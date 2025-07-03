
import { useState } from "react";
import { Filter, Eye, EyeOff, Users, Zap, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SceneFiltersProps {
  onFilterChange: (filters: string[]) => void;
}

export const SceneFilters = ({ onFilterChange }: SceneFiltersProps) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filterCategories = [
    {
      id: 'corpo',
      label: 'Vítima',
      icon: Users,
      color: 'bg-red-500/10 text-red-400 border-red-500/30',
      activeColor: 'bg-red-500/20 text-red-300 border-red-500/50'
    },
    {
      id: 'arma',
      label: 'Evidência',
      icon: Zap,
      color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      activeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
    },
    {
      id: 'mobilia',
      label: 'Ambiente',
      icon: Home,
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      activeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/50'
    },
    {
      id: 'sangue',
      label: 'Rastros',
      icon: AlertTriangle,
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      activeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/50'
    }
  ];

  const toggleFilter = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(f => f !== filterId)
      : [...activeFilters, filterId];
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    onFilterChange([]);
  };

  const showAllFilters = () => {
    const allFilters = filterCategories.map(cat => cat.id);
    setActiveFilters(allFilters);
    onFilterChange(allFilters);
  };

  return (
    <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <h4 className="text-sm font-semibold text-white">Filtros Visuais</h4>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={showAllFilters}
            className="text-xs text-green-400 hover:text-green-300 hover:bg-green-500/10"
          >
            <Eye className="h-3 w-3 mr-1" />
            Mostrar Todos
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <EyeOff className="h-3 w-3 mr-1" />
            Ocultar Todos
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {filterCategories.map((category) => {
          const Icon = category.icon;
          const isActive = activeFilters.includes(category.id);
          
          return (
            <button
              key={category.id}
              onClick={() => toggleFilter(category.id)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200
                ${isActive ? category.activeColor : category.color}
                hover:scale-105 active:scale-95
              `}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{category.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-current rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
      
      {activeFilters.length > 0 && (
        <div className="mt-3 text-xs text-slate-400">
          {activeFilters.length} categoria(s) ativa(s)
        </div>
      )}
    </div>
  );
};
