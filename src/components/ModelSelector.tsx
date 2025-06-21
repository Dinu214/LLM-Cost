import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { PRICING } from '../data/pricing';

interface ModelSelectorProps {
  selectedModels: string[];
  onModelChange: (models: string[]) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModels,
  onModelChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleModel = (model: string) => {
    if (selectedModels.includes(model)) {
      onModelChange(selectedModels.filter(m => m !== model));
    } else {
      onModelChange([...selectedModels, model]);
    }
  };

  const removeModel = (model: string) => {
    onModelChange(selectedModels.filter(m => m !== model));
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Models (with pricing):
      </label>
      
      {/* Selected Models Display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedModels.map(model => (
          <div
            key={model}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
          >
            <span className="font-medium">{model}</span>
            <span className="text-xs opacity-75">
              (${PRICING[model].in} in / ${PRICING[model].out} out)
            </span>
            <button
              onClick={() => removeModel(model)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors flex items-center justify-between"
        >
          <span className="text-gray-500">
            {selectedModels.length === 0 ? 'Select models...' : `${selectedModels.length} model(s) selected`}
          </span>
          <ChevronDown size={20} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {Object.entries(PRICING).map(([model, pricing]) => (
              <label
                key={model}
                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={selectedModels.includes(model)}
                  onChange={() => toggleModel(model)}
                  className="mr-3 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{model}</div>
                  <div className="text-sm text-gray-500">
                    ${pricing.in} input / ${pricing.out} output per 1M tokens
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};