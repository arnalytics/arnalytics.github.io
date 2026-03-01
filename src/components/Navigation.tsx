import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/#contact");
    }
  };

  return (
    <>
      {/* Top Left - Logo/Initials */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-8 left-8 z-50"
      >
        <Link
          to="/"
          className="text-sm font-medium text-accent-orange hover:opacity-70 transition-opacity"
        >
          A—B
        </Link>
      </motion.div>

      {/* Top Right - News Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="fixed top-8 right-8 z-50 flex flex-col items-end gap-2 md:flex-row md:items-center md:gap-8"
      >
        <Link
          to="/publications"
          className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
        >
          Publications
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="fixed bottom-8 left-8 z-50"
      >
        <Link
          to="/news"
          className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
        >
          News
        </Link>
      </motion.div>

      {/* Bottom Right - Contact Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <a
          href="#contact"
          onClick={handleContactClick}
          className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity cursor-pointer"
        >
          Contact
        </a>
      </motion.div>
    </>
  );
};

export default Navigation;
