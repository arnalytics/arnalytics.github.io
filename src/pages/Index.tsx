import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import LatestNews from "@/components/LatestNews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollIndicator from "@/components/ScrollIndicator";

const Index = () => {
  const { hash } = useLocation();
  const [showIndicator, setShowIndicator] = useState(false);
  const [hasScrolledDown, setHasScrolledDown] = useState(false);

  useEffect(() => {
    if (hash === "#contact") {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        // Delay slightly to ensure content is rendered
        setTimeout(() => {
          contactSection.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [hash]);

  const resetTimer = useCallback(() => {
    setShowIndicator(false);
  }, []);

  useEffect(() => {
    if (hasScrolledDown) return;

    let timer: NodeJS.Timeout;

    const startIndicatorTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const main = document.querySelector('main');
        if (main && main.scrollTop < 100 && !hasScrolledDown) {
          setShowIndicator(true);
        }
      }, 12000); // 12 seconds
    };

    const handleScroll = () => {
      const main = document.querySelector('main');
      if (main && main.scrollTop > 100) {
        setShowIndicator(false);
        setHasScrolledDown(true);
      }
    };

    const handleInteraction = () => {
      // If indicator is ALREADY showing, do nothing (keep it showing)
      // If it's NOT showing yet, restart the timer (delay its appearance)
      setShowIndicator((prev) => {
        if (!prev) {
          startIndicatorTimer();
        }
        return prev;
      });
    };

    // Initial timer
    startIndicatorTimer();

    const main = document.querySelector('main');
    if (main) {
      window.addEventListener("mousemove", handleInteraction);
      window.addEventListener("keydown", handleInteraction);
      window.addEventListener("click", handleInteraction);
      main.addEventListener("scroll", handleScroll);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("click", handleInteraction);
      if (main) main.removeEventListener("scroll", handleScroll);
    };
  }, [hasScrolledDown]);

  return (
    <main className="h-screen overflow-y-auto snap-y snap-mandatory bg-background">
      <Navigation />
      <ScrollIndicator isVisible={showIndicator} />
      <div className="snap-start snap-always h-screen w-full">
        <Hero />
      </div>
      <div className="snap-start snap-always min-h-screen w-full flex items-center">
        <AboutMe />
      </div>
      <div className="snap-start snap-always min-h-screen w-full flex items-center">
        <LatestNews />
      </div>
      <div className="snap-start snap-always min-h-screen w-full flex flex-col">
        <div className="flex-1 flex items-center w-full">
          <Contact />
        </div>
        <Footer />
      </div>
    </main>
  );
};

export default Index;
