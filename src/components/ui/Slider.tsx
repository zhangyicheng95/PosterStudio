interface SliderProps {
  label?: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  formatValue?: (v: number) => string
}

export function Slider({ label, value, min, max, step = 1, onChange, formatValue }: SliderProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex justify-between">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
          {formatValue && <span className="text-xs text-slate-400">{formatValue(value)}</span>}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-slate-200 accent-brand-600 cursor-pointer"
      />
    </div>
  )
}
