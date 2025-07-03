
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
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase(1), 200);
    const timer2 = setTimeout(() => setAnimationPhase(2), 1000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [data]);

  const getElementIcon = (tipo: string) => {
    const icons: Record<string, string> = {
      corpo: "🫂",
      arma: "🔫",
      sangue: "🩸",
      pegada: "👣",
      acesso: "🚪",
      mobilia: "🪑",
      comodo: "🏠",
      evidencia: "🔍"
    };
    return icons[tipo] || "📍";
  };

  const getElementSize = (tipo: string) => {
    const sizes: Record<string, number> = {
      corpo: 24,
      arma: 20,
      sangue: 16,
      pegada: 14,
      acesso: 22,
      mobilia: 18,
      comodo: 26,
      evidencia: 16
    };
    return sizes[tipo] || 18;
  };

  const handleElementClick = (elementName: string) => {
    setSelectedElement(selectedElement === elementName ? null : elementName);
  };

  return (
    <TooltipProvider>
      <div className="relative w-full h-[350px] md:h-[500px] bg-gradient-to-br from-slate-900/60 to-slate-800/60 rounded-2xl border border-slate-700/40 overflow-hidden backdrop-blur-sm">
        {/* Enhanced Grid Background */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 2px, transparent 2px),
              linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px, 40px 40px, 20px 20px, 20px 20px'
          }}
        />

        {/* Ambient Lighting Effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-28 h-28 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 700 500"
          className="absolute inset-0 cursor-crosshair"
        >
          <defs>
            {/* Enhanced Gradients */}
            <radialGradient id="elementGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.6)" />
              <stop offset="50%" stopColor="rgba(59, 130, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
            </radialGradient>
            
            <radialGradient id="selectedGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.8)" />
              <stop offset="50%" stopColor="rgba(34, 197, 94, 0.4)" />
              <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
            </radialGradient>

            {/* Enhanced Filters */}
            <filter id="elementShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
              <feOffset dx="0" dy="2" result="offset"/>
              <feFlood floodColor="#000000" floodOpacity="0.3"/>
              <feComposite in2="offset" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="connectionGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Enhanced Connections with Curved Paths */}
          {animationPhase >= 2 && data.conexoes.map((conexao, index) => {
            const elementoOrigem = data.elementos.find(el => el.nome === conexao.de);
            const elementoDestino = data.elementos.find(el => el.nome === conexao.para);
            
            if (!elementoOrigem || !elementoDestino) return null;

            const midX = (elementoOrigem.posicao[0] + elementoDestino.posicao[0]) / 2;
            const midY = (elementoOrigem.posicao[1] + elementoDestino.posicao[1]) / 2;
            const controlY = midY - 30;

            return (
              <g key={`conexao-${index}`}>
                {/* Curved Connection Path */}
                <path
                  d={`M ${elementoOrigem.posicao[0]} ${elementoOrigem.posicao[1]} Q ${midX} ${controlY} ${elementoDestino.posicao[0]} ${elementoDestino.posicao[1]}`}
                  fill="none"
                  stroke={conexao.cor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.7"
                  filter="url(#connectionGlow)"
                  className="transition-all duration-300"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    values="0,1000;20,980;1000,0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </path>
                
                {/* Flow Direction Indicator */}
                <circle
                  r="4"
                  fill={conexao.cor}
                  opacity="0.8"
                  className="animate-pulse"
                >
                  <animateMotion
                    dur="4s"
                    repeatCount="indefinite"
                    path={`M ${elementoOrigem.posicao[0]} ${elementoOrigem.posicao[1]} Q ${midX} ${controlY} ${elementoDestino.posicao[0]} ${elementoDestino.posicao[1]}`}
                  />
                </circle>
              </g>
            );
          })}

          {/* Enhanced Elements */}
          {data.elementos.map((elemento, index) => {
            const isHovered = hoveredElement === elemento.nome;
            const isSelected = selectedElement === elemento.nome;
            const elementSize = getElementSize(elemento.tipo);
            
            return (
              <Tooltip key={`elemento-${index}`}>
                <TooltipTrigger asChild>
                  <g
                    className="cursor-pointer transition-all duration-500 ease-out hover:scale-110"
                    onMouseEnter={() => setHoveredElement(elemento.nome)}
                    onMouseLeave={() => setHoveredElement(null)}
                    onClick={() => handleElementClick(elemento.nome)}
                    style={{
                      transform: animationPhase >= 1 ? 'scale(1)' : 'scale(0)',
                      transformOrigin: `${elemento.posicao[0]}px ${elemento.posicao[1]}px`,
                      transition: `transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.15}s`
                    }}
                  >
                    {/* Outer Glow Ring */}
                    <circle
                      cx={elemento.posicao[0]}
                      cy={elemento.posicao[1]}
                      r={elementSize + 15}
                      fill={isSelected ? "url(#selectedGlow)" : "url(#elementGlow)"}
                      className={isHovered || isSelected ? "animate-ping" : "animate-pulse"}
                      opacity={isHovered ? "0.8" : "0.4"}
                    />
                    
                    {/* Orbital Ring */}
                    {(isHovered || isSelected) && (
                      <circle
                        cx={elemento.posicao[0]}
                        cy={elemento.posicao[1]}
                        r={elementSize + 8}
                        fill="none"
                        stroke={isSelected ? "#22c55e" : "#3b82f6"}
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.6"
                        className="animate-spin"
                        style={{ animationDuration: "3s" }}
                      />
                    )}
                    
                    {/* Main Element Circle */}
                    <circle
                      cx={elemento.posicao[0]}
                      cy={elemento.posicao[1]}
                      r={elementSize}
                      fill={elemento.cor}
                      stroke="rgba(255, 255, 255, 0.4)"
                      strokeWidth="2"
                      filter="url(#elementShadow)"
                      className={`transition-all duration-300 ${isHovered ? 'stroke-white stroke-4' : ''}`}
                    />
                    
                    {/* Element Label */}
                    <text
                      x={elemento.posicao[0]}
                      y={elemento.posicao[1] - elementSize - 20}
                      textAnchor="middle"
                      className="fill-white text-sm font-bold tracking-wide"
                      style={{ 
                        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))',
                        fontSize: isHovered ? '14px' : '12px'
                      }}
                    >
                      {elemento.nome}
                    </text>
                    
                    {/* Animated Icon */}
                    <foreignObject
                      x={elemento.posicao[0] - 10}
                      y={elemento.posicao[1] - 8}
                      width="20"
                      height="16"
                      className="pointer-events-none"
                    >
                      <div className={`text-center transition-transform duration-300 ${isHovered ? 'scale-125' : ''}`}>
                        <span className="text-lg">
                          {getElementIcon(elemento.tipo)}
                        </span>
                      </div>
                    </foreignObject>

                    {/* Pulse Animation for Selected Elements */}
                    {isSelected && (
                      <circle
                        cx={elemento.posicao[0]}
                        cy={elemento.posicao[1]}
                        r={elementSize}
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="3"
                        opacity="0.7"
                        className="animate-ping"
                      />
                    )}
                  </g>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  className="bg-slate-900/95 backdrop-blur-xl border-slate-600/50 shadow-2xl max-w-xs"
                >
                  <div className="p-2">
                    <p className="font-bold text-white text-base mb-1">{elemento.nome}</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{elemento.tooltip}</p>
                    <p className="text-slate-400 text-xs mt-1">{elemento.classificacao}</p>
                    <div className="flex items-center mt-2 pt-2 border-t border-slate-700">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: elemento.cor }}
                      />
                      <span className="text-xs text-slate-400 capitalize">{elemento.tipo}</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </svg>

        {/* Enhanced Legend */}
        <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-xl rounded-xl p-4 border border-slate-600/50 shadow-2xl max-w-xs">
          <h4 className="text-white text-sm font-bold mb-3 flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Elementos Identificados</span>
          </h4>
          <div className="space-y-2 text-xs max-h-32 overflow-y-auto">
            {data.elementos.map((elemento, index) => (
              <div key={index} className="flex items-center space-x-3 py-1">
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: elemento.cor }}
                />
                <span className="text-slate-300 font-medium flex-1">{elemento.nome}</span>
                <span className="text-slate-500 text-xs capitalize">{elemento.tipo}</span>
                <span className="text-slate-500 text-xs ml-2">{elemento.classificacao}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Status Panel */}
        <div className="absolute top-6 right-6 bg-slate-900/80 backdrop-blur-xl rounded-xl p-4 border border-slate-600/50 shadow-2xl">
          <div className="text-right space-y-1">
            <div className="flex items-center space-x-2 text-green-400 text-sm font-semibold">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Análise Concluída</span>
            </div>
            <p className="text-slate-300 text-sm">{data.elementos.length} elementos</p>
            <p className="text-slate-400 text-xs">{data.conexoes.length} conexões mapeadas</p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
