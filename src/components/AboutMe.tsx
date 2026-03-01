import { motion } from "framer-motion";

const AboutMe = () => {
    return (
        <section id="about" className="w-full max-w-2xl mx-auto px-8 pb-32 lowercase">
            <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-sm font-medium text-text-muted mb-4 uppercase tracking-wide border-b border-foreground/10 pb-1 inline-block"
            >
                ABOUT ME
            </motion.h3>

            <div className="flex flex-col gap-8">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-lg md:text-xl leading-relaxed text-foreground/80"
                >
                    My name is <span className="text-foreground font-semibold">Arnau Barrera Roy</span>, and I am a PhD student in Artificial Intelligence at the Human Pose and Behavior Analysis{" "}
                    <a href="https://hupba.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity inline-block align-baseline">
                        <img src="/hupba_logo.png" alt="HuPBA Logo" className="h-[1.2em] w-auto rounded-sm" />
                    </a>{" "}
                    lab from the University of Barcelona{" "}
                    <a href="https://mat.ub.edu/recerca/#1708345610331-6afaaf2c-d160" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity inline-block align-baseline">
                        <img src="/ub_logo.png" alt="UB Logo" className="h-[1.2em] w-auto rounded-sm" />
                    </a>{" "}
                    and the Computer Vision Center{" "}
                    <a href="https://www.cvc.uab.es/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity inline-block align-baseline">
                        <img src="/cvc_logo.png" alt="CVC Logo" className="h-[1.2em] w-auto rounded-sm" />
                    </a>.
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="text-lg md:text-xl leading-relaxed text-foreground/80"
                >
                    My research focuses on <strong className="text-foreground">Multimodal Knowledge Distillation</strong> of foundational vision-language models and <strong className="text-foreground">Action Valuation</strong> in team sports contexts.
                </motion.p>
            </div>
        </section >
    );
};

export default AboutMe;
