
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, FileText, AlertCircle, Sparkles, Lightbulb } from "lucide-react";

interface CrimeSceneFormProps {
  onSubmit: (description: string) => void;
  isLoading: boolean;
}

export const CrimeSceneForm = ({ onSubmit, isLoading }: CrimeSceneFormProps) => {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [showExamples, setShowExamples] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError("Por favor, descreva detalhadamente a cena criminal");
      return;
    }

    if (description.trim().length < 15) {
      setError("Descrição muito superficial. Forneça mais detalhes específicos para análise forense precisa.");
      return;
    }

    setError("");
    onSubmit(description.trim());
  };

  const exampleDescriptions = [
    {
      title: "Cena Doméstica",
      description: "Corpo encontrado caído na sala ao lado do sofá de couro marrom. Há uma arma de fogo calibre .38 no chão próximo à mesa de centro. Rastros de sangue levam até a cozinha passando pelo corredor. A porta da frente estava entreaberta com sinais de arrombamento."
    },
    {
      title: "Quarto com Sinais de Luta",
      description: "Vítima no quarto principal com múltiplos ferimentos por arma branca no tórax. Pegadas lamacentas próximo à janela quebrada do segundo andar. Mesa de cabeceira revirada com documentos e dinheiro espalhados pelo chão. Cortinas rasgadas."
    },
    {
      title: "Banheiro Suspeito",
      description: "Cadáver no banheiro da suíte com evidentes sinais de luta e estrangulamento. Sangue espirrado nas paredes brancas e espelho do armário quebrado. Torneira da pia aberta com água corrente e toalhas ensanguentadas no chão molhado."
    }
  ];

  const useExample = (example: string) => {
    setDescription(example);
    setError("");
    setShowExamples(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <label htmlFor="description" className="text-white font-semibold flex items-center space-x-3 text-lg">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <FileText className="h-5 w-5 text-blue-400" />
          </div>
          <span>Descrição da Cena Criminal</span>
        </label>
        
        <div className="relative">
          <Textarea
            id="description"
            placeholder="Descreva minuciosamente a cena: posição do corpo, objetos próximos, sinais de luta, armas, rastros de sangue, pegadas, estado do ambiente, portas e janelas, móveis desarrumados, documentos, iluminação..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (error) setError("");
            }}
            className="min-h-40 bg-slate-800/50 backdrop-blur-sm border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-400/60 focus:ring-blue-400/20 rounded-xl text-lg leading-relaxed resize-none transition-all duration-300 hover:bg-slate-800/70"
            disabled={isLoading}
          />
          <div className="absolute bottom-3 right-3 text-xs text-slate-500">
            {description.length}/500
          </div>
        </div>
        
        {error && (
          <div className="flex items-center space-x-3 text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20 animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}
      </div>

      {/* Examples Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-300">
            <Lightbulb className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">Exemplos de descrições forenses:</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowExamples(!showExamples)}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
          >
            {showExamples ? "Ocultar" : "Ver exemplos"}
          </Button>
        </div>

        {showExamples && (
          <div className="space-y-3 animate-in slide-in-from-top-4 duration-500">
            {exampleDescriptions.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => useExample(example.description)}
                className="w-full text-left p-4 bg-gradient-to-r from-slate-800/30 to-slate-700/30 hover:from-slate-700/50 hover:to-slate-600/50 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 group"
                disabled={isLoading}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <Sparkles className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1 group-hover:text-blue-100 transition-colors">
                      {example.title}
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                      {example.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading || !description.trim()}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 text-lg"
      >
        {isLoading ? (
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span>Processando Análise Forense...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Send className="h-5 w-5" />
            <span>Iniciar Reconstituição</span>
          </div>
        )}
      </Button>
    </form>
  );
};
