"use client";
// defining TYPE for UI_Brick parameter
interface Prop {
  value: string | string[];
  ariaLabel?: string;
  style?: string;
}
export default function UI_Brick({ value, ariaLabel, style }: Prop) {
  if (typeof value === "string") {
    return (
      <p
        className={`py-0.2 aria-label bg-secondary text-foreground-dark w-fit rounded-xl px-1 ${style}`}
        aria-label={ariaLabel || ""}
      >
        {value}
      </p>
    );
  }
  return value.map((text) => (
    <li key={text}>
      <p
        className={`py-0.2 bg-secondary text-foreground-dark w-fit rounded-xl px-1 italic ${style}`}
      >
        {text}
      </p>
    </li>
  ));
}
