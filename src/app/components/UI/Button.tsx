type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  className?: string;
  config: {
    type: "primary" | "secondary" | "tab-primary";
    isPending?: boolean;
  };
};

export default function Button({
  children,
  className,
  config,
  ...buttonProps
}: ButtonProps) {
  const buttonType =
    config.type === "primary"
      ? "bg-cta border-none"
      : config.type === "tab-primary"
        ? "bg-cta-secondary border-cta hover:bg-cta text-foreground-dark"
        : "dark:border-white border-foreground-dark  bg-transparent";
  return (
    <button
      {...buttonProps}
      className={`hover:bg-cta-secondary rounded-full border px-3 py-1.5 transition-colors duration-300 ${className} ${buttonType} ${config.isPending ? "border-cta-secondary bg-slate-300" : ""}`}
    >
      {children}
    </button>
  );
}
