export interface SampleCropItem {
  id: string;
  titleEng: string;
  titleLug: string;
  crop: string;
  notesEng: string;
  notesLug: string;
  thumb: string;
  imageBase64: string;
}

const svgCMD = `data:image/svg+xml;utf8,` + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="100%" height="100%" fill="#EBE8E0"/>
  <!-- Stem -->
  <path d="M 200,280 Q 190,150 200,40" stroke="#1D3625" stroke-width="5" fill="none"/>
  <!-- Leaf lobes for Cassava -->
  <path d="M 200,60 Q 300,30 350,110 Q 280,140 200,90" fill="#294833" opacity="0.9"/>
  <path d="M 200,120 Q 310,130 330,220 Q 240,200 200,140" fill="#3C654A" opacity="0.85"/>
  <path d="M 200,140 Q 90,130 70,220 Q 160,200 200,160" fill="#4A7A5B" opacity="0.9"/>
  <path d="M 200,60 Q 100,30 50,110 Q 120,140 200,90" fill="#3C654A" opacity="0.9"/>
  
  <!-- Mosaic Spots / Pathogen Chlorosis -->
  <circle cx="250" cy="80" r="15" fill="#E6C844" opacity="0.75"/>
  <circle cx="290" cy="100" r="10" fill="#DFD085" opacity="0.85"/>
  <circle cx="150" cy="80" r="12" fill="#E6C844" opacity="0.8"/>
  <circle cx="110" cy="110" r="16" fill="#DFD085" opacity="0.75"/>
  <circle cx="270" cy="150" r="18" fill="#E6C844" opacity="0.7"/>
  <circle cx="140" cy="170" r="14" fill="#DFD085" opacity="0.75"/>
  
  <!-- Overlay grid details -->
  <text x="20" y="35" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="#15291B">Specimen #CMD-804</text>
  <text x="20" y="55" font-family="monospace" font-size="10" fill="#544F47">CROP: MANIHOT ESCULENTA</text>
  <rect x="20" y="240" width="160" height="40" fill="#15291B" opacity="0.8"/>
  <text x="30" y="265" font-family="sans-serif" font-weight="bold" font-size="12" fill="#FCFBFA">MOSAIC INFECTION</text>
</svg>
`);

const svgBXW = `data:image/svg+xml;utf8,` + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="100%" height="100%" fill="#EBE8E0"/>
  <!-- Broad Banana leaf wilted -->
  <path d="M 200,280 Q 180,160 210,30" stroke="#544F47" stroke-width="6" fill="none"/>
  <!-- Leaf left side -->
  <path d="M 200,40 Q 70,100 90,200 Q 150,220 200,250" fill="#7C7844" opacity="0.85"/>
  <!-- Leaf right side drooping -->
  <path d="M 200,40 Q 330,80 340,180 Q 280,240 200,250" fill="#8C7030" opacity="0.9"/>
  <!-- Necrotic wilt patterns -->
  <path d="M 120,120 Q 160,150 180,210" stroke="#3B3732" stroke-width="4" fill="none" opacity="0.4"/>
  <path d="M 280,100 Q 240,140 220,190" stroke="#3B3732" stroke-width="4" fill="none" opacity="0.4"/>
  
  <circle cx="110" cy="120" r="22" fill="#E68222" opacity="0.5"/>
  <circle cx="280" cy="140" r="30" fill="#C49B25" opacity="0.6"/>
  <circle cx="180" cy="180" r="18" fill="#5E502B" opacity="0.75"/>
  
  <text x="20" y="35" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="#15291B">Specimen #BXW-021</text>
  <text x="20" y="55" font-family="monospace" font-size="10" fill="#544F47">CROP: MUSA ACUMINATA</text>
  <rect x="20" y="240" width="160" height="40" fill="#15291B" opacity="0.8"/>
  <text x="30" y="265" font-family="sans-serif" font-weight="bold" font-size="12" fill="#FCFBFA">BACTERIAL WILT</text>
</svg>
`);

const svgMLN = `data:image/svg+xml;utf8,` + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="100%" height="100%" fill="#EBE8E0"/>
  <!-- Long slender maize leaves -->
  <path d="M 200,260 Q 220,140 180,30" stroke="#1D3625" stroke-width="4" fill="none"/>
  <!-- Leaf 1 -->
  <path d="M 200,200 Q 350,150 380,60 Q 280,180 200,200" fill="#4A7A5B" opacity="0.9"/>
  <!-- Leaf 2 necrotic dry end -->
  <path d="M 200,160 Q 50,120 20,40 Q 120,140 200,160" fill="#8C7D41" opacity="0.9"/>
  <!-- Dry margins (Necrosis) -->
  <path d="M 20,40 Q 60,80 120,120" stroke="#5E4E2B" stroke-width="8" fill="none" opacity="0.7"/>
  <path d="M 380,60 Q 330,110 280,140" stroke="#5E4E2B" stroke-width="5" fill="none" opacity="0.7"/>
  
  <text x="20" y="35" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="#15291B">Specimen #MLN-449</text>
  <text x="20" y="55" font-family="monospace" font-size="10" fill="#544F47">CROP: ZEA MAYS</text>
  <rect x="20" y="240" width="160" height="40" fill="#15291B" opacity="0.8"/>
  <text x="30" y="265" font-family="sans-serif" font-weight="bold" font-size="12" fill="#FCFBFA">LETHAL NECROSIS</text>
</svg>
`);

export const SAMPLE_CROPS: SampleCropItem[] = [
  {
    id: "cassava-mosaic",
    titleEng: "Cassava Mosaic",
    titleLug: "Obwebigga bwa Muwogo",
    crop: "Cassava (Muwogo)",
    notesEng: "Yellowish mosaic patterns and curly leaf margins observed in my garden in Mokono. Appears to be stunting stem growth.",
    notesLug: "Ebikoola bikuze n'ebibalabala ebya kyenvu n'obukoola bukunkumuka mu nnimiro yange e Mukono. Kiyimirizza n'ekula y'emiti.",
    thumb: svgCMD,
    imageBase64: svgCMD
  },
  {
    id: "banana-wilt",
    titleEng: "Banana Wilt (BXW)",
    titleLug: "Kiwotoka ky'Ebitooke",
    crop: "Matooke (Bananas)",
    notesEng: "Leaves turning dull yellow and drooping. The male bud appears blackish and dry in Masaka shamba.",
    notesLug: "Obukoola bweyongera okuba ebya kyenvu era buba bupaluuka. Akatooke kennyini kayunzimula bubi mu ddamu e Masaka.",
    thumb: svgBXW,
    imageBase64: svgBXW
  },
  {
    id: "maize-necrosis",
    titleEng: "Maize Necrosis",
    titleLug: "Kukaza Kasooli",
    crop: "Maize (Kasooli Longe)",
    notesEng: "Yellow stripes starting along leaf margins, followed by premature drying and rotting of the maize cobs in Luweero.",
    notesLug: "Ebisusunzo bijjamu ebibalabala bya kyenvu ne bikala mu nkingo z'ebikoola ekituuse okulwaza ebisaka bya kasooli e Luweero.",
    thumb: svgMLN,
    imageBase64: svgMLN
  }
];
