import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Experience from "@/components/Experience";
import LatestNews from "@/components/LatestNews";
import { SelectedPublications } from "@/components/Publications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollIndicator from "@/components/ScrollIndicator";
import { usePageMeta } from "@/hooks/use-page-meta";

const Index = () => {
  usePageMeta(undefined, "Arnau Barrera-Roy — PhD student in AI at the University of Barcelona and the Computer Vision Center, working on computer vision for sports and multimodal models.");
  const [showIndicator, setShowIndicator] = useState(false);
  const [hasScrolledDown, setHasScrolledDown] = useState(false);

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
    <main className="h-[100svh] overflow-y-auto snap-y snap-proximity md:snap-mandatory bg-background">
      <Navigation />
      <ScrollIndicator isVisible={showIndicator} />
      <div className="snap-start snap-always h-[100svh] w-full">
        <Hero />
      </div>
      <div className="snap-start snap-always min-h-screen w-full flex items-center">
        <AboutMe />
      </div>
      <div className="snap-start snap-always min-h-screen w-full flex items-center">
        <Experience />
      </div>
      <div className="snap-start snap-always min-h-screen w-full flex items-center py-24">
        <SelectedPublications />
      </div>
      <div className="snap-start snap-always min-h-screen w-full flex items-center py-24">
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
