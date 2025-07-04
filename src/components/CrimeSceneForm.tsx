
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, FileText, AlertCircle, Sparkles, Lightbulb, RotateCcw } from "lucide-react";
import { InputMethodSelector } from "./InputMethodSelector";
import { DocumentUploader } from "./DocumentUploader";
import { ImageUploader } from "./ImageUploader";

interface CrimeSceneFormProps {
  onSubmit: (description: string) => void;
  isLoading: boolean;
}

export const CrimeSceneForm = ({ onSubmit, isLoading }: CrimeSceneFormProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'text' | 'document' | 'image'>('text');
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [showExamples, setShowExamples] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const exampleDescriptions = [
    "A vítima estava no corredor, com sangue indo até a cozinha e a arma no sofá.",
    "Dois disparos ocorreram na sala. O corpo foi encontrado caído ao lado da mesa.",
    "Pegadas lamacentas levam da janela quebrada até o quarto onde estava a vítima.",
    "Arma de fogo calibre .38 encontrada embaixo da cama com digitais do suspeito.",
    "Rastro de sangue conecta a sala de estar ao banheiro onde havia sinais de luta."
  ];

  // Typewriter effect for examples
  useEffect(() => {
    if (selectedMethod === "text" && !description) {
      const interval = setInterval(() => {
        setCurrentExample((prev) => (prev + 1) % exampleDescriptions.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [selectedMethod, description, exampleDescriptions.length]);

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

  const handleDocumentProcessed = (content: string, summary: string) => {
    setDescription(`${summary}\n\nConteúdo extraído: ${content}`);
  };

  const handleImageProcessed = (imageDescription: string, confidence: number) => {
    setDescription(`Análise de imagem (Confiança: ${Math.round(confidence * 100)}%): ${imageDescription}`);
  };

  const applyExample = (example: string) => {
    setDescription(example);
    setError("");
    setShowExamples(false);
  };

  const resetForm = () => {
    setDescription("");
    setError("");
    setSelectedMethod('text');
    setShowExamples(false);
  };

  return (
    <div className="space-y-8">
      {/* Method Selection */}
      <InputMethodSelector 
        onMethodSelect={setSelectedMethod}
        selectedMethod={selectedMethod}
      />

      {/* Content based on selected method */}
      {selectedMethod === 'text' && (
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
                placeholder={`Exemplo: ${exampleDescriptions[currentExample]}`}
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

          {/* Enhanced Examples Section */}
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
                    onClick={() => applyExample(example)}
                    className="w-full text-left p-4 bg-gradient-to-r from-slate-800/30 to-slate-700/30 hover:from-slate-700/50 hover:to-slate-600/50 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 group"
                    disabled={isLoading}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-1 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                        <Sparkles className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                          {example}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Button
              type="submit"
              disabled={isLoading || !description.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 text-lg"
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
            
            {description && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="px-4 py-4 border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            )}
          </div>
        </form>
      )}

      {selectedMethod === 'document' && (
        <DocumentUploader 
          onDocumentProcessed={handleDocumentProcessed}
          isProcessing={isLoading}
        />
      )}

      {selectedMethod === 'image' && (
        <ImageUploader 
          onImageProcessed={handleImageProcessed}
          isProcessing={isLoading}
        />
      )}

      {/* Submit button for document/image methods */}
      {selectedMethod !== 'text' && description && (
        <div className="space-y-4">
          <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-700/30">
            <h4 className="text-white font-semibold mb-2">Conteúdo Processado:</h4>
            <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>
          
          <Button
            onClick={() => onSubmit(description)}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl text-lg"
          >
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Processando Análise Forense...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Send className="h-5 w-5" />
                <span>Gerar Visualização</span>
              </div>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
