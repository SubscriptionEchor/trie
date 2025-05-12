export const Slider = ({ value, onChange, min, max, step, displayValue, className = "" }) => {
    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-between mb-2">
                {displayValue && <span className="text-sm bg-gray-700 px-2 py-1 rounded">{displayValue}</span>}
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500"
            />
        </div>
    )
}