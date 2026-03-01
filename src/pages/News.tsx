import Navigation from "@/components/Navigation";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const NewsPage = () => {
    return (
        <main className="min-h-screen bg-background pt-32 lowercase">
            <Navigation />
            <div className="max-w-4xl mx-auto px-8">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-4xl md:text-6xl font-display mb-16"
                >
                    news
                </motion.h1>
            </div>
            <Experience />
            <Footer />
        </main>
    );
};

export default NewsPage;
