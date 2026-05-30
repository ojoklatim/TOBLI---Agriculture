import React, { useState, useRef, useEffect } from "react";
import { AppLanguage, ChatMessage } from "../types";
import { DICTIONARY } from "../data";
import {
  Send,
  Sparkles,
  User,
  Trash2,
  ArrowRight,
  Mic,
  Camera,
  Image as ImageIcon,
  Square,
  X,
  Play,
  Volume2,
  RefreshCw,
  Loader2,
  Paperclip,
  Check
} from "lucide-react";

interface FarmChatProps {
  language: AppLanguage;
}

const CHAT_SUGGESTIONS = [
  {
    lug: "Ngeri ki gye nnyonnyola ky'okufuuyira Kaawa weesase?",
    eng: "What is the optimal coffee pruning cycle in Masaka?",
  },
  {
    lug: "Pesticide ow'obutonde ava mu vvu ne neem kimenya kitya?",
    eng: "How do I make organic pesticide from wood ash and neem?",
  },
  {
    lug: "Myala ki gyetaaga wakati w'okusiga kasooli ne beans?",
    eng: "What spacing and companion crops work with maize and beans?",
  },
  {
    lug: "Enkuba weetandikira mu 'Kasamula' mu Kampala leero?",
    eng: "When does the Kasamula rainfall peak usually start?",
  },
];

export default function FarmChat({ language }: FarmChatProps) {
  const dict = DICTIONARY[language];
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioPlaybackRef = useRef<HTMLAudioElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Attachment states (Images)
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>("image/jpeg");

  // Attachment states (Audio)
  const [attachedAudio, setAttachedAudio] = useState<string | null>(null);
  const [audioMime, setAudioMime] = useState<string>("audio/webm");
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);

  // In-app Camera states
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Audio Recording states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordError, setRecordError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<any>(null);

  // Initialize chatbot welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: DICTIONARY[language].chatWelcome,
        },
      ]);
    }
  }, [language]);

  // Scroll to bottom function disabled on request to avoid page auto-shifting
  const scrollToBottom = () => {
    // Disabled to prevent automatic scrolling when messages update
  };

  // Scroll effect on load is removed per spec instructions

  // Handle Recording Timer Tick
  useEffect(() => {
    if (isRecording) {
      recordTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
      }
      setRecordingSeconds(0);
    }

    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, [isRecording]);

  // Cleanup camera streams on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // 1. SELECT IMAGE FILE ACTION
  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageMime(file.type);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAttachedImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input value so same file can be triggered again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 2. TRIGGER CAMERA MODULE
  const startCamera = async () => {
    setCameraError(null);
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setCameraError(
        language === "lug"
          ? "Tutusobole okufuna kyamela. Ba n'obukakafu nti oganyizza eby'okukebera."
          : "Camera access was denied or is unavailable on this device."
      );
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setAttachedImage(dataUrl);
        setImageMime("image/jpeg");
      }
      closeCamera();
    } catch (err) {
      console.error("Failed to capture snapshot:", err);
    }
  };

  // 3. VOICE RECORDING LOGIC
  const startRecording = async () => {
    setRecordError(null);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Collect recorded binary audio chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const previewUrl = URL.createObjectURL(audioBlob);
        setAudioPreviewUrl(previewUrl);
        setAudioMime("audio/webm");

        // Convert blob to base64 for API delivery
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setAttachedAudio(reader.result as string);
          }
        };
        reader.readAsDataURL(audioBlob);

        // Turn off microphone tracks safely
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250); // Slice data chunks
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access failed:", err);
      setRecordError(
        language === "lug"
          ? "Tutusobole okufuna amaloboozi. Kola obukakafu nti oganyizza enkola gino."
          : "Microphone access was denied or is unavailable."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const discardRecordedAudio = () => {
    setAttachedAudio(null);
    setAudioPreviewUrl(null);
  };

  // 4. MAIN ACTION: SEND MESSAGE TO BACKEND
  const handleSend = async (forcedText?: string) => {
    const text = (forcedText || input).trim();
    
    // Allow sending if there is text, OR if there is an image, OR if there is a voice query
    if ((!text && !attachedImage && !attachedAudio) || loading) return;

    if (!forcedText) setInput("");

    // Package current message details cleanly
    const userMsg: ChatMessage = {
      role: "user",
      content: text || (attachedImage ? "[Attached Image]" : "[Voice message attachment]"),
      imageBase64: attachedImage || undefined,
      mimeType: attachedImage ? imageMime : undefined,
      audioBase64: attachedAudio || undefined,
      audioMimeType: attachedAudio ? audioMime : undefined,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    // Reset attachments
    setAttachedImage(null);
    setAttachedAudio(null);
    setAudioPreviewUrl(null);

    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // IMPORTANT: We send the current language toggle setting ("lug" or "eng") to enforce strict mono-lingual output
        body: JSON.stringify({
          messages: updatedMessages,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat service returned an error status");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.content,
          fallbackModeActive: data.fallbackModeActive,
        },
      ]);
    } catch (err) {
      console.error("Chat failure:", err);
      // Fallback response with explicit fallback designation
      const simulatedText =
        language === "lug"
          ? "Nsobeddwa katono mukusoma kw'amadaala gaffe ery'emirimu, naye ekirime kino okisiga wakati mu kisanja kya Kasamula oba togo? Manyisa bikalubo ne ddamu."
          : "The TOBLI AI link experienced temporary API spikes. Here is your localized guide: Best spacing is 75cm between rows for Cassava and Maize crops. Please check your network context or retry.";
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: simulatedText,
          fallbackModeActive: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-1 pb-6 px-2 sm:px-4 flex flex-col h-[650px] md:h-[750px] w-full">
      {/* Dynamic Header */}
      <div className="text-center mb-3 shrink-0 max-w-2xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-black text-forest-900 font-editorial mb-1">
          {dict.chatTitle}
        </h1>
        <p className="text-xs text-sand-800 leading-normal font-medium">
          {dict.chatDesc}
        </p>
      </div>

      {/* Main Container Frame - Transparent, Seamless layout to avoid an isolated box section */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Connection status and actions bar */}
        <div className="px-1 py-2 border-b border-sand-200 bg-transparent flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#414E45] font-extrabold">
              {language === "lug" ? "AI eya TOBLI: Ekozirwa ku Luganda" : "TOBLI AI: Active Gateway"}
            </span>
          </div>
          <button
            onClick={() => {
              setMessages([
                {
                  role: "assistant",
                  content: DICTIONARY[language].chatWelcome,
                },
              ]);
            }}
            className="flex items-center space-x-1 hover:text-red-700 text-sand-800 font-mono text-[10px] font-bold uppercase transition-all duration-150 border-b border-transparent hover:border-red-200 pb-0.5"
          >
            <Trash2 className="h-3 w-3" />
            <span>{language === "lug" ? "Sangula" : "Clear"}</span>
          </button>
        </div>

        {/* Scrollable messages viewport */}
        <div className="flex-1 overflow-y-auto py-4 px-1 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={index}
                className={`flex ${isUser ? "justify-end" : "justify-start"} animate-slide-up`}
              >
                <div className={`max-w-[85%] sm:max-w-[72%] flex flex-col space-y-2`}>
                  {/* Sender Label */}
                  <div
                    className={`flex items-center space-x-1.5 text-[9px] font-mono tracking-wider font-extrabold uppercase ${
                      isUser ? "justify-end text-sand-800" : "text-forest-800"
                    }`}
                  >
                    {isUser ? (
                      <>
                        <span>{language === "lug" ? "Omulimi (You)" : "Farmer (You)"}</span>
                        <div className="h-4 w-4 rounded-full bg-sand-200 flex items-center justify-center text-[8px] shrink-0 font-sans">
                          U
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-4 w-4 rounded-full bg-forest-900 text-sand-50 flex items-center justify-center shrink-0">
                          <Sparkles className="h-2.5 w-2.5" />
                        </div>
                        <span>TOBLI Agriculture AI</span>
                        {msg.fallbackModeActive && (
                          <span className="ml-2 text-[8px] bg-amber-50 text-amber-900 border border-amber-200/50 px-1 py-0.5 rounded-none tracking-normal normal-case">
                            {language === "lug" ? "Simulated guide" : "Demo Cache"}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Bubble content */}
                  <div
                    className={`p-4 text-xs sm:text-sm font-sans leading-relaxed border transition-all duration-150 ${
                      isUser
                        ? "bg-forest-900 text-sand-50 border-forest-950 selection:bg-forest-600 rounded-none shadow-sm"
                        : "bg-sand-40 text-[#1B271F] border-sand-200 rounded-none"
                    }`}
                  >
                    {/* Render attachment image if present in message history */}
                    {msg.imageBase64 && (
                      <div className="mb-3 max-w-sm border border-black/10 overflow-hidden bg-black/5">
                        <img
                          src={msg.imageBase64}
                          alt="Farmer specimen upload"
                          className="max-h-56 object-contain w-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Render attachment audio player if present in message history */}
                    {msg.audioBase64 && (
                      <div className="mb-3 p-2 bg-black/5 border border-black/10 flex items-center space-x-2 text-xs">
                        <Volume2 className="h-4 w-4 shrink-0 text-amber-700" />
                        <audio
                          src={msg.audioBase64}
                          controls
                          className="w-full h-8 outline-none mini-audio"
                          style={{ minWidth: "180px" }}
                        />
                      </div>
                    )}

                    {/* Text block */}
                    <div className="whitespace-pre-line break-words">{msg.content}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loader bubble */}
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex flex-col space-y-1.5 max-w-[70%]">
                <div className="flex items-center space-x-1.5 text-[9px] font-mono font-bold text-forest-800 uppercase">
                  <div className="h-4 w-4 rounded-full bg-forest-900 text-sand-50 flex items-center justify-center shrink-0">
                    <Sparkles className="h-2.5 w-2.5 animate-spin" />
                  </div>
                  <span>{language === "lug" ? "TOBLI AI eky'andika..." : "TOBLI AI thinking..."}</span>
                </div>
                <div className="bg-sand-40 text-sand-900 border border-sand-200 p-4 rounded-none">
                  <div className="flex space-x-1 items-center py-1">
                    <span className="h-2 w-2 rounded-full bg-forest-800 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-forest-800 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-forest-800 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* In-app Camera Stream overlay panel */}
        {showCamera && (
          <div className="absolute inset-x-0 bottom-0 top-12 bg-black/95 flex flex-col justify-between p-6 z-30 animate-fade-in">
            <div className="flex justify-between items-center text-white pb-3 border-b border-white/10 shrink-0">
              <span className="text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <Camera className="h-4 w-4 text-emerald-400" />
                <span>{language === "lug" ? "KOLA EKIFANANYI KYA AI" : "SPECIMEN INTERACTION CAMERA"}</span>
              </span>
              <button
                onClick={closeCamera}
                className="p-1 border border-white/20 hover:border-white/50 text-white rounded-none transition duration-150"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center overflow-hidden my-4 relative">
              {cameraError ? (
                <div className="text-center p-4 max-w-sm text-[#CD5B45]">
                  <p className="text-sm font-sans font-bold">{cameraError}</p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="max-h-full max-w-full object-contain border border-white/10"
                />
              )}
            </div>

            <div className="flex justify-center items-center space-x-4 shrink-0 pb-2">
              <button
                onClick={closeCamera}
                className="px-4 py-2 text-xs font-mono uppercase font-bold tracking-wider text-white border border-white/20 hover:bg-white/10"
              >
                {language === "lug" ? "Sazaamu" : "Cancel"}
              </button>
              {!cameraError && (
                <button
                  onClick={capturePhoto}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold uppercase text-xs tracking-wider border border-emerald-700 flex items-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>{language === "lug" ? "Kola Kifannanyi" : "Take Snapshot"}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Input area & attachments drawer */}
        <div className="py-2.5 px-1.5 sm:p-4 bg-transparent border-t border-sand-200 shrink-0 space-y-3">
          
          {/* Preset Prompts section (Only visible when user has no/few entries) */}
          {messages.length <= 2 && (
            <div className="transition-all duration-250 pb-1">
              <span className="text-[9px] font-mono uppercase font-extrabold text-[#526055] tracking-widest block mb-1.5 font-sans">
                {language === "lug" ? "EBIKOLERA OKUBALIMISA (Suggested guidance):" : "GUIDED CONVERSATIONS:"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {CHAT_SUGGESTIONS.map((s, idx) => {
                  const label = language === "lug" ? s.lug : s.eng;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(label)}
                      className="text-[10px] sm:text-[11px] text-forest-950 border border-sand-250 bg-white hover:bg-sand-50 py-1.5 px-2.5 rounded-none hover:border-forest-800 transition-all duration-150 flex items-start space-x-1.5 text-left leading-normal w-full animate-fade-in"
                    >
                      <ArrowRight className="h-3 w-3 text-forest-700 shrink-0 mt-0.5" />
                      <span className="break-words font-medium">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Attachments Preview Drawer (Sits nicely above input bar if something is staged) */}
          {(attachedImage || attachedAudio || isRecording || recordError) && (
            <div className="p-3 bg-white border border-sand-200 animate-slide-up flex flex-col space-y-2 rounded-none">
              <div className="flex justify-between items-center pb-2 border-b border-sand-100 flex-wrap gap-2">
                <span className="text-[10px] font-mono uppercase font-extrabold tracking-widest text-[#526055]">
                  {language === "lug" ? "EBIRONGOSA EBYOKUSINZIIRA (Staged payload)" : "Pre-flight attachments"}
                </span>
                {(attachedImage || attachedAudio) && (
                  <button
                    onClick={() => {
                      setAttachedImage(null);
                      setAttachedAudio(null);
                      setAudioPreviewUrl(null);
                    }}
                    className="text-[9px] text-red-700 hover:text-red-900 underline font-mono font-bold uppercase"
                  >
                    {language === "lug" ? "Ggyako Byonna" : "Clear Staged"}
                  </button>
                )}
              </div>

              {/* Staged Image Frame */}
              {attachedImage && (
                <div className="flex items-center space-x-3.5 bg-sand-50 p-2 border border-sand-200 max-w-md">
                  <div className="h-14 w-14 bg-black/10 border border-sand-200 overflow-hidden shrink-0">
                    <img
                      src={attachedImage}
                      alt="Thumbnail staged"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-mono leading-tight font-bold truncate">specimen.jpg</p>
                    <p className="text-[10px] text-sand-500 font-mono uppercase">Image ready</p>
                  </div>
                  <button
                    onClick={() => setAttachedImage(null)}
                    className="p-1 border border-sand-250 hover:bg-sand-100 text-sand-800 hover:text-red-700 rounded-none shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Active Audio Recording Bar */}
              {isRecording && (
                <div className="flex items-center justify-between bg-[#FCF8F5] p-3 border border-amber-200 animate-pulse">
                  <div className="flex items-center space-x-3">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                    </span>
                    <span className="text-xs font-mono font-extrabold text-red-900">
                      {language === "lug"
                        ? `Abalimi bejula ddi: okukwata amaloboozi (Recording: ${recordingSeconds}s)`
                        : `Recording voice query: ${recordingSeconds}s`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Tiny animated voice spectrum visualizer using tailwind scales */}
                    <div className="flex items-end space-x-0.5 h-4 px-1 shrink-0">
                      <div className="w-0.5 bg-red-600 animate-[bounce_1s_infinite] h-2"></div>
                      <div className="w-0.5 bg-red-600 animate-[bounce_1.4s_infinite] h-4"></div>
                      <div className="w-0.5 bg-red-600 animate-[bounce_1.1s_infinite] h-3"></div>
                      <div className="w-0.5 bg-red-600 animate-[bounce_1.6s_infinite] h-1"></div>
                    </div>

                    <button
                      onClick={stopRecording}
                      className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white font-mono text-[10px] uppercase tracking-wider flex items-center space-x-1.5"
                    >
                      <Square className="h-2.5 w-2.5" />
                      <span>Stop</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Staged Audio File Player */}
              {audioPreviewUrl && !isRecording && (
                <div className="flex items-center space-x-3 bg-sand-50 p-2.5 border border-sand-200 max-w-md">
                  <div className="h-9 w-9 bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-900">
                    <Volume2 className="h-4 w-4 shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-[11px] font-mono leading-tight font-bold truncate">voice_query.webm</p>
                    <div className="mt-1">
                      <audio src={audioPreviewUrl} controls className="h-6 w-full max-w-xs sub-audio" />
                    </div>
                  </div>
                  <button
                    onClick={discardRecordedAudio}
                    className="p-1 border border-sand-250 hover:bg-sand-100 text-sand-800 hover:text-red-700 rounded-none shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Recording / User Error */}
              {recordError && (
                <p className="text-[11px] text-[#CD5B45] font-mono font-medium leading-relaxed">
                  {recordError}
                </p>
              )}
            </div>
          )}

          {/* Form input controls (Gemini-style large rounded envelope) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-end bg-white border border-sand-250 focus-within:border-forest-800 p-1 sm:p-2 shadow-sm transition-all duration-150"
          >
            {/* Action buttons drawer: Image upload, inline camera snapshot, voice record */}
            <div className="flex items-center space-x-0.5 sm:space-x-1 px-1 pb-1 shrink-0">
              
              {/* Image Input file hidden mechanism */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageFileSelect}
                className="hidden"
              />
              
              {/* Open file selector */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Select Image Specimen"
                disabled={loading || isRecording}
                className="p-1 sm:p-2 text-sand-700 hover:text-forest-900 hover:bg-sand-100 disabled:opacity-40 transition-all duration-150 rounded-none shrink-0"
              >
                <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 stroke-[1.5]" />
              </button>

              {/* Open camera view */}
              <button
                type="button"
                onClick={startCamera}
                title="Use device Camera"
                disabled={loading || isRecording}
                className="p-1 sm:p-2 text-sand-700 hover:text-forest-900 hover:bg-sand-100 disabled:opacity-40 transition-all duration-150 rounded-none shrink-0"
              >
                <Camera className="h-4 w-4 sm:h-5 sm:w-5 stroke-[1.5]" />
              </button>

              {/* Start voice recording */}
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  title="Record Voice Note"
                  disabled={loading || attachedAudio !== null}
                  className="p-1 sm:p-2 text-sand-700 hover:text-red-800 hover:bg-red-50 disabled:opacity-40 transition-all duration-150 rounded-none shrink-0"
                >
                  <Mic className="h-4 w-4 sm:h-5 sm:w-5 stroke-[1.5]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  title="Stop recording"
                  className="p-1 sm:p-2 text-red-700 bg-red-100 hover:bg-red-200 transition-all duration-150 rounded-none animate-pulse shrink-0"
                >
                  <Square className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2]" />
                </button>
              )}
            </div>

            {/* Input field text box */}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={dict.chatPlaceholder}
              disabled={loading || isRecording}
              rows={1}
              className="flex-1 py-1.5 sm:py-2 px-2 sm:px-3 bg-transparent text-sm text-[#1B271F] font-sans placeholder-sand-500 focus:outline-none resize-none max-h-24 min-h-[38px] leading-relaxed"
            />

            {/* Send Message action */}
            <div className="shrink-0 pb-1 px-1 sm:px-1.5">
              <button
                type="submit"
                disabled={loading || isRecording || (!input.trim() && !attachedImage && !attachedAudio)}
                className={`flex items-center justify-center p-2 rounded-none transition duration-150 ${
                  (!input.trim() && !attachedImage && !attachedAudio) || loading || isRecording
                    ? "bg-sand-100 text-sand-300 border border-sand-200 cursor-not-allowed"
                    : "bg-forest-900 text-sand-50 border border-forest-950 hover:bg-forest-800 cursor-pointer shadow-sm"
                }`}
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin text-forest-500" />
                ) : (
                  <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </button>
            </div>
          </form>
          
          <div className="flex justify-between items-center text-[10px] font-mono text-sand-500 px-1">
            <span>
              {language === "lug"
                ? "Ekibanja ki ku lwa Gemini 3.5-Flash"
                : "Powered by Gemini 3.5-Flash Vision model"}
            </span>
            <span>
              {language === "lug"
                ? "Embeera yona okusika munda"
                : "Transfers safe server proxies"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
