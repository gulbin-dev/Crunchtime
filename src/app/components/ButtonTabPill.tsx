"use client";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
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
  onChange: (value: CatalogType) => void;
  ariaLabel?: string;
  className?: string;
  buttonClassName?: string;
}

export default function ButtonTabPill({
  options,
  value,
  onChange,
  ariaLabel = "Select option",
  className = "tab-pill relative self-start",
  buttonClassName = "tab-pill__btn relative z-10",
}: ButtonTabPillProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  const updateIndicatorGeometry = useCallback(
    (selectedValue: string) => {
      const selectedIndex = options.findIndex(
        (opt) => opt.value === selectedValue,
      );
      const activeBtn = buttonRefs.current[selectedIndex];

      if (!activeBtn || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();

      setIndicator({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
      });
    },
    [options],
  );

  const handleButtonClick = (optionValue: CatalogType) => {
    if (optionValue === value) return;
    updateIndicatorGeometry(optionValue);
    onChange(optionValue);
  };

  //   Measure initial dimensions on mount
  useLayoutEffect(() => {
    updateIndicatorGeometry(value);
  }, [value, updateIndicatorGeometry]);

  // Recalculate on screen resize
  useEffect(() => {
    const handleResize = () => updateIndicatorGeometry(value);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [value, updateIndicatorGeometry]);

  return (
    <div
      className={className}
      role="tablist"
      aria-label={ariaLabel}
      ref={containerRef}
    >
      <span
        ref={indicatorRef}
        className="tab-pill__indicator absolute transition-all duration-300 ease-out"
        aria-hidden="true"
        style={{ left: indicator.left, width: indicator.width }}
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
          className={buttonClassName}
          onClick={() => handleButtonClick(option.value)}
        >
          <span className="pointer-events-none">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
