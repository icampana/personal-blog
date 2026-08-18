---
title: Fonema PT-PT
date: 2025-03-07
description: >-
  Outil éducatif interactif pour apprendre la prononciation du portugais
  européen. Inclut 21 phonèmes critiques avec audio de référence généré
  par synthèse vocale.
techStack:
  - React
  - TypeScript
  - Astro
  - Python
  - edge-tts
  - DaisyUI
liveUrl: /fr/fonema-pt
---

[Fonema PT-PT](/fr/fonema-pt) est un outil éducatif conçu pour aider les étudiants de portugais européen à maîtriser les sons les plus difficiles de la langue.

## Le Problème

Le portugais européen possède des phonèmes uniques qui n'existent ni en espagnol ni en anglais :
- Voyelles nasales (ão, ão, ões)
- Le "S" final qui sonne comme "sh"
- Le "R" guttural du fond de la gorge
- Des sons comme "LH" et "NH"

Pour un locuteur non natif, ces sons peuvent être presque impossibles à percevoir et à reproduire sans une référence audio claire.

## La Solution

J'ai créé un "soundboard" phonétique interactif qui comprend :

**21 phonèmes organisés en 3 catégories :**
- **9 Voyelles** (ouvertes, fermées, muettes)
- **4 Voyelles nasales** (ão, am/an, ões, im/in)
- **8 Consonnes spéciales** (s→sh, lh, nh, rr, etc.)

**Caractéristiques techniques :**
- Audio généré avec voix synthétique haute qualité (pt-PT-DuarteNeural)
- Lecture sans latence grâce au préchargement audio
- Interface responsive avec code couleur par catégorie
- Support multilingue (ES/EN/PT/FR)

## Technologie

Le projet utilise :
- **edge-tts** : Génération audio avec voix neuronale Microsoft Edge
- **React + TypeScript** : Composant interactif du soundboard
- **Astro** : Génération de site statique avec hydratation sélective
- **DaisyUI** : Système de design avec thèmes et composants accessibles

## Impact

Cet outil permet à toute personne de pratiquer la prononciation du portugais européen de manière autonome, en répétant les sons autant de fois que nécessaire jusqu'à atteindre la perfection.
