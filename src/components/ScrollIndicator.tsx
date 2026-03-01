import { motion, AnimatePresence } from "framer-motion";

interface ScrollIndicatorProps {
    isVisible: boolean;
}

const ScrollIndicator = ({ isVisible }: ScrollIndicatorProps) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 0.4, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.8 }}
                    className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="flex flex-col items-center gap-2"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-text-muted"
                        >
                            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                        </svg>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ScrollIndicator;
