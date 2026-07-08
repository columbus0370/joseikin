export type ShopInfo = {
  name: string;
  industry: string;
  prefecture: string;
  employees: string;
  purpose: string;
  keyword: string;
};

export type Subsidy = {
  id: string;
  name: string;
  org: string;
  amount: string;
  deadline: string;
  tags: string[];
  description: string;
  fields: string[];
  source_url?: string;
  color: string;
};

export type SearchResult = {
  subsidies: Subsidy[];
  source: "api" | "fallback";
};
