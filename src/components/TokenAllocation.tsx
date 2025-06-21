import React from 'react';
import { ModelWeights } from '../types';

interface TokenAllocationProps {
  models: string[];
  weights: ModelWeights;
  onWeightChange: (model: string, weight: number) => void;
}

export const TokenAllocation: React.FC<TokenAllocationProps> = ({
  models,
  weights,
  onWeightChange,
}) => {
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Token Allocation (%)</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          totalWeight === 100 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          Total: {totalWeight}%
        </div>
      </div>

      {totalWeight !== 100 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            ⚠️ Total allocation must equal 100%. Current total: {totalWeight}%
          </p>
        </div>
      )}

      <div className="space-y-6">
        {models.map((model) => {
          const currentWeight = weights[model] || 0;
          return (
            <div key={model} className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">
                  {model}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 min-w-[3rem] text-right">
                    {currentWeight}%
                  </span>
                </div>
              </div>
              
              {/* Custom Range Slider */}
              <div className="relative">
                <div className="range-container">
                  <div 
                    className="range-progress"
                    style={{ width: `${currentWeight}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentWeight}
                  onChange={(e) => onWeightChange(model, parseInt(e.target.value))}
                  className="range-input"
                />
              </div>
              
              {/* Value indicators */}
              <div className="flex justify-between text-xs text-gray-400 px-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick allocation buttons */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const equalWeight = Math.floor(100 / models.length);
              const remainder = 100 - (equalWeight * models.length);
              models.forEach((model, index) => {
                onWeightChange(model, equalWeight + (index === 0 ? remainder : 0));
              });
            }}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
          >
            Equal Split
          </button>
          <button
            onClick={() => {
              models.forEach(model => onWeightChange(model, 0));
            }}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
};