type Props = {
  currentStep: number;
};

const STEPS = ["店舗情報入力", "助成金を選択", "必要書類確認"];

export default function StepIndicator({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i <= currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {i < currentStep ? "✓" : i + 1}
            </div>
            <span
              className={`mt-1 text-xs whitespace-nowrap ${
                i <= currentStep ? "text-blue-600 font-medium" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-2 mb-4 transition-colors ${
                i < currentStep ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
