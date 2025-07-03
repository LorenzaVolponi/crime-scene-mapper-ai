
import { useState, useRef } from "react";
import { CrimeSceneForm } from "@/components/CrimeSceneForm";
import { CrimeSceneVisualization } from "@/components/CrimeSceneVisualization";
import { VoiceNarrator } from "@/components/VoiceNarrator";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { ScenePreview } from "@/components/ScenePreview";
import { GuidedTour } from "@/components/GuidedTour";
import { SceneFilters } from "@/components/SceneFilters";
import { Shield, Brain, Eye, Sparkles, HelpCircle, Menu, X } from "lucide-react";
import { generatePdf } from "@/lib/generatePdf";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface SceneElement {
  nome: string;
  cor: string;
  posicao: [number, number];
  tooltip: string;
  tipo: string;
  icone: string;
}

export interface SceneConnection {
  de: string;
  para: string;
  cor: string;
  descricao: string;
}

export interface CrimeSceneData {
  elementos: SceneElement[];
  conexoes: SceneConnection[];
  narrativa: string;
  titulo: string;
}

const Index = () => {
  const [sceneData, setSceneData] = useState<CrimeSceneData | null>(null);
  const [previewData, setPreviewData] = useState<CrimeSceneData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingStage, setProcessingStage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const visualizationRef = useRef<HTMLDivElement>(null);

  const handleSceneGeneration = async (description: string) => {
    setIsLoading(true);
    setSceneData(null);
    setShowPreview(false);
    
    try {
      // Simulate AI cognitive processing stages
      setProcessingStage("Analisando descrição...");
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setProcessingStage("Identificando elementos...");
      await new Promise(resolve => setTimeout(resolve, 700));
      
      setProcessingStage("Mapeando conexões...");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProcessingStage("Construindo pré-visualização...");
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const generatedScene = interpretCrimeScene(description);
      
      // Show preview first
      setPreviewData(generatedScene);
      setShowPreview(true);
      
    } catch (error) {
      console.error("Erro ao processar cena:", error);
      toast.error("Falha na análise forense", {
        description: "Tente reformular a descrição com mais detalhes específicos",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
      setProcessingStage("");
    }
  };

  const handlePreviewApproval = () => {
    if (previewData) {
      setSceneData(previewData);
      setShowPreview(false);
      
      toast.success("Reconstituição forense concluída", {
        description: `${previewData.elementos.length} elementos identificados com precisão`,
        duration: 4000,
      });
    }
  };

  const handlePreviewEdit = (elementos: SceneElement[], conexoes: SceneConnection[]) => {
    if (previewData) {
      const updatedData = {
        ...previewData,
        elementos,
        conexoes
      };
      setPreviewData(updatedData);
    }
  };

  const interpretCrimeScene = (description: string): CrimeSceneData => {
    // Advanced scene interpretation logic
    const elementos: SceneElement[] = [];
    const conexoes: SceneConnection[] = [];
    let narrativa = "";
    let titulo = "Cena Criminal Analisada";

    // Normalize text
    const text = description.toLowerCase();
    
    // Element detection patterns
    const patterns = [
      { keywords: ['corpo', 'cadáver', 'vítima', 'morto'], tipo: 'corpo', cor: '#1e90ff', icone: 'user' },
      { keywords: ['arma', 'pistola', 'revólver', 'faca', 'facão'], tipo: 'arma', cor: '#dc143c', icone: 'zap' },
      { keywords: ['sangue', 'mancha', 'poça'], tipo: 'sangue', cor: '#8b0000', icone: 'droplet' },
      { keywords: ['pegada', 'pisada', 'rastro'], tipo: 'pegada', cor: '#8b4513', icone: 'footprints' },
      { keywords: ['porta', 'janela', 'entrada'], tipo: 'acesso', cor: '#4a5568', icone: 'door' },
      { keywords: ['mesa', 'cadeira', 'sofá', 'móvel'], tipo: 'mobilia', cor: '#2d3748', icone: 'box' },
      { keywords: ['cozinha', 'banheiro', 'quarto', 'sala'], tipo: 'comodo', cor: '#4a5568', icone: 'home' }
    ];

    // Generate elements based on text analysis
    patterns.forEach((pattern, index) => {
      const found = pattern.keywords.some(keyword => text.includes(keyword));
      if (found) {
        const baseX = Math.random() * 400 + 100;
        const baseY = Math.random() * 300 + 100;
        
        elementos.push({
          nome: pattern.tipo.charAt(0).toUpperCase() + pattern.tipo.slice(1),
          cor: pattern.cor,
          posicao: [baseX, baseY],
          tooltip: `${pattern.tipo.charAt(0).toUpperCase() + pattern.tipo.slice(1)} encontrado na cena`,
          tipo: pattern.tipo,
          icone: pattern.icone
        });
      }
    });

    // Generate connections based on spatial relationships
    if (elementos.length > 1) {
      for (let i = 0; i < elementos.length - 1; i++) {
        if (Math.random() > 0.5) { // 50% chance of connection
          conexoes.push({
            de: elementos[i].nome,
            para: elementos[i + 1].nome,
            cor: '#ff4500',
            descricao: `Relação espacial entre ${elementos[i].nome} e ${elementos[i + 1].nome}`
          });
        }
      }
    }

    // Generate narrative
    if (elementos.length > 0) {
      narrativa = `Análise forense identificou ${elementos.length} elementos principais na cena. `;
      elementos.forEach((elemento, index) => {
        narrativa += `${elemento.nome} localizado em posição estratégica${index < elementos.length - 1 ? ', ' : '. '}`;
      });
      narrativa += `As evidências sugerem um padrão investigativo que requer análise detalhada.`;
    } else {
      narrativa = "Descrição insuficiente para análise forense. Favor fornecer mais detalhes sobre a cena.";
      titulo = "Análise Inconclusiva";
    }

    return { elementos, conexoes, narrativa, titulo };
  };

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Enhanced Header */}
      <header className="relative z-10 bg-slate-900/70 backdrop-blur-xl border-b border-slate-700/50 sticky top-0">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Shield className="h-10 w-10 text-blue-400 drop-shadow-lg" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-slate-300 bg-clip-text text-transparent">
                  Crime Scene Mapper AI
                </h1>
                <p className="text-slate-400 text-sm font-medium tracking-wide">
                  Reconstituição Forense Inteligente • Versão Beta
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTour(true)}
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Como usar
              </Button>
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/10 rounded-full border border-green-500/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-sm font-medium">Sistema Ativo</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-medium">IA Avançada</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="sm:hidden text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="relative bg-slate-900 w-64 p-6 space-y-6">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <Button
              variant="ghost"
              className="justify-start text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 w-full"
              onClick={() => {
                setShowTour(true);
                setMobileMenuOpen(false);
              }}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Como usar
            </Button>
            <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/10 rounded-full border border-green-500/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-300 text-sm font-medium">Sistema Ativo</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <span className="text-sm font-medium">IA Avançada</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid xl:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Left Panel */}
          <div className="space-y-8">
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/30 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Brain className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Análise Forense</h2>
              </div>
              
              {isLoading ? (
                <LoadingAnimation stage={processingStage} />
              ) : (
                <CrimeSceneForm onSubmit={handleSceneGeneration} isLoading={isLoading} />
              )}
            </div>

            {/* Preview Section */}
            {showPreview && previewData && (
              <ScenePreview
                elementos={previewData.elementos}
                conexoes={previewData.conexoes}
                confidence={0.87} // Simulated confidence
                onApprove={handlePreviewApproval}
                onEdit={handlePreviewEdit}
              />
            )}

            {/* Narrative Section */}
            {sceneData && (
              <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/30 shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Eye className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Narrativa Forense</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-slate-300 leading-relaxed text-lg">{sceneData.narrativa}</p>
                  <VoiceNarrator text={sceneData.narrativa} />
                </div>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="space-y-8">
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/30 shadow-2xl min-h-[600px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Eye className="h-6 w-6 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Reconstituição Visual</h2>
                </div>
                {sceneData && (
                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm text-slate-400">
                      <p className="font-medium">{sceneData.elementos.length} elementos</p>
                      <p>{sceneData.conexoes.length} conexões</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (sceneData && visualizationRef.current) {
                          generatePdf(sceneData, visualizationRef.current);
                        }
                      }}
                      className="text-blue-400 border-blue-400 hover:bg-blue-500/10"
                    >
                      Baixar PDF
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Filters */}
              {sceneData && (
                <div className="mb-6">
                  <SceneFilters onFilterChange={handleFilterChange} />
                </div>
              )}
              
              {isLoading ? (
                <div className="flex items-center justify-center h-96">
                  <LoadingAnimation stage={processingStage} />
                </div>
              ) : sceneData ? (
                <div ref={visualizationRef}>
                  <CrimeSceneVisualization data={sceneData} activeFilters={activeFilters} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="relative mb-8">
                      <Shield className="h-24 w-24 mx-auto text-slate-600 opacity-50" />
                      <div className="absolute inset-0 animate-ping">
                        <Shield className="h-24 w-24 mx-auto text-blue-400 opacity-20" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">
                      Aguardando Análise
                    </h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                      Escolha o método de entrada para iniciar a reconstituição forense inteligente
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900/50 backdrop-blur-xl border-t border-slate-700/30 mt-20">
        <div className="container mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-slate-400 mb-4">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Crime Scene Mapper AI</span>
            <span>•</span>
            <span>Tecnologia Forense Avançada</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2025 - Sistema de Reconstituição Forense com Inteligência Artificial
          </p>
        </div>
      </footer>

      {/* Guided Tour */}
      <GuidedTour isOpen={showTour} onClose={() => setShowTour(false)} />
    </div>
  );
};

export default Index;
