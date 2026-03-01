import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { milestones } from "@/data/news";


const Experience = () => {
  return (
    <section id="news" className="flex flex-col items-center justify-center px-8 pb-32 -mt-24">
      <motion.h3
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-sm font-medium text-text-muted mb-12 uppercase tracking-wide"
      >
        Recent News
      </motion.h3>
      {milestones.map((milestone, index) => (
        <motion.div
          key={milestone.name}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.6,
            delay: index * 0.1,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="w-full max-w-4xl"
        >
          <div className="flex flex-col md:flex-row items-baseline gap-4 md:gap-8 py-8 border-b border-foreground/10 hover:border-foreground/30 transition-colors duration-300">
            <span className="text-sm text-text-muted font-mono w-20 shrink-0 text-left">
              {milestone.date}
            </span>
            <span className="text-xl md:text-2xl leading-snug text-foreground/80 hover:text-foreground transition-colors text-left max-w-2xl">
              {milestone.name}
            </span>
          </div>
        </motion.div>
      ))}
    </section>
  );
};

export default Experience;
