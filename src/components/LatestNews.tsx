import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { milestones } from "@/data/news";

const LatestNews = () => {
    // Take the 3 latest news items
    const latestNews = milestones.slice(0, 3);

    return (
        <section id="latest-news" className="w-full max-w-2xl mx-auto px-8 lowercase">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mb-4"
            >
                <h3 className="text-sm font-medium text-text-muted uppercase tracking-wide border-b border-foreground/10 pb-1 inline-block">
                    Latest News
                </h3>
            </motion.div>

            <div className="flex flex-col gap-6">
                {latestNews.map((news, index) => (
                    <motion.div
                        key={news.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.1,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <Link
                            to="/news"
                            className="group flex flex-col md:flex-row items-baseline gap-4 md:gap-8 py-4 border-b border-foreground/5 hover:border-foreground/20 transition-colors duration-300 no-underline"
                        >
                            <span className="text-sm text-text-muted font-mono w-20 shrink-0 text-left">
                                {news.date}
                            </span>
                            <span className="text-base md:text-lg text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed">
                                {news.name}
                            </span>
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
                    to="/news"
                    className="text-sm font-medium text-text-muted hover:text-foreground transition-colors uppercase tracking-widest no-underline inline-flex items-center gap-2 group"
                >
                    View all news
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                        →
                    </span>
                </Link>
            </motion.div>
        </section>
    );
};

export default LatestNews;
