import { useEffect, useState } from "react";

type Props = {
  lines: string[];
  typingSpeed?: number;
  lineDelay?: number;
  showCursor?: boolean;
};

export default function TypewriterLines({
  lines,
  typingSpeed = 22,
  lineDelay = 650,
  showCursor = true,
}: Props) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [printed, setPrinted] = useState<string[]>([]);
  const [current, setCurrent] = useState("");

  useEffect(() => {
    setLineIndex(0);
    setCharIndex(0);
    setPrinted([]);
    setCurrent("");
  }, [lines]);

  useEffect(() => {
    let timer: number | null = null;

    if (lineIndex >= lines.length) return;

    const full = lines[lineIndex] ?? "";

    if (charIndex < full.length) {
      timer = window.setTimeout(() => {
        const next = full.slice(0, charIndex + 1);
        setCurrent(next);
        setCharIndex((c) => c + 1);
      }, typingSpeed);
    } else {
      timer = window.setTimeout(() => {
        setPrinted((arr) => [...arr, full]);
        setCurrent("");
        setCharIndex(0);
        setLineIndex((i) => i + 1);
      }, lineDelay);
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [charIndex, lineIndex, lines, typingSpeed, lineDelay]);

  return (
    <div aria-live="polite" aria-atomic="false">
      {printed.map((p, i) => (
        <p key={`p-${i}`} className="mb-4 text-foreground">
          {p}
        </p>
      ))}

      {lineIndex < lines.length && (
        <p className="mb-4 text-foreground">
          {current}
          {showCursor && (
            <span
              className="inline-block w-2 h-5 align-[-2px] bg-foreground ml-0.5"
              style={{
                animation: "tw-blink 1s steps(1, start) infinite",
              }}
            />
          )}
        </p>
      )}

      <style>{`
        @keyframes tw-blink { 
          0%, 50% { opacity: 1 } 
          50.01%, 100% { opacity: 0 } 
        }
      `}</style>
    </div>
  );
}
