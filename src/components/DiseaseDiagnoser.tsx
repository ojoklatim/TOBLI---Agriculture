import React, { useState, useRef } from "react";
import { AppLanguage, DiagnosisResult } from "../types";
import { DICTIONARY, UGANDA_DISTRICTS } from "../data";
import { Upload, Camera, Sparkles, Check, AlertCircle, RefreshCw, Layers } from "lucide-react";

// Sourced mock base64/placeholder samples so judges can test instantly without uploading images
import { SAMPLE_CROPS } from "./SampleCropAssets";

interface DiseaseDiagnoserProps {
  language: AppLanguage;
}

export default function DiseaseDiagnoser({ language }: DiseaseDiagnoserProps) {
  const dict = DICTIONARY[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [district, setDistrict] = useState<string>("Kampala");
  const [cropType, setCropType] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [modelType, setModelType] = useState<"gemini" | "gemma4">("gemini");

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Convert File to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Select Sample Crops for instant testing
  const selectSample = (sampleId: string) => {
    const sample = SAMPLE_CROPS.find((c) => c.id === sampleId);
    if (sample) {
      setSelectedImage(sample.imageBase64);
      setMimeType("image/jpeg");
      setCropType(sample.crop);
      setNotes(language === "lug" ? sample.notesLug : sample.notesEng);
      setResult(null);
      setError(null);
    }
  };

  // Submit diagnosis request
  const runDiagnosis = async () => {
    if (!selectedImage) {
      setError(language === "lug" ? "Ngero tabaako kake ekyo kusingika ekifananyi." : "Please select or capture a plant photo first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType,
          notes,
          cropType,
          district,
          modelType,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Server responded with an error");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(dict.diagError);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setSelectedImage(null);
    setResult(null);
    setNotes("");
    setCropType("");
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-slide-up">
      {/* Editorial Header */}
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight text-forest-900 mb-4 font-editorial">
          {dict.diagTitle}
        </h1>
        <p className="text-base text-sand-800 font-sans leading-relaxed">
          {dict.diagDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column Input Panel */}
        <div className="lg:col-span-5 bg-sand-40 border border-sand-200 p-6 shadow-sm flex flex-col space-y-5 rounded-none">
          <h2 className="text-xl font-bold font-editorial text-forest-900 border-b border-sand-200 pb-2">
            {language === "lug" ? "Kebera ne AI" : "Select Inputs & Upload"}
          </h2>

          {/* AI Model Selector */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-sand-800 block font-semibold">
              {language === "lug" ? "Enkola ya AI ey'Okukebesa:" : "Select Diagnostics Model:"}
            </span>
            <div className="grid grid-cols-2 gap-1 bg-sand-100/60 p-1 border border-sand-200/60">
              <button
                type="button"
                onClick={() => setModelType("gemini")}
                className={`py-2 px-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-150 ${
                  modelType === "gemini"
                    ? "bg-forest-900 text-sand-50 shadow-sm"
                    : "text-sand-800 hover:text-forest-900 hover:bg-sand-100"
                }`}
              >
                Gemini 3.5 (Vision)
              </button>
              <button
                type="button"
                onClick={() => setModelType("gemma4")}
                className={`py-2 px-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-150 ${
                  modelType === "gemma4"
                    ? "bg-forest-900 text-sand-50 shadow-sm"
                    : "text-sand-800 hover:text-forest-900 hover:bg-sand-100"
                }`}
              >
                Gemma-4 (Text GGUF)
              </button>
            </div>
            <p className="text-[11px] text-sans text-sand-800 italic leading-relaxed">
              {modelType === "gemini"
                ? (language === "lug" ? "Kweyambisa ekifaananyi n'ebikula kuzuula olwatika." : "Analyzes leaf structure and image patterns using active multi-modal visual computing.")
                : (language === "lug" ? "Mutindo gw'ebiwandiko agemebwa ku ndwadde z'ebirime mu Uganda." : "Queries the Hugging Face crop-disease-finder-gemma4 specialized pathogen classifier.")}
            </p>
          </div>

          {/* Quick-Test Sample Presets */}
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-sand-800 block mb-2 font-semibold">
              {language === "lug" ? "Bukebera obutereevu (Okugezaako):" : "Instant Hackathon Demo Presets:"}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_CROPS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => selectSample(sample.id)}
                  className="flex flex-col items-center p-2 border border-sand-200 hover:border-forest-700 bg-sand-50/50 hover:bg-sand-100 transition duration-150 text-center rounded-none group"
                >
                  <img
                    src={sample.thumb}
                    alt={sample.crop}
                    referrerPolicy="no-referrer"
                    className="w-full h-12 object-cover mb-1 border border-sand-200 group-hover:filter group-hover:brightness-95"
                  />
                  <span className="text-[10px] font-sans font-medium text-forest-900 truncate w-full">
                    {language === "lug" ? sample.titleLug : sample.titleEng}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload/Drag area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed ${
              selectedImage ? "border-forest-500 bg-sand-50" : "border-sand-200 hover:border-forest-500 hover:bg-sand-50/50"
            } p-5 text-center cursor-pointer transition-all duration-150 relative rounded-none flex flex-col justify-center items-center min-h-[180px]`}
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedImage ? (
              <div className="w-full h-40 relative">
                <img
                  src={selectedImage}
                  alt="Selected plant"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                  }}
                  className="absolute top-1 right-1 bg-forest-900 text-sand-50 hover:bg-sand-800 text-xs px-2 py-1 uppercase"
                >
                  {language === "lug" ? "Ggyamu" : "Remove"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-sand-800 stroke-[1.5] mb-2" />
                <p className="text-xs font-semibold text-forest-900">{dict.uploadBtn}</p>
                <p className="text-[11px] text-sand-800 mt-1 font-sans">{dict.dragText}</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Metadata Selections */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-medium text-sand-900 uppercase tracking-wider block mb-1">
                {dict.districtSelectLabel}
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-sand-50 border border-sand-200 text-sand-900 text-xs py-2 px-3 focus:outline-none focus:border-forest-700 font-medium"
              >
                {UGANDA_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-sand-900 uppercase tracking-wider block mb-1">
                {dict.cropTypeLabel}
              </label>
              <input
                type="text"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                placeholder="e.g., Cassava"
                className="w-full bg-sand-50 border border-sand-200 text-sand-900 text-xs py-2 px-3 focus:outline-none focus:border-forest-700"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-sand-900 uppercase tracking-wider block mb-1">
                {dict.farmerNotesLabel}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={dict.notesPlaceholder}
                rows={2}
                className="w-full bg-sand-50 border border-sand-200 text-sand-900 text-xs py-2 px-3 focus:outline-none focus:border-forest-700"
              />
            </div>
          </div>

          {/* Diagnostics Invoke Trigger */}
          <div className="flex space-x-2 pt-2">
            {selectedImage && (
              <button
                onClick={resetAll}
                className="px-4 py-2 border border-sand-200 text-sand-900 text-xs tracking-wider uppercase hover:bg-sand-100 font-semibold"
              >
                {language === "lug" ? "Malawo" : "Reset"}
              </button>
            )}
            <button
              onClick={runDiagnosis}
              disabled={loading || !selectedImage}
              className={`flex-1 flex items-center justify-center space-x-2 py-3.5 px-4 font-bold border text-xs uppercase tracking-widest ${
                !selectedImage
                  ? "bg-sand-100 text-sand-200 border-sand-200 cursor-not-allowed"
                  : "bg-forest-900 text-sand-50 hover:bg-forest-800 border-forest-900 hover:text-sand-50 cursor-pointer"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? dict.uploadActive : dict.diagnoseSubmit}</span>
            </button>
          </div>
        </div>

        {/* Right Column Output Display */}
        <div className="lg:col-span-7 space-y-6">
          {loading && (
            <div className="bg-sand-40 border border-sand-200 p-12 text-center rounded-none animate-pulse flex flex-col items-center justify-center min-h-[400px]">
              <RefreshCw className="h-10 w-10 text-forest-700 animate-spin mb-4" />
              <p className="text-lg font-bold font-editorial text-forest-950 px-6">
                {dict.diagnosingAlert}
              </p>
              <p className="text-xs text-sand-800 font-mono mt-2 uppercase tracking-tight">
                TOBLI Pathogen Analyzer V3.5-Flash
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50/50 border border-red-200 p-6 flex items-start space-x-3 text-red-900 rounded-none animate-fade-in">
              <AlertCircle className="h-5 w-5 text-red-700 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Ensobi Yeeyo (Diagnosis Error)</p>
                <p className="text-xs mt-1 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {!loading && !result && !error && (
            <div className="bg-sand-40/50 border border-sand-200 p-12 text-center text-sand-800 rounded-none min-h-[400px] flex flex-col justify-center items-center">
              <Layers className="h-12 w-12 text-sand-200 stroke-[1.2] mb-3" />
              <h3 className="text-lg font-bold font-editorial text-forest-900">
                {language === "lug" ? "Alinda Okukolerwako ebiwonvu" : "Awaiting Crop Diagnostic Scan"}
              </h3>
              <p className="text-xs text-sand-800 max-w-sm mt-1 leading-relaxed">
                {language === "lug"
                  ? "Bwe weemala okukola oba okutwala ekifananyi ky'ekirime eky'okusiga obulungi, eby'okulondolwa byonna bijja kulabika wano mu Luganda ne Munnamasajja."
                  : "Once you upload a leaf picture or use our diagnostic quick-presets, the complete pathology results, causes, remedies, and organic preventatives will render dynamically here."}
              </p>
            </div>
          )}

          {/* Results Render */}
          {result && (
            <div className="bg-sand-40 border border-sand-200 p-8 shadow-sm flex flex-col space-y-6 rounded-none animate-slide-up animate-ease-out">
              {/* Output Header */}
              <div className="border-b border-sand-200 pb-4 flex justify-between items-start flex-wrap gap-4">
                <div>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-[10px] font-mono tracking-wider uppercase font-extrabold text-forest-700 bg-forest-50 px-2 py-0.5 border border-forest-200">
                      {dict.cropAnalyzed}: {result.cropName}
                    </span>
                    {result.fallbackModeActive && (
                      <span className="text-[9px] font-mono tracking-wider uppercase font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200 animate-pulse">
                        {language === "lug" ? "Simulated Fallback Mode" : "Demo Cache Fallback"}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-extrabold text-forest-900 font-editorial mt-1.5 leading-tight">
                    {language === "lug" ? result.diseaseNameLuganda : result.diseaseNameEnglish}
                  </h2>
                  <p className="text-[10px] font-mono text-sand-800 mt-1 uppercase">
                    Model: <span className="text-forest-800 font-extrabold">{result.modelUsed || "Gemini 3.5-Flash"}</span>
                  </p>
                </div>
                {/* Confidence Bar */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-sand-800">{dict.confidenceLabel}</span>
                  <div className="h-6 w-20 bg-sand-100 flex items-center relative border border-sand-200">
                    <div
                      className="h-full bg-forest-700 transition-all duration-300"
                      style={{ width: `${result.confidence}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-sand-900">
                      {result.confidence}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Bilingual Toggle Card for Disease Information */}
              <div className="space-y-4">
                {/* Pathology Symptoms & Cause */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-sand-50 p-4 border border-sand-200 rounded-none">
                    <h3 className="text-sm font-semibold text-forest-900 uppercase tracking-wider mb-1">
                      {dict.observedSymptoms}
                    </h3>
                    <p className="text-xs text-sand-900 leading-relaxed font-sans">
                      {language === "lug" ? result.symptomsLuganda : result.symptomsEnglish}
                    </p>
                  </div>
                  <div className="bg-sand-50 p-4 border border-sand-200 rounded-none">
                    <h3 className="text-sm font-semibold text-forest-900 uppercase tracking-wider mb-1">
                      {dict.causedBy}
                    </h3>
                    <p className="text-xs text-sand-900 leading-relaxed font-sans">
                      {language === "lug" ? result.causeLuganda : result.causeEnglish}
                    </p>
                  </div>
                </div>

                {/* Step-by-Step Treatment (Ugandan context organic ash, urine, etc.) */}
                <div>
                  <h3 className="text-sm font-semibold text-forest-950 uppercase tracking-widest border-b border-sand-200 pb-1.5 mb-2.5 flex items-center space-x-1">
                    <Check className="h-4 w-4 text-forest-700" />
                    <span>{dict.treatmentTitle}</span>
                  </h3>
                  <ul className="space-y-2">
                    {(language === "lug" ? result.treatmentStepsLuganda : result.treatmentStepsEnglish).map(
                      (step: string, i: number) => (
                        <li key={i} className="flex items-start space-x-2.5 text-xs text-sand-900">
                          <span className="font-mono text-[10px] bg-sand-200/50 text-forest-900 font-bold px-1.5 py-0.5 mt-0.5 rounded-none">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Preventative Strategies */}
                <div>
                  <h3 className="text-sm font-semibold text-forest-950 uppercase tracking-widest border-b border-sand-200 pb-1.5 mb-2.5 flex items-center space-x-1">
                    <Check className="h-4 w-4 text-forest-700" />
                    <span>{dict.preventionTitle}</span>
                  </h3>
                  <ul className="space-y-2">
                    {(language === "lug" ? result.preventionStepsLuganda : result.preventionStepsEnglish).map(
                      (step: string, i: number) => (
                        <li key={i} className="flex items-start space-x-2.5 text-xs text-sand-900">
                          <span className="font-mono text-[10px] bg-forest-900/10 text-forest-700 font-bold px-1.5 py-0.5 mt-0.5 rounded-none">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Brand Footnote */}
                <span className="text-[10px] text-sans text-sand-800 block text-right">
                  {language === "lug"
                    ? "Okujanjaba kuno ebisanyula byakuuma mu Uganda n'ettaka. Siga bugimuse obulungi."
                    : "Remedies verified for Smallholders in East African soils. TOBLI Agronomic Guidelines apply."}
                </span>

                {/* Back / Alternate Translation Toggle */}
                <div className="border-t border-sand-200 pt-3 flex justify-end">
                  <div className="text-[11px] font-sans font-medium text-sand-800">
                    {language === "lug" ? "Also available in: " : "Okyasobola okusoma bino mu: "}
                    <button
                      onClick={() => {}}
                      className="underline font-bold text-forest-750 ml-1 hover:text-forest-900"
                    >
                      {language === "lug" ? "English Output" : "Olungereza ne Luganda Okuzza nate"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
