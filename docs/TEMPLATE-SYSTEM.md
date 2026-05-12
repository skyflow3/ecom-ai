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
| `upsell-vibriance` | Upsell OTO1 Volume Deal | varies | `upsell-filler.ts` | (per OTO position) | 9.1/10 avg |
| `upsell-cross-sell` | Upsell OTO2 Cross-Sell | varies | `upsell-filler.ts` | (per OTO position) | 9.1/10 avg |
| `upsell-product` | Upsell OTO3+OTO4 Cross-Sell | varies | `upsell-filler.ts` | (per OTO position) | 9.1/10 avg |
| `upsell-protection` | Upsell OTO5 Protection | varies | `upsell-filler.ts` | (per OTO position) | 9.1/10 avg |

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
Le template détecte automatiquement le pays du visiteur via 2 méthodes :
1. **Client-side**: `geolocation-db.com/json/` — détecte l'IP du visiteur (pays + région)
2. **Server-side fallback**: `/api/geo` — proxy server-side si l'API client échoue

80+ pays sont inclus dans la dropdown. State/Province est un champ texte libre.
Le pays est pré-sélectionné automatiquement dans les dropdowns shipping + billing.

**POURQUOI 2 méthodes**: Les APIs externes (ipwhois.app, ipapi.co) renvoient 403 quand le navigateur
envoie un header `Origin`. `geolocation-db.com` est la seule API qui accepte les requêtes CORS avec Origin.

### Google Places Autocomplete
Le champ Street Address propose des suggestions d'adresse via Google Places API.
- Clé API configurée via le marker `{{google_places_api_key}}`
- Fonctionne sur les champs `#shipAddress1` et `#address1`
- Remplit automatiquement ville, état, zip, pays après sélection

**PRÉREQUIS Google Cloud Console**:
- Activer **Maps JavaScript API** et **Places API** dans API Library
- Configurer la clé API (pas de restriction Application nécessaire)

### Warranty auto-hide
Le bloc warranty ("2-Year Protection") s'affiche ou se cache automatiquement selon le type de produit :
- **Produit physique/durable** (électronique, appareil, outil) → `hasWarranty: true` → bloc visible
- **Produit consommable** (suppléments, cosmétiques, huiles, nourriture) → `hasWarranty: false` → bloc caché

L'IA détecte automatiquement le type de produit depuis la description et set le flag `hasWarranty`.
Le marker `{{warranty_display}}` contrôle la visibilité (`display:block` / `display:none`).

### Affichage shipping
Le texte barré dans la section shipping montre la valeur du shipping :
- **Bundle x1**: `~~$4.95 worth~~ $4.95`
- **Bundle x3**: `~~$4.95 worth~~ FREE`
- **Bundle x6**: `~~$4.95 worth~~ FREE`

Les valeurs `shipSpan` et `shipValue` dans chaque bundle du brief contrôlent ce display.

### API Routes (serveur)
| Route | Rôle |
|-------|------|
| `/api/checkout-preview` | Sert le HTML checkout depuis `public/checkout-preview.html` |
| `/api/geo` | Proxy géolocalisation (server-side, bypass CORS) |

---

## Upsell Templates — Guide pour Agent IA (ZERO MEMORY)

### Architecture du funnel upsell

Le systeme genere **5 pages OTO (One-Time Offer)** qui s'enchainerent apres le checkout. Chaque OTO a un role psychologique distinct:

```
CHECKOUT → OTO1 → OTO2 → OTO3 → OTO4 → OTO5 → Thank You
              │       │       │       │       │
              │       │       │       │       └─ Protection (perte/vol colis)
              │       │       │       └───────── Surprise multi-use
              │       │       └───────────────── Premium cross-sell
              │       └───────────────────────── Complementaire (AM/PM)
              └───────────────────────────────── Volume deal (same product)
```

### 4 templates, 5 OTO positions

| Position | Template ID | Type | Role psychologique | Exemple Vibriance |
|----------|------------|------|--------------------|--------------------|
| OTO1 | `upsell-vibriance` | `same_product` | Desir + quantite → "achetez plus du meme a prix reduit" | 3x Super C Serum au lieu de $79 → $XX |
| OTO2 | `upsell-cross-sell` | `cross_sell` | Complementarite → "routine complete AM/PM" | Retinol Serum pour le soir |
| OTO3 | `upsell-product` | `cross_sell` | Premium → "zone probleme specifique" (body_extra) | Eye Renewal pour le contour des yeux |
| OTO4 | `upsell-product` | `cross_sell` | Surprise → "astuce inattendue" (ingredients) | Moisturizing Cream = hand cream portable |
| OTO5 | `upsell-protection` | `protection` | Peur de perte → "protection contre vol/perte" | Porch Pirates protection |

### Prompt: `src/agents/prompts/upsell-filler.ts`

Un seul prompt gere les 5 positions OTO. Il contient:

**Position psychology** — chaque OTO a une structure de persuasion differente:
- OTO1: Anchoring (competitor price) → Volume deal → FOMO rejection
- OTO2: Social proof opening (80%) → Complementarity → AM/PM routine
- OTO3: Aspirational headline → Premium positioning → Specific benefit
- OTO4: Surprise multi-use → "Vous n'y aviez pas pense" → Reveal
- OTO5: Threat statistics → Identity ("Don't Be The Next Victim") → Protection CTA

**Type-specific rules** — 4 types de contenu:
- `same_product`: Volume discount, supply talk ("3-month supply"), competitor anchoring
- `cross_sell`: Complementarity, "routine complete", specific benefit
- `protection`: Threat statistics, identity fear, "AGAINST LOSS & THEETH"
- `subscription`: Auto-ship savings, convenience, "never run out"

**Category vocabulary** — adapte le vocabulaire au type de produit:
- `consumable`: "supply", "bottle", "capsule", "scoop" (ex: supplements, serums)
- `device`: "unit", "device", "system" (ex: air purifier, massager)
- `apparel`: "pair", "item", "piece" (ex: shoes, clothing)
- `digital`: "access", "program", "guide" (ex: ebook, course)

### 16 techniques Vibriance (integrees dans le prompt)

Ces techniques sont extraites des pages upsell gagnantes de Vibriance et injectees dans le prompt selon la position OTO:

| # | Technique | Position | Description |
|---|-----------|----------|-------------|
| 1 | Competitor price anchoring | OTO1 | Compare a un prix concurrent ($79) pour ancrer la valeur |
| 2 | Rejection with retail reminder | OTO1 | "No thanks, I prefer paying full retail price" |
| 3 | "80% social proof" opening | OTO2 | "80% of customers also add..." |
| 4 | "WARNING:" exclusivity | OTO1-2 | Framing d'exclusivite, acces limite |
| 5 | "FIRST & ONLY" USP | OTO2-3 | Positionnement unique du produit |
| 6 | AM/PM protocol | OTO2 | Routine matin/soir pour justifier le cross-sell |
| 7 | FOMO double scarcity | OTO1 | Scarcite sur le prix ET la quantite |
| 8 | "Take Years Off" aspirational | OTO3 | Headline aspirationale ( resultat visible ) |
| 9 | 4 named ingredients | OTO3-4 | Plus credible que 3 ( nombre pair = recherché ) |
| 10 | Social pain-pierce | OTO3-4 | "people saying you look tired" → emotional trigger |
| 11 | Surprise multi-use tip | OTO4 | "purse hand cream" → usage inattendu |
| 12 | Package loss statistics | OTO5 | Chiffres specifiques sur les pertes de colis |
| 13 | "Don't Be The Next Victim" | OTO5 | Identity threat, peur de la perte |
| 14 | Protection-specific CTA | OTO5 | "PROTECT AGAINST LOSS & THEETH" |
| 15 | Guilt-trip rejection | OTO5 | "No thanks, I'm OK with theft risk" |
| 16 | Product-specific CTAs | All | CTA adapte au type de produit et position |

### OTO3 vs OTO4: meme template, zones differentes

OTO3 et OTO4 partagent le template `upsell-product` mais utilisent des zones differentes:
- **OTO3**: utilise la zone `body_extra` (zone supplementaire dans le corps)
- **OTO4**: utilise la zone `ingredients` (liste d'ingredients)

CSS fix: `#ibodyextra` in `upsell-product.marked.html` matches `#i9gchl` styling (Poppins 20px, centered).

### No country references

OTO5 (protection) n'utilise JAMAIS de reference a un pays specifique. Au lieu de "40% of Americans", utilise "Over 40% of packages". Le prompt `upsell-filler.ts` enforce cette regle.

### Test commands

```bash
npx tsx scripts/test-upsell-oto1.ts   # OTO1 - volume deal (Super C Serum)
npx tsx scripts/test-upsell-oto2.ts   # OTO2 - cross-sell (Retinol Serum)
npx tsx scripts/test-upsell-oto3.ts   # OTO3 - cross-sell (Eye Renewal, body_extra)
npx tsx scripts/test-upsell-oto4.ts   # OTO4 - cross-sell (Moisturizing Cream, ingredients)
npx tsx scripts/test-upsell-oto5.ts   # OTO5 - protection (Porch Pirates)
```

### Score

Score moyen: **9.1/10** (amelioration de 6.7/10 avant les techniques Vibriance).

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
| **upsell templates (avg 5 OTO)** | **9.1/10** | DeepSeek, upsell-filler, 16 Vibriance techniques |
| **product-page-tryemsense** | **8.77/10** | DeepSeek, product page, 129 slots |
| **checkout-clarifion** | **N/A (checkout)** | DeepSeek, 127/127 slots, 3-bundle OK |
