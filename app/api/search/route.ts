import { NextRequest, NextResponse } from "next/server";
import {
  fetchSubsidyList,
  fetchSubsidyDetail,
  JGrantsDetail,
} from "@/lib/jgrants";
import { Subsidy } from "@/types";

const COLORS = [
  "#2563eb", "#7c3aed", "#0891b2", "#059669",
  "#dc2626", "#d97706", "#0d9488", "#9333ea",
];

const GENERIC_FIELDS = [
  "申請書（所定様式）",
  "事業計画書",
  "決算書または確定申告書（直近2期分）",
  "法人登記簿謄本または個人事業主の開業届",
  "見積書（2社以上）",
];

function formatAmount(limit?: number): string {
  if (!limit || limit === 0) return "要確認";
  if (limit >= 100000000) {
    const v = limit / 100000000;
    return `最大${Number.isInteger(v) ? v : v.toFixed(1)}億円`;
  }
  const man = Math.round(limit / 10000);
  return `最大${man.toLocaleString("ja-JP")}万円`;
}

function formatDeadline(dt?: string): string {
  if (!dt) return "随時受付";
  const s = dt.replace(/\//g, "-").slice(0, 10);
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return dt;
  return `${m[1]}年${parseInt(m[2])}月${parseInt(m[3])}日`;
}

function buildFields(detail: JGrantsDetail): string[] {
  const base: string[] = [];
  if (detail.application_guidelines) base.push("申請の手引き");
  if (detail.application_form) base.push("申請様式（所定書式）");
  const fields = base.length > 0 ? base : [...GENERIC_FIELDS];
  fields.push("gBizIDプライム（jGrants電子申請に必要）");
  return fields;
}

function buildTags(detail: JGrantsDetail): string[] {
  const tags: string[] = [];
  if (detail.subsidy_type) tags.push(detail.subsidy_type);
  if (detail.target_industry) tags.push(detail.target_industry.split("，")[0]);
  if (detail.use_purpose) tags.push(detail.use_purpose.split("・")[0]);
  return tags.filter((t, i, a) => t && a.indexOf(t) === i).slice(0, 3);
}

export async function POST(req: NextRequest) {
  const shopInfo = await req.json();

  try {
    const list = await fetchSubsidyList(shopInfo);
    const top8 = list.slice(0, 8);

    const detailResults = await Promise.allSettled(
      top8.map((s) => fetchSubsidyDetail(s.id))
    );

    const subsidies: Subsidy[] = detailResults
      .map((r, i) => {
        const summary = top8[i];
        const detail: JGrantsDetail =
          r.status === "fulfilled" ? r.value : (summary as JGrantsDetail);

        return {
          id: summary.id,
          name: detail.subsidy_title ?? summary.subsidy_title ?? "（名称不明）",
          org: detail.government_agencies ?? summary.government_agencies ?? "（機関不明）",
          amount: formatAmount(detail.subsidy_max_limit ?? summary.subsidy_max_limit),
          deadline: formatDeadline(
            detail.acceptance_end_datetime ?? summary.acceptance_end_datetime
          ),
          tags: buildTags(detail),
          description: detail.outline_of_grant?.slice(0, 120) ?? "",
          fields: buildFields(detail),
          source_url: detail.url_1 ?? detail.url_2 ?? undefined,
          color: COLORS[i % COLORS.length],
        } satisfies Subsidy;
      })
      .filter((s) => s.name !== "（名称不明）");

    return NextResponse.json({ subsidies, source: "api" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "search_failed" }, { status: 500 });
  }
}
