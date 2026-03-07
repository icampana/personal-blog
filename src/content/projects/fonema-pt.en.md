---
title: Phoneme PT-PT
date: 2025-03-07
description: >-
  Interactive educational tool for learning European Portuguese pronunciation.
  Includes 21 critical phonemes with reference audio generated using speech
  synthesis.
techStack:
  - React
  - TypeScript
  - Astro
  - Python
  - edge-tts
  - DaisyUI
liveUrl: /en/fonema-pt
---

[Phoneme PT-PT](/en/fonema-pt) is an educational tool designed to help European Portuguese students master the language's most challenging sounds.

## The Problem

European Portuguese has unique phonemes that do not exist in Spanish or English:
- Nasal vowels (ão, ão, ões)
- The final "S" that sounds like "sh"
- The guttural "R" from the back of the throat
- Sounds like "LH" and "NH"

For a non-native speaker, these sounds can be almost impossible to perceive and reproduce without clear auditory reference.

## The Solution

Created an interactive phonetic "soundboard" that includes:

**21 phonemes organized into 3 categories:**
- **9 Vowels** (open, closed, mute)
- **4 Nasal vowels** (ão, am/an, ões, im/in)
- **8 Special Consonants** (s→sh, lh, nh, rr, etc.)

**Technical Features:**
- Audio generated with high-quality synthetic voice (`pt-PT-DuarteNeural`)
- Latency-free playback thanks to audio preloading
- Responsive interface with color-coding by category
- Multilingual support (ES/EN/PT/FR)

## Technology

The project utilizes:
- **edge-tts**: Audio generation with Microsoft Edge neural voice
- **React + TypeScript**: Interactive soundboard component
- **Astro**: Static site generation with selective hydration
- **DaisyUI**: Design system with themes and accessible components

## Impact

This tool allows anyone to autonomously practice European Portuguese pronunciation, repeating sounds as many times as necessary to achieve perfection.