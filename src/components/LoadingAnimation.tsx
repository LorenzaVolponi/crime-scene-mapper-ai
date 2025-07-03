
import { Brain, Zap, Network, Eye } from "lucide-react";

interface LoadingAnimationProps {
  stage: string;
}

export const LoadingAnimation = ({ stage }: LoadingAnimationProps) => {
  const getStageIcon = (stage: string) => {
    if (stage.includes("Analisando")) return Brain;
    if (stage.includes("Identificando")) return Zap;
    if (stage.includes("Mapeando")) return Network;
    if (stage.includes("Construindo")) return Eye;
    return Brain;
  };

  const StageIcon = getStageIcon(stage);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      {/* Neural Processing Animation */}
      <div className="relative">
        {/* Central Processing Unit */}
        <div className="relative z-10 p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30 backdrop-blur-sm">
          <StageIcon className="h-8 w-8 text-blue-400 animate-pulse" />
        </div>

        {/* Orbital Rings */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
          <div className="w-16 h-16 border-2 border-blue-400/30 border-t-blue-400 rounded-full"></div>
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }}>
          <div className="w-20 h-20 border border-purple-400/20 border-t-purple-400/60 rounded-full -m-2"></div>
        </div>

        {/* Pulse Waves */}
        <div className="absolute inset-0 animate-ping">
          <div className="w-16 h-16 bg-blue-400/10 rounded-full"></div>
        </div>
        <div className="absolute inset-0 animate-ping delay-500">
          <div className="w-20 h-20 bg-purple-400/10 rounded-full -m-2"></div>
        </div>
      </div>

      {/* Stage Text with Typewriter Effect */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-white animate-pulse">
          Processamento Cognitivo
        </h3>
        <p className="text-blue-300 font-medium animate-in slide-in-from-bottom-2 duration-300">
          {stage}
        </p>
        
        {/* Progress Dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>

      {/* Neural Network Background */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <defs>
            <radialGradient id="nodeGradient">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          
          {/* Animated Neural Nodes */}
          <circle cx="50" cy="50" r="3" fill="url(#nodeGradient)" className="animate-pulse">
            <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="150" cy="50" r="3" fill="url(#nodeGradient)" className="animate-pulse delay-300">
            <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="100" cy="100" r="3" fill="url(#nodeGradient)" className="animate-pulse delay-500">
            <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="150" r="3" fill="url(#nodeGradient)" className="animate-pulse delay-700">
            <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="150" cy="150" r="3" fill="url(#nodeGradient)" className="animate-pulse delay-1000">
            <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Animated Connections */}
          <path d="M50,50 Q100,25 150,50" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.3">
            <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M150,50 Q125,75 100,100" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.3">
            <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0" dur="3s" repeatCount="indefinite" begin="0.5s" />
          </path>
          <path d="M100,100 Q75,125 50,150" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.3">
            <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0" dur="3s" repeatCount="indefinite" begin="1s" />
          </path>
          <path d="M50,150 Q100,175 150,150" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.3">
            <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0" dur="3s" repeatCount="indefinite" begin="1.5s" />
          </path>
        </svg>
      </div>
    </div>
  );
};
