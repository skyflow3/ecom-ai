# PLAN — Intégration Design System dans Architecture Finale.md

**Date**: 2026-05-06
**Source**: Agent Prompt Architecture.md (9 réponses IA, 4686 lignes)
**Objectif**: Ajouter les couches Design + Validation + A/B + RAG manquantes à Architecture Finale.md

---

## REGLE OBLIGATOIRE: Relecture après chaque action

**APRES chaque nouvelle chose faite** (section ajoutée, code écrit, table créée, etc.):
1. Relire `PLAN-DESIGN-SYSTEM.md` en entier (ce fichier)
2. Relire les sections concernées de `Architecture Finale.md`
3. Vérifier cohérence entre les deux fichiers
4. Cocher les checkboxes correspondantes ci-dessous
5. Mettre à jour `progress.txt` avec ce qui a été fait

**POURQUOI**: L'IA peut perdre le contexte entre les actions. La relecture garantit qu'elle reste alignée sur le plan et ne contredit pas ce qui existe déjà. Une future IA sans mémoire doit pouvoir reprendre sans erreur.

---

## Ce qui existe DÉJÀ dans Architecture Finale.md

- Block tree JSON, system prompt basique, tokens simples
- Multi-agent (Planner/Composer/Copywriter) — §15
- A/B testing basique — §28
- Upsell/Downsell flow avec VSL — §43
- Free Trial + Shipping anti-cancel — §38
- Offer Templates Library — §39
- Retention triggers timing — §40
- Multi-country payment processors — §41
- 45 tables DB existantes

---

## Ce qui manque (à ajouter)

### §45 — Design Token System (Code + Config)

**Source**: Réponses 8 et 9 (les plus complètes)

#### À documenter :
- [x] **Spacing scale** — 4px base, 12 steps (0→64px)
- [x] **Typography** — 2 fonts max (DM Serif Display + Inter), scale modulaire 1.25, 9 sizes, 5 weights, 4 line-heights
- [x] **4 Palettes par niche** pré-validées WCAG AA :
  - `health-warm` (rouge urgence CTA)
  - `beauty-clean` (tons dorés/nectar)
  - `supplement-bold` (orange high-energy)
  - `pet-friendly` (vert naturel)
  - + explication : l'agent choisit UNE palette, jamais de mix
- [x] **Border radius** — 6 valeurs (none→full), soft jamais sharp (look DTC premium)
- [x] **Shadows** — 4 niveaux, subtle only (heavy shadows = cheap)
- [x] **Breakpoints** — mobile 0px (DEFAULT), tablet 768px, desktop 1025px
- [x] **CTA dimensions** — min 52px mobile, 56px desktop, full-width mobile, auto desktop, 18px font bold
- [x] **Image aspect ratios** — hero 4:5, thumbnail 1:1, lifestyle 16:9, before/after 1:1, testimonial 1:1, product-in-use 4:5
- [x] **Page max-widths par type** — advertorial 720px, product 1024px, VSL 960px, checkout 520px, upsell 520px, quiz 640px
- [x] **TypeScript** — `DESIGN_TOKENS` const, `PaletteKey` type, exports

#### DB tables nécessaires :
- Pas de nouvelle table — c'est du code (tokens hardcoded dans le codebase)
- Eventuellement une table `brand_design_configs` pour overrides par brand (palette choice, font overrides)

---

### §46 — Block Composition Rules (par type de page)

**Source**: Réponse 9 (le plus complet)

#### À documenter :
- [x] **Règles par type de page** (10 types) :
  | Type | Required Sequence | Required Blocks | Forbidden Blocks | Max Blocks | Headline Max |
  |------|------------------|----------------|-----------------|------------|-------------|
  | product-page | hero → bundle → add-to-cart | hero, bundle, reviews, add-to-cart, guarantee, faq | form, quiz-step | 15 | 60 |
  | advertorial | hero | hero, reviews, cta | payment-form, order-summary, quiz-step | 20 | 80 |
  | VSL | hero → cta | hero, cta | payment-form, bundle, quiz-step | 8 | 50 |
  | checkout | order-summary → payment-form | order-summary, payment-form, trust-badges, guarantee | hero, countdown, reviews, comparison, carousel, quiz | 6 | 40 |
  | upsell | heading → bundle → add-to-cart | heading, bundle, add-to-cart, countdown | payment-form, faq, comparison, carousel, quiz | 6 | 50 |
  | downsell | heading → bundle → add-to-cart | heading, bundle, add-to-cart | payment-form, faq, reviews, carousel | 5 | 50 |
  | optin | hero → form | hero, form, trust-badges | payment-form, order-summary, bundle | 6 | 60 |
  | quiz | quiz-step | quiz-step | payment-form, order-summary, bundle, comparison | 10 | 40 |
  | thank-you | heading | heading | payment-form, countdown, bundle | 5 | 40 |
  | bridge | heading | heading, button | payment-form, order-summary | 4 | 50 |

- [x] **Explication du concept** : l'agent compose dans un cadre strict, pas de liberté totale
- [x] **TypeScript** — `PAGE_COMPOSITION_RULES` Record avec types

#### DB tables nécessaires :
- Pas de nouvelle table — c'est du code (règles hardcoded + extensibles via DB)

---

### §47 — CSS Design System Mobile-First (Le CSS complet)

**Source**: Réponse 9 (CSS le plus complet et production-ready)

#### À documenter :
- [x] **Reset + Base** — box-sizing, font-size 16px, antialiased, smooth scroll
- [x] **Sections (.funnel-section)** — padding 40px 16px mobile, alternance auto nth-child(even), max-width par type
- [x] **Typography** — heading serif (DM Serif Display), body sans (Inter), hiérarchie hero/section/card, line-height relaxed pour advertorial
- [x] **Buttons/CTAs** — full-width mobile, min 52px, border-radius 12px, touch feedback scale(0.97), safe-area iPhone
- [x] **Sticky CTA Bar** — fixed bottom, mobile only, safe-area-inset-bottom, hidden desktop
- [x] **Images** — wrapper avec overflow hidden, blur-up placeholder (zero CLS), object-fit cover, lazy loading
- [x] **Cards** — border 2px, radius 16px, selected state (border accent), popular badge (::before pseudo-element)
- [x] **Carousel** — scroll-snap x mandatory, peeking 85%, hidden scrollbar, touch scroll
- [x] **FAQ Accordion** — grid-template-rows animation, tap target 52px, rotate 45deg chevron
- [x] **Countdown** — boxes avec tabular-nums (pas de layout shift), fond secondary, blanc
- [x] **Trust Badges** — flex wrap, horizontal scroll sur mobile
- [x] **Reviews** — étoiles gold #F59E0B toujours, card surface, author muted
- [x] **Guarantee** — badge dashed border success, icone flex
- [x] **Patterns mobile DTC** (table récap) :
  - Sticky CTA bar (+15-30% conversion)
  - Peeking carousel (indique plus de contenu)
  - Alternating section bg (rythme visuel sans effort)
  - Badge "Most Popular" (ancre sociale)
  - Blur-up images (zero CLS)
  - Touch feedback scale(0.97)
  - Negative opt-out text
  - Serif heading + sans body

#### DB tables nécessaires :
- Aucune — CSS statique

---

### §48 — Validation Pipeline (8 passes)

**Source**: Réponses 8 et 9

#### À documenter :
- [x] **Pipeline diagram** : Schema → Composition → Design Token → Mobile Layout → Performance → Accessibility → Compliance → Lighthouse
- [x] **Pass 1: Schema (Zod)** — discriminated unions, chaque block a son schema, props validées
- [x] **Pass 2: Composition** — required blocks présents, forbidden absents, séquence respectée, max blocks
- [x] **Pass 3: Design Token** — couleurs = palette tokens uniquement, spacing = tokens uniquement, fonts = 2 max
- [x] **Pass 4: Mobile Layout (Puppeteer 375×812)** — overflow horizontal, tap targets ≥ 44px, CLS < 0.1, CTA au-dessus du fold, sections pas trop hautes (< 1200px), texte ≥ 14px
- [x] **Pass 5: Performance** — images ≤ 800KB total, ≤ 12 images, ≤ 3 fonts, CSS ≤ 50KB, DOM ≤ 800 nodes, zero JS (sauf tracking + Stripe)
- [x] **Pass 6: Accessibility** — contrast ≥ 4.5 (WCAG AA), alt text sur images, heading hierarchy, aria attributes
- [x] **Pass 7: Compliance** — Stripe elements bien placés, legal text présent, tracking pixels
- [x] **Pass 8: Lighthouse** — mobile preset, performance ≥ 90, accessibility ≥ 95
- [x] **Auto-retry** — max 3 tentatives avec feedback d'erreurs au LLM
- [x] **Quality score** — 0-100, -10 par erreur, -3 par warning, < 70 = auto-retry
- [x] **TypeScript** — `validateBlockTree()`, `ValidationResult`, orchestrator

#### DB tables nécessaires :
- Aucune nouvelle table — validation est du code
- Les résultats de validation sont stockés dans `funnel_pages` existant (champ rendered_html, status)

---

### §49 — A/B Testing State Machine (5 étapes)

**Source**: Réponse 8 (la plus complète)

#### À documenter :
- [x] **Diagramme state machine** :
  ```
  Sandbox (5-10% traffic)
    → Elimination (kill weak variants, p > 0.30)
    → Commando (2-3 forts, statistical significance p < 0.10)
    → Duel (50/50 split, p < 0.05)
    → Champion (100% traffic, pattern codifié)
  ```
- [x] **Gates statistiques** — Chi-squared test, p-value thresholds à chaque étape
- [x] **Traffic allocation** — sandbox 5-10%, elimination split equal, commando weighted, duel 50/50
- [x] **Minimum sample sizes** — 200 views pour sortir du sandbox, 1000+ pour commando
- [x] **TypeScript** — `Stage` type, `TRANSITIONS` array, `StageTransition` interface

#### DB tables nécessaires :
- [x] `experiments` — id, funnelPageId, name, stage, hypothesis, primaryMetric, trafficAllocation, minSampleSize, confidenceLevel, startedAt, endedAt, result
- [x] `variants` — id, experimentId, name, blockTree, designTokens, renderedHtml, trafficWeight, isControl
- [x] `conversions` — id, variantId, experimentId, visitorId, eventType (view/click_cta/add_to_cart/begin_checkout/purchase/subscription_created), revenue, metadata
- [x] **Index** — idx_conversions_variant, idx_conversions_experiment, idx_conversions_time

---

### §50 — RAG Pattern Engine (Feedback Loop)

**Source**: Réponse 8 (la plus complète)

#### À documenter :
- [x] **Flow complet** :
  ```
  Champion trouvé
    → Diff block trees (winner vs loser)
    → Classifier le pattern type
    → Calculer lift %
    → Générer SOP description (LLM)
    → Stocker winning_pattern
    → Créer RAG document
    → Générer embedding (pgvector)
  ```
- [x] **Pattern types** — hero_layout, cta_placement, bundle_order, testimonial_count, cta_copy, etc.
- [x] **SOP Promotion Pipeline** :
  - candidate → 3+ expériences indépendantes = validated
  - validated → 5+ expériences + lift > 10% + confidence > 95% = SOP
  - SOP → auto-update block template defaults
- [x] **Agent Context Building** :
  1. Brand manifest (tokens, voice)
  2. Vector search winning patterns (top 10)
  3. Competitor intelligence (si dispo)
  4. Page-type scaffold
  → Injecté dans le prompt agent comme section "Proven Winning Patterns"
- [x] **RAG Document format** — PATTERN, PAGE TYPE, VERTICAL, LIFT, CONFIDENCE, SAMPLE, DESCRIPTION, BLOCK SIGNATURE, STATUS
- [x] **Pattern deprecation** — les patterns qui arrêtent de gagner sont auto-dépréciés

#### DB tables nécessaires :
- [x] `winning_patterns` — id, patternType, pageType, vertical, description, blockSignature, liftPercent, confidence, sampleSize, experimentIds, embedding, status (candidate/validated/sop/deprecated)
- [x] `rag_documents` — id, sourceType (winning_pattern/experiment_result/brand_guideline/competitor_analysis), content, metadata, embedding

---

### §51 — Block Composer System Prompt (Template)

**Source**: Réponse 9

#### À documenter :
- [x] **Structure du prompt** :
  1. Role definition ("You are a DTC e-commerce page designer")
  2. Constraints (MOBILE FIRST, tokens only, blocks only, page rules)
  3. Page Type Guide (spécifique par type — structure, key points)
  4. Mobile Design Rules (CTAs, text, spacing, images, colors, typography, padding, above fold)
  5. Output Format (JSON block tree structure)
  6. Marketing Angle Injection (headline → hero, ctaText → ALL CTAs, benefits → list, etc.)
- [x] **10 Page Type Guides** — product-page, advertorial, VSL, checkout, upsell, downsell, optin, quiz, thank-you, bridge
- [x] **Règle clé** : ne JAMAIS reformuler le message de l'angle marketing
- [x] **TypeScript** — `BLOCK_COMPOSER_SYSTEM_PROMPT` template string

#### DB tables nécessaires :
- Aucune — c'est du code (prompt template)

---

## Résumé : Nouvelles sections à ajouter

| # | Section | Lignes estimées | Nouvelles tables | Source principale |
|---|---------|----------------|-----------------|-------------------|
| §45 | Design Token System | ~150 | 0-1 (brand_design_configs optionnel) | Réponses 8, 9 |
| §46 | Block Composition Rules | ~120 | 0 | Réponse 9 |
| §47 | CSS Design System Mobile-First | ~200 | 0 | Réponse 9 |
| §48 | Validation Pipeline | ~200 | 0 | Réponses 8, 9 |
| §49 | A/B Testing State Machine | ~150 | 3 (experiments, variants, conversions) | Réponse 8 |
| §50 | RAG Pattern Engine | ~180 | 2 (winning_patterns, rag_documents) | Réponse 8 |
| §51 | Block Composer System Prompt | ~150 | 0 | Réponse 9 |
| | **TOTAL** | **~1150 lignes** | **5-6 nouvelles tables** | |

---

## Ce que j'ai de UNIQUE (pas dans les autres IA)

Déjà dans Architecture Finale.md, pas besoin d'ajouter :
- ✅ Upsell/Downsell flow avec VSL intégrée (§43)
- ✅ Free Trial + Shipping anti-cancel strategy (§38)
- ✅ Offer Templates Library 10 templates (§39)
- ✅ Retention triggers timing J+3, J-7, J-3 (§40)
- ✅ Multi-country payment processors (§41)
- ✅ Subscription milestones + promo auto-detection (§40)

---

## Ordre d'exécution

**STATUT: ARCHITECTURE COMPLETE (§45-§52 toutes intégrées)**

Prochaine phase = CODAGE du funnel builder.

### Phase CODAGE (ordre) :
1. Design tokens TypeScript (`src/design-system/tokens.ts`) — §45
2. Composition rules TypeScript (`src/design-system/composition-rules.ts`) — §46
3. CSS mobile-first (`src/design-system/mobile-first.css`) — §47
4. Block Composer prompt (`src/agents/prompts/block-composer.ts`) — §51
5. Validation pipeline (`src/validation/`) — §48
6. A/B state machine (`src/services/experiment-state-machine.ts`) — §49
7. RAG pattern engine (`src/services/pattern-codifier.ts`) — §50

### VALIDATION POST-CODAGE :
- Comparer avec HTML winners (user fournit APRÈS) → ajuster tokens/rules si nécessaire

---

## À DEMANDER à l'utilisateur

- [x] Les fichiers HTML de winners (pages gagnantes) — pour enrichir le design system avec des vrais patterns
- [x] Les exemples de pages upsell avec VSL — pour §43
- [x] Confirmer l'ordre d'exécution ou priorités
- [x] Vouloir intégrer les nouvelles tables dans le count (45 → 50-51 tables)
