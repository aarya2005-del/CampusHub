import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  name,
  required = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selected = options.find(
    (option) => String(option.value) === String(value)
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const selectOption = (option) => {
    onChange({
      target: {
        name,
        value: option.value,
      },
    });

    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-w-0 ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="
          w-full min-w-0
          flex items-center justify-between gap-3
          bg-slate-950
          border border-slate-700
          rounded-xl
          px-4 py-3
          text-left text-white
          outline-none
          focus:border-blue-500
        "
      >
        <span className="truncate">
          {selected?.label || placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="
            absolute z-50
            left-0 right-0 top-full
            mt-1
            w-full max-w-full
            overflow-hidden
            rounded-xl
            border border-slate-700
            bg-slate-950
            shadow-2xl
          "
        >
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => {
              const active =
                String(option.value) === String(value);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectOption(option)}
                  className={`
                    w-full min-w-0
                    flex items-center justify-between gap-3
                    px-4 py-3
                    text-left
                    hover:bg-slate-800
                    ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-slate-200"
                    }
                  `}
                >
                  <span className="truncate">
                    {option.label}
                  </span>

                  {active && (
                    <Check
                      size={17}
                      className="shrink-0"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {required && (
        <input
          tabIndex={-1}
          aria-hidden="true"
          required
          value={value || ""}
          onChange={() => {}}
          className="absolute pointer-events-none opacity-0"
        />
      )}
    </div>
  );
}

export default CustomSelect;