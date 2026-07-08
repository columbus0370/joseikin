import { ShopInfo } from "@/types";

const INDUSTRIES = [
  "飲食業",
  "小売業",
  "製造業",
  "建設業",
  "IT・情報通信業",
  "医療・福祉",
  "宿泊業・旅館",
  "美容・理容業",
  "運輸・物流業",
  "その他サービス業",
];

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

const USE_PURPOSES = [
  "設備投資",
  "販路開拓・マーケティング",
  "雇用・人材育成",
  "IT化・デジタル化",
  "事業再構築",
  "研究開発",
  "事業承継・引継ぎ",
  "創業・起業",
  "その他",
];

type Props = {
  shopInfo: ShopInfo;
  onChange: (info: ShopInfo) => void;
  onSubmit: () => void;
  loading: boolean;
};

export default function ShopForm({ shopInfo, onChange, onSubmit, loading }: Props) {
  const isValid = shopInfo.industry !== "" && shopInfo.employees !== "" && shopInfo.prefecture !== "";

  const set = (key: keyof ShopInfo, value: string) =>
    onChange({ ...shopInfo, [key]: value });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-lg mx-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-5">事業者情報を入力</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            事業者名（任意）
          </label>
          <input
            type="text"
            value={shopInfo.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="例：山田商店"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            業種 <span className="text-red-500">*</span>
          </label>
          <select
            value={shopInfo.industry}
            onChange={(e) => set("industry", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">選択してください</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            都道府県 <span className="text-red-500">*</span>
          </label>
          <select
            value={shopInfo.prefecture}
            onChange={(e) => set("prefecture", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">選択してください</option>
            {PREFECTURES.map((pref) => (
              <option key={pref} value={pref}>{pref}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            従業員数 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={shopInfo.employees}
            onChange={(e) => set("employees", e.target.value)}
            placeholder="例：5"
            min="1"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            利用目的（任意）
          </label>
          <select
            value={shopInfo.purpose}
            onChange={(e) => set("purpose", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">選択してください</option>
            {USE_PURPOSES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            キーワード（任意）
          </label>
          <input
            type="text"
            value={shopInfo.keyword}
            onChange={(e) => set("keyword", e.target.value)}
            placeholder="例：省エネ、DX、雇用"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">未入力の場合は業種名で検索します</p>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={!isValid || loading}
        className={`mt-6 w-full py-3 rounded-xl font-bold text-sm transition-all ${
          isValid && !loading
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            jGrantsを検索中...
          </span>
        ) : (
          "助成金を検索"
        )}
      </button>
    </div>
  );
}
