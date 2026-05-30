import { AppLanguage } from "../types";
import { DICTIONARY } from "../data";
import { Leaf, Menu, X, Landmark, Globe } from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({
  language,
  setLanguage,
  activeTab,
  setActiveTab,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dict = DICTIONARY[language];

  const toggleLanguage = () => {
    setLanguage(language === "lug" ? "eng" : "lug");
  };

  const navItems = [
    { id: "diagnose", label: dict.navDiagnose },
    { id: "chat", label: dict.navChat },
    { id: "prices", label: dict.navPrices },
    { id: "calendar", label: dict.navCalendar },
    { id: "weather", label: dict.navWeather },
  ];

  return (
    <nav className="border-b border-sand-200 bg-sand-40 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Brand Logo & Derivative */}
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-forest-900 text-sand-50 flex items-center justify-center shrink-0">
              <Leaf className="h-5 w-5 text-sand-50 stroke-[2.5]" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-forest-900 font-editorial uppercase">
              TOBLI Agriculture
            </span>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-150 rounded-none border-b-2 ${
                  activeTab === item.id
                    ? "border-forest-900 text-forest-900 bg-sand-100/50"
                    : "border-transparent text-sand-800 hover:text-forest-800 hover:bg-sand-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Action Bar (Language Switcher) */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3.5 py-1.5 border border-forest-900 hover:bg-forest-900 hover:text-sand-50 transition-all duration-200 text-sm font-medium text-forest-900 rounded-none"
            >
              <Globe className="h-4 w-4" />
              <span>{dict.changeLang}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleLanguage}
              className="mr-3 p-1.5 text-forest-900 border border-forest-900/40 text-xs font-semibold uppercase hover:bg-sand-100"
              title="Change Language"
            >
              {language === "lug" ? "ENG" : "LUG"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-forest-900 hover:bg-sand-100 rounded-none focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-sand-200 bg-sand-40 px-4 pt-2 pb-4 space-y-1 block animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 text-base font-semibold border-l-4 ${
                activeTab === item.id
                  ? "border-forest-900 text-forest-900 bg-sand-100"
                  : "border-transparent text-sand-800 hover:text-forest-900 hover:bg-sand-50"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 pb-2 border-t border-sand-200 flex justify-center">
            <button
              onClick={() => {
                toggleLanguage();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center flex items-center justify-center space-x-2 py-3 bg-forest-900 text-sand-50 font-medium transition-all duration-150 hover:bg-forest-800"
            >
              <Globe className="h-4 w-4" />
              <span>{dict.changeLang}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
