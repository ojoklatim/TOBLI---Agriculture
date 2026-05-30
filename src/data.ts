import { MarketPriceItem, PlantingPeriod } from "./types";

// Translation helper catalog to support the "Luganda-First" initiative
export const DICTIONARY = {
  lug: {
    brandName: "TOBLI Ebyobulimi",
    brandSubtitle: "Yiga, Ggula, limira ku mutindo mu Luganda ne Munnamasajja",
    navDiagnose: "Kebera Endwadde",
    navChat: "Muzannyi wa AI",
    navPrices: "Ebisale by'Akatale",
    navCalendar: "Ebiro by'Okusiga",
    navWeather: "Embeera y'Obudde",
    langLabel: "Luganda",
    changeLang: "In English",
    
    // Diagnosis Module
    diagTitle: "Kebera Endwadde z'Ebirime ku Dagala rya AI",
    diagDesc: "Kuba ne weebatike ekifananyi ky'ekirime kyo ekirwadde. Enkola ya AI ejja kukuyamba okuzuula ekirwadde, kiva ku ki, n'engeri y'okukitako eddagala mu Luganda.",
    uploadBtn: "Kuba oba Tekamu Ekifananyi",
    uploadActive: "Ekifananyi Kitekebwamu...",
    dragText: "Kanyaze oba fukuula ekifananyi wano",
    farmerNotesLabel: "Ebyogerwa ebirala okusobola okuyamba AI (Ekyokulabirako: ebimuli biyunguka, obukoola buyulika):",
    notesPlaceholder: "Wandika wano mu Luganda oba Kiswahili...",
    districtSelectLabel: "Alima mu disitulikiti ki:",
    cropTypeLabel: "Kika ki eky'Ekirime (Matooke, Kasooli, Kaawa, n'ebirala):",
    diagnoseSubmit: "Kebera Endwadde Ggwangwa",
    diagnosingAlert: "AI ekyakebera obusawo bw'ebirime byo... Katono nnyo.",
    confidenceLabel: "Obwesige bwa AI:",
    cropAnalyzed: "Ekirime kizuuliddwa:",
    diseaseName: "Erinnya ly'Ekirwadde (Luganda):",
    diseaseNameEng: "Erinnya ly'Ekirwadde (English):",
    observedSymptoms: "Akabonero Akalondoddwa:",
    causedBy: "Ekireese Obulwadde:",
    treatmentTitle: "Enfuna y'Eddagala n'Okubujjanjaba:",
    preventionTitle: "Engeri y'okubitangiramu mu Maaso:",
    diagError: "Wabaddewo okukola ensobi mu kukebera ekirime kyo. Ngero gezaako nate.",
    
    // Chat Module
    chatTitle: "AI Omuyambi w'Omulimi",
    chatDesc: "Muuza AI yaffe ekibuuzo kyonna ku nlima, okufuuyira, ebigimusa, ne ddigani mu Luganda oba Olungereza.",
    chatPlaceholder: "Wandika wano eky'okubuuza (mu Luganda oba Olungereza)...",
    chatSubmit: "Siga Ekibuuzo",
    chatWelcome: "Mwasuze mutya, basenero abalimi ba TOBLI! Nsanyuse okukubulira ku by'obulimi ebitanga obulunji. Mbawuliriza, biki bye twogera ku kibanja kyammwe leero?",

    // Market Module
    marketTitle: "Eby'Akatale n'Ebisale by'Ebirime",
    marketDesc: "Omuwendo gw'ebintu mu butale bwa Uganda obunene mu Kampala (Nakasero, Balikuddembe Owino), Jinja, ne Mbarara. Enkyukakyuka y'ebisale evudde ku wiiki ewedde.",
    cropCategory: "Ekirime",
    marketNakasero: "Nakasero",
    marketOwino: "Owino (Balikuddembe)",
    marketJinja: "Jinja",
    marketMbarara: "Mbarara",
    marketGulu: "Gulu",
    averagePrice: "Ebisale ku Kilo (UGX)",
    directionUp: "Byeyongedde",
    directionDown: "Bikendedde",
    directionStable: "Bitebentye",
    trendChartLabel: "Mu kibalo ky'enkyukakyuka (ennaku 30 eziyise):",

    // Planting Module
    plantingTitle: "Entegeka ya Kalenda y'Okusiga ne Kasoola",
    plantingDesc: "Orugero rw'entegeka y'obusigosigo okukuuma wakati w'enkula y'enkyukakyuka y'ebutiti ku bungi bwe ntonya za Uganda ebbiri z'enjala.",
    chooseDistrict: "Masaka/Disitulikiti Yoolerwa:",
    plantingOptimal: "Mubiri gw'okusiga omulungi:",
    harvestOptimal: "Obudde bw'ukungula:",
    rainfallNotes: "Embeera y'embatika y'enkuba:",
    soilAdvice: "Magezi g'Etaka:",

    // Weather Module
    weatherTitle: "Embeera y'Obudde mu Disitulikiti zo",
    weatherDesc: "Eripooti y'embeera y'obudde okumala ennaku 7 eggyiddwa butereevu ku mivuyo gya ntonya (OpenMeteo) mu Uganda.",
    rainProb: "Obusobozi bw'Enkuba",
    humidity: "Obujjakirivu bw'Etaka",
    tempRange: "Obunyogovu ne Buggumu",
    loadingWeather: "Tukupimira embeera y'obudde ey'akaseera... Yinduka."
  },
  eng: {
    brandName: "TOBLI Agriculture",
    brandSubtitle: "Empowering growers with Luganda-First AI companion and digital resources",
    navDiagnose: "Disease Diagnosis",
    navChat: "Farmers' AI Chat",
    navPrices: "Live Market Prices",
    navCalendar: "Planting Calendar",
    navWeather: "Weather Forecast",
    langLabel: "English",
    changeLang: "Mu Luganda",

    // Diagnosis Module
    diagTitle: "AI Crop Disease Diagnosis",
    diagDesc: "Take or select a crop photo. Our AI identifies crop type, detects disease, uncovers diagnostic causes, and recommends step-by-step eco-sound remedies.",
    uploadBtn: "Snap or Upload Plant Photo",
    uploadActive: "Uploading Image...",
    dragText: "Drag & drop crop image here",
    farmerNotesLabel: "Additional farmer observations (e.g., Wilting, yellow leaf edges, holes):",
    notesPlaceholder: "Write feedback, symptoms observed in English or Luganda...",
    districtSelectLabel: "Agricultural District:",
    cropTypeLabel: "Name / Category (optional):",
    diagnoseSubmit: "Perform Diagnostics",
    diagnosingAlert: "Diagnosing crop pathogen. Please wait standard server interval...",
    confidenceLabel: "AI Confidence Output:",
    cropAnalyzed: "Identified Crop Specimen:",
    diseaseName: "Local Disease Name:",
    diseaseNameEng: "English Disease Name:",
    observedSymptoms: "Observed Pathology:",
    causedBy: "Pathogen Context (Cause):",
    treatmentTitle: "Organic & Remedial Treatments:",
    preventionTitle: "Prevention Guidelines:",
    diagError: "An error occurred during diagnostics. Please check picture lighting and try again.",

    // Chat Module
    chatTitle: "Uganda Agronomic AI Companion",
    chatDesc: "Ask any agricultural or veterinary question. Powered by AI trained in regional district seasons, soils, and sustainable methods.",
    chatPlaceholder: "Ask about irrigation, organic fertilizers, pesticides, coffee berry disease...",
    chatSubmit: "Broadcast Prompt",
    chatWelcome: "Welcome to TOBLI Agriculture AI! How can I assist you on your shamba/farm today in Luganda or English?",

    // Market Module
    marketTitle: "Live Market Intelligence",
    marketDesc: "Track dynamic crop prices across Uganda's prominent distribution centers: Nakasero and Owino (St. Balikuddembe) in Kampala, Jinja, and Mbarara. Net weekly variations.",
    cropCategory: "Agricultural Commodity",
    marketNakasero: "Nakasero Market",
    marketOwino: "Owino (Balikuddembe)",
    marketJinja: "Jinja Main Market",
    marketMbarara: "Mbarara Central",
    marketGulu: "Gulu Market",
    averagePrice: "Average Price per KG (UGX)",
    directionUp: "Increased",
    directionDown: "Decreased",
    directionStable: "Stable",
    trendChartLabel: "30-Day Price Trendline Representation:",

    // Planting Module
    plantingTitle: "Ugandan Dual-Season Planting Guide",
    plantingDesc: "Select your district and crop type to dynamically fetch the best planting and reaping slots based on the region's historical double-peak rain patterns.",
    chooseDistrict: "Select Farming District:",
    plantingOptimal: "Optimal Planting Window:",
    harvestOptimal: "Target Reap Window:",
    rainfallNotes: "Ugandan Rainfall Peak Category:",
    soilAdvice: "Soil Conditioning Advice:",

    // Weather Module
    weatherTitle: "7-Day District Weather Engine",
    weatherDesc: "District-level real-time forecasts queried from OpenMeteo. Displays ambient temperatures, humidity, and rainfall probability peaks.",
    rainProb: "Rain Probability",
    humidity: "Air Humidity",
    tempRange: "Temp. Bounds",
    loadingWeather: "Fetching current district metrics... One second."
  }
};

export const UGANDA_DISTRICTS = [
  "Kampala",
  "Wakiso",
  "Mukono",
  "Jinja",
  "Masaka",
  "Mbarara",
  "Gulu",
  "Mbale",
  "Kabale",
  "Kasese",
  "Lira",
  "Luweero",
  "Tororo"
];

// Seed market database representing real-world Uganda wholesale metrics
export const SEED_MARKET_PRICES: MarketPriceItem[] = [
  {
    id: "matooke",
    cropEnglish: "Matooke (Green Bananas)",
    cropLuganda: "Ebitooke (Matooke)",
    category: "Grains",
    unit: "Bunch (Medium)",
    averagePriceUGX: 22000,
    changePercent: 4.8,
    pricesByMarket: {
      Nakasero: 24000,
      "St. Balikuddembe (Owino)": 21000,
      Jinja: 22000,
      Mbarara: 15000,
      Gulu: 25000
    },
    trendHistory: [18000, 19000, 18500, 20000, 21000, 20500, 22000, 22000]
  },
  {
    id: "kasooli",
    cropEnglish: "Maize Grain (Kasooli)",
    cropLuganda: "Ekipapula kya Kasooli",
    category: "Grains",
    unit: "KG (Dry Wholesale)",
    averagePriceUGX: 1400,
    changePercent: -2.1,
    pricesByMarket: {
      Nakasero: 1600,
      "St. Balikuddembe (Owino)": 1400,
      Jinja: 1300,
      Mbarara: 1350,
      Gulu: 1200
    },
    trendHistory: [1550, 1500, 1480, 1450, 1420, 1400, 1380, 1400]
  },
  {
    id: "muwogo",
    cropEnglish: "Cassava (Muwogo)",
    cropLuganda: "Muwogo omunene",
    category: "Tubers",
    unit: "KG (Fresh Tuber)",
    averagePriceUGX: 1800,
    changePercent: 1.5,
    pricesByMarket: {
      Nakasero: 2000,
      "St. Balikuddembe (Owino)": 1700,
      Jinja: 1800,
      Mbarara: 1600,
      Gulu: 1900
    },
    trendHistory: [1700, 1720, 1750, 1720, 1780, 1820, 1800, 1800]
  },
  {
    id: "bijanjalo",
    cropEnglish: "Yellow Beans (Bijanjalo)",
    cropLuganda: "Ebijanjalo ebya Diloolo",
    category: "Legumes",
    unit: "KG (Dry Grade A)",
    averagePriceUGX: 3800,
    changePercent: 7.2,
    pricesByMarket: {
      Nakasero: 4100,
      "St. Balikuddembe (Owino)": 3800,
      Jinja: 3700,
      Mbarara: 3400,
      Gulu: 3950
    },
    trendHistory: [3400, 3500, 3550, 3600, 3700, 3750, 3800, 3800]
  },
  {
    id: "kaawa",
    cropEnglish: "Robusta Coffee (FAQ/Kase)",
    cropLuganda: "Kaawa ow'amaliba (Robusta)",
    category: "Cash Crops",
    unit: "KG (Kiboko FAQ)",
    averagePriceUGX: 8200,
    changePercent: 12.4,
    pricesByMarket: {
      Nakasero: 8400,
      "St. Balikuddembe (Owino)": 8100,
      Jinja: 8300,
      Mbarara: 8500,
      Gulu: 8100
    },
    trendHistory: [7100, 7250, 7400, 7600, 7810, 8000, 8150, 8200]
  },
  {
    id: "binyebwa",
    cropEnglish: "Groundnuts (Red Beauty)",
    cropLuganda: "Ebinyebwa Red Beauty",
    category: "Legumes",
    unit: "KG (Shelled)",
    averagePriceUGX: 4500,
    changePercent: -0.8,
    pricesByMarket: {
      Nakasero: 4800,
      "St. Balikuddembe (Owino)": 4500,
      Jinja: 4400,
      Mbarara: 4300,
      Gulu: 4700
    },
    trendHistory: [4600, 4580, 4550, 4540, 4500, 4510, 4490, 4500]
  },
  {
    id: "vitunguu",
    cropEnglish: "Onions",
    cropLuganda: "Obutungulu",
    category: "Fruits",
    unit: "Basket (Small)",
    averagePriceUGX: 12000,
    changePercent: 0.0,
    pricesByMarket: {
      Nakasero: 13000,
      "St. Balikuddembe (Owino)": 11500,
      Jinja: 12000,
      Mbarara: 11000,
      Gulu: 12500
    },
    trendHistory: [12000, 11800, 12200, 12000, 12000, 12100, 11950, 12000]
  }
];

// Seed planting seasons correlating with Uganda's double rains
export const PLANTING_CALENDAR_DATA: PlantingPeriod[] = [
  {
    id: "bananas",
    cropEnglish: "Matooke (Bananas)",
    cropLuganda: "Ebitooke / Matooke",
    optimalPlantingEnglish: "Late Feb to Mid-April (at the onset of first rains 'Kasamula')",
    optimalPlantingLuganda: "Tandika mu kasamula mu kitundu kya Feberewali okutuuka wakati wa Apuli",
    harvestWindowEnglish: "Year-round, with peak yields 12-15 months from planting",
    harvestWindowLuganda: "Kukungulwa kwakalemera omwaka gwonna, naddala emyezi 12-15 okuva lwasigwa",
    ugandaRainSeason: "First Peak (Kasamula: Mar-May)",
    soilTipsEnglish: "Requires highly mulched fields, organic dung compost, and soil mounds. High spacing of 3m x 3m.",
    soilTipsLuganda: "Okusiga kwetaaga omuceere mungi ku ttaka okusala, eddagala ly'enkoko oba ebisolo, era ne mita 3 ku 3."
  },
  {
    id: "maize",
    cropEnglish: "Maize (Kasooli Longe-series)",
    cropLuganda: "Kasooli ow'obusigo (Longe)",
    optimalPlantingEnglish: "March (First Season) or Late August/September (Second Season)",
    optimalPlantingLuganda: "Siga mu Maaki (Ebiro eby'olubereberye) oba mu kulemerako kwa Agusito/Sebutemba (Ebiro eby'okubiri)",
    harvestWindowEnglish: "July-August (First Season) or January-February (Second Season)",
    harvestWindowLuganda: "Kungula wakati wa Julaayi ne Agusito, oba Ogwokubiri kinyumise",
    ugandaRainSeason: "Both Seasons",
    soilTipsEnglish: "In sandy-clay or volcanic loams. Apply nitrogen fertilizer or cow manure on week 4.",
    soilTipsLuganda: "Mu musenyusenyu n'ettaka ly'obugimuse. Yiirira nnakavundira oba ggalon wa cow manure mu wiiki ey'okuna."
  },
  {
    id: "beans",
    cropEnglish: "Beans (Nambale/Yellow)",
    cropLuganda: "Ebijanjalo Nambale",
    optimalPlantingEnglish: "Early March to mid-April or early September to October",
    optimalPlantingLuganda: "Kusiga mu masekkati ga Maaki ku Apuli, oba Sebutemba egwa",
    harvestWindowEnglish: "June-July or December (requires dry sun for shelf storage)",
    harvestWindowLuganda: "Kukungula mu Juni-Julaayi oba Desemba (omusana omunene weetaagisa okukaza)",
    ugandaRainSeason: "Both Seasons",
    soilTipsEnglish: "Prefers well-draining sandy loam soils. Does not tolerate waterlogging; avoid low plains with poor pathways.",
    soilTipsLuganda: "Kyettanira ettaka eritaliamu mazzi mayitirivu. Weewale emigezo emiramu kubanga emiddo jireeta kutaataaganya."
  },
  {
    id: "cassava",
    cropEnglish: "Cassava (Muwogo)",
    cropLuganda: "Muwogo w'ekika ekiyiti",
    optimalPlantingEnglish: "March-April or late August (takes full advantage of both rains)",
    optimalPlantingLuganda: "Tumbula okusiga wakati wa Maaki ne Apuli oba kulemerako gya Agusito agaba",
    harvestWindowEnglish: "9-12 months later (harvest sequentially as needed)",
    harvestWindowLuganda: "Emyezi 9-12 okuva lw'osize. Sinzika butereevu nnyigo egwa okukungula",
    ugandaRainSeason: "Both Seasons",
    soilTipsEnglish: "Mound planting is highly recommended. Soil must be deep and loose to allow tuber enlargement.",
    soilTipsLuganda: "Okuteekamu obukiiko n'emyezi kiyamba nnyo okukulisa ebinyigo. Ettaka ligonze bulungi obutunzi we bwavu."
  },
  {
    id: "coffee",
    cropEnglish: "Robusta Coffee (Kaawa)",
    cropLuganda: "Kaawa ow'olunyago (Robusta)",
    optimalPlantingEnglish: "Late September to November (second peak, allows root establishment during mild rains)",
    optimalPlantingLuganda: "Tandika mu Sebutemba agwa okutuuka mu Novemba (Kiyamba okunyweza emizi mu mataka amagumu)",
    harvestWindowEnglish: "Main crop pickings from December to March (varies with rain cycles)",
    harvestWindowLuganda: "Okubaba we kutandikira mu Desemba okugenda mu Maaki",
    ugandaRainSeason: "Second Peak (Togo: Sep-Nov)",
    soilTipsEnglish: "Deep, fertile acidic clay soils. Intercrop with Matooke or shade trees like Albizia to manage severe sun impacts.",
    soilTipsLuganda: "Ettaka ly'okusiko n'okusiga libeere eggimu bulungi. Siga wamu n'ebitooke oba emiti gy'ebisikirize ekitalubamu musana gungi."
  }
];

// District-wise latitude & longitude mappings to trigger OpenMeteo dynamically without breaking
// Or use robust baseline forecast when network is unstable
export const DISTRICT_MAP = {
  Kampala: { lat: 0.3156, lon: 32.5811 },
  Wakiso: { lat: 0.3957, lon: 32.4642 },
  Mukono: { lat: 0.3544, lon: 32.7486 },
  Jinja: { lat: 0.4244, lon: 33.2042 },
  Masaka: { lat: -0.3409, lon: 31.7342 },
  Mbarara: { lat: -0.6074, lon: 30.6545 },
  Gulu: { lat: 2.7725, lon: 32.2881 },
  Mbale: { lat: 1.0784, lon: 34.1758 },
  Kabale: { lat: -1.2529, lon: 29.9872 },
  Kasese: { lat: 0.1794, lon: 30.0883 },
  Lira: { lat: 2.2474, lon: 32.9004 },
  Luweero: { lat: 0.8354, lon: 32.4981 },
  Tororo: { lat: 0.6931, lon: 34.1811 }
};

// Map OpenMeteo weather code to beautiful English/Luganda labels and Lucide Icons compatible tags
export function getWeatherCondition(code: number): { condition: string; conditionLuganda: string; icon: string } {
  if (code === 0) return { condition: "Clear Sky", conditionLuganda: "Obudde bwa Musana Obwerulo", icon: "Sun" };
  if (code >= 1 && code <= 3) return { condition: "Partly Cloudy", conditionLuganda: "Obudde bwa Bisinde", icon: "CloudSun" };
  if (code >= 45 && code <= 48) return { condition: "Foggy/Misty", conditionLuganda: "Obufu / Lufu lwa Budde", icon: "CloudFog" };
  if (code >= 51 && code <= 55) return { condition: "Light Drizzle", conditionLuganda: "Katonnyera / Luwawa", icon: "CloudDrizzle" };
  if (code >= 61 && code <= 65) return { condition: "Rainy Peak", conditionLuganda: "Tonneesera Enkuba Katono", icon: "CloudRain" };
  if (code >= 80 && code <= 82) return { condition: "Heavy Rain Showers", conditionLuganda: "Matonnye_gaggya n'Enkuba Enneene", icon: "CloudLightning" };
  return { condition: "Mild Weather", conditionLuganda: "Obudde Obulanga bwa bulijjo", icon: "Cloud" };
}
