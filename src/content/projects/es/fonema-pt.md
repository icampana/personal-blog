---
title: Fonema PT-PT
date: 2025-03-07
description: >-
  Herramienta educativa interactiva para aprender la pronunciación del
  portugués europeo. Incluye 21 fonemas críticos con audio de referencia
  generado mediante síntesis de voz.
techStack:
  - React
  - TypeScript
  - Astro
  - Python
  - edge-tts
  - DaisyUI
liveUrl: /fonema-pt
---

[Fonema PT-PT](/fonema-pt) es una herramienta educativa diseñada para ayudar a estudiantes de portugués europeo a dominar los sonidos más difíciles del idioma.

## El Problema

El portugués europeo tiene fonemas únicos que no existen en español ni en inglés:
- Vocales nasales (ão, ão, ões)
- La "S" final que suena como "sh"
- La "R" gutural del fondo de la garganta
- Sonidos como "LH" y "NH"

Para un hablante no nativo, estos sonidos pueden ser casi imposibles de percibir y reproducir sin una referencia auditiva clara.

## La Solución

Cree un "soundboard" fonético interactivo que incluye:

**21 fonemas organizados en 3 categorías:**
- **9 Vocales** (abiertas, cerradas, mudas)
- **4 Vocales nasales** (ão, am/an, ões, im/in)  
- **8 Consonantes especiales** (s→sh, lh, nh, rr, etc.)

**Características técnicas:**
- Audio generado con voz sintética de alta calidad (pt-PT-DuarteNeural)
- Reproducción sin latencia gracias a precarga de audio
- Interfaz responsive con código de colores por categoría
- Soporte multilingüe (ES/EN/PT/FR)

## Tecnología

El proyecto utiliza:
- **edge-tts**: Generación de audio con voz neural de Microsoft Edge
- **React + TypeScript**: Componente interactivo del soundboard
- **Astro**: Generación de sitio estático con hidratación selectiva
- **DaisyUI**: Sistema de diseño con temas y componentes accesibles

## Impacto

Esta herramienta permite a cualquier persona practicar la pronunciación del portugués europeo de forma autónoma, repitiendo los sonidos tantas veces como sea necesario hasta lograr la perfección.
