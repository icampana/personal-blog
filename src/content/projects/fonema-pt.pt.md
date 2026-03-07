---
title: Fonema PT-PT
date: 2025-03-07
description: >-
  Ferramenta educacional interativa para aprender a pronúncia do português
  europeu. Inclui 21 fonemas críticos com áudio de referência gerado por
  síntese de voz.
techStack:
  - React
  - TypeScript
  - Astro
  - Python
  - edge-tts
  - DaisyUI
liveUrl: /pt/fonema-pt
---

[Fonema PT-PT](/pt/fonema-pt) é uma ferramenta educacional projetada para ajudar estudantes de português europeu a dominar os sons mais difíceis do idioma.

## O Problema

O português europeu tem fonemas únicos que não existem em espanhol nem em inglês:
- Vogais nasais (ão, ão, ões)
- O "S" final que soa como "sh"
- O "R" gutural do fundo da garganta
- Sons como "LH" e "NH"

Para um falante não nativo, esses sons podem ser quase impossíveis de perceber e reproduzir sem uma referência auditiva clara.

## A Solução

Criei um "soundboard" fonético interativo que inclui:

**21 fonemas organizados em 3 categorias:**
- **9 Vogais** (abertas, fechadas, mudas)
- **4 Vogais nasais** (ão, am/an, ões, im/in)  
- **8 Consoantes especiais** (s→sh, lh, nh, rr, etc.)

**Características técnicas:**
- Áudio gerado com voz sintética de alta qualidade (pt-PT-DuarteNeural)
- Reprodução sem latência graças à pré-carga de áudio
- Interface responsiva com código de cores por categoria
- Suporte multilíngue (ES/EN/PT/FR)

## Tecnologia

O projeto utiliza:
- **edge-tts**: Geração de áudio com voz neural do Microsoft Edge
- **React + TypeScript**: Componente interativo do soundboard
- **Astro**: Geração de site estático com hidratação seletiva
- **DaisyUI**: Sistema de design com temas e componentes acessíveis

## Impacto

Esta ferramenta permite a qualquer pessoa praticar a pronúncia do português europeu de forma autônoma, repetindo os sons quantas vezes forem necessárias até alcançar a perfeição.
