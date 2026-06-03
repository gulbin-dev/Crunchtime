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
        className={`w-fit border py-0.2 px-1 rounded-xl aria-label ${style}`}
        aria-label={ariaLabel || ""}
      >
        {value}
      </p>
    );
  }
  return value.map((text) => (
    <li key={text}>
      <p className={`w-fit border py-0.2 px-1 rounded-xl italic ${style}`}>
        {text}
      </p>
    </li>
  ));
}
