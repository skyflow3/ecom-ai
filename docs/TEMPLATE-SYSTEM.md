# TEMPLATE SYSTEM — Pipeline HTML complet

**POURQUOI ce fichier**: Le système de templates est complexe mais n'est nécessaire que quand on travaille dessus.
CLAUDE.md reste lean — ce fichier n'est lu que quand c'est pertinent.

---

## Architecture

Le système génère des pages HTML complètes à partir de templates winners. 99.9% de fidélité visuelle.

```
FLOW:
  ProductBrief → AI génère JSON (content map) → template-engine remplit {{SLOT}} markers → HTML final

FICHIERS PAR TEMPLATE:
  templates/{id}.html            ← HTML original du winner (NE PAS MODIFIER)
  templates/{id}.marked.html     ← HTML avec {{SLOT}} markers (texte produit remplacé)
  templates/{id}.html.json       ← Config des slots (description, example, ai_generated)
```

### Fichiers critiques du système

| Fichier | Rôle |
|---------|------|
| `src/services/template-engine.ts` | Moteur de remplissage (markers + zones + images + sanitisation HTML) |
| `src/services/template-generator.ts` | Orchestrateur (ProductBrief → AI JSON → HTML rempli). Route vers le bon prompt. |
| `src/agents/prompts/template-filler.ts` | Prompt advertorial narratif (SmoothSpire). Type `ProductBrief`. |
| `src/agents/prompts/reasons-why-filler.ts` | Prompt listicle (hike-reasons-why, Champion #4 D5_Lite) |

---

## Templates disponibles

| Template ID | Format | Slots | Prompt | Judge Config | Score validé |
|-------------|--------|-------|--------|--------------|--------------|
| `smoothspire-advertorial` | Advertorial narratif | 47 | `template-filler.ts` | advertorial_judge_v2.json | 9.76/10 |
| `hike-reasons-why` | Listicle "10 Reasons Why" | 72 | `reasons-why-filler.ts` | advertorial_listicle_judge_v2.json | 9.23-10.41/10 |
| `product-page-tryemsense` | Product Page DTC | 129 | `product-page-filler.ts` | product_page_judge_v2.json | 8.77/10 |
| `checkout-clarifion` | Checkout/Order Page | 127 | `checkout-filler.ts` | (no judge yet) | 127/127 slots OK |

---

## Comment utiliser

### CLI (tests)

```bash
# Test advertorial narratif (SmoothSpire template)
npx tsx scripts/test-template-generate.ts

# Test listicle "Reasons Why" (hike-2 template)
npx tsx scripts/test-reasons-why-template.ts
```

### Programmatique

```typescript
import { generateFromTemplate } from './src/services/template-generator';
import type { ProductBrief } from './src/agents/prompts/template-filler';

const brief: ProductBrief = {
  name: 'Mon Produit',
  description: 'Description du produit...',
  niche: 'Health & Wellness',
  targetAudience: 'Women 40-65',
  benefits: ['Benefit 1', 'Benefit 2'],
  price: '$49', originalPrice: '$119', discountPct: '58%',
  guarantee: '90-Day Money-Back Guarantee',
  mechanismName: 'Mon Mécanisme Unique',
  authorPersona: 'Dr. Smith, MD',
  categoryBadge: 'Health',
  ratingCount: '4,891',
  doctorImageUrl: 'https://...',
  productImageUrl: 'https://...',
  productImageSquareUrl: 'https://...',
};

const config = {
  apiUrl: process.env.DEEPSEEK_API_URL,
  apiKey: process.env.DEEPSEEK_API_KEY,
  model: 'deepseek-chat',
  temperature: 0.3,
  maxTokens: 8192,
};

const result = await generateFromTemplate('hike-reasons-why', brief, config, './output');
// result.outputPath = chemin du HTML généré
```

---

## Routage automatique

`template-generator.ts` route automatiquement vers le bon prompt selon le template ID :

```typescript
function buildPromptForTemplate(templateId: string, brief: ProductBrief): string {
  if (templateId.startsWith('hike-reasons-why')) {
    return buildReasonsWhyPrompt(brief);        // Listicle, Champion #4
  }
  if (templateId.startsWith('product-page')) {
    return buildProductPageFillerPrompt(brief); // Product Page DTC
  }
  if (templateId.startsWith('checkout')) {
    return buildCheckoutFillerPrompt(brief);    // Checkout/Order page
  }
  return buildTemplateFillerPrompt(brief);      // Advertorial narratif (default)
}
```

**Ajouter un nouveau template** : ajouter une condition dans cette fonction.

---

## Checkout Template — Guide pour Agent IA (ZERO MEMORY)

### Ce que l'agent IA doit savoir

Le template `checkout-clarifion` génère des **pages de checkout/order** complètes avec:
- 3 ou 4 bundles de prix (configurable)
- Formulaire de paiement Stripe + PayPal
- Gallery produit (5 images)
- 3 témoignages
- 11 FAQ
- Urgence (timer 10 min)
- Warranty upsell
- 127 slots au total

### Ce que l'agent doit fournir (CheckoutBrief)

L'agent DOIT fournir ces valeurs dans le `CheckoutBrief` :

**OBLIGATOIRE (le template ne fonctionnera pas sans):**
1. **Product info**: `name`, `namePlural`, `productType`, `description`, `niche`, `targetAudience`, `benefits`
2. **Bundle pricing** (array `bundles`): 3 ou 4 bundles avec:
   - `id`: identifiant unique (ex: "1x-unit")
   - `label`: texte affiché (ex: "50% OFF: 3 AirPures")
   - `qtyLabel`: quantité (ex: "3x")
   - `unitPrice`, `comparePrice`, `totalPrice`, `compareTotal`, `totalDiscount`
   - `shipSpan`, `shipValue`, `shipping`, `img`, `priceDisplay`, `compareDisplay`
3. **Stripe**: `stripeApiEndpoint` (endpoint `/create-payment-intent` de votre backend)
4. **URLs**: `checkoutBaseUrl`, `checkoutUrl`, `stripeRedirectBaseUrl`
5. **Legal URLs**: `termsUrl`, `privacyUrl`, `refundUrl`
6. **Images**: `productAssetsBaseUrl`, `galleryBaseUrl`, `galleryImages` (5 filenames), `logoUrl`, `brandImageUrl`

**OPTIONNEL:**
- `warranty`: si absent, le slot warranty sera vide
- Bundle 4: si seulement 3 bundles, bundle 4 sera automatiquement caché (`display:none`)

### Ce que l'AI génère automatiquement (pas besoin de fournir)
- Hero headline, feature bullets (4), urgency text
- 3 témoignages (name + headline + text)
- 11 FAQ (questions + réponses)
- Discount applied text

### Exemple d'utilisation

```typescript
import { generateFromTemplate } from './src/services/template-generator';
import type { CheckoutBrief } from './src/agents/prompts/checkout-filler';

const brief: CheckoutBrief = {
  name: 'AirPure',
  namePlural: 'AirPures',
  productType: 'Air Purifier',
  description: 'Compact negative ion air purifier...',
  niche: 'Home & Wellness',
  targetAudience: 'Homeowners with allergies',
  benefits: ['Eliminates 99% allergens', 'No filter needed'],
  price: '$19.67', originalPrice: '$79.00', discountPct: '50%',
  guarantee: '30-Day Money-Back Guarantee',
  mechanismName: 'Negative Ion Technology',
  authorPersona: 'Air Quality Expert',
  bundles: [
    { id: '1x', label: '1 AirPure', qtyLabel: '1x', unitPrice: '$39.00', ... },
    { id: '3x', label: '50% OFF: 3 AirPures', qtyLabel: '3x', unitPrice: '$19.67', ... },
    { id: '6x', label: '60% OFF: 6 AirPures', qtyLabel: '6x', unitPrice: '$15.83', ... },
  ],
  warranty: { description: '2-Year Protection', duration: '2 Years', price: '$9.99', priceNum: '9.99' },
  checkoutBaseUrl: 'https://checkout.example.com',
  stripeApiEndpoint: 'https://api.example.com/create-payment-intent',
  stripeRedirectBaseUrl: 'https://checkout.example.com',
  checkoutUrl: 'https://checkout.example.com/order',
  termsUrl: 'https://example.com/terms',
  privacyUrl: 'https://example.com/privacy',
  refundUrl: 'https://example.com/refund',
  productAssetsBaseUrl: 'cdn.example.com/assets/',
  galleryBaseUrl: 'cdn.example.com/gallery/',
  galleryImages: ['front.webp', 'side.webp', 'top.webp', 'box.webp', 'use.webp'],
  logoUrl: 'https://cdn.example.com/logo.png',
  brandImageUrl: 'https://cdn.example.com/brand.png',
};

const result = await generateFromTemplate('checkout-clarifion', brief, config, './output');
```

### Support 3 vs 4 bundles
- **3 bundles**: Fournir 3 éléments dans le tableau `bundles`. Le 4e bundle sera automatiquement caché.
- **4 bundles**: Fournir 4 éléments. Le 4e sera visible.

### Flux de paiement (Stripe)
1. Client choisit un bundle → JS sélectionne les données du bundle dans le tableau `items[]`
2. Client remplit le formulaire de paiement
3. Client clique "Payer" → `processStripePayment()` appelle `stripeApiEndpoint`
4. Votre backend crée un PaymentIntent Stripe avec le montant du bundle sélectionné
5. Stripe confirme le paiement → redirect vers `stripeRedirectBaseUrl`

**IMPORTANT**: Les prix affichés dans le HTML doivent correspondre exactement aux prix envoyés à Stripe.
Le template injecte les prix du `CheckoutBrief.bundles` → ils sont garantis corrects.

### Flux de paiement (PayPal)
Le bouton PayPal est visuel uniquement (background image). Pour un vrai paiement PayPal, il faut ajouter le SDK PayPal JS et un handler de paiement dans le template.

### Auto-détection du pays
Le template détecte automatiquement le pays du visiteur via `ipapi.co` et pré-sélectionne le pays dans les dropdowns shipping/billing.
80+ pays sont inclus dans la dropdown. State/Province est un champ texte libre (pas de dropdown — trop de régions pour tous les pays).

---

## Sanitisation HTML (CRITIQUE)

`template-engine.ts` sanitize automatiquement le contenu AI AVANT injection via `sanitizeHtmlContent()` :

- Ferme les `<strong>`, `<em>`, `<b>`, `<i>`, `<span>` orphelins
- Supprime les `</div>` parasites
- S'applique uniquement aux slots `ai_generated: true`

**POURQUOI**: L'IA génère parfois des tags non fermés (ex: `<strong class="">text` sans `</strong>`).
Ces tags corrompent la structure DOM → le JS ne trouve plus ses éléments → sticky bar, progress bar, countdown cassés.

**TEST**: Après chaque génération, vérifier les tag counts :
```bash
# Les div/strong/em doivent tous être à diff=0
python3 -c "
import re
for tag in ['div','strong','em']:
    # comparer base vs généré
"
```

---

## Remplacement d'images

Chaque template a son propre mapping dans `TEMPLATE_IMAGE_MAP` (template-engine.ts).

### SmoothSpire (Shopify CDN)
- `productHero`: Image hero principal
- `productCta`: Image produit dans sections CTA
- `authorPhoto`: Photo auteur/docteur
- `commentScreenshots`: Screenshots de commentaires

### Hike-2 (Webflow CDN)
- `productCta`: `HF%20Stride%20Transparant`
- `productCompare`: `HIKE_FOOTWEAR_BLACK`
- `authorPhoto`: `Lorax%20Pro%20Barefoot`
- `sidebarPlaceholder`: `683f59f83bf92662dad61988_1x1`
- `reasonImages`: `placehold.co/766x883` (toutes les 10 reason images)

Les images passent via le `ProductBrief` :
- `doctorImageUrl` → remplace la photo auteur
- `productImageUrl` → remplace les images produit (landscape)
- `productImageSquareUrl` → remplace les images produit (square/portrait)

---

## Ajouter un nouveau template (guide pas-à-pas)

1. **HTML original**: Copier le HTML winner dans `templates/{id}.html` (NE PAS modifier)
2. **Marquer les slots**: Créer `templates/{id}.marked.html`
   - Remplacer chaque texte produit par `{{slot_name}}`
   - Garder TOUT le HTML/CSS/JS intact
   - Les numéros de reasons restent hardcoded dans le HTML (pas dans les markers)
3. **Config slots**: Créer `templates/{id}.html.json`
   - Chaque slot: `{ "description": "...", "example": "...", "ai_generated": true/false }`
   - Les slots `ai_generated: true` seront sanitizés avant injection
4. **Prompt**: Créer `src/agents/prompts/{id}-filler.ts`
   - Utiliser `build{TemplateId}Prompt(brief: ProductBrief): string`
   - Inclure: patterns des winners, scoring rules du judge, format de sortie JSON
5. **Routage**: Ajouter dans `template-generator.ts` → `buildPromptForTemplate()`
6. **Images**: Ajouter les needles dans `TEMPLATE_IMAGE_MAP` dans `template-engine.ts`
7. **Test**: Créer `scripts/test-{id}.ts` avec 2+ ProductBriefs
8. **Valider**: Score ≥ 8.0/10 + HTML visuellement correct dans navigateur + JS fonctionne

### Checklist post-intégration
- [ ] Tous les `{{SLOT}}` remplis (0 empty)
- [ ] Tags HTML équilibrés (div, strong, em = diff 0)
- [ ] Pas de texte hardcoded du produit original qui traîne
- [ ] JS fonctionne (sticky bar, progress bar, countdown si applicable)
- [ ] Images remplacées (vérifier dans le HTML final)
- [ ] Score judge ≥ 8.0/10

---

## Score Benchmarks (templates)

| Template | Score | Conditions |
|----------|-------|------------|
| **hike-reasons-why (HF Stride)** | **10.41/10** | DeepSeek, listicle, 72 slots, sanitization |
| **smoothspire-advertorial** | **9.76/10** | DeepSeek, advertorial, 47 slots |
| **hike-reasons-why (Nutrovia)** | **9.23/10** | DeepSeek, listicle, 72 slots, sanitization |
| **product-page-tryemsense** | **8.77/10** | DeepSeek, product page, 129 slots |
| **checkout-clarifion** | **N/A (checkout)** | DeepSeek, 127/127 slots, 3-bundle OK |
