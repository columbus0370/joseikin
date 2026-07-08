"use client";

import { useState } from "react";
import StepIndicator from "@/components/StepIndicator";
import ShopForm from "@/components/ShopForm";
import SubsidyList from "@/components/SubsidyList";
import Checklist from "@/components/Checklist";
import { ShopInfo, Subsidy, SearchResult } from "@/types";

const FALLBACK_SUBSIDIES: Subsidy[] = [
  {
    id: "fb-001",
    name: "小規模事業者持続化補助金",
    org: "日本商工会議所",
    amount: "最大50万円",
    deadline: "随時受付",
    tags: ["補助金", "小規模事業者", "販路拡大"],
    description: "小規模事業者が経営計画を策定して取り組む販路開拓等の費用を補助します。",
    fields: ["申請書", "経営計画書・補助事業計画書", "直近の確定申告書", "従業員数確認書類", "見積書（2社以上）", "gBizIDプライム（jGrants電子申請に必要）"],
    source_url: "https://r3.jizokukahojokin.info/",
    color: "#2563eb",
  },
  {
    id: "fb-002",
    name: "ものづくり・商業・サービス補助金",
    org: "中小企業庁",
    amount: "最大1,000万円",
    deadline: "随時受付",
    tags: ["補助金", "製造業", "設備投資"],
    description: "中小企業・小規模事業者が設備投資や IT 導入により生産性向上を図る取組を支援します。",
    fields: ["申請書", "事業計画書", "決算書（直近2期）", "見積書", "登記簿謄本", "gBizIDプライム（jGrants電子申請に必要）"],
    source_url: "https://portal.monodukuri-hojo.jp/",
    color: "#7c3aed",
  },
  {
    id: "fb-003",
    name: "IT導入補助金",
    org: "中小企業庁",
    amount: "最大450万円",
    deadline: "随時受付",
    tags: ["補助金", "IT化", "デジタル化"],
    description: "中小企業・小規模事業者等のデジタル化・IT ツール導入を支援します。",
    fields: ["申請書", "法人登記簿謄本または開業届", "決算書（直近2期）", "IT ツール見積書", "gBizIDプライム（jGrants電子申請に必要）"],
    source_url: "https://www.it-hojo.jp/",
    color: "#0891b2",
  },
  {
    id: "fb-004",
    name: "雇用調整助成金",
    org: "厚生労働省",
    amount: "休業手当の最大2/3",
    deadline: "随時受付",
    tags: ["助成金", "雇用維持", "休業手当"],
    description: "経済上の理由で事業縮小を余儀なくされた事業主が労働者を休業させた場合に助成します。",
    fields: ["支給申請書", "出勤簿・タイムカード", "賃金台帳", "休業協定書", "雇用保険被保険者一覧", "gBizIDプライム（jGrants電子申請に必要）"],
    color: "#059669",
  },
  {
    id: "fb-005",
    name: "業務改善助成金",
    org: "厚生労働省",
    amount: "最大600万円",
    deadline: "随時受付",
    tags: ["助成金", "賃金引上げ", "設備投資"],
    description: "事業場内最低賃金を引き上げ、生産性向上のための設備投資等を行った場合に費用の一部を助成します。",
    fields: ["交付申請書", "事業場内最低賃金の確認書類", "就業規則（賃金規程）", "設備・機器等の見積書", "賃金台帳（直近3か月）", "gBizIDプライム（jGrants電子申請に必要）"],
    color: "#d97706",
  },
];

const INITIAL_SHOP_INFO: ShopInfo = {
  name: "",
  industry: "",
  prefecture: "",
  employees: "",
  purpose: "",
  keyword: "",
};

export default function Home() {
  const [step, setStep] = useState(0);
  const [shopInfo, setShopInfo] = useState<ShopInfo>(INITIAL_SHOP_INFO);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [checks, setChecks] = useState<Record<string, boolean[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shopInfo),
      });

      if (!res.ok) throw new Error("API error");

      const data: SearchResult = await res.json();
      setSearchResult(data);
    } catch {
      setSearchResult({
        subsidies: FALLBACK_SUBSIDIES,
        source: "fallback",
      });
    } finally {
      setLoading(false);
      setSelected([]);
      setChecks({});
      setStep(1);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleNextToChecklist = () => {
    const initial: Record<string, boolean[]> = {};
    selectedSubsidies.forEach((s) => {
      initial[s.id] = new Array(s.fields.length).fill(false);
    });
    setChecks(initial);
    setStep(2);
  };

  const toggleCheck = (sid: string, idx: number) => {
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
            jGrants公式データから、あなたの事業に合った助成金を探します
          </p>
        </div>

        <StepIndicator currentStep={step} />

        {step === 0 && (
          <ShopForm
            shopInfo={shopInfo}
            onChange={setShopInfo}
            onSubmit={handleSearch}
            loading={loading}
          />
        )}

        {step === 1 && searchResult && (
          <SubsidyList
            subsidies={searchResult.subsidies}
            selected={selected}
            onToggle={toggleSelect}
            source={searchResult.source}
            onNext={handleNextToChecklist}
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
