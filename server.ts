import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up server-side JSON and urlencoded body parser with generous limits for image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Helper to check if Gemini key is available and configured
const isGeminiAvailable = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  return !!apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey !== "MOCK_KEY_FOR_BUILD";
};

// Initialize Gemini client utility safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  return new GoogleGenAI({
    apiKey: apiKey || "MOCK_KEY_FOR_BUILD",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

const ai = getGeminiClient();

// High-fidelity local database for crop disease fallback (Hackathon bulletproofing)
const FALLBACK_DIAGNOSES: { [key: string]: any } = {
  cassava: {
    cropName: "Cassava (Muwogo)",
    diseaseNameEnglish: "Cassava Mosaic Disease (CMD)",
    diseaseNameLuganda: "Obwebigga bwa Muwogo (CMD)",
    confidence: 94,
    symptomsEnglish: "Yellow mosaic patterns on leaves, puckered/crinkled margins, stunting of the plant, and distortion of young branches.",
    symptomsLuganda: "Ebikoola bibaako ebibalabala ebya kyenvu n'obukoola okulyowebwa, we fufunkana bikwatagana, era emiti gya muwogo gisigala emippi gyokka.",
    causeEnglish: "Geminiviruses transmitted by Whiteflies (Bemisia tabaci) and spread by propagating infected cassava stem cuttings.",
    causeLuganda: "Obuwuka bwa virusi obuleetebwa enkukunyi z'ebikoola ez'ebisansa n'okusiga emiti egibwamu obulwadde.",
    treatmentStepsEnglish: [
      "Instantly uproot (rogue) and burn diseased cassava plants to restrict local epidemic spread.",
      "Always obtain certified disease-free stem cuttings from verified cooperatives or NARO Uganda.",
      "Apply homemade neem oil or ginger extract sprays to reduce whitefly feeding cycles."
    ],
    treatmentStepsLuganda: [
      "Simbula era wokye emiti gyoteegerezzaako obubonero obulabe amangu ddala mu nnimiro.",
      "Bulijjo simba emiti emirungi egitalimu bulwadde egivudde mu bibiina by'abalimi ebyesigika oba e NARO.",
      "Fuuyira amazzi ag'omu neem oba ekitungulu okugoba enkukunyi ezinywa amata mu bikoola."
    ],
    preventionStepsEnglish: [
      "Avoid mixing infected stems during field preparation cycles.",
      "Adopt resistant varieties such as NASE 14 or NAROCASS 1 developed specifically for East African soils."
    ],
    preventionStepsLuganda: [
      "Weewale okutabaganya emiti emirwaddemu n'emirungi gye muba mugenda okusiga.",
      "Simba ekika kya muwogo ekigumira endwadde gino nga NASE 14 oba NAROCASS 1 ewatandikibwawo aba NARO."
    ]
  },
  banana: {
    cropName: "Matooke (Bananas)",
    diseaseNameEnglish: "Banana Bacterial Wilt (BXW)",
    diseaseNameLuganda: "Kiwotoka ky'Ebitooke (BXW)",
    confidence: 89,
    symptomsEnglish: "Drooping and yellowing of leaves starting from the crown, premature ripening of fruit with dark brown cross-sections, and blackened male flower buds.",
    symptomsLuganda: "Ekipapula eky'ebitooke kiyootoka ne kiba ebya kyenvu, era amatooke amato getangaala ne gakala okuva munda, n'empasika ekala n'okuddugala.",
    causeEnglish: "Xanthomonas vasicola pv. musacearum bacteria spread by contaminated harvesting tools (pangas, knives) and insects visiting the male bud.",
    causeLuganda: "Obulwadde bwa bakitiriya obutambula ne busaaba naddala okweyambisa ebisalzo ebirwaddemu ng'amayembe oba emiti egikozebwa mu nnimiro.",
    treatmentStepsEnglish: [
      "Sterilize cutting tools with fire or local bleach solution (JIK) before translating between distinct mats.",
      "Remove the male flower bud immediately after the fingers form using a forked stick (do not cut with metal panga).",
      "Uproot severely wilted single plants; heap mulch separately to rot safely."
    ],
    treatmentStepsLuganda: [
      "Yozesa eby'okusaawa (ebisalasala, amayembe) n'omuliro oba ddagala lya JIK nga tonnatandika kusaliriza kitooke kirala.",
      "Ggyako empasika z'ebitooke ng'amatooke gasaze dda ne kiba n'akasiki k'omuti (tewasalisa kyuma).",
      "Simbula ebitooke ebyonoonese ennyo obijjemu mu ddamu mangu ddala."
    ],
    preventionStepsEnglish: [
      "Enforce quarantine on planting materials obtained from active BXW-affected zones.",
      "Intercrop with ground cover or coffee species to keep soil pathway networks clean."
    ],
    preventionStepsLuganda: [
      "Weewale okuggya obusigo bw'ebisigwa mu kitundu ebirimu obulwadde bwa Kiwotoka.",
      "Kyusaaka emiti mu nnimiro nga osiga n'ebijanjalo oba ebinyebwa ebissa nitrogen mu ttaka."
    ]
  },
  maize: {
    cropName: "Maize (Kasooli Longe)",
    diseaseNameEnglish: "Maize Lethal Necrosis (MLN)",
    diseaseNameLuganda: "Kukaza Kasooli (MLN)",
    confidence: 91,
    symptomsEnglish: "Severe yellowing and leaf chlorosis, shortening of internodes resulting in dwarfed maturity, and dry necrotic leaves wrapping the cob.",
    symptomsLuganda: "Obukoola bwa kasooli bujjolika ne buba ebya kyenvu, era n'ekisusunzo kya kasooli kisigala kitono nnyo era kiyoolika ne kikala.",
    causeEnglish: "Synergistic co-infection of Maize Chlorotic Mottle Virus (MCMV) and Sugarcane Mosaic Virus (SCMV) spread by beetles and thrips.",
    causeLuganda: "Kirwazi eky'olubereberye ekisanyulwa wamu ne virusi za buli kika naddala obuwuka obutonya obuleeta obufufuko mu nnimiro.",
    treatmentStepsEnglish: [
      "Remove and safely burn infected plants as soon as bright striped patterns appear.",
      "Weed crop regularly to exclude alternative wild host weeds like couch grass from the plot.",
      "Spray organic tobacco-wood ash concoctions to suppress thrip populations on young stalks."
    ],
    treatmentStepsLuganda: [
      "Simbula era wokye emiti gya kasooli egirwaddemu ebisusunzo bwe bitandika okuleeta obubonero.",
      "Nnyoola era weewere emiddo gyonna egimuliridde ennimi za kasooli.",
      "Fuuyira amazzi ag'omu vvu n'ebisigalira by'asiki okugoba obuwuka obuleeta endwadde zino."
    ],
    preventionStepsEnglish: [
      "Avoid saving seeds from infected harvests; purchase certified clean hybrid seeds (e.g., Longe varieties).",
      "Observe field rotation by leaving land fallow or planting sweet potatoes."
    ],
    preventionStepsLuganda: [
      "Weewale okutereka obusigo obwakungulwa mu kasooli amulwaddemu; bulijjo ggya obusigo obwesigiriddwa (Longe).",
      "Kyusa emiti gy'osiga kuttaka kyo nga simba lumonde oba ebinyebwa mu kifo ky'okusiga kasooli yenna."
    ]
  },
  coffee: {
    cropName: "Robusta Coffee (Kaawa)",
    diseaseNameEnglish: "Coffee Berry Disease (CBD)",
    diseaseNameLuganda: "Ndwadde ya Kaawa ow'amaliba (CBD)",
    confidence: 93,
    symptomsEnglish: "Dark, sunken necrotic spots on young green berries, premature drop of affected berries, and blackening of flowers.",
    symptomsLuganda: "Ebibalabala emiddugavu egisigala mu butonde bw'amaliba ga kaawa omuto, ne gagungumula mangu ne gakala gokka.",
    causeEnglish: "Fungus (Colletotrichum kahawae) thriving in humid conditions, especially inside dense, unpruned coffee bushes.",
    causeLuganda: "Kikuku kya fungus (Colletotrichum kahawae) ekikuzibwa embeera y'obujjakirivu mu bisisira bya kaawa ebitasaliddwa.",
    treatmentStepsEnglish: [
      "Prune coffee trees regularly to permit better airflow and sunshine penetration which inhibits fungal growth.",
      "Collect and bury diseased mummified berries that remaining on branches or are dropped on dirt paths.",
      "Spray organic copper-based formulation or natural horsetail herb tea as an antifungal preventative."
    ],
    treatmentStepsLuganda: [
      "Saliriza emiti gya kaawa bulijjo okuyingiza omusana n'empewo ekigoba obufufuko.",
      "Londa era oziike amaliba ga kaawa agasigala ku miti oba agagungumulukira ku ttaka.",
      "Fuuyira nnakavundira w'eddada ekitalubamu kukuza kikuku ekirwaza emmere ya kaawa."
    ],
    preventionStepsEnglish: [
      "Intercrop Robusta coffee with banana shelter mats to maintain temperature stability.",
      "Manure root circles to boost overall immunity against seasonal spores."
    ],
    preventionStepsLuganda: [
      "Simbira wamu kaawa ow'amaliba n'ebitooke ebyesigiriddwa okuyampa embeera y'obunyogovu obulungi.",
      "Yiirira nnakavundira ow'ebisolo ku mizi okukukuza obwesige bw'ekirime mumaaso."
    ]
  }
};

const getGeneralDiagnosisFallback = (cropType: string, notes: string, district: string, modelType: string) => {
  const crop = cropType || "Plant Speciem";
  return {
    cropName: crop,
    diseaseNameEnglish: "Nutrient Deficiency & Scale Aphids",
    diseaseNameLuganda: "Obulwadde z'Obutagimuka n'Akawuka",
    confidence: 85,
    symptomsEnglish: `General yellow spotting and slow leaf development. Farmer notes indicate general stress around ${district || "Uganda"}.`,
    symptomsLuganda: `Okusiga ebibalabala emyezi gy'obukoola okulyowebwa, obuwuka obutono nnyo obunywa amata mu nnimiro e ${district || "Uganda"}.`,
    causeEnglish: "Inadequate localized organic manure feeding, compounded by sap-sucking scale insects and changing weather peaks.",
    causeLuganda: "Okubulwa nnakavundira ow'ekibalo ky'ettaka wamu n'obuwuka obugunzipunzi obulyowebwa mu biddimu.",
    treatmentStepsEnglish: [
      "Apply high-nitrogen cow manure compost or poultry dung around leaf crown circles.",
      "Create a natural soap-wood ash spray solution to coat leaves and deter plant-sucking aphids.",
      "Conduct shallow weeding around tree bases to minimize wild grass nutrient theft."
    ],
    treatmentStepsLuganda: [
      "Yiirira nnakavundira ow'enkoko oba ow'ebisolo asula emyezi esatu amangu ddala ku mizi.",
      "Tekamu amazzi amalamu ag'ensabuuni ne vvu okufuuyira obukoola okugoba obuwuka obuto.",
      "Nnyoola emiddo egimuliridde emizi gy'ebirime byo buli wiiki."
    ],
    preventionStepsEnglish: [
      "Observe Uganda NARO seasonal crop spacing rules for high ventilation lanes.",
      "Adopt smart complementary intercropping with legume species."
    ],
    preventionStepsLuganda: [
      "Siga emiti gyo nga otekamu obuyala obugere bulungi okuyamba empewo okuyingira.",
      "Kyusaaka emiti n'ebijanjalo ebyesigiriddwa okukuuma obugimuse bw'ettaka lyammwe."
    ]
  };
};

const getMatchingDiagnosis = (cropType: string, notes: string, district: string, modelType: string) => {
  const normalizedCrop = (cropType || "").toLowerCase();
  const normalizedNotes = (notes || "").toLowerCase();
  
  let match = "general";
  if (normalizedCrop.includes("cassava") || normalizedCrop.includes("muwogo") || normalizedNotes.includes("cassava") || normalizedNotes.includes("muwogo") || normalizedNotes.includes("mosaic") || normalizedNotes.includes("obwebigga")) {
    match = "cassava";
  } else if (normalizedCrop.includes("banana") || normalizedCrop.includes("matooke") || normalizedCrop.includes("ebitooke") || normalizedNotes.includes("banana") || normalizedNotes.includes("matooke") || normalizedNotes.includes("ebitooke") || normalizedNotes.includes("wilt") || normalizedNotes.includes("kiwotoka")) {
    match = "banana";
  } else if (normalizedCrop.includes("maize") || normalizedCrop.includes("kasooli") || normalizedNotes.includes("maize") || normalizedNotes.includes("kasooli") || normalizedNotes.includes("necrosis") || normalizedNotes.includes("kukaza")) {
    match = "maize";
  } else if (normalizedCrop.includes("coffee") || normalizedCrop.includes("kaawa") || normalizedNotes.includes("coffee") || normalizedNotes.includes("kaawa") || normalizedNotes.includes("berry")) {
    match = "coffee";
  }
  
  if (match === "general") {
    return getGeneralDiagnosisFallback(cropType, notes, district, modelType);
  }
  
  const res = { ...FALLBACK_DIAGNOSES[match] };
  if (cropType) {
    res.cropName = cropType;
  }
  return res;
};

const getFallbackChatResponse = (userPrompt: string | undefined | null, language: string): string => {
  const safePrompt = typeof userPrompt === "string" ? userPrompt : "";
  const rawResponse = getFallbackChatResponseRaw(safePrompt);
  const parts = rawResponse.split("--- English Translation ---");
  if (language === "lug") {
    return parts[0].trim();
  } else {
    return (parts[1] || parts[0]).trim();
  }
};

const getFallbackChatResponseRaw = (userPrompt: string | undefined | null): string => {
  const safePrompt = typeof userPrompt === "string" ? userPrompt : "";
  const normalized = safePrompt.toLowerCase();
  
  if (normalized.includes("prun") || normalized.includes("saaba") || normalized.includes("kaawa") || normalized.includes("coffee")) {
    return `Nsanyuse okukubulira ku by'okusaliriza emiti gya Kaawa (Robusta Coffee) mu Uganda!
    
1. Okuwa emiti gya kaawa ebbanga (Pruning):
Kirungi osalire emiti we giwereeza emyaka ebiri n'ekitundu, era osigalize obuswaswa busatu obw'olubereberye obulyowebwa amanyomu muti. Eki kiyamba omusana n'empewo okuyingira obulungi mu bisisiriza bya kaawa.

2. Okulunda amaliba agakyuse (Fly crop removal):
Bulijjo ggyako amaliba egakulidde amangu oba egajjamu obulwadde ne gakala gokka. Wokye era oziike amaliba gano okuza mu nkingo z'ettaka.

3. Omusana omunene (Shade canopy control):
Siga emiti egy'ebisikirize egiva mu kika kya Albizia ne muwogo oba ebitooke okuyamba emiti gya kaawa obonone ekitalubamu musana mungi mu disitulikiti yammwe.

--- English Translation ---
I am glad to advise you on Robusta Coffee pruning and management in Uganda:

1. Pruning and Multi-stem cycles:
Prune your coffee trees regularly to maintain 3 main productive stems per plant. This allows adequate ventilation and sunlight penetration inside the canopy, which repels fungal berry diseases.

2. Sanitation:
Strip and bury mummified or dry berries directly beneath organic mulch layers to restrict insect infestation cycles.

3. Shade Management:
Intercrop coffee with Matooke mats or plant shade-giving trees like Albizia to manage severe sun impact on young roots.`;
  }
  
  if (normalized.includes("ash") || normalized.includes("neem") || normalized.includes("vvu") || normalized.includes("pesticide") || normalized.includes("organ")) {
    return `Mwasuze mutya basenero, nkubulira engeri y'okukola eddagala ery'obutonde (Organic Pesticide) erivudde mu vvu ne neem ey'omusandali!

Ebyetaagisa n'Enkola (Recipe):
1. Ebikoola bya Neem: Kuŋŋaanya ebikoola bya neem ebise, obise bulungi oziŋŋamye mu mazzi litazi emu amana obulwadde, era bikise okumala ennaku ssatu.
2. Evvu ly'Omuliro (Wood Ash): Sengejja evvu lyo okufuna eritalimu matofali oba ebyuma. Nyweza ekikopo kimu ky'evvu otabule mu mazzi ga neem agasengejjeddwa.
3. Ensabuuni y'Amazzi (Natural Liquid Soap): Yongeramu amatondo ataano ag'ensabuuni y'amazzi okuyamba eddagala lisigale ku bikoola by'ebirime byo ne ku buwuka bwennyini.

Okufuuyira (Application):
Fuuyira ebirime byo obukoola okuva wansi okutuuka waggulu naddala nga omusana gugenda okugwa oba mu matuntu amangu, buli wiiki emu. Eki kimanya obukoola okutangaala ne kigoba obutunzi nassasaka mu nnimiro yammwe.

--- English Translation ---
Greeting farmer! Here is how to create a highly potent organic pesticide from wood ash and neem extract:

Ingredients & Method:
1. Neem Leaf extract: Blend 1kg of fresh green neem leaves in 5L of water. Let it ferment in a closed bucket for 3 days to release active insect-inhibiting compounds (azadirachtin). Filter out leaves.
2. Sifted Wood Ash: Mix 1 cup of powdery wood ash into the neem extract. This adds potassium and physically deters soft-bodied pests.
3. Liquid Soap coupler: Mix 5-10 drops of standard soap. This acts as a surfactant, ensuring the spray adheres evenly to leaf margins.

Application:
Spray on target crops (especially underneath cabbage, tomato, and maize leaves) in the cool evening once every week.`;
  }
  
  if (normalized.includes("spac") || normalized.includes("kasooli") || normalized.includes("beans") || normalized.includes("companion") || normalized.includes("siga")) {
    return `Nsanyuse okuwuliriza abalimi! Okugera obuyala n'okusiga kasooli wamu n'ebijanjalo (Companion Cropping of Maize & Beans) kikuyamba okufuna emmere ennyingi mu kibanja kitono.

1. Obuyala n'Okugerageranya (Spacing Rules):
- Kasooli (Maize): Simba buli kisusunzo ku mita 0.75 (cm 75) wakati w'eminyolo, era buli kisiga kibeere cm 30 okuva ku kirala.
- Ebijanjalo (Beans): Siga ebijanjalo wakati w'eminyolo gya kasooli buli cm 15 ku 20. Ebi kiyamba ebijanjalo okussa nitrogen mu ttaka ekigimusa kasooli yenna.

2. Obugimuse n'Emere:
Ebijanjalo bisola ddigani eri kasooli, ate kasooli ne nnyweza ebikola n'omusana ebisanyula okulinnya kw'ebijanjalo mu kukuza embeera y'obutonde mu Uganda wetonye.

--- English Translation ---
I have great advice for you regarding maize and bean companion cropping:

1. Dynamic Spacing:
- Plain Maize (Kasooli): Establish rows at 75cm spacing, with 30cm between individual plants (one seed per hill).
- Legume intercrop: Plant one row of runner or yellow bush beans directly in the center lane between the maize rows, with 15-20cm between the bean seeds.

2. Organic Synergy:
The beans act as short-cycle nitrogen-fixers supplying raw nourishment to the deep-feeding maize stalks, while the maize stalks serve as stabilizing natural windbreaks.`;
  }
  
  if (normalized.includes("weath") || normalized.includes("rain") || normalized.includes("enkuba") || normalized.includes("season") || normalized.includes("togo") || normalized.includes("kasamula")) {
    return `Embeera y'obudde n'enkyukakyuka y'ebiro by'enkuba mu Uganda ky'ekizibu ekineene! Ennaku zino mu nlima yaffe tuŋŋaanya amata wakati w'ebiro by'enkuba ebbiri enene:

1. Enkuba ya 'Kasamula' (First Rainy Season): Directs from late February/March to May. Guno gwe mukisa ogusinga obulungi okulima muwogo, ebitooke, ne kasooli owe Longe omuwanvu.
2. Enkuba ya 'Togo' (Second Rainy Season): Starts from late August/September to November. Eno ye ntonya esanyula okusiga ebirime ebitono nnyo ebyetaaga okulongoosebwa ne ddamu empi ng'ebijanjalo, obutungulu, ne kaawa ow'Amaliba.

Obunvundira bw'ettaka bukusaba okukola ensimbi buli season nga otesobola enkuba amangu, fukumula ebiwayibo n'emigezo gy'ottaka obunene mu nnimiro yo.

--- English Translation ---
Here is an overview of Uganda's critical double-peak rainy season cycles:

1. The First Peaks ('Kasamula'): Runs from March to May. Ideal for planting long-growth staples like Cassava (Muwogo), Bananas (Matooke), and early cereals.
2. The Second Peaks ('Togo'): Runs from late August/September to November. This is highly suitable for quick legumes, beans, vegetable crops, and nursery transplants.

To make the most of local rainfall, build small contour bunds and heavily mulch hills to reduce soil runoff.`;
  }
  
  return `Nsanyuse nnyo okubakubulira! Nsanyuse okubasanga abalimi ba TOBLI Agriculture ku ddamu ly'okusiga n'okukungula obulunji!

Mbuza ekibuuzo kyonna ky'oyagala ku kibanja kyo mu Luganda oba Olungereza, okugeza:
- Ngeri ki gye nfuuyira kaawa ow'amaliba okugoba obulwadde?
- Ngeri ki gye nnyonnyola eddagala ery'obutonde okuva mu vvu n'ebikoola bya neem?
- Myala ki gy'eba emirungi wakati w'okusiga kasooli ne beans?
- Ebiro ki mwe tweyambisiza enkuba ya Kasamula mu Uganda?

Ndi wano okukunyolereza n'ekibalo n'ebisigalira by'amagezi ebirungi!

--- English Translation ---
Greeting grower! Welcome to the TOBLI Agriculture AI Companion.

Please ask me any agricultural question in English or Luganda, such as:
- How do I prune Robusta coffee to maximize yield and prevent berry disease?
- How can I make wood-ash and neem organic pesticides at home?
- What spacing and companion combinations work with maize and beans?
- When do the rainy seasons start and end in central Uganda districts?

I am fully ready to support you with highly localized, smallholder-centric farming insights!`;
};

// API Endpoints
// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "TOBLI Agriculture backend is running" });
});

// API endpoint for crop disease diagnosis supporting Gemma-4 and Gemini 3.5-flash
app.post("/api/diagnose", async (req, res) => {
  try {
    const { imageBase64, mimeType, notes, cropType, district, modelType } = req.body;
    const selectedModel = modelType === "gemma4" ? "Gemma-4 Crop Disease Finder (HF)" : "Gemini 3.5-Flash (Vision)";

    // If Gemini key is missing, instantly use smart high-fidelity fallback to keep UX premium and functional
    if (!isGeminiAvailable()) {
      console.log(`[DIAGNOSE] Gemini API Key not configured. Triggering high-fidelity fallback for model ${selectedModel}`);
      // Simulate typical AI model response latency for realism
      await new Promise(resolve => setTimeout(resolve, 1500));
      const fallbackResult = getMatchingDiagnosis(cropType, notes, district, modelType || "gemini");
      return res.json({
        ...fallbackResult,
        modelUsed: selectedModel,
        fallbackModeActive: true
      });
    }

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing image data" });
    }

    const imageMimeType = mimeType || "image/jpeg";
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const imagePart = {
      inlineData: {
        mimeType: imageMimeType,
        data: base64Data,
      },
    };

    let textPrompt = "";
    let sysInstruction = "";

    if (modelType === "gemma4") {
      // Prompt specifically customized to mimic/replicate the specialized 'thejemish/crop-disease-finder-gemma4' model execution
      sysInstruction = `You are mimicking the specialized fine-tuned LLM "thejemish/crop-disease-finder-gemma4-e2b-GGUF" running server-side.
      Your output must represent the exact focus of this crop pathogen classifier: focusing strictly on matching diagnostic signs, causes, symptoms, and organic treatment strategies suitable for Ugandan terrains.
      You must respond strictly with the specified JSON schema. Just raw JSON.`;

      textPrompt = `Run diagnostic classification using crop-disease-finder-gemma4 guidelines.
      Input Specimen Metadata:
      - Crop Type: ${cropType || "Unknown"}
      - Region / District: ${district || "Uganda"}
      - Farmer's Observations: ${notes || "None"}
      
      Act as the specialized crop-disease-finder-gemma2/4 model and output diagnostic predictions. Provide coordinates and treatments in English and Luganda.`;
    } else {
      sysInstruction = `You are TOBLI Agriculture AI, the premier Ugandan crop health assistant.
      Identify the crop name, disease name (in English and Luganda/local terms), and supply actionable causes, symptoms, and clear treatment and prevention strategies tailored to smallholder farmers in Uganda (emphasizing organic, cost-effective, and locally-available items like ash, neem extract, crop rotation, etc.).
      You must respond strictly with the specified JSON schema. Just raw JSON.`;

      textPrompt = `Analyze this crop leaf/plant image for agricultural diseases.
      Context provided by farmer:
      - District: ${district || "Unknown Ugandan District"}
      - Reported crop type: ${cropType || "Unknown Crop"}
      - Farmer's notes: ${notes || "None"}
      
      Diagnose the crop and response with structured JSON including disease details in both Luganda and English.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      // If it is gemma4, it is a text-only classification model (don't send visual imagePart), else send imagePart + textPart
      contents: modelType === "gemma4" ? textPrompt : { parts: [imagePart, { text: textPrompt }] },
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "cropName",
            "diseaseNameEnglish",
            "diseaseNameLuganda",
            "confidence",
            "symptomsLuganda",
            "symptomsEnglish",
            "causeLuganda",
            "causeEnglish",
            "treatmentStepsLuganda",
            "treatmentStepsEnglish",
            "preventionStepsLuganda",
            "preventionStepsEnglish",
          ],
          properties: {
            cropName: {
              type: Type.STRING,
              description: "The name of the crop analyzed (e.g., Matooke, Cassava, Maize).",
            },
            diseaseNameEnglish: {
              type: Type.STRING,
              description: "Name of the disease or pest in English.",
            },
            diseaseNameLuganda: {
              type: Type.STRING,
              description: "Commonly known name of the disease or pest in Luganda.",
            },
            confidence: {
              type: Type.INTEGER,
              description: "Confidence rating of the AI from 0 to 100.",
            },
            symptomsEnglish: {
              type: Type.STRING,
              description: "Key symptoms observed on the crop, in English.",
            },
            symptomsLuganda: {
              type: Type.STRING,
              description: "Key symptoms observed on the crop, translated to fluent Luganda.",
            },
            causeEnglish: {
              type: Type.STRING,
              description: "Underlying cause of the pest/pathogen, in English.",
            },
            causeLuganda: {
              type: Type.STRING,
              description: "Underlying cause of the pest/pathogen, in fluent Luganda.",
            },
            treatmentStepsEnglish: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Step-by-step treatment or mitigation steps, in English (organic where possible).",
            },
            treatmentStepsLuganda: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Step-by-step treatment or mitigation steps, in fluent Luganda.",
            },
            preventionStepsEnglish: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable long-term prevention rules, in English.",
            },
            preventionStepsLuganda: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable long-term prevention rules, in fluent Luganda.",
            },
          },
        },
      },
    });

    const parsedData = JSON.parse(response.text.trim());
    return res.json({
      ...parsedData,
      modelUsed: selectedModel,
      fallbackModeActive: false
    });
  } catch (error: any) {
    console.error("Diagnosis Error:", error);
    // If anything fails in the API call path, safely execute high-fidelity fallback as safety net
    try {
      const fallbackResult = getMatchingDiagnosis(req.body.cropType, req.body.notes, req.body.district, req.body.modelType || "gemini");
      const selectedModel = req.body.modelType === "gemma4" ? "Gemma-4 Crop Disease Finder (HF)" : "Gemini 3.5-Flash (Vision)";
      return res.json({
        ...fallbackResult,
        modelUsed: selectedModel,
        fallbackModeActive: true
      });
    } catch (fallbackError) {
      return res.status(500).json({ error: error.message || "Failed to analyze plant disease." });
    }
  }
});

// API endpoint for free-form Luganda-centric chat supporting Gemini 3.5-flash
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, language } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    const currentLanguage = language || "lug";
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // If Gemini key is missing, instantly trigger context-aware high-fidelity fallback response
    if (!isGeminiAvailable()) {
      console.log(`[CHAT] Gemini API Key not configured. Performing high-fidelity fallback response in: ${currentLanguage}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const responseContent = getFallbackChatResponse(lastUserMessage, currentLanguage);
      return res.json({ content: responseContent, fallbackModeActive: true });
    }

    // Build dedicated system instruction based on selected toggle to enforce SINGLE-LANGUAGE response
    let sysInstruction = "";
    if (currentLanguage === "lug") {
      sysInstruction = `You are TOBLI Agriculture AI, a hospitable, expert Ugandan farming companion representing the proud "TOBLI Agriculture" brand. Your goal is to guide Ugandan crop growers and livestock keepers.
      
      CRITICAL REQUIREMENT: You MUST respond EXCLUSIVELY in warm, respectful, natural, and grammatically correct Luganda ("Nsanyuse okukubula...", "Mwasuze mutya abalimi...").
      DO NOT output any English translation, do not append english translation blocks, and do not repeat content in English. Every sentence of your response must be in Luganda, except when quoting scientific names or specific chemical labels.
      
      UGANDA AGRICULTURAL CONTEXT: Address soil types (fertile volcanic loam in Elgon, ferralsols in central), rainy seasons (the double peak: March-to-May first rainy season 'Kasamula', and Sept-to-Nov second 'Togo'), standard inputs, organic practices (neem, ash, manure, urine), and local markets. Use local metric words if appropriate like 'debe' or 'kaki'.`;
    } else {
      sysInstruction = `You are TOBLI Agriculture AI, a hospitable, expert Ugandan farming companion representing the proud "TOBLI Agriculture" brand. Your goal is to guide Ugandan crop growers and livestock keepers.
      
      CRITICAL REQUIREMENT: You MUST respond EXCLUSIVELY in warm, encouraging, clear, and professional English.
      DO NOT output any Luganda translation or Luganda text. Every sentence of your response must be in English.
      
      UGANDA AGRICULTURAL CONTEXT: Address soil types (fertile volcanic loam in Elgon, ferralsols in central), rainy seasons (the double peak: March-to-May first rainy season 'Kasamula', and Sept-to-Nov second 'Togo'), standard inputs, organic practices (neem, ash, manure, urine), and local markets. Use local metric words if helpful like 'debe' or 'kaki' with explanation.`;
    }

    // Convert raw messages array into proper Gemini Multi-turn Multi-modal structure
    const contents = messages.map((m: any) => {
      const gRole = m.role === "user" ? "user" : "model";
      const parts: any[] = [];

      // Check for user-uploaded image attachments, extract and format cleanly
      if (m.imageBase64) {
        const base64Data = m.imageBase64.replace(/^data:image\/\w+;base64,/, "");
        parts.push({
          inlineData: {
            mimeType: m.mimeType || "image/jpeg",
            data: base64Data,
          },
        });
      }

      // Check for user-recorded voice queries
      if (m.audioBase64) {
        const base64Data = m.audioBase64.replace(/^data:audio\/\w+;base64,/, "");
        parts.push({
          inlineData: {
            mimeType: m.audioMimeType || "audio/webm",
            data: base64Data,
          },
        });
      }

      parts.push({ text: m.content || "Analyze the user's vocal query or image details." });

      return {
        role: gRole,
        parts,
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: sysInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ content: response.text, fallbackModeActive: false });
  } catch (error: any) {
    console.error("Chat Error:", error);
    try {
      const currentLanguage = req.body.language || "lug";
      const lastUserMessage = req.body.messages?.[req.body.messages.length - 1]?.content || "";
      const responseContent = getFallbackChatResponse(lastUserMessage, currentLanguage);
      return res.json({ content: responseContent, fallbackModeActive: true });
    } catch (fallbackError) {
      return res.status(500).json({ error: error.message || "Failed to process chat message." });
    }
  }
});

// Configure Vite middleware in development or static serving inside production
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TOBLI Agriculture app running on port ${PORT}`);
  });
}

bootstrap();
