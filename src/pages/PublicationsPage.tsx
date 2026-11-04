import Navigation from "@/components/Navigation";
import Publications from "@/components/Publications";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { usePageMeta } from "@/hooks/use-page-meta";

const PublicationsPage = () => {
  usePageMeta("Publications", "Research papers by Arnau Barrera-Roy on computer vision, sports analytics and polarimetric imaging.");
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 pt-32 md:pt-40">
        <div className="max-w-5xl mx-auto px-6 md:px-8 mb-12 md:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl font-display"
          >
            publications
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl text-lg text-text-secondary leading-relaxed lowercase"
          >
            computer vision for sports — anticipating and spotting actions from video and tracking data — and, before that,
            polarimetric imaging. the full list is on{" "}
            <a
              href="https://scholar.google.es/citations?user=Xv9aoqIAAAAJ&hl=ca"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground transition-colors"
            >
              google scholar
            </a>
            .
          </motion.p>
        </div>
        <Publications />
      </main>
      <Footer />
    </div>
  );
};

export default PublicationsPage;
