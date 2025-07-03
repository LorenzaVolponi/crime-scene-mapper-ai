
import { useState, useCallback } from "react";
import { Upload, Image, X, CheckCircle, Eye, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageProcessed: (description: string, confidence: number) => void;
  isProcessing: boolean;
}

export const ImageUploader = ({ onImageProcessed, isProcessing }: ImageUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [ocrText, setOcrText] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);

  const acceptedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processImage = async (file: File) => {
    try {
      // Criar preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Simular OCR e análise de imagem
      const ocrResult = await simulateOCR(file);
      const analysisResult = await analyzeImage(file);
      
      setOcrText(ocrResult.text);
      setConfidence(analysisResult.confidence);
      
      const description = generateDescription(ocrResult.text, analysisResult.elements);
      onImageProcessed(description, analysisResult.confidence);
      
      toast.success("Imagem processada com sucesso", {
        description: `Confiança: ${Math.round(analysisResult.confidence * 100)}%`,
      });

    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      toast.error("Falha ao processar imagem", {
        description: "Tente novamente com uma imagem mais clara",
      });
    }
  };

  const simulateOCR = async (file: File): Promise<{ text: string }> => {
    // Simular processamento OCR
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular texto extraído baseado no nome do arquivo
    const filename = file.name.toLowerCase();
    let simulatedText = "";
    
    if (filename.includes('planta') || filename.includes('croqui')) {
      simulatedText = "Sala de estar - Corpo encontrado próximo ao sofá. Cozinha - Rastro de sangue. Quarto - Arma embaixo da cama.";
    } else if (filename.includes('sketch') || filename.includes('desenho')) {
      simulatedText = "X marca posição da vítima. Seta indica direção do disparo. Círculo vermelho = sangue.";
    } else {
      simulatedText = "Elementos identificados: posições marcadas, objetos anotados, trajetórias indicadas.";
    }
    
    return { text: simulatedText };
  };

  const analyzeImage = async (file: File): Promise<{ elements: string[], confidence: number }> => {
    // Simular análise de visão computacional
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const elements = ['corpo', 'arma', 'sangue', 'mobilia'];
    const confidence = Math.random() * 0.3 + 0.7; // 70-100%
    
    return { elements, confidence };
  };

  const generateDescription = (ocrText: string, elements: string[]): string => {
    const baseDescription = ocrText || "Análise visual da imagem identificou elementos na cena.";
    const elementsText = elements.length > 0 
      ? ` Elementos detectados: ${elements.join(', ')}.`
      : "";
    
    return baseDescription + elementsText;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && validateFile(file)) {
      setUploadedImage(file);
      processImage(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setUploadedImage(file);
      processImage(file);
    }
  };

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize) {
      toast.error("Arquivo muito grande", {
        description: "A imagem deve ter no máximo 5MB",
      });
      return false;
    }

    if (!acceptedTypes.includes(file.type)) {
      toast.error("Tipo de arquivo não suportado", {
        description: "Aceitos: JPG, PNG, SVG",
      });
      return false;
    }

    return true;
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview("");
    setOcrText("");
    setConfidence(0);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-green-400 bg-green-500/10' 
            : uploadedImage 
              ? 'border-green-400 bg-green-500/10' 
              : 'border-slate-600 hover:border-slate-500 bg-slate-800/30'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />

        {uploadedImage ? (
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative flex-shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border border-slate-600"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              {/* File Info */}
              <div className="flex-1 text-left space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <p className="text-white font-semibold">{uploadedImage.name}</p>
                </div>
                <p className="text-slate-400 text-sm">
                  {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB
                </p>
                
                {confidence > 0 && (
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-blue-400">
                      Confiança: {Math.round(confidence * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* OCR Results */}
            {ocrText && (
              <div className="bg-slate-900/50 rounded-xl p-4 text-left">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-400">Texto Extraído:</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {ocrText}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="p-4 bg-green-500/10 rounded-full">
                <Image className="h-8 w-8 text-green-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-white">
                Arraste a imagem ou clique para selecionar
              </h4>
              <p className="text-slate-400">
                Formatos aceitos: JPG, PNG, SVG (máx. 5MB)
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
              <div className="flex items-center space-x-1">
                <Image className="h-3 w-3" />
                <span>Plantas baixas</span>
              </div>
              <div className="flex items-center space-x-1">
                <Image className="h-3 w-3" />
                <span>Croquis forenses</span>
              </div>
              <div className="flex items-center space-x-1">
                <Image className="h-3 w-3" />
                <span>Esboços manuais</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex items-center justify-center space-x-3 text-green-400">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-400 border-t-transparent"></div>
          <span className="font-medium">Processando imagem com OCR e IA...</span>
        </div>
      )}
    </div>
  );
};
