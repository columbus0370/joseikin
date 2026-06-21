import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const COLORS = [
  "#2563eb", "#7c3aed", "#0891b2", "#059669",
  "#dc2626", "#d97706", "#0d9488", "#9333ea",
];

export async function POST(req: NextRequest) {
  const shopInfo = await req.json();

  const client = new Anthropic();

  const prompt = `あなたは日本の助成金・補助金の専門家です。
以下の事業者情報をもとに、現在申請可能な助成金・補助金をweb_searchで調査してください。

【事業者情報】
- 業種: ${shopInfo.industry}
- 所在地: ${shopInfo.prefecture}
- 従業員数: ${shopInfo.employees}人
- 設立年: ${shopInfo.established || "不明"}
- 非正規雇用: ${shopInfo.hasPartTime ? "あり" : "なし"}

【指示】
1. web_searchで「${shopInfo.industry} ${shopInfo.prefecture} 助成金 補助金 2025 申請」を検索する
2. 国・都道府県・市区町村レベルの制度を幅広く5〜8件調査する
3. 結果を以下のJSON配列のみで返す。説明文・マークダウン記号は不要

[
  {
    "id": 1,
    "name": "助成金名",
    "org": "実施機関",
    "amount": "補助額",
    "deadline": "締切",
    "tags": ["タグ1","タグ2"],
    "description": "概要2文",
    "fields": ["必要書類1","必要書類2","必要書類3"],
    "source_url": "公式URL"
  }
]`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: prompt }],
    });

    const searchQueries = response.content
      .filter((b) => b.type === "tool_use" && b.name === "web_search")
      .map((b: any) => b.input?.query ?? "");

    const rawText = response.content
      .filter((b) => b.type === "text")
      .map((b: any) => b.text)
      .join("");

    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("JSON not found");

    const subsidies = JSON.parse(jsonMatch[0]).map(
      (item: any, i: number) => ({ ...item, color: COLORS[i % COLORS.length] })
    );

    return NextResponse.json({ subsidies, source: "api", searchQueries });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "search_failed" }, { status: 500 });
  }
}
