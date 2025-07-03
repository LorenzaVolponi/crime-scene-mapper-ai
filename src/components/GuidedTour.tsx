
import { useState } from "react";
import { HelpCircle, X, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TourStep {
  title: string;
  content: string;
  target?: string;
}

export const GuidedTour = ({ isOpen, onClose }: GuidedTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps: TourStep[] = [
    {
      title: "Bem-vindo ao Crime Scene Mapper AI",
      content: "Este sistema utiliza inteligência artificial para transformar descrições de cenas criminais em visualizações interativas. Vamos conhecer as funcionalidades!"
    },
    {
      title: "Três Formas de Entrada",
      content: "Você pode iniciar a análise de três maneiras: digitando uma descrição livre, enviando um documento (PDF, TXT, DOCX) ou carregando uma imagem (planta baixa, croqui).",
      target: "input-methods"
    },
    {
      title: "Descrição Textual",
      content: "Digite livremente os detalhes da cena. O sistema oferece sugestões animadas para inspirar sua descrição. Seja específico sobre posições, objetos e relações espaciais."
    },
    {
      title: "Upload de Documentos",
      content: "Envie laudos periciais, boletins de ocorrência ou transcrições. A IA extrai automaticamente as informações relevantes, ignorando cabeçalhos e seções irrelevantes."
    },
    {
      title: "Análise de Imagens",
      content: "Carregue plantas baixas ou croquis. O sistema usa OCR para extrair texto e visão computacional para identificar elementos marcados na imagem."
    },
    {
      title: "Pré-visualização Inteligente",
      content: "Antes da visualização final, você verá um resumo dos elementos identificados e suas relações. Pode editar, adicionar ou remover itens conforme necessário."
    },
    {
      title: "Visualização Interativa",
      content: "A cena é renderizada com pontos pulsantes, conexões animadas e tooltips informativos. Use os filtros para destacar categorias específicas (evidência, vítima, ambiente)."
    },
    {
      title: "Narração por Voz",
      content: "Clique em 'Ouvir Reconstituição' para uma narração forense da cena. Controle play/pause e ajuste o volume conforme necessário."
    }
  ];

  if (!isOpen) return null;

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <HelpCircle className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Tutorial Interativo</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Progresso</span>
              <span className="text-blue-400">
                {currentStep + 1} de {tourSteps.length}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white">
              {tourSteps[currentStep].title}
            </h4>
            <p className="text-slate-300 leading-relaxed">
              {tourSteps[currentStep].content}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="text-slate-400 hover:text-white disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="flex space-x-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentStep 
                      ? 'bg-blue-400' 
                      : index < currentStep 
                        ? 'bg-green-400' 
                        : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {currentStep === tourSteps.length - 1 ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Concluir
                </>
              ) : (
                <>
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
