
import { useState } from "react";
import { Eye, Edit3, CheckCircle, AlertCircle, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SceneElement, SceneConnection } from "@/pages/Index";

interface ScenePreviewProps {
  elementos: SceneElement[];
  conexoes: SceneConnection[];
  confidence: number;
  onApprove: () => void;
  onEdit: (elementos: SceneElement[], conexoes: SceneConnection[]) => void;
}

export const ScenePreview = ({ elementos, conexoes, confidence, onApprove, onEdit }: ScenePreviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedElements, setEditedElements] = useState<SceneElement[]>(elementos);
  const [editedConnections, setEditedConnections] = useState<SceneConnection[]>(conexoes);
  const [newElementName, setNewElementName] = useState("");

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'text-green-400';
    if (conf >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceIcon = (conf: number) => {
    if (conf >= 0.8) return CheckCircle;
    return AlertCircle;
  };

  const addElement = () => {
    if (!newElementName.trim()) return;
    
    const newElement: SceneElement = {
      nome: newElementName,
      cor: '#6366f1',
      posicao: [Math.random() * 400 + 100, Math.random() * 300 + 100],
      tooltip: `${newElementName} adicionado manualmente`,
      tipo: 'personalizado',
      classificacao: 'Evidência complementar',
      icone: 'box'
    };
    
    setEditedElements([...editedElements, newElement]);
    setNewElementName("");
  };

  const removeElement = (index: number) => {
    const newElements = editedElements.filter((_, i) => i !== index);
    setEditedElements(newElements);
    
    // Remove conexões relacionadas
    const elementName = editedElements[index].nome;
    const newConnections = editedConnections.filter(
      conn => conn.de !== elementName && conn.para !== elementName
    );
    setEditedConnections(newConnections);
  };

  const handleSaveEdits = () => {
    onEdit(editedElements, editedConnections);
    setIsEditing(false);
  };

  const ConfidenceIcon = getConfidenceIcon(confidence);

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/30 shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Eye className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Pré-visualização da Cena</h3>
              <div className="flex items-center space-x-2 mt-1">
                <ConfidenceIcon className={`h-4 w-4 ${getConfidenceColor(confidence)}`} />
                <span className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
                  Confiança: {Math.round(confidence * 100)}%
                </span>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancelar' : 'Editar'}
          </Button>
        </div>

        {/* Elements List */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <h4 className="text-lg font-semibold text-white">
              Elementos Identificados ({editedElements.length})
            </h4>
          </div>
          
          <div className="grid gap-3">
            {editedElements.map((elemento, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full animate-pulse"
                    style={{ backgroundColor: elemento.cor }}
                  ></div>
                  <div>
                    <span className="text-white font-medium">{elemento.nome}</span>
                    <p className="text-slate-400 text-sm">{elemento.tooltip}</p>
                  </div>
                </div>
                
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeElement(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Add New Element */}
          {isEditing && (
            <div className="flex items-center space-x-2 p-3 bg-slate-800/20 rounded-xl border-2 border-dashed border-slate-600/50">
              <Input
                placeholder="Adicionar novo elemento..."
                value={newElementName}
                onChange={(e) => setNewElementName(e.target.value)}
                className="flex-1 bg-transparent border-none text-white placeholder-slate-500"
                onKeyPress={(e) => e.key === 'Enter' && addElement()}
              />
              <Button
                onClick={addElement}
                size="sm"
                disabled={!newElementName.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Connections */}
        {editedConnections.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              <h4 className="text-lg font-semibold text-white">
                Relações Identificadas ({editedConnections.length})
              </h4>
            </div>
            
            <div className="grid gap-2">
              {editedConnections.map((conexao, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-slate-800/20 rounded-xl">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-white font-medium">{conexao.de}</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-0.5 bg-orange-400"></div>
                      <div className="w-0 h-0 border-l-2 border-r-0 border-t-1 border-b-1 border-transparent border-l-orange-400"></div>
                    </div>
                    <span className="text-white font-medium">{conexao.para}</span>
                  </div>
                  {conexao.descricao && (
                    <span className="text-slate-400 text-sm">({conexao.descricao})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-700/30">
          {isEditing ? (
            <Button
              onClick={handleSaveEdits}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Ajustar Manualmente
              </Button>
              <Button
                onClick={onApprove}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar e Visualizar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
