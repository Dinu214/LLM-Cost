import { ModelPricing } from '../types';

export const PRICING: Record<string, ModelPricing> = {
  "Llama 4 Scout (17Bx16E)": { in: 0.11, out: 0.34 },
  "Llama 4 Maverick (17Bx128E)": { in: 0.20, out: 0.60 },
  "Llama Guard 4 12B 128k": { in: 0.20, out: 0.20 },
  "DeepSeek R1 Distill Llama 70B": { in: 0.75, out: 0.99 },
  "Qwen3 32B 131k": { in: 0.29, out: 0.59 },
  "Qwen QwQ 32B (Preview)": { in: 0.29, out: 0.39 },
  "Mistral Saba 24B": { in: 0.79, out: 0.79 },
  "Llama 3.3 70B Versatile 128k": { in: 0.59, out: 0.79 },
  "Llama 3.1 8B Instant 128k": { in: 0.05, out: 0.08 },
  "Llama 3 70B 8k": { in: 0.59, out: 0.79 },
  "Llama 3 8B 8k": { in: 0.05, out: 0.08 },
  "Gemma 2 9B 8k": { in: 0.20, out: 0.20 },
  "Llama Guard 3 8B 8k": { in: 0.20, out: 0.20 },
};

export const DEFAULT_MODELS = [
  "Llama 3.3 70B Versatile 128k",
  "Qwen3 32B 131k"
];