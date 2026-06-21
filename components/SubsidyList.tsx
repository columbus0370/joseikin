import { Subsidy } from "@/types";

type Props = {
  subsidies: Subsidy[];
  selected: number[];
  onToggle: (id: number) => void;
  source: string;
  onNext: () => void;
  searchQueries: string[];
};

export default function SubsidyList({
  subsidies,
  selected,
  onToggle,
  source,
  onNext,
  searchQueries,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          申請可能な助成金 ({subsidies.length}件)
        </h2>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            source === "api"
              ? "bg-blue-100 text-blue-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {source === "api" ? "🌐 Web検索結果" : "📦 ローカルDB"}
        </span>
      </div>

      {searchQueries.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 space-y-1">
          <p className="font-medium text-gray-600">実行した検索クエリ:</p>
          {searchQueries.map((q, i) => (
            <p key={i} className="truncate">🔍 {q}</p>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500 mb-4">
        申請したい助成金を選択してください（複数可）
      </p>

      <div className="space-y-3">
        {subsidies.map((sub) => {
          const isSelected = selected.includes(sub.id);
          return (
            <div
              key={sub.id}
              onClick={() => onToggle(sub.id)}
              className={`relative bg-white rounded-xl border-2 p-4 cursor-pointer transition-all ${
                isSelected
                  ? "border-blue-500 shadow-md"
                  : "border-gray-100 hover:border-gray-300 shadow-sm"
              }`}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                style={{ backgroundColor: sub.color }}
              />
              <div className="pl-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm leading-tight">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{sub.org}</p>
                  </div>
                  {isSelected && (
                    <div className="shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  {sub.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {sub.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-semibold text-green-700">
                      💰 {sub.amount}
                    </span>
                    <span className="text-gray-500">📅 {sub.deadline}</span>
                  </div>
                  {sub.source_url && (
                    <a
                      href={sub.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      公式サイト →
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={selected.length === 0}
        className={`mt-6 w-full py-3 rounded-xl font-bold text-sm transition-all ${
          selected.length > 0
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        必要書類を確認 ({selected.length}件選択中)
      </button>
    </div>
  );
}
