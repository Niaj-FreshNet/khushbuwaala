export function LiveSkeleton({
  className = "",
  delayMs = 0,
  speedMs = 1400,
  children,
}: {
  className?: string;
  delayMs?: number;
  speedMs?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`skel-live ${className}`}
      style={
        {
          ["--skel-delay" as any]: `${delayMs}ms`,
          ["--skel-speed" as any]: `${speedMs}ms`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}