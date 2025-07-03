
import { useState } from "react";
import { CrimeSceneForm } from "@/components/CrimeSceneForm";
import { CrimeSceneVisualization } from "@/components/CrimeSceneVisualization";
import { VoiceNarrator } from "@/components/VoiceNarrator";
import { Shield, Brain, Eye } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSceneGeneration = async (description: string) => {
    setIsLoading(true);
    console.log("Gerando cena para descrição:", description);
    
    try {
      // Simulate AI processing with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedScene = interpretCrimeScene(description);
      setSceneData(generatedScene);
      
      toast.success("Cena criminal mapeada com sucesso!", {
        description: `${generatedScene.elementos.length} elementos identificados`
      });
      
    } catch (error) {
      console.error("Erro ao gerar cena:", error);
      toast.error("Erro ao processar a descrição", {
        description: "Tente novamente com uma descrição mais detalhada"
      });
    } finally {
      setIsLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Crime Scene Mapper AI</h1>
                <p className="text-slate-300 text-sm">Análise Forense Inteligente</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-slate-300">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span className="text-sm">IA Ativa</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span className="text-sm">Visualização 2D</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Input Form */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Brain className="h-5 w-5 text-blue-400" />
                <span>Descrição da Cena</span>
              </h2>
              <CrimeSceneForm onSubmit={handleSceneGeneration} isLoading={isLoading} />
            </div>

            {sceneData && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-3">Narrativa Forense</h3>
                <p className="text-slate-300 leading-relaxed mb-4">{sceneData.narrativa}</p>
                <VoiceNarrator text={sceneData.narrativa} />
              </div>
            )}
          </div>

          {/* Right Panel - Visualization */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 min-h-[500px]">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Eye className="h-5 w-5 text-blue-400" />
                <span>Mapa da Cena</span>
              </h2>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-slate-300">Analisando cena criminal...</p>
                  </div>
                </div>
              ) : sceneData ? (
                <CrimeSceneVisualization data={sceneData} />
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center text-slate-400">
                    <Shield className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Aguardando descrição da cena...</p>
                    <p className="text-sm mt-2">Digite os detalhes para gerar a visualização</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-slate-400">
          <p>&copy; 2025 Crime Scene Mapper AI - Tecnologia Forense Avançada</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
