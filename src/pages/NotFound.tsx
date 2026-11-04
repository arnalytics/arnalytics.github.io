import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { usePageMeta } from "@/hooks/use-page-meta";

const NotFound = () => {
  const { pathname } = useLocation();
  usePageMeta("Page not found");

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-8 lowercase">
      <Navigation />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-md"
      >
        <p className="font-display text-7xl md:text-9xl text-foreground/90">404</p>
        <p className="mt-6 text-lg text-text-secondary">
          nothing to see at <span className="font-mono text-foreground">{pathname}</span>. maybe the ball went out of bounds.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-text-muted hover:text-foreground transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
          back home
        </Link>
      </motion.div>
    </main>
  );
};

export default NotFound;
