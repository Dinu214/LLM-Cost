import { CostBreakdown } from '../types';

interface ReportData {
  selectedModels: string[];
  qnaBreakdown: CostBreakdown[];
  reportBreakdown: CostBreakdown[];
  totalQuestionDaily: number;
  totalQnaTokens: number;
  totalReportTokens: number;
  totalDailyTokens: number;
  qnaTotalCost: number;
  reportTotalCost: number;
  combinedDailyCost: number;
  combinedMonthlyCost: number;
}

export const generateReport = (data: ReportData): string => {
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatNumber = (num: number) => num.toLocaleString();

  let report = `Terra Price Estimator Report
Generated on: ${new Date().toLocaleDateString()}

========================================
SELECTED MODELS AND COST BREAKDOWN
========================================

`;

  // Q&A Breakdown
  report += `Q&A Cost Breakdown:
`;
  data.qnaBreakdown.forEach(breakdown => {
    report += `  • ${breakdown.model}
    - Daily: ${formatCurrency(breakdown.dailyCost)}
    - Monthly: ${formatCurrency(breakdown.monthlyCost)}
`;
  });

  report += `
Report Generation Cost Breakdown:
`;
  data.reportBreakdown.forEach(breakdown => {
    report += `  • ${breakdown.model}
    - Daily: ${formatCurrency(breakdown.dailyCost)}
    - Monthly: ${formatCurrency(breakdown.monthlyCost)}
`;
  });

  report += `
========================================
SUMMARY
========================================
Total Q&A Tokens per Day: ${formatNumber(data.totalQnaTokens)}
Total Report Tokens per Day: ${formatNumber(data.totalReportTokens)}
Combined Daily Tokens: ${formatNumber(data.totalDailyTokens)}

Q&A Daily Cost: ${formatCurrency(data.qnaTotalCost)}
Report Daily Cost: ${formatCurrency(data.reportTotalCost)}
Total Daily Cost: ${formatCurrency(data.combinedDailyCost)}
Total Monthly Cost: ${formatCurrency(data.combinedMonthlyCost)}

========================================
USAGE PARAMETERS
========================================
Total Questions per Day: ${formatNumber(data.totalQuestionDaily)}
Q&A Tokens: ${formatNumber(data.totalQnaTokens)}
Report Tokens: ${formatNumber(data.totalReportTokens)}
Total Daily Tokens: ${formatNumber(data.totalDailyTokens)}
`;

  return report;
};

export const downloadReport = (reportContent: string, filename: string = 'terra_price_estimate.txt') => {
  const blob = new Blob([reportContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};