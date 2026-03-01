import { motion } from "framer-motion";

const publications = [
    {
        title: "Revealing hidden bioimaging information by isotropic depolarization filtering",
        date: "2025",
        link: "https://doi.org/10.1016/j.optlastec.2025.112956",
        details: "DOI: 10.1016/j.optlastec.2025.112956"
    },
    {
        title: "See It Before You Grab It: Deep Learning-based Action Anticipation in Basketball",
        date: "2025",
        link: "https://arxiv.org/abs/2512.15386",
        details: "arXiv: 2512.15386"
    }
];

const Publications = () => {
    return (
        <section id="publications" className="max-w-4xl mx-auto px-8 py-32">
            <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-sm font-medium text-text-muted mb-12 uppercase tracking-wide"
            >
                Publications
            </motion.h3>

            <div className="flex flex-col gap-12">
                {publications.map((pub, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="group"
                    >
                        <a
                            href={pub.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-xl md:text-2xl font-medium group-hover:text-text-muted transition-colors duration-300 max-w-2xl">
                                    {pub.title}
                                </h4>
                                <span className="text-sm text-text-muted font-medium ml-4">
                                    {pub.date}
                                </span>
                            </div>
                            <p className="text-sm text-text-muted group-hover:text-foreground/60 transition-colors duration-300">
                                {pub.details}
                            </p>
                        </a>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Publications;
