import React, { useState, useEffect } from 'react';
import { Brain, Download, BarChart3 } from 'lucide-react';
import { ModelSelector } from './components/ModelSelector';
import { InputField } from './components/InputField';
import { TokenAllocation } from './components/TokenAllocation';
import { CostBreakdown } from './components/CostBreakdown';
import { useCostCalculation } from './hooks/useCostCalculation';
import { generateReport, downloadReport } from './utils/reportGenerator';
import { DEFAULT_MODELS } from './data/pricing';
import { ModelWeights } from './types';

function App() {
  const [selectedModels, setSelectedModels] = useState<string[]>(DEFAULT_MODELS);
  const [weights, setWeights] = useState<ModelWeights>({});
  
  // Q&A parameters
  const [tokensPerQuestion, setTokensPerQuestion] = useState(10000);
  const [users, setUsers] = useState(3);
  const [questionsPerUser, setQuestionsPerUser] = useState(20);
  
  // Report parameters
  const [questionsPerReport, setQuestionsPerReport] = useState(30);
  const [reportsPerDay, setReportsPerDay] = useState(2);

  // Initialize weights when models change
  useEffect(() => {
    const newWeights: ModelWeights = {};
    const equalWeight = selectedModels.length > 0 ? Math.floor(100 / selectedModels.length) : 0;
    const remainder = selectedModels.length > 0 ? 100 - (equalWeight * selectedModels.length) : 0;
    
    selectedModels.forEach((model, index) => {
      newWeights[model] = equalWeight + (index === 0 ? remainder : 0);
    });
    
    setWeights(newWeights);
  }, [selectedModels]);

  const handleWeightChange = (model: string, weight: number) => {
    setWeights(prev => ({ ...prev, [model]: weight }));
  };

  const costData = useCostCalculation({
    selectedModels,
    weights,
    tokensPerQuestion,
    users,
    questionsPerUser,
    questionsPerReport,
    reportsPerDay,
  });

  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  const canShowCosts = totalWeight === 100 && selectedModels.length > 0;

  const handleDownloadReport = () => {
    const reportContent = generateReport({
      selectedModels,
      qnaBreakdown: costData.qnaBreakdown,
      reportBreakdown: costData.reportBreakdown,
      totalQuestionDaily: costData.totalQuestionDaily,
      totalQnaTokens: costData.totalQnaTokens,
      totalReportTokens: costData.totalReportTokens,
      totalDailyTokens: costData.totalDailyTokens,
      qnaTotalCost: costData.qnaTotalCost,
      reportTotalCost: costData.reportTotalCost,
      combinedDailyCost: costData.combinedDailyCost,
      combinedMonthlyCost: costData.combinedMonthlyCost,
    });
    
    downloadReport(reportContent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Brain className="text-blue-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Terra Price Estimator</h1>
              <p className="text-gray-600">Calculate Groq token costs with precision</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Model Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <ModelSelector
                selectedModels={selectedModels}
                onModelChange={setSelectedModels}
              />
            </div>

            {/* Q&A Usage */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="text-blue-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Q&A Usage</h3>
              </div>
              <div className="space-y-4">
                <InputField
                  label="Tokens per question"
                  value={tokensPerQuestion}
                  onChange={setTokensPerQuestion}
                  min={1}
                />
                <InputField
                  label="Number of users"
                  value={users}
                  onChange={setUsers}
                  min={1}
                />
                <InputField
                  label="Questions per user/day"
                  value={questionsPerUser}
                  onChange={setQuestionsPerUser}
                  min={1}
                />
              </div>
            </div>

            {/* Report Generation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="text-green-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Report Generation</h3>
              </div>
              <div className="space-y-4">
                <InputField
                  label="Questions per report"
                  value={questionsPerReport}
                  onChange={setQuestionsPerReport}
                  min={1}
                />
                <InputField
                  label="Reports per day"
                  value={reportsPerDay}
                  onChange={setReportsPerDay}
                  min={1}
                />
              </div>
            </div>

            {/* Token Allocation */}
            {selectedModels.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <TokenAllocation
                  models={selectedModels}
                  weights={weights}
                  onWeightChange={handleWeightChange}
                />
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {/* Usage Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {costData.totalDailyTokens.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total tokens/day</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {costData.monthlyTokens.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total tokens/month</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {costData.totalQuestionDaily.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Questions/day</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedModels.length}
                  </div>
                  <div className="text-sm text-gray-600">Models selected</div>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            {canShowCosts ? (
              <>
                <CostBreakdown
                  qnaBreakdown={costData.qnaBreakdown}
                  reportBreakdown={costData.reportBreakdown}
                  qnaTotalCost={costData.qnaTotalCost}
                  reportTotalCost={costData.reportTotalCost}
                  combinedDailyCost={costData.combinedDailyCost}
                  combinedMonthlyCost={costData.combinedMonthlyCost}
                />
                
                {/* Download Button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={handleDownloadReport}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Download size={20} />
                    Download Report
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <BarChart3 size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Calculate</h3>
                <p className="text-gray-600">
                  {selectedModels.length === 0 
                    ? "Select at least one model to see cost estimates."
                    : "Adjust token allocation to equal 100% to see cost estimates."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;