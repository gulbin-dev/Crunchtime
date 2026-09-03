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
      className={`bg-cta hover:bg-cta-secondary rounded-lg px-1 py-2 text-white transition-colors duration-300 ${className || ""}`}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
