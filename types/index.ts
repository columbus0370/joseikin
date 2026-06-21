export type ShopInfo = {
  name: string;
  industry: string;
  prefecture: string;
  employees: string;
  established: string;
  hasPartTime: boolean;
};

export type Subsidy = {
  id: number;
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
  searchQueries: string[];
};
