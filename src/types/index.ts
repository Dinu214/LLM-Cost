export interface ModelPricing {
  in: number;
  out: number;
}

export interface ModelWeights {
  [key: string]: number;
}

export interface CostBreakdown {
  model: string;
  dailyCost: number;
  monthlyCost: number;
  inputTokens: number;
  outputTokens: number;
}