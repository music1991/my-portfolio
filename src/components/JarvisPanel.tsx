import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
  onHoverChange?: (hover: boolean) => void;
};

export default function JarvisHoverFrame({
  className = "",
  children,
  onHoverChange,
}: Props) {
  return (
    <div
      className={["relative group", className].join(" ")}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 
                   group-hover:opacity-50 transition-opacity duration-500"
        style={{
          backgroundImage:
            "linear-gradient(rgb(var(--color-accent) / 0.08) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-accent) / 0.08) 1px, transparent 1px)",
          backgroundSize: "20px 20px, 20px 20px",
          animation: "gridShift 22s linear infinite",
        }}
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-60 transition-opacity duration-500">
        <div className="relative w-[550px] h-[550px] max-w-none">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, rgb(var(--color-accent) / 0) 0%, rgb(var(--color-accent) / 0.45) 12%, rgb(var(--color-accent) / 0) 24%)",
              mask:
                "radial-gradient(circle at center, transparent 46%, black 47%)",
              WebkitMask:
                "radial-gradient(circle at center, transparent 46%, black 47%)",
              animation: "ringSpin 14s linear infinite",
              filter: "blur(0.3px)",
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 90deg, rgb(var(--color-accent) / 0) 0%, rgb(var(--color-accent) / 0.4) 10%, rgb(var(--color-accent) / 0) 22%)",
              mask:
                "radial-gradient(circle at center, transparent 58%, black 59%)",
              WebkitMask:
                "radial-gradient(circle at center, transparent 58%, black 59%)",
              animation: "ringSpin 18s linear infinite reverse",
              filter: "blur(0.5px)",
            }}
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-90 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(ellipse at center, rgb(var(--color-accent) / 0.12), transparent 50%)",
          animation: "pulseGlow 2.4s ease-in-out infinite",
        }}
      />

      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-accent/70"
            style={{
              left: `${(i * 67) % 100}%`,
              top: `${(i * 41) % 100}%`,
              filter: "drop-shadow(0 0 4px rgb(var(--color-accent) / 0.8))",
              animation: `floatDot ${5 + (i % 4)}s ease-in-out infinite ${i * 0.25}s`,
            }}
          />
        ))}
      </div>

      <div className="relative px-8">{children}</div>

      <style>{`
        @keyframes ringSpin { from {transform: rotate(0)} to {transform: rotate(360deg)} }
        @keyframes gridShift {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 20px 20px, 20px 20px; }
        }
        @keyframes pulseGlow {
          0%,100% { opacity: .35; filter: blur(.4px); }
          50% { opacity: .75; filter: blur(.8px); }
        }
        @keyframes floatDot {
          0%,100% { transform: translateY(-3px); opacity: .7; }
          50% { transform: translateY(4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
