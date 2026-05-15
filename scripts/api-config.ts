/**
 * Purpose: Shared API config for test scripts — uses MiMo (FREE, CHAMPION).
 *          All test scripts import getConfig() from here.
 *
 * WHY: MiMo mimo-v2-flash is FREE and the CHAMPION model:
 *      - CHAMPIONS.md #5: 0 color bugs, 16 sections, 17 CTAs, ~4 min
 *      - DeepSeek costs $0.60/M and ran out of credits
 *      - Same API format (OpenAI-compatible)
 *
 * Usage in test scripts:
 *   import { getConfig } from './api-config';
 *   const config = getConfig();
 */

export interface ApiConfig {
  apiUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  maxRetries: number;
  allKeys?: string[];
}

export function getConfig(): ApiConfig {
  const allKeys = [
    process.env.MIMO_API_KEY,
    process.env.MIMO_API_KEY_2,
    process.env.MIMO_API_KEY_3,
    process.env.MIMO_API_KEY_4,
    process.env.MIMO_API_KEY_5,
    process.env.MIMO_API_KEY_6,
  ].filter(Boolean) as string[];

  if (allKeys.length === 0) {
    console.error('ERROR: No MIMO_API_KEY found in .env');
    process.exit(1);
  }

  return {
    apiUrl: process.env.MIMO_API_URL ?? 'https://api.xiaomimimo.com/v1/chat/completions',
    apiKey: allKeys[0],
    model: 'mimo-v2-flash',
    temperature: 0.3,
    maxTokens: 16384,
    maxRetries: 2,
    allKeys,
  };
}

/**
 * Get config for judge (DeepSeek — better for structured JSON evaluation).
 * Falls back to MiMo if DeepSeek is unavailable.
 */
export function getJudgeConfig(): ApiConfig {
  const dsKey = process.env.DEEPSEEK_API_KEY;
  if (dsKey) {
    return {
      apiUrl: process.env.DEEPSEEK_API_URL ?? 'https://api.deepseek.com/v1/chat/completions',
      apiKey: dsKey,
      model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
      temperature: 0.5,
      maxTokens: 8192,
      maxRetries: 2,
    };
  }

  // Fallback to MiMo for judging too
  console.warn('WARN: DeepSeek unavailable, using MiMo for judging');
  return getConfig();
}
