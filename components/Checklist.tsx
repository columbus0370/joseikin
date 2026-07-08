import { Subsidy } from "@/types";

type Props = {
  subsidies: Subsidy[];
  checks: Record<string, boolean[]>;
  onToggle: (sid: string, idx: number) => void;
  onBack: () => void;
};

export default function Checklist({ subsidies, checks, onToggle, onBack }: Props) {
  const totalFields = subsidies.reduce((acc, s) => acc + s.fields.length, 0);
  const totalChecked = subsidies.reduce((acc, s) => {
    const arr = checks[s.id] ?? [];
    return acc + arr.filter(Boolean).length;
  }, 0);
  const globalPct = totalFields === 0 ? 0 : Math.round((totalChecked / totalFields) * 100);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">必要書類チェックリスト</h2>
        <button
          onClick={onBack}
          className="text-sm text-blue-600 hover:underline"
        >
          ← 助成金選択に戻る
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">全体の進捗</span>
          <span className="text-sm font-bold text-blue-600">
            {totalChecked} / {totalFields} 件
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${globalPct}%` }}
          />
        </div>
        <p className="text-right text-xs text-gray-500 mt-1">{globalPct}% 完了</p>
      </div>

      <div className="space-y-4">
        {subsidies.map((sub) => {
          const arr = checks[sub.id] ?? new Array(sub.fields.length).fill(false);
          const checkedCount = arr.filter(Boolean).length;
          const pct = sub.fields.length === 0 ? 0 : Math.round((checkedCount / sub.fields.length) * 100);

          return (
            <div key={sub.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div
                className="p-4 border-l-4"
                style={{ borderLeftColor: sub.color }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{sub.name}</h3>
                    <p className="text-xs text-gray-500">{sub.org}</p>
                  </div>
                  <span
                    className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                      pct === 100
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {checkedCount}/{sub.fields.length}
                  </span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                  <div
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: sub.color,
                    }}
                  />
                </div>
              </div>

              <ul className="divide-y divide-gray-50">
                {sub.fields.map((field, idx) => (
                  <li
                    key={idx}
                    onClick={() => onToggle(sub.id, idx)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        arr[idx]
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {arr[idx] && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        arr[idx] ? "line-through text-gray-400" : "text-gray-700"
                      }`}
                    >
                      {field}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
