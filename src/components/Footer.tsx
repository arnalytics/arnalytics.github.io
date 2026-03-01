import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-t border-border-default"
    >
      <div className="max-w-7xl mx-auto px-8 py-8 flex justify-center items-center">
        <span className="text-sm text-text-muted">
          © Copyright 2026 Arnau Barrera-Roy. Adapted from {" "}
          <a
            href="https://lovable.dev/templates/portfolio-resume/designer-portfolio/ivory-designer-portfolio-website-template"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:text-foreground transition-colors duration-200"
          >
            Lovable's Ivory theme
          </a>
          . Hosted by{" "}
          <a
            href="https://pages.github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:text-foreground transition-colors duration-200"
          >
            GitHub Pages
          </a>
          .
        </span>
      </div>
    </motion.footer>
  );
};

export default Footer;
