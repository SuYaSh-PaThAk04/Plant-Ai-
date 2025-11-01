"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Mic, MicOff, Volume2 } from "lucide-react";

export default function AgriTechChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "नमस्ते! Hello! I am your AgriTech assistant. How can I help you today? | मैं आपका कृषि सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en-IN");

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [language]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

const speakText = (text) => {
  if (!synthRef.current) return;
  synthRef.current.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  utterance.rate = 0.9;
  utterance.pitch = 1;
  synthRef.current.speak(utterance);
};


const sendMessage = async () => {
  if (!input.trim() || isLoading) return;

  const userMessage = { role: "user", content: input };
  setMessages((prev) => [...prev, userMessage]);
  const currentInput = input;
  setInput("");
  setIsLoading(true);

  try {
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: currentInput,
        language: language,
        history: messages,
      }),
    });

    // Handle HTTP failure
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json().catch(() => ({}));

    // ✅ Always show Gemini reply if available (even if TTS failed)
    const replyText =
      data?.reply ||
      (language === "hi-IN"
        ? "क्षमा करें, मैं फिलहाल उत्तर देने में असमर्थ हूं।"
        : "Sorry, I couldn’t process your request right now.");

    const assistantMessage = { role: "assistant", content: replyText };
    setMessages((prev) => [...prev, assistantMessage]);


    if (data?.audio) {
      try {
        const audio = new Audio(data.audio);
        await audio
          .play()
          .catch((err) => console.error("Playback failed:", err));
      } catch (err) {
        console.warn("Audio playback failed:", err);
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(replyText);
        utter.lang = language === "hi-IN" ? "hi-IN" : "en-IN";
        synth.speak(utter);
        speakText(replyText); // fallback browser TTS
      }
    } else {
      // 🎙️ fallback: browser TTS if no audio
      speakText(replyText);
    }
  } catch (error) {
    console.error("Error:", error);

    const errorMessage =
      language === "hi-IN"
        ? "सर्वर से कनेक्ट नहीं हो सका। कृपया जांचें कि बैकएंड चल रहा है।"
        : "Cannot connect to the server. Please ensure the backend is running.";

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: errorMessage },
    ]);
  } finally {
    setIsLoading(false);
  }
};


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 hover:from-emerald-600 hover:via-green-700 hover:to-teal-800 text-white rounded-full p-5 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.5)] transition-all duration-500 hover:scale-110 hover:rotate-12 z-50 group"
          aria-label="Open chat"
        >
          <MessageCircle
            size={30}
            className="group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-ping border-2 border-white"></div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white"></div>
        </button>
      )}

      {/* Dark Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-black/60 via-gray-900/50 to-black/60 backdrop-blur-md z-40 transition-all duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-gradient-to-b from-gray-900 via-gray-900 to-black shadow-[0_0_80px_-15px_rgba(16,185,129,0.4)] z-50 flex flex-col border-l border-green-500/20 animate-[slideIn_0.4s_cubic-bezier(0.4,0,0.2,1)]">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 text-white p-6 flex items-center justify-between overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/20 rounded-full blur-3xl -translate-x-20 -translate-y-20"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl translate-x-16 translate-y-16"></div>
            </div>

            <div className="flex items-center space-x-4 relative z-10">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 shadow-lg border border-white/20">
                <MessageCircle size={28} className="drop-shadow-lg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight drop-shadow-lg">
                  AgriTech AI
                </h2>
                <p className="text-sm text-green-100 font-medium flex items-center gap-2 mt-1">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
                  {language === "hi-IN"
                    ? "कृषि सहायक • ऑनलाइन"
                    : "Agriculture Assistant • Online"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 backdrop-blur-sm rounded-xl p-2.5 transition-all duration-300 hover:rotate-90 hover:scale-110 relative z-10 border border-white/10"
              aria-label="Close chat"
            >
              <X size={24} />
            </button>
          </div>

          {/* Language Toggle */}
          <div className="bg-gray-800/95 backdrop-blur-md p-4 flex justify-center space-x-4 border-b border-green-500/20 shadow-lg">
            <button
              onClick={() => setLanguage("en-IN")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                language === "en-IN"
                  ? "bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white shadow-[0_10px_40px_-10px_rgba(16,185,129,0.6)] scale-105 border border-green-400/30"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600/30 hover:border-green-500/30"
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setLanguage("hi-IN")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                language === "hi-IN"
                  ? "bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white shadow-[0_10px_40px_-10px_rgba(16,185,129,0.6)] scale-105 border border-green-400/30"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600/30 hover:border-green-500/30"
              }`}
            >
              🇮🇳 हिंदी
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gradient-to-b from-gray-900 via-gray-900 to-black [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-900/50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-green-500 [&::-webkit-scrollbar-thumb]:to-emerald-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-gray-900/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } animate-[fadeInUp_0.4s_ease-out]`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)] border border-green-400/30"
                      : "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-green-500/20 hover:border-green-500/40 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.3)]"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {msg.content}
                  </p>
                  {msg.role === "assistant" && (
                    <button
                      onClick={() =>
                       {
                         if (msg.audio) {
                           const audio = new Audio(msg.audio);
                           audio.play();
                         } else {
                           speakText(msg.content);
                         }
                       }
                      }
                      className="mt-3 flex items-center space-x-2 text-green-400 hover:text-green-300 text-xs font-semibold transition-all group bg-gray-700/50 px-3 py-1.5 rounded-lg hover:bg-gray-700"
                      aria-label="Speak message"
                    >
                      <Volume2
                        size={16}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span>{language === "hi-IN" ? "सुनें" : "Listen"}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-[fadeInUp_0.4s_ease-out]">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-green-500/20">
                  <div className="flex space-x-2 items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-bounce shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
                    <div
                      className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-bounce shadow-[0_0_10px_rgba(74,222,128,0.8)]"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-bounce shadow-[0_0_10px_rgba(74,222,128,0.8)]"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <span className="text-sm text-gray-400 ml-2 font-medium">
                      {language === "hi-IN"
                        ? "AI सोच रहा है..."
                        : "AI is thinking..."}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-5 bg-gradient-to-t from-black to-gray-900 border-t border-green-500/20 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)]">
            <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-2 border-2 border-gray-700 focus-within:border-green-500 transition-all duration-300 shadow-lg">
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-3.5 rounded-xl transition-all duration-300 ${
                  isRecording
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse scale-110 border border-red-400"
                    : "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-green-600 hover:to-emerald-600 hover:text-white border border-gray-600 hover:border-green-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                }`}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? <MicOff size={22} /> : <Mic size={22} />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  language === "hi-IN"
                    ? "अपना संदेश टाइप करें..."
                    : "Type your message..."
                }
                className="flex-1 px-4 py-3.5 bg-transparent border-none focus:outline-none text-gray-100 placeholder-gray-500 text-sm font-medium"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white p-3.5 rounded-xl hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-110 disabled:shadow-none disabled:scale-100 border border-green-500/30 disabled:border-gray-700"
                aria-label="Send message"
              >
                <Send size={22} />
              </button>
            </div>

            {/* Powered by Badge */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 rounded-full border border-green-500/20 shadow-lg">
                <span className="text-xs text-gray-400 font-medium">
                  {language === "hi-IN" ? "द्वारा संचालित" : "Powered by"}
                </span>
                <span className="text-xs font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Gemini AI
                </span>
                <span className="inline-flex w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
