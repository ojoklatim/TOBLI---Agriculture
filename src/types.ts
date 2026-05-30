export type AppLanguage = "lug" | "eng";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  imageBase64?: string;
  mimeType?: string;
  audioBase64?: string;
  audioMimeType?: string;
}

export interface DiagnosisResult {
  cropName: string;
  diseaseNameEnglish: string;
  diseaseNameLuganda: string;
  confidence: number;
  symptomsEnglish: string;
  symptomsLuganda: string;
  causeEnglish: string;
  causeLuganda: string;
  treatmentStepsEnglish: string[];
  treatmentStepsLuganda: string[];
  preventionStepsEnglish: string[];
  preventionStepsLuganda: string[];
  modelUsed?: string;
  fallbackModeActive?: boolean;
}

export interface MarketPriceItem {
  id: string;
  cropEnglish: string;
  cropLuganda: string;
  category: "Grains" | "Tubers" | "Legumes" | "Cash Crops" | "Fruits";
  unit: string;
  averagePriceUGX: number;
  changePercent: number; // e.g., 2.4 (positive or negative)
  pricesByMarket: {
    Nakasero: number;
    "St. Balikuddembe (Owino)": number;
    Jinja: number;
    Mbarara: number;
    Gulu: number;
  };
  trendHistory: number[]; // Array of 30-day index numbers for SVG trend chart
}

export interface PlantingPeriod {
  id: string;
  cropEnglish: string;
  cropLuganda: string;
  optimalPlantingEnglish: string;
  optimalPlantingLuganda: string;
  harvestWindowEnglish: string;
  harvestWindowLuganda: string;
  ugandaRainSeason: "First Peak (Kasamula: Mar-May)" | "Second Peak (Togo: Sep-Nov)" | "Both Seasons";
  soilTipsEnglish: string;
  soilTipsLuganda: string;
}

export interface WeatherData {
  time: string[];
  temperature2mMax: number[];
  temperature2mMin: number[];
  precipitationProbabilityMax: number[];
  relativeHumidity2mMax: number[];
  weatherCode: number[];
}

export interface DistrictWeather {
  district: string;
  temperature: number; // current temp
  humidity: number; // current humidity
  rainChance: number; // current rain prob
  forecast: {
    day: string;
    tempMin: number;
    tempMax: number;
    rainProb: number;
    humidity: number;
    condition: string;
    conditionLuganda: string;
  }[];
}
