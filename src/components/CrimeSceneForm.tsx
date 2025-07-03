
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, FileText, AlertCircle } from "lucide-react";

interface CrimeSceneFormProps {
  onSubmit: (description: string) => void;
  isLoading: boolean;
}

export const CrimeSceneForm = ({ onSubmit, isLoading }: CrimeSceneFormProps) => {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError("Por favor, descreva a cena criminal");
      return;
    }

    if (description.trim().length < 10) {
      setError("Descrição muito curta. Forneça mais detalhes.");
      return;
    }

    setError("");
    onSubmit(description.trim());
  };

  const exampleDescriptions = [
    "Corpo encontrado caído na sala ao lado do sofá. Há uma arma de fogo no chão e rastros de sangue levando até a cozinha. A porta da frente estava aberta.",
    "Vítima no quarto com ferimentos por arma branca. Pegadas na lama próximo à janela quebrada. Mesa revirada com documentos espalhados.",
    "Cadáver no banheiro com sinais de luta. Sangue nas paredes e espelho quebrado. Torneira aberta e água no chão."
  ];

  const useExample = (example: string) => {
    setDescription(example);
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="description" className="text-white font-medium flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Descrição da Cena Criminal</span>
        </label>
        <Textarea
          id="description"
          placeholder="Descreva detalhadamente a cena criminal: localização dos objetos, evidências, estado do ambiente, posição do corpo, armas, sangue, pegadas, móveis, etc..."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (error) setError("");
          }}
          className="min-h-32 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
          disabled={isLoading}
        />
        {error && (
          <div className="flex items-center space-x-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-slate-300 text-sm">Exemplos de descrições:</p>
        <div className="space-y-2">
          {exampleDescriptions.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => useExample(example)}
              className="w-full text-left p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-slate-500 transition-colors text-slate-300 text-sm"
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !description.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-600 disabled:text-slate-400"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Analisando...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Send className="h-4 w-4" />
            <span>Gerar Mapa da Cena</span>
          </div>
        )}
      </Button>
    </form>
  );
};
