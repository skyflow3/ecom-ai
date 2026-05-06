# 🚩 ECOM-AI: Handover & Bootstrap Guide (Read Me First)

## 1. Vision du Projet
Bâtir un **"Autonomous Funnel Builder" Agent-First**. 
Le système ne doit pas seulement construire des pages, il doit être **Meta-Cognitif** : il apprend de ses échecs (via AOV x CVR), débat en interne via un "Council" d'agents, et met à jour ses propres SOPs marketing.

## 2. Tes Sources de Vérité (MUST READ)
1. **`Architecture Finale.md`** : Tout est là. Schémas DB (Drizzle), Types TS, Endpoints API, Logique A/B Testing (Wilson Score), et le **Marketing Evolution Engine** (Section 27).
2. **`Agent-Intelligence/`** : Base de connaissances marketing brute organisée par dossiers (Marketing, Research, Prompts, Vault).

## 3. Le Modèle d'Inspiration Logicielle
Consulte **`C:\Users\Admin\ai-factory`**. 
- Analyse particulièrement `agents/base.py` et `orchestrator/` pour comprendre comment implanter le système de débat multi-agents et l'injection de connaissances dynamiques.

## 4. Stack Technique validée
- **Runtime** : Node.js 20+
- **Framework API** : Hono.js (pour la vélocité et le support Edge)
- **ORM** : Drizzle (Schemas déjà rédigés dans l'Architecture Finale)
- **DB** : PostgreSQL 16
- **Tâches de fond** : BullMQ + Redis (pour les workers de rendu HTML et l'Evolution Engine)

## 5. Ta première mission (Next Steps)
1. **Initialisation du projet** : Crée la structure Node.js conforme à la section 12 de l'Architecture (Docker Compose).
2. **Migration Database** : Prends le schéma Drizzle consolidé (Sections 2 et 3 de l'Architecture) et génère la première migration.
3. **Evolution Engine Shell** : Prépare le worker BullMQ qui servira à scripter le "Scout" et le "Council".

---
**Note :** Le fichier `AI_FUNNEL_BUILDER_SOP.md` et le dossier `dont open this` ont été supprimés car ils étaient obsolètes. Ne te fie qu'à `Architecture Finale.md`.
