import { ShopInfo } from "@/types";

const BASE = "https://api.jgrants-portal.go.jp/exp/v1/public";

export const INDUSTRY_MAP: Record<string, string> = {
  "飲食業": "宿泊業，飲食サービス業",
  "小売業": "卸売業，小売業",
  "製造業": "製造業",
  "建設業": "建設業",
  "IT・情報通信業": "情報通信業",
  "医療・福祉": "医療，福祉",
  "宿泊業・旅館": "宿泊業，飲食サービス業",
  "美容・理容業": "生活関連サービス業，娯楽業",
  "運輸・物流業": "運輸業，郵便業",
  "その他サービス業": "サービス業（他に分類されないもの）",
};

export function toEmployeeCategory(employees: string): string {
  const n = parseInt(employees || "0");
  if (n <= 5) return "5名以下";
  if (n <= 20) return "20名以下";
  if (n <= 50) return "50名以下";
  if (n <= 100) return "100名以下";
  if (n <= 300) return "300名以下";
  if (n <= 900) return "900名以下";
  return "901名以上";
}

export type JGrantsSummary = {
  id: string;
  subsidy_title?: string;
  government_agencies?: string;
  acceptance_end_datetime?: string;
  subsidy_max_limit?: number;
  target_area_search?: string;
  target_industry?: string;
  use_purpose?: string;
  subsidy_type?: string;
  [key: string]: unknown;
};

export type JGrantsDetail = JGrantsSummary & {
  outline_of_grant?: string;
  application_guidelines?: string;
  application_form?: string;
  url_1?: string;
  url_2?: string;
};

export async function fetchSubsidyList(shopInfo: ShopInfo): Promise<JGrantsSummary[]> {
  const rawKeyword = (shopInfo.keyword?.trim() || shopInfo.industry || "").trim();
  const keyword = rawKeyword.length >= 2 ? rawKeyword : "事業";

  const params = new URLSearchParams({
    keyword,
    sort: "acceptance_end_datetime",
    order: "ASC",
    acceptance: "1",
  });

  const mappedIndustry = INDUSTRY_MAP[shopInfo.industry];
  if (mappedIndustry) params.set("target_industry", mappedIndustry);
  if (shopInfo.prefecture) params.set("target_area_search", shopInfo.prefecture);
  if (shopInfo.purpose) params.set("use_purpose", shopInfo.purpose);

  const res = await fetch(`${BASE}/subsidies?${params.toString()}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`jGrants list error: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data.result) ? data.result : [];
}

export async function fetchSubsidyDetail(id: string): Promise<JGrantsDetail> {
  const res = await fetch(`${BASE}/subsidies/id/${encodeURIComponent(id)}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`jGrants detail error: ${res.status}`);
  const data = await res.json();
  return (data.result ?? {}) as JGrantsDetail;
}
