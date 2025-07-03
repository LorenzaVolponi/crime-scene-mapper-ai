
import { useEffect, useRef, useState } from "react";
import { CrimeSceneData } from "@/pages/Index";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CrimeSceneVisualizationProps {
  data: CrimeSceneData;
}

export const CrimeSceneVisualization = ({ data }: CrimeSceneVisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Animation phases: 0 = initial, 1 = elements appear, 2 = connections appear
    const timer1 = setTimeout(() => setAnimationPhase(1), 100);
    const timer2 = setTimeout(() => setAnimationPhase(2), 800);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [data]);

  const getElementIcon = (tipo: string) => {
    const icons: Record<string, string> = {
      corpo: "👤",
      arma: "🔫",
      sangue: "🩸",
      pegada: "👣",
      acesso: "🚪",
      mobilia: "🪑",
      comodo: "🏠"
    };
    return icons[tipo] || "📍";
  };

  const getElementSize = (tipo: string) => {
    const sizes: Record<string, number> = {
      corpo: 20,
      arma: 16,
      sangue: 14,
      pegada: 12,
      acesso: 18,
      mobilia: 16,
      comodo: 22
    };
    return sizes[tipo] || 16;
  };

  return (
    <TooltipProvider>
      <div className="relative w-full h-96 bg-slate-900/50 rounded-lg border border-slate-600 overflow-hidden">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 600 400"
          className="absolute inset-0"
        >
          {/* Definitions for animations and gradients */}
          <defs>
            <radialGradient id="pulseGradient" cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/> 
              </feMerge>
            </filter>
          </defs>

          {/* Connections */}
          {animationPhase >= 2 && data.conexoes.map((conexao, index) => {
            const elementoOrigem = data.elementos.find(el => el.nome === conexao.de);
            const elementoDestino = data.elementos.find(el => el.nome === conexao.para);
            
            if (!elementoOrigem || !elementoDestino) return null;

            return (
              <g key={`conexao-${index}`}>
                {/* Animated connection line */}
                <line
                  x1={elementoOrigem.posicao[0]}
                  y1={elementoOrigem.posicao[1]}
                  x2={elementoDestino.posicao[0]}
                  y2={elementoDestino.posicao[1]}
                  stroke={conexao.cor}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                  opacity="0.7"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;10"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </line>
                {/* Arrow marker */}
                <circle
                  cx={elementoDestino.posicao[0]}
                  cy={elementoDestino.posicao[1]}
                  r="3"
                  fill={conexao.cor}
                  className="animate-ping"
                />
              </g>
            );
          })}

          {/* Elements */}
          {data.elementos.map((elemento, index) => (
            <Tooltip key={`elemento-${index}`}>
              <TooltipTrigger asChild>
                <g
                  className="cursor-pointer transition-all duration-300 hover:scale-110"
                  onMouseEnter={() => setHoveredElement(elemento.nome)}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{
                    transform: animationPhase >= 1 ? 'scale(1)' : 'scale(0)',
                    transformOrigin: `${elemento.posicao[0]}px ${elemento.posicao[1]}px`,
                    transition: `transform 0.5s ease-out ${index * 0.1}s`
                  }}
                >
                  {/* Pulsing background */}
                  <circle
                    cx={elemento.posicao[0]}
                    cy={elemento.posicao[1]}
                    r={getElementSize(elemento.tipo) + 8}
                    fill="url(#pulseGradient)"
                    className={hoveredElement === elemento.nome ? "animate-ping" : "animate-pulse"}
                  />
                  
                  {/* Main element circle */}
                  <circle
                    cx={elemento.posicao[0]}
                    cy={elemento.posicao[1]}
                    r={getElementSize(elemento.tipo)}
                    fill={elemento.cor}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="2"
                    filter={hoveredElement === elemento.nome ? "url(#glow)" : "none"}
                    className="transition-all duration-300"
                  />
                  
                  {/* Element label */}
                  <text
                    x={elemento.posicao[0]}
                    y={elemento.posicao[1] - getElementSize(elemento.tipo) - 12}
                    textAnchor="middle"
                    className="fill-white text-xs font-medium"
                    style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))' }}
                  >
                    {elemento.nome}
                  </text>
                  
                  {/* Icon overlay */}
                  <text
                    x={elemento.posicao[0]}
                    y={elemento.posicao[1] + 2}
                    textAnchor="middle"
                    className="text-xs"
                  >
                    {getElementIcon(elemento.tipo)}
                  </text>
                </g>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-slate-800 border-slate-600">
                <div className="text-center">
                  <p className="font-medium text-white">{elemento.nome}</p>
                  <p className="text-xs text-slate-300">{elemento.tooltip}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
          <h4 className="text-white text-sm font-medium mb-2">Legenda</h4>
          <div className="space-y-1 text-xs">
            {data.elementos.map((elemento, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: elemento.cor }}
                />
                <span className="text-slate-300">{elemento.nome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
          <div className="text-right text-xs text-slate-300">
            <p>{data.elementos.length} elementos</p>
            <p>{data.conexoes.length} conexões</p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
