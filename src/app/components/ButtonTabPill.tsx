"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
  Dispatch,
  SetStateAction,
} from "react";
import type { CatalogType } from "@hooks/useCatalogState";

interface TabOption {
  value: CatalogType;
  label: string;
  ariaLabel?: string;
}

interface ButtonTabPillProps {
  options: TabOption[];
  value: string;
  setCatalog: Dispatch<SetStateAction<CatalogType>>;
  ariaLabel?: string;
  className?: string;
  buttonClassName?: string;
}

const ButtonTabPill = memo(function ButtonTabPill({
  options,
  value,
  setCatalog,
  ariaLabel = "Select option",
  buttonClassName,
}: ButtonTabPillProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const [indicator, setIndicator] = useState<{ left: number; right: number }>({
    left: 1,
    right: 50,
  });

  const updateIndicatorGeometry = useCallback((selectedValue: string) => {
    if (selectedValue === "tv")
      setIndicator({
        left: 50,
        right: 1,
      });
    else
      setIndicator({
        left: 1,
        right: 50,
      });
  }, []);

  const handleButtonClick = (optionValue: CatalogType) => {
    updateIndicatorGeometry(optionValue);
    setCatalog(optionValue);
  };

  // Recalculate on screen resize
  useEffect(() => {
    const handleResize = () => updateIndicatorGeometry(value);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [value, updateIndicatorGeometry]);

  return (
    <div
      className="desktop:col-start-3 tab-pill desktop:row-start-1 relative col-span-full row-start-2 flex gap-1 py-1.5"
      role="tablist"
      aria-label={ariaLabel}
      ref={containerRef}
    >
      <span
        ref={indicatorRef}
        className="tab-pill__indicator absolute transition-all duration-300 ease-out"
        aria-hidden="true"
        style={{
          inset: `4px ${indicator.right}% 4px ${indicator.left}%`,
        }}
      />
      {options.map((option, index) => (
        <button
          key={`tab-${option.value}`}
          ref={(el) => {
            buttonRefs.current[index] = el;
          }}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          aria-label={option.ariaLabel || option.label}
          className={`tab-pill__btn relative z-10 ${buttonClassName}`}
          onClick={() => handleButtonClick(option.value)}
        >
          <span className="pointer-events-none">{option.label}</span>
        </button>
      ))}
    </div>
  );
});

export default ButtonTabPill;
