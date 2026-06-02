export default function Button({
  children,
  onClick,
  className,
  ariaLabel,
  role,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  role?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-cta hover:bg-cta-secondary transition-colors duration-300 text-foreground-dark rounded-lg ${className || ""}`}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
