import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { milestones } from "@/data/news";
import { usePageMeta } from "@/hooks/use-page-meta";

const EASE = [0.22, 1, 0.36, 1] as const;

const NewsPage = () => {
  usePageMeta("News", "News and milestones from Arnau Barrera-Roy.");

  const years = Array.from(new Set(milestones.map((m) => m.date.split(" ").pop()!)));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 pt-32 md:pt-40 pb-32 lowercase">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-4xl md:text-6xl font-display mb-16"
          >
            news
          </motion.h1>

          <div className="flex flex-col gap-14">
            {years.map((year) => (
              <section key={year} className="grid grid-cols-1 md:grid-cols-[6rem_1fr] gap-4 md:gap-8">
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-sm font-mono text-text-muted md:sticky md:top-28 self-start"
                >
                  {year}
                </motion.h2>
                <ol className="relative border-l border-foreground/10">
                  {milestones
                    .filter((m) => m.date.endsWith(year))
                    .map((m, i) => {
                      const content = (
                        <>
                          <span className="block text-xs font-mono text-text-muted mb-1">{m.date.split(" ")[0]}</span>
                          <span className="text-base md:text-lg leading-relaxed text-foreground/80 group-hover:text-foreground transition-colors">
                            {m.name}
                          </span>
                          {m.link && (
                            <span className="mt-2 flex w-fit items-center gap-1 text-sm text-text-muted group-hover:text-foreground transition-colors">
                              read more
                              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                            </span>
                          )}
                        </>
                      );
                      return (
                        <motion.li
                          key={m.name}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                          className="relative pl-6 md:pl-8 pb-8 last:pb-0"
                        >
                          <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-background border border-foreground/30" />
                          {m.link ? (
                            <Link to={m.link} className="group block">
                              {content}
                            </Link>
                          ) : (
                            <div className="group">{content}</div>
                          )}
                        </motion.li>
                      );
                    })}
                </ol>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewsPage;
