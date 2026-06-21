"use client";

import { useState } from "react";
import StepIndicator from "@/components/StepIndicator";
import ShopForm from "@/components/ShopForm";
import SubsidyList from "@/components/SubsidyList";
import Checklist from "@/components/Checklist";
import { ShopInfo, Subsidy, SearchResult } from "@/types";

const FALLBACK_SUBSIDIES: Subsidy[] = [
  {
    id: 101,
    name: "小規模事業者持続化補助金",
    org: "日本商工会議所",
    amount: "最大50万円",
    deadline: "2025年6月上旬（予定）",
    tags: ["小規模事業者", "販路拡大", "全業種"],
    description: "小規模事業者が経営計画を策定して取り組む販路開拓等の費用を補助します。商工会・商工会議所のサポートを受けながら申請できます。",
    fields: ["申請書", "経営計画書・補助事業計画書", "直近の確定申告書", "従業員数確認書類", "見積書（2社以上）"],
    source_url: "https://r3.jizokukahojokin.info/",
    color: "#2563eb",
  },
  {
    id: 102,
    name: "ものづくり・商業・サービス生産性向上促進補助金",
    org: "中小企業庁",
    amount: "最大1,000万円",
    deadline: "2025年通年（複数回）",
    tags: ["製造業", "設備投資", "IT導入"],
    description: "中小企業・小規模事業者が設備投資や IT 導入により生産性向上を図る取組を支援します。省力化・デジタル化に幅広く活用できます。",
    fields: ["申請書", "事業計画書", "決算書（直近2期）", "見積書", "登記簿謄本"],
    source_url: "https://portal.monodukuri-hojo.jp/",
    color: "#7c3aed",
  },
  {
    id: 103,
    name: "IT導入補助金",
    org: "中小企業庁",
    amount: "最大450万円",
    deadline: "2025年通年",
    tags: ["IT化", "デジタル化", "全業種"],
    description: "中小企業・小規模事業者等のデジタル化・IT ツール導入を支援します。会計ソフト・受発注・決済・EC サイト等の導入費用が対象です。",
    fields: ["申請書", "法人登記簿謄本（または個人事業主の開業届）", "決算書（直近2期）", "IT ツール見積書（IT ベンダー発行）"],
    source_url: "https://www.it-hojo.jp/",
    color: "#0891b2",
  },
  {
    id: 104,
    name: "雇用調整助成金",
    org: "厚生労働省",
    amount: "休業手当の最大2/3（中小）",
    deadline: "随時受付",
    tags: ["雇用維持", "休業手当", "全業種"],
    description: "経済上の理由で事業縮小を余儀なくされた事業主が労働者を休業させた場合、休業手当の一部を助成します。",
    fields: ["支給申請書", "出勤簿・タイムカード", "賃金台帳", "休業協定書", "雇用保険被保険者一覧"],
    source_url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/pageL07.html",
    color: "#059669",
  },
  {
    id: 105,
    name: "キャリアアップ助成金（正社員化コース）",
    org: "厚生労働省",
    amount: "1人あたり最大80万円",
    deadline: "随時受付",
    tags: ["パート・アルバイト", "正社員化", "雇用"],
    description: "有期雇用労働者等を正社員へ転換した場合に助成します。パートタイマーやアルバイトの正規雇用化を推進する事業主向けです。",
    fields: ["支給申請書", "就業規則（転換規定が記載されたもの）", "転換前後の雇用契約書", "賃金台帳（転換前後各3か月分）", "出勤簿"],
    source_url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/part_haken/jigyounushi/career.html",
    color: "#dc2626",
  },
  {
    id: 106,
    name: "事業再構築補助金",
    org: "中小企業庁",
    amount: "最大1億円（通常枠）",
    deadline: "2025年内（予定）",
    tags: ["業態転換", "新規事業", "中小企業"],
    description: "ポストコロナ時代の経済社会の変化に対応するため、新分野展開・業態転換・事業転換等の大胆な事業再構築を支援します。",
    fields: ["申請書", "事業計画書", "決算書（直近2期）", "認定支援機関確認書", "見積書", "登記簿謄本"],
    source_url: "https://jigyou-saikouchiku.jp/",
    color: "#d97706",
  },
  {
    id: 107,
    name: "業務改善助成金",
    org: "厚生労働省",
    amount: "最大600万円",
    deadline: "2025年12月末",
    tags: ["賃金引上げ", "設備投資", "小規模事業者"],
    description: "事業場内で最も低い賃金を一定額以上引き上げ、生産性向上のための設備投資等を行った場合に費用の一部を助成します。",
    fields: ["交付申請書", "事業場内最低賃金の確認書類", "就業規則（賃金規程）", "設備・機器等の見積書", "賃金台帳（申請時直近3か月）"],
    source_url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/zigyonushi/shienjigyou/02.html",
    color: "#0d9488",
  },
];

const INITIAL_SHOP_INFO: ShopInfo = {
  name: "",
  industry: "",
  prefecture: "",
  employees: "",
  established: "",
  hasPartTime: false,
};

function filterFallback(subsidies: Subsidy[], shopInfo: ShopInfo): Subsidy[] {
  const emp = parseInt(shopInfo.employees || "0");
  return subsidies.filter((s) => {
    if (shopInfo.hasPartTime && s.id === 105) return true;
    if (emp <= 20 && s.id === 101) return true;
    if (s.id === 103 || s.id === 104 || s.id === 106 || s.id === 107) return true;
    if (shopInfo.industry === "製造業" && s.id === 102) return true;
    return false;
  });
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [shopInfo, setShopInfo] = useState<ShopInfo>(INITIAL_SHOP_INFO);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [checks, setChecks] = useState<Record<number, boolean[]>>({});
  const [loading, setLoading] = useState(false);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);

  const handleSearch = async () => {
    setLoading(true);
    setSearchQueries([]);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shopInfo),
      });

      if (!res.ok) throw new Error("API error");

      const data: SearchResult = await res.json();
      setSearchResult(data);
      setSearchQueries(data.searchQueries ?? []);
    } catch {
      const filtered = filterFallback(FALLBACK_SUBSIDIES, shopInfo);
      setSearchResult({
        subsidies: filtered.length > 0 ? filtered : FALLBACK_SUBSIDIES,
        source: "fallback",
        searchQueries: [],
      });
    } finally {
      setLoading(false);
      setSelected([]);
      setChecks({});
      setStep(1);
    }
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleNextToChecklist = () => {
    const initial: Record<number, boolean[]> = {};
    selectedSubsidies.forEach((s) => {
      initial[s.id] = new Array(s.fields.length).fill(false);
    });
    setChecks(initial);
    setStep(2);
  };

  const toggleCheck = (sid: number, idx: number) => {
    setChecks((prev) => {
      const arr = [...(prev[sid] ?? [])];
      arr[idx] = !arr[idx];
      return { ...prev, [sid]: arr };
    });
  };

  const selectedSubsidies =
    searchResult?.subsidies.filter((s) => selected.includes(s.id)) ?? [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">助成金 Navi</h1>
          <p className="text-sm text-gray-500 mt-1">
            あなたの事業に合った助成金を、AIがリアルタイムで探します
          </p>
        </div>

        <StepIndicator currentStep={step} />

        {step === 0 && (
          <ShopForm
            shopInfo={shopInfo}
            onChange={setShopInfo}
            onSubmit={handleSearch}
            loading={loading}
            searchQueries={searchQueries}
          />
        )}

        {step === 1 && searchResult && (
          <SubsidyList
            subsidies={searchResult.subsidies}
            selected={selected}
            onToggle={toggleSelect}
            source={searchResult.source}
            onNext={handleNextToChecklist}
            searchQueries={searchResult.searchQueries}
          />
        )}

        {step === 2 && (
          <Checklist
            subsidies={selectedSubsidies}
            checks={checks}
            onToggle={toggleCheck}
            onBack={() => setStep(1)}
          />
        )}
      </div>
    </main>
  );
}
