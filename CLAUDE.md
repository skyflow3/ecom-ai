# CLAUDE.md — ECOM-AI (Production Hub AUTONOME)

## OBLIGATOIRE: LECTURE DE DEMARRAGE (AVANT TOUTE ACTION)

**CECI EST LA PREMIERE CHOSE QUE TU LIS. TU NE PEUX PAS CODER AVANT D'AVOIR LU CES FICHIERS.**

**POURQUOI**: Tu es une IA sans mémoire. Chaque session, chaque /compact = perte totale du contexte.
Ces fichiers CONTIENNENT ton contexte. Sans eux, tu codes à l'aveugle et tu casses l'architecture.

```
LECTURE OBLIGATOIRE AVANT CHAQUE SESSION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. CE FICHIER (CLAUDE.md)              ← Structure, règles, stack, conventions
2. Architecture Finale.md              ← Architecture complète (7400 lignes, source de vérité)
3. Agent Prompt Architecture.md        ← Pipeline agent, composition engine, block grammar
4. progress.txt                        ← Ce qui a été fait, ce qui reste, patterns importants
5. docs/TEMPLATE-SYSTEM.md             ← Pipeline templates HTML (si tu touches aux templates)

LECTURE OBLIGATOIRE AVANT DE TOUCHER AU CODE:
- Relire les sections de "Architecture Finale.md" liées à ta tâche
- Relire "Agent Prompt Architecture.md" si tu touches aux agents/renderers
- Relire "docs/TEMPLATE-SYSTEM.md" si tu touches aux templates
- Relire "progress.txt" pour connaître l'état actuel et les patterns
```

**APRÈS CHAQUE ACTION MAJEURE** (code écrit, fichier créé, bug fixé):
1. Relire les sections concernées de `Architecture Finale.md`
2. Vérifier cohérence avec `progress.txt`
3. Mettre à jour `progress.txt` (APPEND, jamais replace)

**APRÈS CHAQUE /compact OU PERTE DE CONTEXTE**:
→ Re-lire les 4 fichiers ci-dessus AVANT de continuer à coder.

## Zero Memory Rule
Chaque session commence avec ZERO mémoire. Le code doit s'auto-expliquer.
Tu écris pour TOI-MÊME dans une future session avec ZERO mémoire.
But: < 30s pour comprendre un fichier, contexte minimal pour reprendre le travail.

## REGLE OBLIGATOIRE: Fin de session

**AVANT de terminer une session**:
1. Mettre à jour `progress.txt` avec l'état actuel (APPEND, jamais replace)
2. Vérifier que `PLAN-DESIGN-SYSTEM.md` est à jour (checkboxes, statut)
3. Vérifier que `Architecture Finale.md` est cohérent avec le plan
4. Noter les NEXT STEPS pour la prochaine session

## UTILISATEUR
- Entrepreneur non-développeur
- Parle français — répondre en français, code en English
- Ne JAMAIS poser de questions techniques — explorer soi-même
- Le plus lazy guy on earth — ne jamais demander quelque chose qu'on peut faire soi-même

---

## PREMIÈRES 2 MINUTES (Protocole de démarrage)

```
1. Lire CLAUDE.md (CE FICHIER) — comprendre la structure + règles
2. Lire CHAMPION-PROMPTS-DEPLOY.md — avoir les prompts champions
3. Lire docs/COPYWRITING-SYSTEM.md — règles de production copywriting
4. python verify_consistency.py --pre-test   ← OBLIGATOIRE, bloque si incohérent
5. Vérifier .env: load_dotenv() + print les clés API
6. Pre-flight: ping MiMo + DeepSeek APIs
7. Si tout OK → lancer la production
8. Si API down → diagnostiquer + fixer AVANT de produire
```

---

## OBJECTIF
Hub de production AUTONOME pour le business e-commerce. Contient TOUT pour produire du contenu marketing sans dépendre d'aucun autre projet.
- Prompts champions validés (lab-tested)
- Judge configs pour auto-évaluation
- Ressources marketing (frameworks, SOPs, exemples gagnants)
- Pipeline vidéo AI complet

---

## STRUCTURE

```
ECOM-AI/
├── CLAUDE.md                         ← CE FICHIER (entrée point)
├── content_producer.py               ← PIPELINE TEXTE (génère + juge contenu)
├── media_executor.py                 ← PIPELINE MÉDIA (image, vidéo, voix, montage)
├── verify_consistency.py             ← Checks auto (judge configs, fichiers, sync)
├── CHAMPION-PROMPTS-DEPLOY.md        ← TOUS les prompts champions + architecture
│
├── templates/                        ← TEMPLATES HTML WINNERS (pipeline template)
│   ├── smoothspire-advertorial.html       Advertorial narratif original (Winner)
│   ├── smoothspire-advertorial.marked.html  Version avec {{SLOT}} markers
│   ├── smoothspire-advertorial.html.json    Config des slots (47 slots)
│   ├── hike-reasons-why.html              Listicle "10 Reasons Why" original (Winner)
│   ├── hike-reasons-why.marked.html       Version avec {{SLOT}} markers (72 slots)
│   └── hike-reasons-why.html.json         Config des slots
│   ├── checkout-clarifion.html            Checkout original (127 slots, 3/4 bundles)
│   ├── checkout-clarifion.marked.html     Version avec {{SLOT}} markers + geo + Places
│   └── checkout-clarifion.html.json       Config des slots
│   ├── upsell-vibriance.marked.html       Upsell OTO1 volume deal (same_product)
│   ├── upsell-vibriance.html + .json
│   ├── upsell-cross-sell.marked.html      Upsell OTO2 cross-sell (AM/PM routine)
│   ├── upsell-cross-sell.html + .json
│   ├── upsell-product.marked.html         Upsell OTO3+OTO4 cross-sell (body_extra/ingredients)
│   ├── upsell-product.html + .json
│   └── upsell-protection.marked.html      Upsell OTO5 protection (package loss)
│       upsell-protection.html + .json
│
├── src/
│   ├── services/
│   │   ├── template-engine.ts          Moteur de remplissage (markers + zones + images)
│   │   ├── template-generator.ts       Orchestrateur (ProductBrief → AI JSON → HTML rempli)
│   │   ├── funnel-generator.ts         Funnel orchestrateur (variants + CTA wiring + router)
│   │   ├── cta-injector.ts             CTA URL post-processor (regex structural targeting)
│   │   ├── variant-router.ts           Client-side A/B traffic splitter HTML generator
│   │   ├── funnel-metrics.ts           JSON-file A/B metrics tracking
│   │   ├── page-generator.ts           Block system (AI compose blocks → HTML)
│   │   └── content-judge.ts            Juge V5 Council (3 personas)
│   ├── agents/prompts/
│   │   ├── template-filler.ts          Prompt advertorial narratif (SmoothSpire)
│   │   ├── reasons-why-filler.ts       Prompt listicle (hike-reasons-why, Champion #4)
│   │   ├── product-page-filler.ts      Prompt product page DTC (tryemsense)
│   │   ├── checkout-filler.ts          Prompt checkout (clarifion, 127 slots, warranty auto-hide)
│   │   ├── upsell-filler.ts            Prompt upsell OTO1-5 (16 Vibriance techniques)
│   │   ├── funnel-filler.ts            Prompt auto-config (product brief → FunnelConfig)
│   │   └── block-composer.ts           Composer de blocks (3-step pipeline)
│   └── design-system/
│       └── tokens.ts                   Design tokens + page types
│
├── src/app/api/
│   ├── checkout-preview/route.ts       Sert le HTML checkout depuis public/
│   └── geo/route.ts                    Proxy géolocalisation (bypass CORS 403)
│
├── scripts/
│   ├── test-template-generate.ts       Test SmoothSpire advertorial
│   ├── test-reasons-why-template.ts    Test hike-reasons-why listicle
│   ├── test-product-page-template.ts   Test product page
│   ├── test-checkout-template.ts       Test checkout page (3-bundle, $4.95 shipping)
│   ├── test-upsell-oto1.ts             Test upsell OTO1 (volume deal, Super C Serum)
│   ├── test-upsell-oto2.ts             Test upsell OTO2 (cross-sell, Retinol Serum)
│   ├── test-upsell-oto3.ts             Test upsell OTO3 (cross-sell, Eye Renewal)
│   ├── test-upsell-oto4.ts             Test upsell OTO4 (cross-sell, Moisturizing Cream)
│   └── test-upsell-oto5.ts             Test upsell OTO5 (protection, Porch Pirates)
│
├── capabilities/                     ← CAPACITÉS MÉDIA
│   ├── voice_gen.py                     ElevenLabs (text → audio)
│   ├── image_gen.py                     ComfyUI Flux.2 Klein + LoRA (prompt → image)
│   ├── video_gen.py                     Kling/Seedance/Runway (prompt → vidéo)
│   ├── video_edit.py                    FFmpeg + Hyperframes (assemblage)
│   └── thumbnail_gen.py                 Thumbnail rapide
│
├── Agent-Intelligence/               ← Prompts + ressources marketing
│   ├── 01-Marketing-Frameworks/         Frameworks copywriting
│   ├── 02-Research-Methods/             SOPs recherche marché
│   ├── 03-System-Prompts/               PROMPTS DE PRODUCTION
│   │   ├── Prompt-Advertorial-Copywriter.md        (legacy, pré-lab)
│   │   ├── Prompt-Advertorial-Headline-Generator.md (legacy)
│   │   ├── Prompt-Direct-Response-Copywriter.md    (legacy)
│   │   ├── Prompt-Unaware-Ad-Copywriter.md          (legacy)
│   │   ├── Prompt-Video-AI-Reverse-Engineer.md      ← p0 (extrait blueprint vidéo)
│   │   ├── Prompt-Video-AI-Product-Adapter.md        ← p2 (adapte blueprint produit)
│   │   └── Prompt-Video-AI-Visual-Judge.md           ← p3 (juge qualité prompts)
│   ├── 04-Creative-Vault/               Exemples gagnants
│   ├── 05-Operational-SOPs/             SOPs opérationnels
│   └── legacy-video-prompts/            Anciens prompts vidéo (archivés)
│
├── judges/                           ← JUDGE CONFIGS (auto-évaluation)
│   ├── advertorial_judge_v2.json        Advertorial (10 critères, 21 winners)
│   ├── product_page_judge_v2.json       Product Page (10 critères, 17 winners)
│   ├── advertorial_listicle_judge_v2.json Listicle (10 critères, 6 winners)
│   ├── vsl_teaser_judge_v2.json         VSL Teaser (10 critères, 9 winners)
│   ├── video_ad_judge_v2.json           Video Ad (10 critères, 31 winners)
│   ├── fb_ad_judge.json                 FB Ad (8 critères, 22 winners)
│   ├── vsl_judge_v2.json                VSL Full (10 critères, 6 winners)
│   ├── video_ads_retargeting_judge.json Retargeting (7 critères, 11 winners)
│   ├── image_ads_long_form_copy_judge.json Image Ads (8 critères, 10 winners)
│   ├── image_ads_retargeting_judge.json  Image Ads Retargeting (8 critères, 19 winners)
│   ├── whatsapp_sms_judge.json          WhatsApp/SMS (8 critères, 6 winners)
│   ├── quiz_judge.json                  Quiz (8 critères, 2 winners)
│   ├── soap_opera_judge.json            Soap Opera (10 critères, 8 winners)
│   ├── email_sms_judge.json             Email/SMS (8 critères, 6 winners)
│   ├── video_ai_judge.json              Video AI (8 critères, 35 winners)
│   └── [4 judges v1 legacy]
│
├── docs/                             ← DOCUMENTATION PRODUCTION
│   ├── COPYWRITING-SYSTEM.md            Manuel copywriting auto-suffisant
│   ├── SOAP_OPERA_STRATEGY.md           Stratégie Soap Opera 7-Day
│   └── TEMPLATE-SYSTEM.md               Pipeline templates HTML (architecture, guide ajout)
│
├── tools/                            ← OUTILS DE PRODUCTION
│   ├── hyperframes/                     Post-production vidéo HTML
│   └── video-pipeline/                  Pipeline vidéo AI (à construire)
│
├── Architecture Finale.md            ← Architecture SaaS funnel builder
├── Handover_Guide.md                 ← Guide démarrage original
│
├── test-output/                      ← HTML générés par les tests
└── output/                           ← CONTENU GÉNÉRÉ (auto-créé par content_producer.py)
    ├── {format}_{quality}_{timestamp}.txt   Contenu généré
    └── {format}_{quality}_{timestamp}.json  Score + métadonnées
```

---

## TEMPLATE SYSTEM

Génère des pages HTML complètes à partir de templates winners (99.9% fidélité visuelle).
**4 templates**: `smoothspire-advertorial` (narratif, 9.76/10) + `hike-reasons-why` (listicle, 9.23-10.41/10) + `product-page-tryemsense` (product page, 8.77/10) + `checkout-clarifion` (checkout, 127 slots).

**DOC COMPLETE**: `docs/TEMPLATE-SYSTEM.md` — architecture, utilisation, routage, sanitisation, ajout de templates.

**TESTS**: `npx tsx scripts/test-template-generate.ts` (SmoothSpire) | `npx tsx scripts/test-reasons-why-template.ts` (listicle) | `npx tsx scripts/test-product-page-template.ts` (product page) | `npx tsx scripts/test-checkout-template.ts` (checkout)
```

---

## UPSELL TEMPLATE SYSTEM (5-OTO Funnel)

Genere des pages upsell HTML completes a partir de 4 templates couvrant 5 positions OTO.
**Score: 6.7/10 -> 9.1/10** (avg, 16 Vibriance copywriting techniques integrees).

### Architecture

```
5 OTO positions, 4 templates:

  OTO1 — upsell-vibriance      Volume deal (same_product, ex: 3x Super C Serum a prix reduit)
  OTO2 — upsell-cross-sell     Cross-sell complementaire (ex: Retinol Serum, AM/PM routine)
  OTO3 — upsell-product        Cross-sell premium (ex: Eye Renewal, body_extra zone)
  OTO4 — upsell-product        Cross-sell surprise (ex: Moisturizing Cream, ingredients zone)
  OTO5 — upsell-protection     Protection package (ex: Porch Pirates, perte/vol colis)
```

### Pipeline flow
```
Product Brief → test script → template-generator.ts → upsell-filler.ts (prompt)
→ AI JSON → template-engine.ts (fill markers) → HTML output
```

### Prompt: `src/agents/prompts/upsell-filler.ts`
Contient TOUTES les regles copywriting pour les 5 OTO:
- **Position psychology**: chaque OTO a un role psychologique distinct (desir -> complement -> premium -> surprise -> protection)
- **Type-specific rules**: same_product, cross_sell, protection, subscription
- **Category vocabulary**: consumable, device, apparel, digital (ex: "supply" pour consumable, "unit" pour device)
- **16 Vibriance techniques**: competitor price anchoring, "80% social proof", AM/PM protocol, FOMO rejection, identity threat, product-specific CTAs
- **No country references**: OTO5 utilise "Over 40% of packages" (pas de mention de pays specifique)

### 16 Vibriance Techniques (integrees dans le prompt)
1. Competitor price anchoring ($79 comparison, OTO1)
2. Rejection with full retail price reminder
3. "80% social proof" opening (OTO2)
4. "WARNING:" exclusivity framing
5. "FIRST & ONLY" USP positioning
6. AM/PM protocol (morning/evening routine, OTO2)
7. FOMO rejection with double scarcity
8. "Take Years Off" aspirational headline (OTO3)
9. 4 named ingredients (not 3)
10. Social pain-pierce ("people saying you look tired")
11. Surprise multi-use tip ("purse hand cream", OTO4)
12. Specific package loss statistics (OTO5)
13. "Don't Be The Next Victim" identity threat
14. CTA specific to protection threat ("AGAINST LOSS & THEFT")
15. Guilt-trip rejection ("against theft")
16. Product-specific CTAs per OTO position

### Test commands
```bash
npx tsx scripts/test-upsell-oto1.ts   # OTO1 - volume deal (Super C Serum)
npx tsx scripts/test-upsell-oto2.ts   # OTO2 - cross-sell (Retinol Serum)
npx tsx scripts/test-upsell-oto3.ts   # OTO3 - cross-sell (Eye Renewal, body_extra)
npx tsx scripts/test-upsell-oto4.ts   # OTO4 - cross-sell (Moisturizing Cream, ingredients)
npx tsx scripts/test-upsell-oto5.ts   # OTO5 - protection (Porch Pirates)
```

### Files created
- `src/agents/prompts/upsell-filler.ts` — Prompt avec 16 techniques Vibriance
- `templates/upsell-vibriance.marked.html` + `.html` + `.html.json` — OTO1 volume deal
- `templates/upsell-cross-sell.marked.html` + `.html` + `.html.json` — OTO2 cross-sell
- `templates/upsell-product.marked.html` + `.html` + `.html.json` — OTO3+OTO4 cross-sell
- `templates/upsell-protection.marked.html` + `.html` + `.html.json` — OTO5 protection
- `scripts/test-upsell-oto1.ts` through `test-upsell-oto5.ts` — 5 test scripts
- `scripts/test-upsell-template.ts` — Generic test script
- `public/upsell-oto1.html` through `upsell-oto5.html` — Preview HTML files

### CSS fix
`#ibodyextra` in `upsell-product.marked.html` matches `#i9gchl` styling (Poppins 20px, centered).

---

## FUNNEL SYSTEM (7-step complete funnel with A/B testing)

Genere des funnels complets avec connexion CTA entre toutes les pages + A/B testing sur l'entry page.

### Architecture

```
Product Brief → FunnelConfig → generateFunnel() → HTML pages + router + metrics
                                            ↓
                        ┌───────────────────┼───────────────────┐
                        │                   │                   │
                   Template mode       Block mode          Variant router
                   (99.9% fidelity)    (~82% fidelity)    (client-side split)
```

### Dual Mode
- **Template mode** (`mode: 'template'`): Utilise les .marked.html templates. 99.9% visual fidelity.
- **Block mode** (`mode: 'block'`): AI compose des blocks from scratch via page-generator.ts. ~82% fidelity.
- Les deux modes peuvent coexister dans le meme funnel (ex: template entry + block upsell).

### A/B Testing
- Chaque FunnelStep peut avoir plusieurs `variants` avec `trafficWeight` (%).
- Un router HTML (client-side JS + localStorage) split le traffic entre les variants.
- Sticky sessions: localStorage conserve le variant assigné.
- Metrics tracking: JSON-file-based, pas de DB requise.

### Funnel Flow
```
Entry (A/B: advertorial / listicle / product page)
  → [Checkout] (backend handles payment)
    → OTO1 (volume deal)
      → OTO2 (cross-sell)
        → OTO3 (premium cross-sell)
          → OTO4 (surprise cross-sell)
            → OTO5 (protection)
              → Thank You
```

### Files
- `src/services/funnel-generator.ts` — Orchestrateur (variants + CTA wiring + router generation)
- `src/services/cta-injector.ts` — Post-processor CTA URL injection (regex-based structural targeting)
- `src/services/variant-router.ts` — Client-side traffic splitter HTML generator
- `src/services/funnel-metrics.ts` — JSON-file-based A/B metrics tracking
- `src/agents/prompts/funnel-filler.ts` — Auto-config prompt (product brief → FunnelConfig)
- `scripts/test-funnel.ts` — Test funnel simple (1 variant per step)
- `scripts/test-funnel-ab.ts` — Test A/B funnel (3 entry variants)

### Test commands
```bash
# Test funnel simple (7 pages, 1 variant each)
npx tsx scripts/test-funnel.ts

# Test A/B funnel (3 entry variants + 5 upsells + thank you)
npx tsx scripts/test-funnel-ab.ts
```

### Backward Compatibility
L'ancien format FunnelStep avec `templateId` direct fonctionne toujours:
```typescript
{ id: 'entry', templateId: 'smoothspire-advertorial', outputFilename: 'index.html', nextOnAccept: 'oto1' }
```
Nouveau format avec variants:
```typescript
{
  id: 'entry', outputFilename: 'index.html', nextOnAccept: 'oto1',
  variants: [
    { id: 'a', name: 'Advertorial', mode: 'template', templateId: 'smoothspire-advertorial', trafficWeight: 34 },
    { id: 'b', name: 'Listicle', mode: 'template', templateId: 'hike-reasons-why', trafficWeight: 33 },
    { id: 'c', name: 'Product Page', mode: 'template', templateId: 'product-page-tryemsense', trafficWeight: 33 },
  ]
}
```

### Auto-Config (AI-generated FunnelConfig)
`funnel-filler.ts` fournit un prompt qui demande a l'IA de generer un FunnelConfig complet a partir d'un product brief seul. L'IA choisit les templates, les upsells, les prix, et les weights.
Usage: `buildFunnelConfigPrompt(brief)` → LLM → FunnelConfig JSON → `generateFunnel()`

---

## ENVIRONMENT (.env requis)

Le fichier `.env` DOIT contenir ces variables. **SANS ELLES, AUCUNE GÉNÉRATION NE FONCTIONNE.**

```env
# Producteur (GRATUIT, 2+ clés recommandé pour round-robin)
MIMO_API_KEY=xxx
MIMO_API_KEY_2=xxx           # Round-robin, optionnel mais recommandé
MIMO_API_URL=https://api.mimo.vn/v1/chat/completions
MIMO_MODEL=mimo-v2-flash

# Juge ($0.60/M input)
DEEPSEEK_API_KEY=xxx
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
DEEPSEEK_MODEL=deepseek-chat
```

### Pre-Flight Check (AVANT chaque session de production)
```python
from dotenv import load_dotenv
load_dotenv()  # OBLIGATOIRE en premier
import os, httpx

# Vérifier .env
mimo_key = os.getenv("MIMO_API_KEY", "")
ds_key = os.getenv("DEEPSEEK_API_KEY", "")
assert mimo_key, "MIMO_API_KEY manquant dans .env"
assert ds_key, "DEEPSEEK_API_KEY manquant dans .env"

# Vérifier APIs
mimo_url = os.getenv("MIMO_API_URL", "")
r = httpx.post(mimo_url, json={"model": "mimo-v2-flash", "messages": [{"role": "user", "content": "test"}]},
                headers={"Authorization": f"Bearer {mimo_key}"}, timeout=10)
assert r.status_code == 200, f"MiMo API down: {r.status_code}"
```

---

## PROMPTS CHAMPIONS (Architecture Hybride DEFINITIVE)

### Où trouver les prompts
**`CHAMPION-PROMPTS-DEPLOY.md`** contient TOUS les prompts champions avec:
- Le prompt complet (portion statique)
- Les scoring rules par format
- Le judge config associé
- L'architecture de routage (quel prompt pour quel format)

### Routage par format

| Format | Prompt Copywriter | Reddit Persona? | Judge Config |
|--------|-------------------|-----------------|--------------|
| **Advertorial** | rules_only (8 règles) | OUI (Dual Persona) | advertorial_judge_v2.json |
| **Video Ad** | D5_Lite + patterns | OUI (Dual Persona) | video_ad_judge_v2.json |
| **FB Ad** | D5_Lite + patterns | OUI (Dual Persona) | fb_ad_judge.json |
| **Listicle** | D5_Lite + patterns | OUI (Dual Persona) | advertorial_listicle_judge_v2.json |
| **Product Page** | D5_Lite + patterns | NON | product_page_judge_v2.json |
| **VSL** | D5_Lite + patterns | NON | vsl_judge_v2.json |
| **VSL Teaser** | D5_Lite + patterns | NON | vsl_teaser_judge_v2.json |
| **Retargeting Video** | D5_Lite + patterns | NON | video_ads_retargeting_judge.json |
| **Image Ads Long Form** | D5_Lite + patterns | NON | image_ads_long_form_copy_judge.json |
| **Image Ads Retargeting** | D5_Lite + patterns | NON | image_ads_retargeting_judge.json |
| **WhatsApp/SMS** | D5_Lite + patterns | NON | whatsapp_sms_judge.json |
| **Quiz** | D5_Lite v1 | NON | quiz_judge.json |
| **Soap Opera Email** | Soap Opera v2 | NON | soap_opera_judge.json |
| **Video AI** | p2 Product Adapter | NON | video_ai_judge.json |

### Modèles recommandés
- **Producteur (CHAMPION)**: mimo-v2-flash (GRATUIT, 8.92 avg, validé lab-exact)
- **Juge**: deepseek-chat V5 Council (3 personas: Copywriter, Strategist, Psychologist)
- **Composer**: deepseek-chat (meilleur que MiMo pour JSON structuré)
- **temp**: 0.3 (génération), 0.5 (juge), 0.3 (composer)

### Judge usage (auto-évaluation)
```python
import json
from pathlib import Path

# Charger le judge config pour un format
judge_config = json.loads(Path("judges/advertorial_judge_v2.json").read_text())

# Le judge config contient:
# - "criteria": liste des critères avec poids, description, exemples
# - "anti_bias": 5 critères anti-biais (S1-S5)
# - "winner_patterns": patterns extraits des winners

# Pour auto-évaluer un contenu généré:
# Utiliser deepseek-chat avec temp=0.5, 3 personas séparés
# Score chaque critère 1-10, médiane des 3 personas = score final
# Weighted average = score principal
# Score > 7.0 = bon, > 8.0 = excellent, < 6.0 = retravailler
```

---

## PIPELINE VIDEO AI (Production)

### Pipeline validé (3 étapes)

```
ÉTAPE 1 — REVERSE ENGINEER (p0)
  Input:  URL vidéo gagnante (TikTok, YouTube, Facebook ad)
  Tool:   Gemini Vision
  Output: Blueprint structuré (shot-by-shot, audio, psychologie)
  Prompt: 03-System-Prompts/Prompt-Video-AI-Reverse-Engineer.md

ÉTAPE 2 — PRODUCT ADAPTER (p2)
  Input:  Blueprint + Product Brief (produit, audience, bénéfices)
  Tool:   Claude / DeepSeek / MiMo
  Output: Prompts Kling/Seedance/Runway prêts à l'emploi + script vocal + composition Hyperframes
  Prompt: 03-System-Prompts/Prompt-Video-AI-Product-Adapter.md

ÉTAPE 3 — VISUAL JUDGE (p3)
  Input:  Prompts générés par p2
  Tool:   DeepSeek (juge)
  Output: Score qualité 1-10 + feedback par critère
  Prompt: 03-System-Prompts/Prompt-Video-AI-Visual-Judge.md
```

### Workflow complet

```
1. Trouver une vidéo gagnante (Facebook Ads Library, TikTok, YouTube)
2. p0: Extraire le blueprint via Gemini Vision
3. Préparer le Product Brief (produit, audience, bénéfices, objections)
4. p2: Générer les prompts adaptés au produit
5. p3: Juger la qualité des prompts (score > 7.5 = bon)
6. Générer anchor frames: Flux.2 Klein + LoRA (ComfyUI local)
7. Générer clips vidéo: Kling 3.0 / Seedance 2.0 / Runway Gen-4.5
8. Générer voix: ElevenLabs API (avec Audio Tags du script)
9. Assembler: Hyperframes HTML composition (post-production)
10. Render: npx hyperframes render → MP4 final
11. Export: 1080x1920 H.264 (NE PAS exporter en 4K)
```

---

## AUTONOMIE

**Ce projet est 100% AUTONOME.** Il ne dépend d'aucun autre projet.

| Besoin | Où le trouver | Fichier |
|--------|---------------|---------|
| **Générer du contenu** | **content_producer.py** | **CLI ou import Python** |
| Prompt champion pour un format | CHAMPION-PROMPTS-DEPLOY.md | Section dédiée |
| Scoring rules | CHAMPION-PROMPTS-DEPLOY.md | Par format |
| Judge config (patterns + critères) | judges/ | {type}_judge.json |
| Manuel copywriting | docs/COPYWRITING-SYSTEM.md | Auto-suffisant |
| Stratégie Soap Opera | docs/SOAP_OPERA_STRATEGY.md | Complet |
| Pipeline vidéo AI | 03-System-Prompts/ | p0, p2, p3 |
| Frameworks marketing | Agent-Intelligence/01-Marketing-Frameworks/ | Templates |

### Relation avec le Lab (testing-ai-prompt)
```
testing-ai-prompt (LAB)              ECOM-AI (PRODUCTION — CE PROJET)
├── Tester, optimiser, valider        ├── Prompts déployés (copie)
├── CHAMPIONS.md = source             ├── CHAMPION-PROMPTS-DEPLOY.md = production
├── judges/*.json = configs           ├── judges/ = copie locale
├── COPYWRITING-SYSTEM.md             ├── docs/COPYWRITING-SYSTEM.md = copie
└── Winners = références              └── Pas de dépendance au lab
```

**Règle**: Quand un nouveau champion est validé dans le lab, le copier ici.
Ne PAS modifier un prompt de production sans l'avoir testé dans le lab d'abord.

### Relation avec God-anwser-ai-agent (Agent Autonome)
```
God-anwser-ai-agent (AGENT)                  ECOM-AI (PRODUCTION — CE PROJET)
├── Scanner détecte signaux                  ├── content_producer.py (pipeline)
├── Router → copywriter specialist           ├── judges/ (quality reference)
├── CEO valide décision                      ├── output/ (contenu généré)
├── autonomous_executor.py                   │
│   ├── Détecte action = "content_produce"   │
│   ├── Importe content_producer.py  ←───────┘
│   └── Appelle producer.produce(format, brief)
└── BI Monitor → feedback loop
```

**Flux de production intégré:**
```
1. Scanner (God-anwser) détecte un signal marché
2. Router → copywriter specialist analyse
3. CEO valide: "Créer un advertorial pour produit X"
4. autonomous_executor détecte method="content_produce"
5. Appelle ECOM-AI content_producer.py:
   a. Charge D5_Lite prompt + judge config
   b. Génère contenu (MiMo GRATUIT ou DeepSeek)
   c. Évalue qualité (V5 Council, 3 personas)
   d. Si score ≥ 7.0 → sauvegarde dans output/
6. BI Monitor détecte impact → feedback loop
```

**Utilisation standalone (sans God-anwser):**
```bash
# CLI
python content_producer.py --format advertorial --brief "..." --product "Turmeric" --audience "Women 40-65"

# Python
from content_producer import ContentProducer
producer = ContentProducer()
result = producer.produce("fb_ad", brief="...", product_info={"name": "..."})
print(result["quality"], result["weighted_avg"])
```

---

## RÈGLES OBLIGATOIRES

### 1. Persist Everything — Sauvegarder TOUJOURS
**NE JAMAIS** montrer des résultats uniquement dans stdout. **TOUJOURS** sauver dans un fichier.
- Contenu généré → sauver dans un fichier (pas juste print)
- Résultats de judge → sauver les scores
- Si tu découvres quelque chose → le documenter IMMÉDIATEMENT
- **Pourquoi:** stdout disparaît. Les fichiers persistent. Une future IA sans mémoire a besoin de ces fichiers.

### 2. Document Immediately — Immédiatement, pas "après"
Quand tu découvres quelque chose, l'écrire IMMÉDIATEMENT — pas "après la prochaine génération."
- Trouvé un problème dans un prompt? → Le noter + fixer
- Trouvé un pattern qui marche? → Le documenter dans COPYWRITING-SYSTEM.md
- "Je documenterai après" = ça ne sera jamais documenté

### 3. Never Ask What You Can Determine Yourself
Avant de demander à l'utilisateur, vérifier si tu peux répondre toi-même en lisant les fichiers ou en lançant un test rapide.
- "Quel prompt utiliser pour ce format?" → Lire CHAMPION-PROMPTS-DEPLOY.md
- "Est-ce que le judge config est bon?" → Lire judges/{type}_judge.json
- L'utilisateur est non-technique et busy. Ton job = réduire les décisions.

### 4. Fix Bugs When Found — Pas de TODO
Quand tu vois un bug, le fixer immédiatement. Pas de TODO ou note pour plus tard.
- Prompt qui génère du contenu mauvais? → Fix maintenant
- Judge config corrompu? → Fix maintenant
- "Fix plus tard" = la prochaine session repart de zéro et perd du temps

### 5. Verify Before Trusting — Toujours vérifier
Ne JAMAIS faire confiance que l'infrastructure fonctionne. Toujours vérifier avant de s'y fier.
- API externe? → Tester un call avant le batch
- Judge config? → Vérifier qu'il existe avant de l'utiliser
- .env variables? → Print et vérifier avant utilisation
- **Pourquoi:** Des heures de travail ont été perdues à générer du contenu avec une API down.

### 6. Filter External Data Before LLM Integration
Les LLMs intègrent TOUT, même les données inutiles. **Toujours filtrer par pertinence d'abord.**
Integration avec garbage = PIRE que pas d'integration.

### 7. Diagnose Before Abandoning
Quand un contenu est mauvais, diagnostiquer POURQUOI avant de changer de prompt.
- Prompt mal adapté? → Comparer avec le champion dans CHAMPION-PROMPTS-DEPLOY.md
- Judge trop sévère? → Vérifier le judge config
- Produit atypique? → Adapter le brief, pas le prompt

### 8. Zero Cross-Reference — Chaque fichier AUTO-SUFFISANT
**JAMAIS** de "voir CHAMPIONS.md section #X" dans un prompt ou config de production.
Chaque fichier doit être compréhensible SANS lire les autres.
- CHAMPION-PROMPTS-DEPLOY.md → COMPLET, pas de raccourci
- docs/COPYWRITING-SYSTEM.md → COMPLET, pas de référence externe
- Judge configs → COMPLETS, patterns inclus

### 9. Self-Contained Outputs
Chaque sortie générée doit être UTILISABLE TELLE QUELLE. Pas besoin de contexte extérieur.
- Un prompt généré = prêt à copier-coller dans l'outil cible
- Un contenu évalué = score + feedback clair
- Un script = autonome, avec ses propres imports

---

## Surgical Logging Protocol (Protocole d'Observabilité Récursive)

ALL logging utilise un logger structuré. **Zero `console.*` autorisé** en production.

### Phase 1 — Construction (Zero-Bloat)
Uniquement les logs de structure essentiels (début/fin de processus, succès/échec API).
Logs typés (Info, Error, Warn).

### Phase 2 — Diagnostic (en cas d'erreur)
1. **Observation** — Qu'est-ce qui se passe réellement?
2. **Analyse** — Quelle donnée te manque pour comprendre?
3. **Instrumentation** — Ajoute des logs de debug temporairement
4. **Réflexion** — Déduis la solution à partir des preuves

### Phase 3 — Résolution
1. Applique le correctif
2. **NETTOYAGE OBLIGATOIRE** — Retire tous les logs de debug temporaires

**Règle d'or:** Ne propose jamais une solution basée sur une supposition. Si tu ne sais pas, ajoute des logs jusqu'à ce que tu saches.

---

## CONVENTIONS
- Prompts en ANGLAIS (meilleure compréhension par l'IA)
- Contenu généré peut être en français
- Fichiers legacy: ne pas supprimer (archiver dans legacy/)
- Tools dans `tools/` — ne pas polluer la racine
- Scripts Python en anglais, commentaires business en français si nécessaire

## TESTS & DOCUMENTATION (OBLIGATOIRE)

### Quels fichiers déclenchent un test
**RÈGLE:** Après TOUT changement sur ces fichiers, lancer le test AVANT de commit :
- `src/agents/prompts/*` (copywriter, composer, template filler, reasons-why filler, upsell filler, funnel filler)
- `src/services/funnel-generator.ts` (funnel orchestrateur)
- `src/services/cta-injector.ts` (CTA injection)
- `src/services/variant-router.ts` (A/B router)
- `src/services/funnel-metrics.ts` (A/B metrics)
- `src/renderers/*` (renderers HTML)
- `src/services/template-engine.ts` (moteur de templates)
- `src/services/template-generator.ts` (orchestrateur templates)
- `src/design-system/blocks.ts` (schémas Zod)
- `src/validation/*` (pipeline validation)
- `src/services/content-judge.ts` (juge V5 Council)
- `judges/*.json` (configs judge)
- `templates/*.marked.html` (templates avec markers)

### Lancement des tests
```bash
# Test advertorial narratif (SmoothSpire template)
npx tsx scripts/test-template-generate.ts

# Test listicle "Reasons Why" (hike-2 template)
npx tsx scripts/test-reasons-why-template.ts

# Test product page
npx tsx scripts/test-product-page-template.ts

# Test checkout page
npx tsx scripts/test-checkout-template.ts

# Test upsell OTO1-5
npx tsx scripts/test-upsell-oto1.ts   # OTO1 volume deal
npx tsx scripts/test-upsell-oto2.ts   # OTO2 cross-sell
npx tsx scripts/test-upsell-oto3.ts   # OTO3 cross-sell (body_extra)
npx tsx scripts/test-upsell-oto4.ts   # OTO4 cross-sell (ingredients)
npx tsx scripts/test-upsell-oto5.ts   # OTO5 protection

# Test pipeline 3-step (block system)
npx tsx scripts/test-generate.ts

# Test funnel complet (7 pages, 1 variant each)
npx tsx scripts/test-funnel.ts

# Test A/B funnel (3 entry variants + upsells)
npx tsx scripts/test-funnel-ab.ts

# Test avec modèle alternatif
npx tsx scripts/test-generate.ts deepseek-v4-pro
```

### Critères de succès
- Score de validation ≥ 80/100
- Score Judge V5 Council ≥ 6.0/10 (target: 7.0+)
- 0 erreur de validation
- 0 crash de renderer
- HTML généré dans `test-output/` (ouvrir dans navigateur pour vérif visuelle)

### Documentation OBLIGATOIRE après chaque test

**RÈGLE:** Chaque test DOIT être documenté dans `test-results/`. Pas d'exception.
**POURQUOI:** Sans documentation, la prochaine session repart de zéro et refait les mêmes tests.

#### Format du fichier de résultats
Fichier: `test-results/YYYY-MM-DD-{sujet}.md`

```markdown
# Test Results — {Sujet}
# Date: YYYY-MM-DD
# Product: {nom du produit test}
# Judge: V5 Council (3 personas), {judge config}

## Test Summary

| # | Config | Gen Score | Judge Score | Words | C1 BigIdea | C4 Proof | C10 CTA | Notes |
|---|--------|-----------|-------------|-------|------------|----------|---------|-------|
| 1 | ... | ... | ... | ... | ... | ... | ... | ... |

## Key Findings
1. ...
2. ...

## Root Cause Analysis (si problème)
...

## Next Steps
- ...
```

#### Procédure post-test
1. Sauver les résultats dans `test-results/`
2. Sauver les fichiers générés dans `test-output/` (HTML + JSON + tree)
3. Identifier le MEILLEUR résultat (score le plus élevé)
4. Documenter ce qui a marché et ce qui n'a pas marché
5. Proposer les next steps pour la prochaine session
6. Si un champion est confirmé → noter le score dans ce fichier

### Score Benchmarks (référence)
| Source | Score | Conditions |
|--------|-------|------------|
| **Template hike-reasons-why (HF Stride)** | **10.41/10** | **DeepSeek, listicle, 72 slots, HTML sanitization** |
| **Template hike-reasons-why (Nutrovia)** | **9.23/10** | **DeepSeek, listicle, 72 slots, HTML sanitization** |
| **Template smoothspire-advertorial** | **9.76/10** | **DeepSeek, advertorial narratif, 47 slots** |
| **Upsell templates (avg 5 OTO)** | **9.1/10** | **DeepSeek, upsell-filler, 16 Vibriance techniques** |
| **ECOM-AI 3-step (lab briefs avg)** | **8.92/10** | **MiMo, free text, anti-bias fix, Dual Persona** |
| Lab (testing-ai-prompt) | 8.58/10 | MiMo, free text, temp=0.3 |
| ECOM-AI 3-step (Nutrovia) | 7.77/10 | MiMo, free text, anti-bias fix |
| Upsell before Vibriance techniques | 6.7/10 | DeepSeek, basic upsell prompt |
| ECOM-AI JSON best (#5) | 6.44/10 | DeepSeek, JSON, triggers, long prompt |
| ECOM-AI JSON Dual Persona | 6.0/10 | DeepSeek, JSON, judge pick-best |

### Fichiers à mettre à jour après un changement
**RÈGLE**: Quand tu modifies un prompt champion, juge config, ou architecture de pipeline:
1. `CLAUDE.md` — règles et documentation
2. `GUIDE-IA.md` — découvertes, résultats de tests, checkpoint
3. `CHAMPION-PROMPTS-DEPLOY.md` — SEULEMENT si le prompt champion change (pas pour changements d'architecture)
4. `test-results/` — résultats des tests documentés

### Gap Analysis Lab vs ECOM-AI
ECOM-AI 3-step pipeline EXCEEDS lab reference (8.92 vs 8.58). Key improvements:
1. **Anti-bias fix**: Rewrote ANTI_BIAS_CRITERIA with explicit 1-10 rubrics. Judges now score 7-9 instead of 0. Adds ~1.3 points. (Lab has same bug — lab's 8.58 was with anti-bias ≈0)
2. **Free text pipeline**: 3-step pipeline (free text → judge → blocks) matches lab architecture. JSON constraint eliminated.
3. **Brief quality matters**: Lab briefs ("hidden gut parasite") score higher than generic briefs ("gut bacteria imbalance"). Same pipeline, different brief = 1.6 point difference.
