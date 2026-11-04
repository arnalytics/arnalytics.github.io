import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2, FileText, Link2, PlayCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { publications, Publication, PublicationLink } from "@/data/publications";
import { usePageMeta } from "@/hooks/use-page-meta";
import { EASE } from "./primitives";

const linkIcon = (kind: PublicationLink["kind"]) => {
  switch (kind) {
    case "pdf":
      return <FileText className="w-4 h-4" />;
    case "code":
      return <Code2 className="w-4 h-4" />;
    case "video":
      return <PlayCircle className="w-4 h-4" />;
    default:
      return <Link2 className="w-4 h-4" />;
  }
};

export const AuthorList = ({ pub, className = "" }: { pub: Publication; className?: string }) => (
  <p className={className}>
    {pub.authors.map((a, i) => (
      <span key={a.name}>
        <span className={a.me ? "text-foreground font-medium underline decoration-accent-orange decoration-2 underline-offset-4" : ""}>
          {a.name}
          {a.equal && <sup className="ml-0.5 text-text-muted">*</sup>}
        </span>
        {i < pub.authors.length - 1 && ", "}
      </span>
    ))}
  </p>
);

interface Props {
  pub: Publication;
  /** Short line above the title (venue, place…). */
  eyebrow: ReactNode;
  /** Extra line under the authors (affiliations, notes). */
  note?: ReactNode;
  /** Large visual shown under the header. */
  visual?: ReactNode;
  /** In-page anchors shown under the buttons. */
  toc: { id: string; label: string }[];
  children: ReactNode;
}

const PublicationLayout = ({ pub, eyebrow, note, visual, toc, children }: Props) => {
  usePageMeta(pub.shortTitle, pub.summary);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  const index = publications.findIndex((p) => p.slug === pub.slug);
  const prev = publications[(index - 1 + publications.length) % publications.length];
  const next = publications[(index + 1) % publications.length];
  const words = pub.title.split(" ");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent-orange origin-left z-[60]"
        style={{ scaleX: progress }}
        aria-hidden
      />
      <Navigation />

      <main className="flex-1">
        {/* Header */}
        <header className="mx-auto max-w-5xl px-6 md:px-8 pt-28 md:pt-40 pb-10 md:pb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs md:text-sm font-mono text-text-muted"
          >
            <Link to="/publications" className="hover:text-foreground transition-colors">
              publications
            </Link>
            <span aria-hidden>/</span>
            <span className="text-foreground">{eyebrow}</span>
          </motion.div>

          <h1 className="mt-6 text-[2rem] leading-[1.1] md:text-6xl md:leading-[1.05] font-medium tracking-tight text-balance">
            {words.map((w, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.25em]"
                initial={{ opacity: 0, y: "0.4em", filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.035, ease: EASE }}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          >
            <AuthorList pub={pub} className="mt-8 text-base md:text-lg text-text-secondary leading-relaxed max-w-3xl" />
            {note && <div className="mt-2 text-sm text-text-muted">{note}</div>}

            <div className="mt-8 flex flex-wrap gap-3">
              {pub.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    l.kind === "pdf"
                      ? "inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:bg-foreground/85 transition-colors"
                      : "inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium text-foreground hover:border-foreground/60 transition-colors"
                  }
                >
                  {linkIcon(l.kind)}
                  {l.label}
                  {l.kind !== "pdf" && <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />}
                </a>
              ))}
              <a
                href="#citation"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium text-foreground hover:border-foreground/60 transition-colors"
              >
                BibTeX
              </a>
            </div>

            <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-muted">
              {toc.map((t, i) => (
                <a key={t.id} href={`#${t.id}`} className="hover:text-foreground transition-colors">
                  <span className="font-mono text-xs text-text-faded mr-1.5">{String(i + 1).padStart(2, "0")}</span>
                  {t.label}
                </a>
              ))}
            </nav>
          </motion.div>
        </header>

        {visual && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: EASE }}
            className="mx-auto max-w-6xl px-4 md:px-8"
          >
            {visual}
          </motion.div>
        )}

        {children}

        {/* Prev / next */}
        <nav aria-label="More publications" className="mx-auto max-w-5xl px-6 md:px-8 pt-10 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-foreground/10 pt-10">
            {[
              { p: prev, dir: "prev" as const },
              { p: next, dir: "next" as const },
            ].map(({ p, dir }) => (
              <Link
                key={dir}
                to={`/publications/${p.slug}`}
                className={`group rounded-xl border border-foreground/10 p-5 hover:border-foreground/30 hover:bg-foreground/[0.02] transition-colors ${dir === "next" ? "md:text-right" : ""}`}
              >
                <span className={`flex items-center gap-2 text-xs uppercase tracking-wide text-text-muted ${dir === "next" ? "md:justify-end" : ""}`}>
                  {dir === "prev" && <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />}
                  {dir === "prev" ? "Previous" : "Next"}
                  {dir === "next" && <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />}
                </span>
                <span className="mt-2 block text-lg font-medium leading-snug">{p.shortTitle}</span>
                <span className="mt-1 block text-sm text-text-muted">
                  {p.venueShort} · {p.year}
                </span>
              </Link>
            ))}
          </div>
        </nav>
      </main>

      <Footer />
    </div>
  );
};

export default PublicationLayout;
