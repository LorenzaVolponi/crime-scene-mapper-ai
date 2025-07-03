
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { toast } from "sonner";

interface VoiceNarratorProps {
  text: string;
}

export const VoiceNarrator = ({ text }: VoiceNarratorProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const speakText = () => {
    if (!('speechSynthesis' in window)) {
      toast.error("Narração por voz não suportada neste navegador");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings for forensic narration
    utterance.rate = 0.8; // Slower, more deliberate pace
    utterance.pitch = 0.9; // Slightly lower pitch for authority
    utterance.volume = isMuted ? 0 : 0.8;
    
    // Try to find a Portuguese voice, fallback to default
    const voices = window.speechSynthesis.getVoices();
    const portugueseVoice = voices.find(voice => 
      voice.lang.includes('pt') || voice.lang.includes('br')
    );
    
    if (portugueseVoice) {
      utterance.voice = portugueseVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      console.log("Iniciando narração forense");
    };

    utterance.onend = () => {
      setIsPlaying(false);
      console.log("Narração concluída");
    };

    utterance.onerror = (event) => {
      console.error("Erro na narração:", event);
      setIsPlaying(false);
      toast.error("Erro ao iniciar narração");
    };

    window.speechSynthesis.speak(utterance);
    toast.success("Iniciando reconstituição por voz");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <Button
        onClick={speakText}
        variant="outline"
        size="sm"
        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
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
        onClick={toggleMute}
        variant="ghost"
        size="sm"
        className="text-slate-400 hover:text-white hover:bg-slate-700"
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>

      {isPlaying && (
        <div className="flex items-center space-x-2 text-slate-400">
          <div className="animate-pulse w-2 h-2 bg-blue-400 rounded-full"></div>
          <span className="text-xs">Narrando...</span>
        </div>
      )}
    </div>
  );
};
