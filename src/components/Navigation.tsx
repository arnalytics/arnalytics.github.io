import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const pill =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 -mx-3 -my-1.5 text-sm font-medium bg-background/70 backdrop-blur-md transition-opacity hover:opacity-70 lowercase";

const Dot = ({ on }: { on: boolean }) =>
  on ? <span className="h-1.5 w-1.5 rounded-full bg-accent-orange" aria-hidden /> : null;

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (path === "/") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#contact");
    }
  };

  const corner = (delay: number, className: string, children: React.ReactNode) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      className={cn("fixed z-50", className)}
    >
      {children}
    </motion.div>
  );

  return (
    <nav aria-label="Main">
      {corner(
        0.2,
        "top-6 left-6 md:top-8 md:left-8",
        <Link to="/" className={cn(pill, "text-accent-orange")} aria-label="Home">
          A—B
        </Link>,
      )}
      {corner(
        0.3,
        "top-6 right-6 md:top-8 md:right-8",
        <Link
          to="/publications"
          className={cn(pill, "text-foreground")}
          aria-current={path.startsWith("/publications") ? "page" : undefined}
        >
          <Dot on={path.startsWith("/publications")} />
          publications
        </Link>,
      )}
      {corner(
        0.4,
        "bottom-6 left-6 md:bottom-8 md:left-8",
        <Link to="/news" className={cn(pill, "text-foreground")} aria-current={path === "/news" ? "page" : undefined}>
          <Dot on={path === "/news"} />
          news
        </Link>,
      )}
      {corner(
        0.5,
        "bottom-6 right-6 md:bottom-8 md:right-8",
        <a href="/#contact" onClick={handleContactClick} className={cn(pill, "text-foreground cursor-pointer")}>
          contact
        </a>,
      )}
    </nav>
  );
};

export default Navigation;
