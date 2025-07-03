import { SceneElement } from "@/pages/Index";

interface SceneElementsListProps {
  elements: SceneElement[];
}

export const SceneElementsList = ({ elements }: SceneElementsListProps) => {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30 shadow-2xl mt-6">
      <h4 className="text-white text-lg font-bold mb-4">Elementos Identificados</h4>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {elements.map((el, idx) => (
          <div key={idx} className="flex items-center space-x-4 text-base">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: el.cor }} />
            <span className="text-slate-200 font-medium flex-1">{el.nome}</span>
            <span className="text-slate-400 text-sm capitalize">{el.tipo}</span>
            <span className="text-slate-500 text-sm ml-2">{el.classificacao}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
