import { useMemo } from 'react';
import { PRICING } from '../data/pricing';
import { ModelWeights, CostBreakdown } from '../types';

interface UseCostCalculationProps {
  selectedModels: string[];
  weights: ModelWeights;
  tokensPerQuestion: number;
  users: number;
  questionsPerUser: number;
  questionsPerReport: number;
  reportsPerDay: number;
}

export const useCostCalculation = ({
  selectedModels,
  weights,
  tokensPerQuestion,
  users,
  questionsPerUser,
  questionsPerReport,
  reportsPerDay,
}: UseCostCalculationProps) => {
  return useMemo(() => {
    const totalQuestionDaily = users * questionsPerUser;
    const totalQnaTokens = tokensPerQuestion * totalQuestionDaily;
    const totalReportTokens = questionsPerReport * tokensPerQuestion * reportsPerDay;
    const totalDailyTokens = totalQnaTokens + totalReportTokens;
    const monthlyTokens = totalDailyTokens * 30;

    const calculateModelCosts = (totalTokens: number): CostBreakdown[] => {
      return selectedModels.map(model => {
        const price = PRICING[model];
        const modelShare = totalTokens * ((weights[model] || 0) / 100);
        const inputTokens = modelShare * 0.85;
        const outputTokens = modelShare * 0.15;

        const costInput = (inputTokens * price.in) / 1_000_000;
        const costOutput = (outputTokens * price.out) / 1_000_000;
        const dailyCost = costInput + costOutput;
        const monthlyCost = dailyCost * 30;

        return {
          model,
          dailyCost,
          monthlyCost,
          inputTokens,
          outputTokens,
        };
      });
    };

    const qnaBreakdown = calculateModelCosts(totalQnaTokens);
    const reportBreakdown = calculateModelCosts(totalReportTokens);

    const qnaTotalCost = qnaBreakdown.reduce((sum, breakdown) => sum + breakdown.dailyCost, 0);
    const reportTotalCost = reportBreakdown.reduce((sum, breakdown) => sum + breakdown.dailyCost, 0);
    const combinedDailyCost = qnaTotalCost + reportTotalCost;
    const combinedMonthlyCost = combinedDailyCost * 30;

    return {
      totalQuestionDaily,
      totalQnaTokens,
      totalReportTokens,
      totalDailyTokens,
      monthlyTokens,
      qnaBreakdown,
      reportBreakdown,
      qnaTotalCost,
      reportTotalCost,
      combinedDailyCost,
      combinedMonthlyCost,
    };
  }, [selectedModels, weights, tokensPerQuestion, users, questionsPerUser, questionsPerReport, reportsPerDay]);
};