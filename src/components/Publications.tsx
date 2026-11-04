import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { publications } from "@/data/publications";
import { AuthorList } from "@/components/publication/PublicationLayout";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Full publication list with thumbnails, used on /publications. */
const Publications = () => (
  <section id="publications" className="max-w-5xl mx-auto px-6 md:px-8 pb-32">
    <div className="flex flex-col">
      {publications.map((pub, index) => (
        <motion.article
          key={pub.slug}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
          className="group grid grid-cols-1 md:grid-cols-[17rem_1fr] gap-6 md:gap-10 py-10 border-t border-foreground/10 last:border-b"
        >
          <Link
            to={`/publications/${pub.slug}`}
            className="block overflow-hidden rounded-xl bg-foreground/5 aspect-[16/10]"
            tabIndex={-1}
            aria-hidden
          >
            <img
              src={pub.thumbnail}
              alt={pub.thumbnailAlt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-text-muted">
              <span>{pub.year}</span>
              <span aria-hidden>·</span>
              <span>{pub.venueShort}</span>
              <span aria-hidden>·</span>
              <span>{pub.type.toLowerCase()}</span>
            </div>

            <h2 className="mt-3 text-xl md:text-2xl font-medium leading-snug tracking-tight">
              <Link to={`/publications/${pub.slug}`}>
                <span className="bg-gradient-to-r from-foreground to-foreground bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                  {pub.title}
                </span>
              </Link>
            </h2>

            <AuthorList pub={pub} className="mt-3 text-sm text-text-muted leading-relaxed" />
            <p className="mt-3 text-base text-text-secondary leading-relaxed">{pub.summary}</p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link
                to={`/publications/${pub.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background hover:bg-foreground/85 transition-colors"
              >
                Project page
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              {pub.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-foreground/15 px-3.5 py-1.5 text-sm text-text-secondary hover:text-foreground hover:border-foreground/50 transition-colors"
                >
                  {l.label}
                  <ArrowUpRight className="w-3 h-3 opacity-50" />
                </a>
              ))}
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  </section>
);

/** Compact list for the home page. */
export const SelectedPublications = () => (
  <section id="selected-publications" className="w-full max-w-4xl mx-auto px-8 lowercase">
    <motion.h3
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="text-sm font-medium text-text-muted mb-4 uppercase tracking-wide border-b border-foreground/10 pb-1 inline-block"
    >
      Publications
    </motion.h3>

    <div className="flex flex-col">
      {publications.map((pub, index) => (
        <motion.div
          key={pub.slug}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
        >
          <Link
            to={`/publications/${pub.slug}`}
            className="group flex items-center gap-5 md:gap-8 py-6 border-b border-foreground/10 hover:border-foreground/30 transition-colors duration-300"
          >
            <div className="hidden sm:block w-28 md:w-36 shrink-0 aspect-[16/10] overflow-hidden rounded-lg bg-foreground/5">
              <img
                src={pub.thumbnail}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover grayscale-[40%] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-xs md:text-sm text-text-muted font-mono">
                {pub.year} · {pub.venueShort}
              </span>
              <span className="mt-1 block text-lg md:text-xl leading-snug text-foreground/80 group-hover:text-foreground transition-colors normal-case">
                {pub.shortTitle}
              </span>
            </div>
            <ArrowRight className="w-5 h-5 shrink-0 text-text-faded transition-all duration-300 group-hover:text-foreground group-hover:translate-x-1" />
          </Link>
        </motion.div>
      ))}
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-4"
    >
      <Link
        to="/publications"
        className="text-sm font-medium text-text-muted hover:text-foreground transition-colors uppercase tracking-widest inline-flex items-center gap-2 group"
      >
        All publications
        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
      </Link>
    </motion.div>
  </section>
);

export default Publications;
