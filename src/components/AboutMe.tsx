import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const AboutMe = () => {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <section id="about" className="w-full max-w-5xl mx-auto px-8 pb-32 lowercase">
            <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
                <div className="flex-1 w-full">
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
                            My name is <span className="text-foreground font-semibold">Arnau Barrera Roy</span>, and I am a first-year PhD student in Artificial Intelligence at the Human Pose and Behavior Analysis{" "}
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
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0 mt-8 md:mt-0"
                    style={{ perspective: 1000 }}
                >
                    <motion.div
                        ref={ref}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            rotateX,
                            rotateY,
                            transformStyle: "preserve-3d"
                        }}
                        className="w-full h-full relative"
                    >
                        {/* Modern Gradient Backdrop */}
                        <div
                            className="absolute inset-0 bg-gradient-to-tr from-accent-orange/30 via-foreground/5 to-accent-green/20 rounded-[2.5rem] md:rounded-[3rem] blur-2xl opacity-70"
                            style={{ transform: "translateZ(-30px) scale(1.15)" }}
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-bl from-accent-orange/20 to-transparent rounded-[2.5rem] md:rounded-[3rem] opacity-60"
                            style={{ transform: "translateZ(-15px) rotate(-3deg) scale(1.1)" }}
                        />

                        {/* The Image */}
                        <div
                            className="relative z-10 w-full h-full rounded-[2.5rem] md:rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.05)] overflow-hidden"
                            style={{ transform: "translateZ(30px)" }}
                        >
                            <img
                                src="/profile_image.jpeg"
                                alt="Arnau Barrera Roy"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutMe;
