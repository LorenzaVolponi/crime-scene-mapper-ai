
import { useState } from "react";
import { FileText, Image, PenTool, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InputMethodSelectorProps {
  onMethodSelect: (method: 'text' | 'document' | 'image') => void;
  selectedMethod?: 'text' | 'document' | 'image';
}

export const InputMethodSelector = ({ onMethodSelect, selectedMethod }: InputMethodSelectorProps) => {
  const methods = [
    {
      id: 'text' as const,
      title: 'Descrever a Cena',
      description: 'Digite livremente os detalhes da cena criminal',
      icon: PenTool,
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      examples: ['Descrição narrativa', 'Detalhes específicos', 'Posições e objetos']
    },
    {
      id: 'document' as const,
      title: 'Enviar Documento',
      description: 'Upload de laudo, ocorrência ou transcrição',
      icon: FileText,
      color: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400',
      examples: ['PDF, TXT, DOCX', 'Laudos periciais', 'Boletins de ocorrência']
    },
    {
      id: 'image' as const,
      title: 'Enviar Imagem',
      description: 'Planta baixa, croqui ou esboço forense',
      icon: Image,
      color: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30',
      iconColor: 'text-green-400',
      examples: ['JPG, PNG, SVG', 'Plantas baixas', 'Croquis manuais']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
          <h3 className="text-xl font-bold text-white">Como deseja iniciar a análise?</h3>
          <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
        </div>
        <p className="text-slate-400">Escolha o método de entrada mais adequado para sua situação</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <div
              key={method.id}
              className={`relative group cursor-pointer transition-all duration-500 ${
                isSelected ? 'scale-105' : 'hover:scale-102'
              }`}
              onClick={() => onMethodSelect(method.id)}
            >
              <div className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300
                bg-gradient-to-br ${method.color}
                ${isSelected ? method.borderColor + ' shadow-lg shadow-current/20' : 'border-slate-600/30 hover:' + method.borderColor}
                backdrop-blur-sm
              `}>
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                )}

                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${method.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-8 w-8 ${method.iconColor}`} />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all duration-300">
                    {method.title}
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {method.description}
                  </p>
                  
                  {/* Examples */}
                  <div className="space-y-1">
                    {method.examples.map((example, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs text-slate-400">
                        <div className="w-1 h-1 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: `${index * 200}ms` }}></div>
                        <span>{example}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
