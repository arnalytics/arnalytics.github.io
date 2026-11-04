import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Index from "./pages/Index";
import News from "./pages/News";
import Publications from "./pages/PublicationsPage";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

// Publication pages are heavier (figures, charts, animations): load them on demand.
const BioimagingPublication = lazy(
  () => import("./pages/BioimagingPublication"),
);
const BasketballPublication = lazy(
  () => import("./pages/BasketballPublication"),
);
const FootballPublication = lazy(() => import("./pages/FootballPublication"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MotionConfig reducedMotion="user">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/news" element={<News />} />
              <Route path="/publications" element={<Publications />} />
              <Route
                path="/publications/bioimaging"
                element={<BioimagingPublication />}
              />
              <Route
                path="/publications/basketball"
                element={<BasketballPublication />}
              />
              <Route
                path="/publications/football"
                element={<FootballPublication />}
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </MotionConfig>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
