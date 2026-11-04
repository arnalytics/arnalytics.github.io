import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  alt: string;
  className?: string;
  /** Width / height of the images. */
  aspect: number;
}

/**
 * Drag (or use the arrow keys) to compare two aligned images.
 * The first time it scrolls into view the handle sweeps once to hint at the interaction.
 */
const BeforeAfter = ({ before, after, beforeLabel, afterLabel, alt, className, aspect }: Props) => {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const touched = useRef(false);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(50, [50, 82, 18, 50], {
      duration: 2.6,
      ease: "easeInOut",
      delay: 0.3,
      onUpdate: (v) => !touched.current && setPos(v),
    });
    return () => controls.stop();
  }, [inView, reduce]);

  const setFromClientX = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full select-none overflow-hidden rounded-xl bg-black touch-pan-y cursor-ew-resize",
        className,
      )}
      style={{ aspectRatio: String(aspect) }}
      onPointerDown={(e) => {
        touched.current = true;
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && setFromClientX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <img src={after} alt={`${alt}: ${afterLabel}`} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <img
        src={before}
        alt={`${alt}: ${beforeLabel}`}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        draggable={false}
      />

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-accent-orange/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
        {afterLabel}
      </span>

      <div className="pointer-events-none absolute inset-y-0 w-px bg-white/90" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-black" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(pos)}
        onChange={(e) => {
          touched.current = true;
          setPos(Number(e.target.value));
        }}
        aria-label={`Compare ${beforeLabel} and ${afterLabel}`}
        className="absolute inset-0 h-full w-full opacity-0 pointer-events-none focus-visible:pointer-events-auto"
      />
    </div>
  );
};

export default BeforeAfter;
