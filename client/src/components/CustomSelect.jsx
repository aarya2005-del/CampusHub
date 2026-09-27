import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(
    (option) => String(option.value) === String(value)
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange({
      target: {
        value: option.value,
      },
    });

    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full flex items-center justify-between gap-3 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-left text-white outline-none focus:border-blue-500"
      >
        <span className="truncate">
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-2xl">
          <div className="max-h-60 overflow-y-auto p-1">
            {options.length === 0 ? (
              <div className="px-3 py-3 text-sm text-slate-400">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`block w-full rounded-lg px-3 py-3 text-left transition-colors ${
                    String(option.value) === String(value)
                      ? "bg-blue-600 text-white"
                      : "text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomSelect;