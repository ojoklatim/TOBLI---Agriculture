import { useState, useEffect } from "react";
import { AppLanguage } from "./types";
import { DICTIONARY } from "./data";
import Navigation from "./components/Navigation";
import DiseaseDiagnoser from "./components/DiseaseDiagnoser";
import FarmChat from "./components/FarmChat";
import MarketPrices from "./components/MarketPrices";
import PlantingCalendar from "./components/PlantingCalendar";
import WeatherForecast from "./components/WeatherForecast";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, Award, Heart, Shield } from "lucide-react";

export default function App() {
  const [language, setLanguage] = useState<AppLanguage>("lug");
  const [activeTab, setActiveTab] = useState<string>("diagnose");

  const dict = DICTIONARY[language];

  // Ensure every active view selection forces scroll reset to top of viewport
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  // Helper renderer to load desired agronomic views
  const renderTabContent = () => {
    switch (activeTab) {
      case "diagnose":
        return <DiseaseDiagnoser language={language} />;
      case "chat":
        return <FarmChat language={language} />;
      case "prices":
        return <MarketPrices language={language} />;
      case "calendar":
        return <PlantingCalendar language={language} />;
      case "weather":
        return <WeatherForecast language={language} />;
      default:
        return <DiseaseDiagnoser language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 text-sand-900 font-sans flex flex-col justify-between selection:bg-forest-900 selection:text-sand-50 transition-colors duration-200">
      
      {/* Modern Refined Navigation bar */}
      <Navigation
        language={language}
        setLanguage={setLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container Stage */}
      <main className="flex-1 pb-16 bg-sand-40/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${language}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="w-full"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Beautiful High-Contrast Minimalist Footer matching anthropic.com editorial panels */}
      <footer className="bg-forest-900 text-sand-100 border-t border-forest-950 py-12 px-4 selection:bg-sand-100 selection:text-forest-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand focus details */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-sand-50 text-forest-900 flex items-center justify-center shrink-0">
                <Leaf className="h-5 w-5 text-forest-900 stroke-[2.5]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-sand-50 font-editorial uppercase">
                TOBLI Agriculture
              </span>
            </div>
            <p className="text-xs text-sand-200 font-sans leading-relaxed max-w-sm">
              {language === "lug"
                ? "Ennimiro yo, Maaso go. Enkola embi mu Luganda ekuyamba okukulisa obulunji n'okutangira endwadde z'ebirime ku mutindo gwa nnyongeza ebyomudaala."
                : "A modern agricultural companion. Leveraging zero-install browser interfaces and sever-safe AI capabilities to guarantee crop yields across Ugandan districts."}
            </p>
          </div>

          {/* District Support Indicators */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#B5C2B7] font-bold">
              {language === "lug" ? "Gye Tukolera (Districts in Uganda):" : "Core Coverage Hubs:"}
            </h4>
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-sans">
              {["Masaka", "Kampala", "Kabale", "Jinja", "Gulu", "Wakiso", "Mukono"].map((dst) => (
                <span key={dst} className="bg-forest-800 text-[#B5C2B7] px-2 py-0.5 border border-forest-700">
                  {dst}
                </span>
              ))}
            </div>
          </div>

          {/* Structural Copyrights */}
          <div className="md:col-span-3 space-y-3 md:text-right">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#B5C2B7] font-bold">
              {language === "lug" ? "Mikwano ne TOBLI Brand:" : "Legal & Corporate Derivative:"}
            </h4>
            <p className="text-[10px] text-sand-200 leading-normal font-mono uppercase">
              TOBLI Agriculture Derivative © 2026. <br />
              {language === "lug" ? "Byonna Bikuumiddwa" : "All Rights Reserved."}
            </p>
            <div className="flex items-center md:justify-end space-x-1 text-xs text-sand-200 font-sans">
              <span>Made with</span>
              <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400" />
              <span>for Uganda Hackathon</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
