
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface VoiceNarratorProps {
  text: string;
  autoPlay?: boolean;
}

export const VoiceNarrator = forwardRef<{ speak: () => void }, VoiceNarratorProps>(
  ({ text, autoPlay }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const speakText = () => {
    if (!('speechSynthesis' in window)) {
      toast.error("Narração por voz não suportada neste navegador", {
        description: "Use Chrome, Firefox ou Safari para melhor compatibilidade"
      });
      return;
    }

    if (isPlaying && currentUtterance) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Enhanced voice configuration for forensic narration
    utterance.rate = 0.85;
    utterance.pitch = 0.9;
    utterance.volume = isMuted ? 0 : 0.85;
    
    // Wait for voices to load and select Portuguese voice
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const portugueseVoice = voices.find(voice => 
        voice.lang.includes('pt') || 
        voice.lang.includes('br') ||
        voice.name.toLowerCase().includes('portuguese')
      ) || voices.find(voice => voice.default);
      
      if (portugueseVoice) {
        utterance.voice = portugueseVoice;
      }
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true });
    } else {
      setVoice();
    }

    // Enhanced event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setCurrentUtterance(utterance);
      console.log("Iniciando narração forense");
      toast.success("Reconstituição por voz iniciada", {
        description: "Ouvindo análise forense detalhada",
        duration: 2000,
      });
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentUtterance(null);
      console.log("Narração concluída");
      toast.info("Narração forense concluída", {
        duration: 2000,
      });
    };

    utterance.onerror = (event) => {
      console.error("Erro na narração:", event);
      setIsPlaying(false);
      setCurrentUtterance(null);
      toast.error("Erro na narração por voz", {
        description: "Tente novamente em alguns segundos"
      });
    };

    utterance.onpause = () => {
      setIsPlaying(false);
    };

    utterance.onresume = () => {
      setIsPlaying(true);
    };

    window.speechSynthesis.speak(utterance);
  };

  useImperativeHandle(ref, () => ({
    speak: speakText
  }));

  useEffect(() => {
    if (autoPlay) {
      speakText();
    }
  }, [text, autoPlay]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isPlaying && currentUtterance) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
    }
    toast.info(isMuted ? "Som ativado" : "Som desativado", {
      duration: 1500,
    });
  };

  const resetNarration = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
    }
    toast.info("Narração reiniciada", {
      duration: 1500,
    });
  };

  return (
    <div className="flex items-center justify-between p-4 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-600/30">
      <div className="flex items-center space-x-3">
        <Button
          onClick={speakText}
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-slate-700 to-slate-600 border-slate-500 text-white hover:from-slate-600 hover:to-slate-500 hover:border-slate-400 transition-all duration-300 shadow-lg"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pausar Narração
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Ouvir Reconstituição
            </>
          )}
        </Button>

        <Button
          onClick={resetNarration}
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300"
          disabled={!isPlaying && !currentUtterance}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-3">
        {isPlaying && (
          <div className="flex items-center space-x-3 text-slate-300">
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-4 bg-blue-400 rounded-full animate-pulse delay-100"></div>
              <div className="w-1 h-4 bg-blue-400 rounded-full animate-pulse delay-200"></div>
            </div>
            <span className="text-sm font-medium">Narrando...</span>
          </div>
        )}

        <Button
          onClick={toggleMute}
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
});
