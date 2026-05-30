import { useState } from "react";
import { AppLanguage } from "../types";
import { DICTIONARY, UGANDA_DISTRICTS, PLANTING_CALENDAR_DATA } from "../data";
import { Calendar, CloudDrizzle, ShieldCheck, Footprints, AlertCircle } from "lucide-react";

interface PlantingCalendarProps {
  language: AppLanguage;
}

// Special soil and microclimate advice based on regional district characteristics in Uganda
const DISTRICT_CLIMATE_MATRIX: Record<
  string,
  { climateEng: string; climateLug: string; soilEng: string; soilLug: string; seasonPeak: string }
> = {
  Kampala: {
    climateEng: "Central Lake Victoria basin. Warm, highly humid with high rain peaks.",
    climateLug: "Masekkati g'ennyanja Nalubaale. Obudde bwa bbugumu ne nnyonnyola ky'enkuba eggwa.",
    soilEng: "Deep red ferralsols. Highly weathered; requires compost, organic mulching, and nitrogen boosts.",
    soilLug: "Kasolo w'omusenyu ogumyufu. Gwetaaga nnyo nnakavundira, okusaanyiriza n'ebiriisa ebizimbisa.",
    seasonPeak: "First Rains: Mar-May | Second Rains: Sep-Nov"
  },
  Masaka: {
    climateEng: "South-central rolling hills. Slightly dry dry-seasons but high rain yields.",
    climateLug: "Emilawo gy'amasolo ag'ebalimi ba wansi. Obuseera bw'obukadde obutonnyera bulungi.",
    soilEng: "Moderate acidic loam. Highly suited for Robusta coffee and Matooke with proper fertilizer cover.",
    soilLug: "Etaka lya loamu. Lisanula nnyo kaawa ow'olunyago ne Matooke singa kigimusa bulungi.",
    seasonPeak: "First Rains: Mar-May | Second Rains: Sep-Nov"
  },
  Kabale: {
    climateEng: "Kigezi Highlands. High elevation, cool alpine air, severe mist on early seed beds.",
    climateLug: "Ebitundu eby'engulu ebya Kigezi. Obutiti bungi n'olufu olusaanuka mu nkusiga.",
    soilEng: "Fertile young humic volcanic loams. Highly acidic; apply lime/wood-ash to raise soil pH.",
    soilLug: "Etaka ery'omuliro ery'ekinnume. Lirimu asidi mungi; saako evvu lye mmiti okubulundula.",
    seasonPeak: "First Rains: Mar-May | Second Rains: Sep-Nov"
  },
  Jinja: {
    climateEng: "Eastern Kiira basin. Flat plains with intense rain storms and heavy afternoon sun.",
    climateLug: "Ebitundu by'ebuvanjuba mu Kiira. Obudde buba n'enkuba z'omuyaga n'omusana omupya.",
    soilEng: "Clay-loam lake alluvial deposits. Holds water beautifully; outstanding for organic sugarcane and maize.",
    soilLug: "Etaka ely'obujje ery'olububa. Likuuma mazzi; lisana nnyo kasooli ow'obusiga.",
    seasonPeak: "First Rains: Mar-May | Second Rains: Sep-Nov"
  },
  Gulu: {
    climateEng: "Northern Savannah plains. Extremely hot temperature bounds with single longer rain peak.",
    climateLug: "Obukiikokkulu bw'ebuwanjuba mu Gulu. Obudde bwakabirye n'emisana egy'amaanyi.",
    soilEng: "Sandy ferralsols and orthic soils. Drains quickly; best with sunflower, drought-hardy cassava, and groundnuts.",
    soilLug: "Kasolo w'omusenyu omweru. Guzingula mazzi mangu; gusana ebinyebwa ne muwogo ow'obutabi.",
    seasonPeak: "Main Rains: Apr-Oct (Uni-modal peak focus)"
  }
};

export default function PlantingCalendar({ language }: PlantingCalendarProps) {
  const dict = DICTIONARY[language];
  const [district, setDistrict] = useState<string>("Kampala");
  const [selectedCropId, setSelectedCropId] = useState<string>(PLANTING_CALENDAR_DATA[0].id);

  const activeCrop = PLANTING_CALENDAR_DATA.find((c) => c.id === selectedCropId) || PLANTING_CALENDAR_DATA[0];

  // Retrieve special climate override or fallback to Kampala
  const climateInfo = DISTRICT_CLIMATE_MATRIX[district] || DISTRICT_CLIMATE_MATRIX["Kampala"];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-slide-up">
      {/* Page Header */}
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-forest-900 mb-2 font-editorial">
          {dict.plantingTitle}
        </h1>
        <p className="text-sm text-sand-800 font-sans leading-relaxed">
          {dict.plantingDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Parameters Selectors */}
        <div className="lg:col-span-4 bg-sand-40 border border-sand-200 p-6 flex flex-col space-y-6 rounded-none shadow-sm">
          <h2 className="text-lg font-bold font-editorial text-forest-900 border-b border-sand-200 pb-2">
            {language === "lug" ? "Londa omulunda gwo" : "Agronomic Filters"}
          </h2>

          {/* District Selection */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-sand-800 block mb-1.5">
              {dict.chooseDistrict}
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-sand-50 border border-sand-200 text-sm py-2.5 px-3 focus:outline-none focus:border-forest-750 font-medium"
            >
              {UGANDA_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Crop List Toggle Grid */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-sand-800 block mb-2">
              {language === "lug" ? "Londa kika ky'ekirime:" : "Identify Target Seed:"}
            </label>
            <div className="flex flex-col space-y-1">
              {PLANTING_CALENDAR_DATA.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedCropId(item.id)}
                  className={`w-full text-left px-4 py-3.5 text-xs font-bold transition-all duration-150 rounded-none border border-l-4 ${
                    selectedCropId === item.id
                      ? "bg-sand-100 border-l-forest-900 border-sand-200 text-forest-900"
                      : "bg-sand-50 border-l-transparent border-sand-200 text-sand-850 hover:bg-sand-100/40"
                  }`}
                >
                  {language === "lug" ? item.cropLuganda : item.cropEnglish}
                </button>
              ))}
            </div>
          </div>

          {/* Bi-Modal peak information helper */}
          <div className="bg-sand-100/30 p-4 border border-sand-200/60 rounded-none flex items-start space-x-2 text-xs">
            <CloudDrizzle className="h-4.5 w-4.5 text-forest-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-forest-900 block font-editorial">
                {language === "lug" ? "Okumanya obugi bwa Uganda:" : "Uganda's Rainy Cycle:"}
              </span>
              <span className="text-sand-800 text-[11px] leading-relaxed block mt-0.5">
                {language === "lug"
                  ? "Uganda efunira enkuba mu bipeak bibiri: Kasamula (Maaki-May) ne Togo (Sebutemba-Novemba). Kigeza kusingiza obusigo mukaseera kano kiba kyamagezi."
                  : "Central, South, & East Uganda experience bi-modal precipitation. Planting just before the initial showers of each cycle maximizes crop survival."}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Active calendar details and regional tips */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Calendar Card */}
          <div className="bg-sand-40 border border-sand-200 p-8 flex flex-col space-y-6 rounded-none shadow-sm">
            {/* Header / Active Crop */}
            <div className="border-b border-sand-200 pb-4 flex justify-between items-start flex-wrap gap-2">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-forest-700 font-bold">
                  {language === "lug" ? "Erinnya ly'Ekirime" : "Crop Focus Area"}
                </span>
                <h3 className="text-3xl font-extrabold text-forest-900 font-editorial mt-0.5">
                  {language === "lug" ? activeCrop.cropLuganda : activeCrop.cropEnglish}
                </h3>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-forest-900 text-sand-50 font-mono text-[10px] uppercase font-semibold">
                <Calendar className="h-3.5 w-3.5" />
                <span>{activeCrop.ugandaRainSeason}</span>
              </div>
            </div>

            {/* Timelines split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: Planting */}
              <div className="bg-sand-50/50 p-5 border border-sand-200 rounded-none flex flex-col space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-forest-700 font-bold block">
                  {dict.plantingOptimal}
                </span>
                <p className="text-sm font-bold text-forest-900 font-editorial">
                  {language === "lug" ? activeCrop.optimalPlantingLuganda : activeCrop.optimalPlantingEnglish}
                </p>
              </div>

              {/* Box 2: Harvesting */}
              <div className="bg-sand-50/50 p-5 border border-sand-200 rounded-none flex flex-col space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-forest-700 font-bold block">
                  {dict.harvestOptimal || "Target Reap Window:"}
                </span>
                <p className="text-sm font-bold text-forest-900 font-editorial">
                  {language === "lug" ? activeCrop.harvestWindowLuganda : activeCrop.harvestWindowEnglish}
                </p>
              </div>
            </div>

            {/* Standard Soil advice */}
            <div>
              <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-sand-800 mb-2 border-b border-sand-200 pb-1">
                {dict.soilAdvice}
              </h4>
              <p className="text-xs text-sand-900 leading-relaxed font-sans">
                {language === "lug" ? activeCrop.soilTipsLuganda : activeCrop.soilTipsEnglish}
              </p>
            </div>
          </div>

          {/* Regional Microclimate Override Tips */}
          <div className="bg-sand-40 border border-sand-200 p-6 flex flex-col space-y-4 rounded-none shadow-sm animate-fade-in">
            <h3 className="text-sm uppercase font-mono font-bold tracking-wider text-forest-900 flex items-center space-x-1.5">
              <ShieldCheck className="h-4.5 w-4.5 text-forest-700" />
              <span>{district} {language === "lug" ? "Eby'enjawulo ne Climate" : "District Soil & Climate Insights"}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 bg-sand-50 border border-sand-200">
                <span className="font-bold text-sand-900 block mb-1">
                  {language === "lug" ? "Embeera y'Obudde bwa Disitulikiti:" : "District Climate Character:"}
                </span>
                <p className="text-sand-800 leading-relaxed font-sans">
                  {language === "lug" ? climateInfo.climateLug : climateInfo.climateEng}
                </p>
              </div>

              <div className="p-4 bg-sand-50 border border-sand-200">
                <span className="font-bold text-sand-900 block mb-1">
                  {language === "lug" ? "Etaka ne Conditioning bulungi:" : "Target Soil Condition Advice:"}
                </span>
                <p className="text-sand-800 leading-relaxed font-sans">
                  {language === "lug" ? climateInfo.soilLug : climateInfo.soilEng}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[10px] text-sand-800 pt-1.5 border-t border-sand-200/60 font-mono">
              <Footprints className="h-3.5 w-3.5" />
              <span>
                {language === "lug" 
                  ? "Okupima etaka kiyamba okusingiza. Siga nnakavundira mu ttaka lya loamu."
                  : "Farming strategies curated by TOBLI research center Kampala."}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
