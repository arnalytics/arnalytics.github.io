const Footer = () => (
  <footer className="border-t border-border-default">
    <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row gap-2 justify-center items-center text-sm text-text-muted lowercase text-center">
      <span>© {new Date().getFullYear()} Arnau Barrera-Roy</span>
      <span className="hidden md:inline text-text-faded">·</span>
      <span>
        design adapted from{" "}
        <a
          href="https://lovable.dev/templates/portfolio-resume/designer-portfolio/ivory-designer-portfolio-website-template"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors duration-200"
        >
          ivory
        </a>
        , hosted on{" "}
        <a
          href="https://pages.github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors duration-200"
        >
          github pages
        </a>
      </span>
    </div>
  </footer>
);

export default Footer;
