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
│   └── SOAP_OPERA_STRATEGY.md           Stratégie Soap Opera 7-Day
│
├── tools/                            ← OUTILS DE PRODUCTION
│   ├── hyperframes/                     Post-production vidéo HTML
│   └── video-pipeline/                  Pipeline vidéo AI (à construire)
│
├── Architecture Finale.md            ← Architecture SaaS funnel builder
├── Handover_Guide.md                 ← Guide démarrage original
│
└── output/                           ← CONTENU GÉNÉRÉ (auto-créé par content_producer.py)
    ├── {format}_{quality}_{timestamp}.txt   Contenu généré
    └── {format}_{quality}_{timestamp}.json  Score + métadonnées
```
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
- **Producteur**: mimo-v2-flash (GRATUIT) ou deepseek-chat ($0.60/M)
- **Juge**: deepseek-chat V5 Council (3 personas: Copywriter, Strategist, Psychologist)
- **temp**: 0.3 (génération), 0.5 (juge)

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
