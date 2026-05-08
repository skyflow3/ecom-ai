/**
 * Purpose: Page Recipe Registry — winning page structures for AI composition.
 * Each recipe defines block order, required content, and design tokens.
 * The AI agent picks a recipe, customizes it, then fills blocks with content.
 *
 * Dependencies: All recipe files in this directory.
 * Related: src/design-system/composition-rules.ts, src/design-system/tokens.ts
 */

export type RecipeId = string;

export interface PageRecipe {
  id: RecipeId;
  name: string;
  description: string;
  pageType: string;
  source: string;
  blocks: RecipeBlock[];
  designTokens: RecipeDesignTokens;
  notes: string;
}

export interface RecipeBlock {
  type: string;
  required: boolean;
  description: string;
  exampleProps: Record<string, unknown>;
  visibility?: 'all' | 'mobile' | 'desktop';
}

export interface RecipeDesignTokens {
  maxWidth: string;
  primaryColor: string;
  ctaColor: string;
  ctaGradient?: string;
  backgroundColor: string;
  fontFamily?: string;
}

// --- Checkout Recipes ---
export { checkoutV1CheckoutChamp } from './checkout-v1-checkoutchamp';
export { checkoutV2Webflow } from './checkout-v2-webflow';

// --- Upsell Recipes ---
export { upsellV1Interrupt } from './upsell-v1-interrupt';
export { upsellV2Vsl } from './upsell-v2-vsl';

// --- Downsell Recipe ---
export { downsellV1 } from './downsell-v1';

// --- Advertorial Recipe ---
export { advertorialV1Editorial } from './advertorial-v1-editorial';

// --- Product Page Recipe ---
export { productPageV1Dtc } from './product-page-v1-dtc';

// --- VSL Recipe ---
export { vslV1 } from './vsl-v1';

// --- Thank You Recipe ---
export { thankYouV1 } from './thank-you-v1';

// --- Bridge Recipe ---
export { bridgeV1 } from './bridge-v1';

// --- Optin Recipe ---
export { optinV1 } from './optin-v1';

// --- Quiz Recipe ---
export { quizV1 } from './quiz-v1';

/**
 * All recipes indexed by ID for lookup.
 */
import { checkoutV1CheckoutChamp } from './checkout-v1-checkoutchamp';
import { checkoutV2Webflow } from './checkout-v2-webflow';
import { upsellV1Interrupt } from './upsell-v1-interrupt';
import { upsellV2Vsl } from './upsell-v2-vsl';
import { downsellV1 } from './downsell-v1';
import { advertorialV1Editorial } from './advertorial-v1-editorial';
import { productPageV1Dtc } from './product-page-v1-dtc';
import { vslV1 } from './vsl-v1';
import { thankYouV1 } from './thank-you-v1';
import { bridgeV1 } from './bridge-v1';
import { optinV1 } from './optin-v1';
import { quizV1 } from './quiz-v1';

export const ALL_RECIPES: Record<RecipeId, PageRecipe> = {
  [checkoutV1CheckoutChamp.id]: checkoutV1CheckoutChamp,
  [checkoutV2Webflow.id]: checkoutV2Webflow,
  [upsellV1Interrupt.id]: upsellV1Interrupt,
  [upsellV2Vsl.id]: upsellV2Vsl,
  [downsellV1.id]: downsellV1,
  [advertorialV1Editorial.id]: advertorialV1Editorial,
  [productPageV1Dtc.id]: productPageV1Dtc,
  [vslV1.id]: vslV1,
  [thankYouV1.id]: thankYouV1,
  [bridgeV1.id]: bridgeV1,
  [optinV1.id]: optinV1,
  [quizV1.id]: quizV1,
};

/**
 * Get recipes by page type.
 */
export function getRecipesByPageType(pageType: string): PageRecipe[] {
  return Object.values(ALL_RECIPES).filter((r) => r.pageType === pageType);
}
