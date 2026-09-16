"use client";

import { ComponentPropsWithoutRef } from "react";
import { Genre } from "@utils/types/types";

type Prop = Omit<ComponentPropsWithoutRef<"li">, "value"> & {
  value: Genre[] | string;
};

export default function UI_Brick({ value, className, ...props }: Prop) {
  if (typeof value === "string") {
    return (
      <p
        className={`py-0.2 aria-label bg-secondary text-foreground-dark w-fit rounded-xl px-1 ${className}`}
      >
        {value}
      </p>
    );
  }

  return value.map((item) => (
    <li key={item.id} {...props}>
      <p
        className={`py-0.2 bg-secondary text-foreground-dark w-fit rounded-xl px-1 italic ${className}`}
      >
        {item.name}
      </p>
    </li>
  ));
}
