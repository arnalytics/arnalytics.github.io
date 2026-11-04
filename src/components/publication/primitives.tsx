import { ReactNode, useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts its children into place the first time they scroll into view. */
export const Reveal = ({
  children,
  delay = 0,
  className,
  y = 24,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.7, delay, ease: EASE }}
    className={className}
  >
    {children}
  </motion.div>
);

/** Small uppercase label used across the whole site for section headings. */
export const Eyebrow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <h2
    className={cn(
      "text-sm font-medium text-text-muted uppercase tracking-wide border-b border-foreground/10 pb-1 inline-block",
      className,
    )}
  >
    {children}
  </h2>
);

export const Section = ({
  id,
  label,
  title,
  children,
  className,
  wide = false,
}: {
  id?: string;
  label: string;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) => (
  <section id={id} className={cn("scroll-mt-24 py-14 md:py-20", className)}>
    <div className={cn("mx-auto px-6 md:px-8", wide ? "max-w-6xl" : "max-w-4xl")}>
      <Reveal>
        <Eyebrow>{label}</Eyebrow>
        {title && (
          <h3 className="mt-5 text-2xl md:text-4xl font-medium tracking-tight text-foreground leading-tight text-balance max-w-3xl">
            {title}
          </h3>
        )}
      </Reveal>
      <div className="mt-8 md:mt-10">{children}</div>
    </div>
  </section>
);

export const Prose = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div
    className={cn(
      "space-y-5 text-lg leading-relaxed text-text-secondary max-w-3xl [&_strong]:text-foreground [&_strong]:font-semibold",
      className,
    )}
  >
    {children}
  </div>
);

/** Number that counts up from zero the first time it becomes visible. */
export const CountUp = ({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const format = (v: number) =>
    prefix + v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) {
      ref.current.textContent = format(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {format(0)}
    </span>
  );
};

export interface StatItem {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  highlight?: boolean;
}

export const StatGrid = ({ items }: { items: StatItem[] }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
    {items.map((s, i) => (
      <Reveal key={s.label} delay={i * 0.08} className="py-5 border-t border-foreground/15">
        <div
          className={cn(
            "text-3xl md:text-4xl font-medium tracking-tight",
            s.highlight ? "text-accent-orange" : "text-foreground",
          )}
        >
          <CountUp value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
        </div>
        <div className="mt-2 text-sm text-text-muted leading-snug">{s.label}</div>
      </Reveal>
    ))}
  </div>
);

/** Figure with caption; click to view it larger. */
export const Figure = ({
  src,
  alt,
  caption,
  className,
  imgClassName,
  framed = true,
}: {
  src: string;
  alt: string;
  caption?: ReactNode;
  className?: string;
  imgClassName?: string;
  framed?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <Reveal className={className}>
      <figure>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "group block w-full overflow-hidden cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40",
            framed && "rounded-xl border border-foreground/10 bg-white p-3 md:p-5",
          )}
          aria-label={`Enlarge figure: ${alt}`}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className={cn(
              "w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.015]",
              !framed && "rounded-xl",
              imgClassName,
            )}
          />
        </button>
        {caption && (
          <figcaption className="mt-3 text-sm leading-relaxed text-text-muted max-w-3xl">{caption}</figcaption>
        )}
      </figure>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <motion.img
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: EASE }}
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg bg-white shadow-2xl"
          />
        </motion.div>
      )}
    </Reveal>
  );
};

/** BibTeX entry with a copy-to-clipboard button. */
export const BibTeX = ({ bibtex }: { bibtex: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(bibtex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard not available: the text is still selectable */
    }
  };
  return (
    <Reveal>
      <div className="relative rounded-xl bg-[hsl(0_0%_9%)] text-[hsl(40_20%_88%)]">
        <button
          type="button"
          onClick={copy}
          className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1 text-xs text-white/70 hover:text-white hover:border-white/40 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <pre className="overflow-x-auto p-6 pt-12 md:pt-6 text-[13px] leading-relaxed font-mono">{bibtex}</pre>
      </div>
    </Reveal>
  );
};

/** Lightweight YouTube embed: shows the thumbnail and only loads the player on click. */
export const YouTube = ({ id, title }: { id: string; title: string }) => {
  const [play, setPlay] = useState(false);
  return (
    <div className="group">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
        {play ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlay(true)}
            className="absolute inset-0 w-full h-full"
            aria-label={`Play video: ${title}`}
          >
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-black" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <p className="mt-3 text-sm text-text-muted">{title}</p>
    </div>
  );
};
