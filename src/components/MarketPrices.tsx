import { useState } from "react";
import { AppLanguage, MarketPriceItem } from "../types";
import { DICTIONARY, SEED_MARKET_PRICES } from "../data";
import { Search, TrendingUp, TrendingDown, Minus, Info, Landmark } from "lucide-react";

interface MarketPricesProps {
  language: AppLanguage;
}

export default function MarketPrices({ language }: MarketPricesProps) {
  const dict = DICTIONARY[language];
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeItem, setActiveItem] = useState<MarketPriceItem | null>(SEED_MARKET_PRICES[0]);

  const categories = ["All", "Grains", "Tubers", "Legumes", "Cash Crops", "Fruits"];

  // Search and filter crops
  const filteredCrops = SEED_MARKET_PRICES.filter((item) => {
    const term = search.toLowerCase();
    const matchesSearch =
      item.cropEnglish.toLowerCase().includes(term) ||
      item.cropLuganda.toLowerCase().includes(term);
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Custom Inline SVG Sparkline Line Generator
  const renderSparkline = (dataList: number[], changePercent: number) => {
    if (!dataList || dataList.length === 0) return null;
    const padding = 10;
    const width = 280;
    const height = 90;

    const min = Math.min(...dataList);
    const max = Math.max(...dataList);
    const range = max - min || 1;

    // Map each data point to X, Y coordinates
    const points = dataList.map((val, i) => {
      const x = padding + (i / (dataList.length - 1)) * (width - padding * 2);
      // Invert Y because SVG coordinates start from top-left (0,0)
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    });

    const pathD = `M ${points.join(" L ")}`;
    
    // Choose trend color based on performance
    const strokeColor = changePercent > 0 ? "#1B4D20" : changePercent < 0 ? "#A3432B" : "#544F47";

    return (
      <svg width="100%" height={height} className="overflow-visible" style={{ maxWidth: `${width}px` }}>
        {/* Subtle grid indicators */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#dfdcd3" strokeWidth={1} strokeDasharray="3,3" />
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#dfdcd3" strokeWidth={1} strokeDasharray="3,3" />
        
        {/* Connected shaded area gradient */}
        {points.length > 0 && (
          <path
            d={`${pathD} L ${points[points.length - 1].split(",")[0]},${height - padding} L ${points[0].split(",")[0]},${height - padding} Z`}
            fill={changePercent > 0 ? "#1b4d20" : "#a3432b"}
            fillOpacity={0.06}
          />
        )}

        {/* The line itself */}
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Highlight points */}
        {points.map((pt, index) => {
          const [cx, cy] = pt.split(",");
          const isLatest = index === points.length - 1;
          const isEarliest = index === 0;
          return (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r={isLatest ? 4 : 2}
              fill={isLatest ? strokeColor : "#dfdcd3"}
              stroke={isLatest ? "#FCFBFA" : "none"}
              strokeWidth={isLatest ? 1.5 : 0}
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-slide-up">
      {/* Header */}
      <div className="text-center mb-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-forest-900 mb-2 font-editorial">
          {dict.marketTitle}
        </h1>
        <p className="text-sm text-sand-800 font-sans leading-relaxed">
          {dict.marketDesc}
        </p>
      </div>

      {/* Main Grid: Controls + Dual Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Control Column (Commodity Directory) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 items-stretch sm:items-center justify-between pb-2">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-sand-800" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={language === "lug" ? "Saba / Nona ekirime..." : "Search commercial crops..."}
                className="w-full bg-sand-40 border border-sand-200 pl-10 pr-3 py-2 text-xs text-sand-900 focus:outline-none focus:border-forest-700 rounded-none h-10"
              />
            </div>

            {/* Category Selectors */}
            <div className="flex overflow-x-auto gap-1 no-scrollbar pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-150 rounded-none border ${
                    selectedCategory === cat
                      ? "bg-forest-900 text-sand-50 border-forest-900"
                      : "bg-sand-40 text-sand-800 border-sand-200 hover:bg-sand-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Wholesale listing matrix */}
          <div className="bg-sand-40 border border-sand-200 overflow-x-auto rounded-none shadow-sm">
            <table className="min-w-full divide-y divide-sand-200 text-left">
              <thead className="bg-sand-100/60 text-[11px] font-mono uppercase text-sand-900 font-bold tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">{dict.cropCategory}</th>
                  <th scope="col" className="px-6 py-4">{language === "lug" ? "Ekipimo (Unit)" : "Unit"}</th>
                  <th scope="col" className="px-6 py-4 text-right">{dict.averagePrice}</th>
                  <th scope="col" className="px-6 py-4 text-right">{language === "lug" ? "Wiiki eno" : "Weekly Delta"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200 text-xs">
                {filteredCrops.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sand-800">
                      {language === "lug" ? "Ekirime kye wasabye tekisobose kuzuulibwa." : "No commodities found matching current constraints."}
                    </td>
                  </tr>
                ) : (
                  filteredCrops.map((crop) => {
                    const isSelected = activeItem?.id === crop.id;
                    const changeVal = crop.changePercent;
                    return (
                      <tr
                        key={crop.id}
                        onClick={() => setActiveItem(crop)}
                        className={`cursor-pointer transition-colors duration-150 group ${
                          isSelected ? "bg-sand-100 font-medium" : "hover:bg-sand-50"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-forest-950 font-editorial">
                              {language === "lug" ? crop.cropLuganda : crop.cropEnglish}
                            </span>
                            <span className="text-[10px] text-sand-800 uppercase font-mono tracking-tight">
                              {crop.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-sand-850">
                          {crop.unit}
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-forest-900">
                          {crop.averagePriceUGX.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className={`inline-flex items-center space-x-1.5 text-xs font-bold leading-none ${
                            changeVal > 0 ? "text-emerald-800" : changeVal < 0 ? "text-red-700" : "text-sand-800"
                          }`}>
                            {changeVal > 0 ? (
                              <TrendingUp className="h-3.5 w-3.5" />
                            ) : changeVal < 0 ? (
                              <TrendingDown className="h-3.5 w-3.5" />
                            ) : (
                              <Minus className="h-3.5 w-3.5" strokeWidth={3} />
                            )}
                            <span className="font-mono">
                              {changeVal > 0 ? `+${changeVal}%` : `${changeVal}%`}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Detail Pane (Market Drilldown & Trend Sparklines) */}
        <div className="lg:col-span-4">
          {activeItem ? (
            <div className="bg-sand-40 border border-sand-200 p-6 flex flex-col space-y-6 rounded-none shadow-sm animate-fade-in">
              {/* Product Header */}
              <div className="border-b border-sand-200 pb-4">
                <span className="text-[9px] font-mono uppercase font-bold text-sand-800 block mb-1">
                  {language === "lug" ? "Omubiri gw'okusoma (Detail Pane)" : "Retail & Wholesale Breakdown"}
                </span>
                <h3 className="text-2xl font-extrabold text-forest-900 font-editorial">
                  {language === "lug" ? activeItem.cropLuganda : activeItem.cropEnglish}
                </h3>
                <span className="text-xs text-sand-800 block mt-1">
                  {language === "lug" ? `Omukutu gw'Omuwendo: 1 ${activeItem.unit}` : `Price indexed by: 1 ${activeItem.unit}`}
                </span>
              </div>

              {/* District & Central Market List */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-forest-800 mb-2">
                  {language === "lug" ? "Ebisale mu Butale eby'enjawulo:" : "Regional Centers Pricing (UGX/kg):"}
                </h4>
                
                {Object.entries(activeItem.pricesByMarket).map(([mkt, price]) => (
                  <div key={mkt} className="flex justify-between items-center py-2 border-b border-sand-200/50 hover:bg-sand-50/50 px-1 text-xs">
                    <span className="font-sans text-sand-900 font-medium">{mkt}</span>
                    <span className="font-mono font-bold text-forest-900">
                      {price.toLocaleString()} UGX
                    </span>
                  </div>
                ))}
              </div>

              {/* Sparkline Visual Component */}
              <div className="bg-sand-50 p-4 border border-sand-200 rounded-none space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-forest-700">
                    {dict.trendChartLabel}
                  </h4>
                  <span className="text-[10px] font-mono text-sand-800">
                    {language === "lug" ? "wiiki 4 eziyise" : "last 4 weeks"}
                  </span>
                </div>
                {renderSparkline(activeItem.trendHistory, activeItem.changePercent)}
                <div className="flex justify-between text-[10px] font-mono text-sand-800 pt-1">
                  <span>
                    {activeItem.trendHistory[0].toLocaleString()} UGX
                  </span>
                  <span>
                    {activeItem.trendHistory[activeItem.trendHistory.length - 1].toLocaleString()} UGX
                  </span>
                </div>
              </div>

              {/* Analytical Callout */}
              <div className="bg-forest-50 border border-forest-500/20 p-4 rounded-none flex items-start space-x-2 text-xs">
                <Info className="h-4.5 w-4.5 text-forest-700 shrink-0 mt-0.5" />
                <p className="text-sans text-forest-900 leading-relaxed">
                  {language === "lug"
                    ? "Bana-Uganda abalimi ba TOBLI: Ebisale bino bikunze ne bigasizza ddigani ne ddaala lya transport. Weerinde abagula obuwano ku shamba bawanvye akasero kano."
                    : "Prices collected directly from market managers using TOBLI agents in Nakasero, Jinja, and Owino. Use these to settle fair terms with buyers and bypass brokers."}
                </p>
              </div>

            </div>
          ) : (
            <div className="bg-sand-40/50 border border-sand-200 py-16 px-4 text-center text-sand-800 rounded-none h-60 flex flex-col justify-center items-center">
              <Landmark className="h-10 w-10 text-sand-200 mb-2" />
              <p className="text-sm font-semibold text-sand-900 font-editorial">
                {language === "lug" ? "Londa Ekirime okusoma" : "Select a Crop for Intelligence"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
