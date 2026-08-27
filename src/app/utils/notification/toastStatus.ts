import React from "react";
import { toast } from "react-toastify";

interface ToastStatusProp {
  status: "success" | "error" | "loading";
  id: string;
  title?: string;
}

export default function toastStatus(
  component: React.ReactNode,
  options: ToastStatusProp,
) {
  const bgColor =
    options.status === "success"
      ? "bg-green-600!"
      : options.status === "loading"
        ? "bg-yellow-600!"
        : "bg-red-600!";

  return toast(component, {
    toastId: options.id,
    closeButton: false,
    closeOnClick: true,
    className: `${bgColor} text-white! font-bold  z-999!`,
  });
}
