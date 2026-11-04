import { motion } from "framer-motion";

const experiences = [
  { date: "2025 — present", title: "phd student", where: "ub · computer vision center" },
  { date: "2024 — 2025", title: "msc in computer vision", where: "computer vision center (thesis)" },
  { date: "2023 — 2024", title: "software developer", where: "seat technical center" },
  { date: "2023 — present", title: "co-founder", where: "sinfon.ia" },
  { date: "2022 — 2023", title: "research intern", where: "optics group, uab" },
  { date: "2020 — present", title: "youth basketball coach", where: "federació catalana de basquetbol" },
];

const Experience = () => {
  return (
    <section id="experience" className="w-full max-w-4xl mx-auto px-8 py-24 lowercase">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-sm font-medium text-text-muted mb-4 uppercase tracking-wide border-b border-foreground/10 pb-1 inline-block"
      >
        Experience
      </motion.h3>
      {experiences.map((exp, index) => (
        <motion.div
          key={exp.title}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.6,
            delay: index * 0.1,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="w-full"
        >
          <div className="group flex flex-col md:flex-row md:items-baseline gap-1 md:gap-8 py-5 md:py-6 border-b border-foreground/10 hover:border-foreground/30 transition-colors duration-300">
            <span className="text-sm text-text-muted font-mono md:w-40 shrink-0 text-left tabular-nums">
              {exp.date}
            </span>
            <span className="text-xl md:text-2xl leading-snug text-foreground/80 group-hover:text-foreground transition-colors text-left">
              {exp.title}
              <span className="text-text-muted text-base md:text-lg"> @ {exp.where}</span>
            </span>
          </div>
        </motion.div>
      ))}
    </section>
  );
};

export default Experience;
