import React from 'react';
import { CostBreakdown as CostBreakdownType } from '../types';
import { MessageCircle, FileText, DollarSign } from 'lucide-react';

interface CostBreakdownProps {
  qnaBreakdown: CostBreakdownType[];
  reportBreakdown: CostBreakdownType[];
  qnaTotalCost: number;
  reportTotalCost: number;
  combinedDailyCost: number;
  combinedMonthlyCost: number;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({
  qnaBreakdown,
  reportBreakdown,
  qnaTotalCost,
  reportTotalCost,
  combinedDailyCost,
  combinedMonthlyCost,
}) => {
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">💵 Cost Estimates</h2>
        <p className="text-gray-600">Breakdown by model and usage type</p>
      </div>

      {/* Q&A Cost Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageCircle className="text-blue-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Q&A Cost Breakdown</h3>
        </div>
        
        <div className="space-y-3">
          {qnaBreakdown.map((breakdown) => (
            <div key={breakdown.model} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900">{breakdown.model}</div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatCurrency(breakdown.dailyCost)}/day
                </div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(breakdown.monthlyCost)}/month
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Cost Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <FileText className="text-green-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Report Generation Cost</h3>
        </div>
        
        <div className="space-y-3">
          {reportBreakdown.map((breakdown) => (
            <div key={breakdown.model} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900">{breakdown.model}</div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatCurrency(breakdown.dailyCost)}/day
                </div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(breakdown.monthlyCost)}/month
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <DollarSign className="text-blue-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Total Cost Summary</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Q&A Daily</div>
            <div className="text-lg font-bold text-blue-600">
              {formatCurrency(qnaTotalCost)}
            </div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Reports Daily</div>
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(reportTotalCost)}
            </div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Daily</div>
            <div className="text-xl font-bold text-purple-600">
              {formatCurrency(combinedDailyCost)}
            </div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Monthly</div>
            <div className="text-xl font-bold text-purple-600">
              {formatCurrency(combinedMonthlyCost)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};