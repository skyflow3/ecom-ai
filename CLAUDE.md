# CLAUDE.md — ECOM-AI (Production Hub AUTONOME)

## Zero Memory Rule
Chaque session commence avec ZERO mémoire. Le code doit s'auto-expliquer.
Tu écris pour TOI-MÊME dans une future session avec ZERO mémoire.
But: < 30s pour comprendre un fichier, contexte minimal pour reprendre le travail.

## REGLE OBLIGATOIRE: Relecture après chaque action

**APRÈS chaque nouvelle chose faite** (section ajoutée, code écrit, table créée, commit, etc.):
1. Relire `PLAN-DESIGN-SYSTEM.md` en entier
2. Relire les sections concernées de `Architecture Finale.md`
3. Vérifier cohérence entre les deux fichiers
4. Cocher les checkboxes dans PLAN-DESIGN-SYSTEM.md
5. Mettre à jour `progress.txt` avec ce qui a été fait

**POURQUOI**: L'IA perd le contexte entre les actions. La relecture garantit l'alignement.
Une future IA sans mémoire doit pouvoir reprendre sans erreur ni contradiction.

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
│
├── src/
│   ├── services/
│   │   ├── template-engine.ts          Moteur de remplissage (markers + zones + images)
│   │   ├── template-generator.ts       Orchestrateur (ProductBrief → AI JSON → HTML rempli)
│   │   └── content-judge.ts            Juge V5 Council (3 personas)
│   ├── agents/prompts/
│   │   ├── template-filler.ts          Prompt advertorial narratif (SmoothSpire)
│   │   ├── reasons-why-filler.ts       Prompt listicle (hike-reasons-why, Champion #4)
│   │   ├── product-page-filler.ts      Prompt product page DTC (tryemsense)
│   │   ├── checkout-filler.ts          Prompt checkout (clarifion, 127 slots, warranty auto-hide)
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
│   └── test-checkout-template.ts       Test checkout page (3-bundle, $4.95 shipping)
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
- `src/agents/prompts/*` (copywriter, composer, template filler, reasons-why filler)
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

# Test pipeline 3-step (block system)
npx tsx scripts/test-generate.ts

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
| **ECOM-AI 3-step (lab briefs avg)** | **8.92/10** | **MiMo, free text, anti-bias fix, Dual Persona** |
| Lab (testing-ai-prompt) | 8.58/10 | MiMo, free text, temp=0.3 |
| ECOM-AI 3-step (Nutrovia) | 7.77/10 | MiMo, free text, anti-bias fix |
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
