type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100" aria-label={`${normalizedValue}% complete`}>
      <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-emerald-500" style={{ width: `${normalizedValue}%` }} />
    </div>
  );
}
