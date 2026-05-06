/**
 * Purpose: Design System barrel export — single import point for all tokens,
 *          rules, types, and validation helpers.
 * Dependencies: tokens.ts, composition-rules.ts
 * Related: validation pipeline, block renderer, agent prompts
 */

export {
  DESIGN_TOKENS,
  SPACING,
  TYPOGRAPHY,
  PALETTES,
  RADIUS,
  SHADOW,
  BREAKPOINTS,
  CTA_DIMENSIONS,
  IMAGE_RATIOS,
  PAGE_MAX_WIDTHS,
  PAGE_TYPES,
  BLOCK_TYPES,
  isValidPaletteColor,
  isValidSpacing,
  isValidRadius,
  getPalette,
  getAllValidColors,
} from './tokens';

export type {
  SpacingKey,
  FontSizeKey,
  FontWeightKey,
  LineHeightKey,
  PaletteKey,
  PaletteColorKey,
  RadiusKey,
  ShadowKey,
  ImageRatioKey,
  PageType,
  BlockType,
  DesignTokenSet,
} from './tokens';

export {
  PAGE_COMPOSITION_RULES,
  PAGE_TYPE_GUIDES,
  getRules,
  getAllBlockNames,
  validateSequence,
  validateBlocks,
} from './composition-rules';

export type {
  CompositionRule,
  BlockName,
} from './composition-rules';
