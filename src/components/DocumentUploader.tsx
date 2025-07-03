
import { useState, useCallback } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DocumentUploaderProps {
  onDocumentProcessed: (content: string, summary: string) => void;
  isProcessing: boolean;
}

export const DocumentUploader = ({ onDocumentProcessed, isProcessing }: DocumentUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedContent, setExtractedContent] = useState<string>("");

  const acceptedTypes = ['.pdf', '.txt', '.docx'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processFile = async (file: File) => {
    try {
      const content = await extractTextFromFile(file);
      const summary = await generateSummary(content);
      
      setExtractedContent(content);
      onDocumentProcessed(content, summary);
      
      toast.success("Documento processado com sucesso", {
        description: `${content.length} caracteres extraídos para análise`,
      });

    } catch (error) {
      console.error("Erro ao processar documento:", error);
      toast.error("Falha ao processar documento", {
        description: "Verifique se o arquivo não está corrompido ou protegido",
      });
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const text = event.target?.result as string;
        // Simular extração inteligente removendo cabeçalhos e rodapés
        const cleanText = text
          .replace(/^[\s\S]*?(?=\w.*\w)/, '') // Remove início até primeira palavra significativa
          .replace(/\n{3,}/g, '\n\n') // Normaliza quebras de linha
          .replace(/\s+/g, ' ') // Normaliza espaços
          .trim();
        
        resolve(cleanText);
      };
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
  };

  const generateSummary = async (content: string): Promise<string> => {
    // Simular análise IA para resumo
    const words = content.toLowerCase();
    const elements = [];
    
    if (words.includes('corpo') || words.includes('vítima')) elements.push('Vítima identificada');
    if (words.includes('arma') || words.includes('disparo')) elements.push('Arma de fogo presente');
    if (words.includes('sangue') || words.includes('mancha')) elements.push('Rastros de sangue');
    if (words.includes('porta') || words.includes('janela')) elements.push('Pontos de acesso');
    
    return elements.length > 0 
      ? `Elementos identificados: ${elements.join(', ')}`
      : 'Análise em andamento - elementos serão mapeados na visualização';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && validateFile(file)) {
      setUploadedFile(file);
      processFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setUploadedFile(file);
      processFile(file);
    }
  };

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize) {
      toast.error("Arquivo muito grande", {
        description: "O arquivo deve ter no máximo 10MB",
      });
      return false;
    }

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      toast.error("Tipo de arquivo não suportado", {
        description: `Aceitos: ${acceptedTypes.join(', ')}`,
      });
      return false;
    }

    return true;
  };

  const removeFile = () => {
    setUploadedFile(null);
    setExtractedContent("");
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-blue-400 bg-blue-500/10' 
            : uploadedFile 
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
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />

        {uploadedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-400 animate-pulse" />
              <div className="text-left">
                <p className="text-white font-semibold">{uploadedFile.name}</p>
                <p className="text-slate-400 text-sm">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {extractedContent && (
              <div className="bg-slate-900/50 rounded-xl p-4 text-left">
                <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                  {extractedContent.substring(0, 200)}...
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="p-4 bg-blue-500/10 rounded-full">
                <Upload className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-white">
                Arraste o documento ou clique para selecionar
              </h4>
              <p className="text-slate-400">
                Formatos aceitos: PDF, TXT, DOCX (máx. 10MB)
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
              <div className="flex items-center space-x-1">
                <FileText className="h-3 w-3" />
                <span>Laudos periciais</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="h-3 w-3" />
                <span>Boletins de ocorrência</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="h-3 w-3" />
                <span>Transcrições</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex items-center justify-center space-x-3 text-blue-400">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
          <span className="font-medium">Extraindo e analisando conteúdo...</span>
        </div>
      )}
    </div>
  );
};
