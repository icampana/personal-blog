#!/usr/bin/env python3
"""
Fonema Audio Generator
Generates MP3 files for European Portuguese phonemes using edge-tts CLI.

Usage:
    python3 scripts/generate-phonemes.py

Requirements:
    pipx install edge-tts
    # or: pip install edge-tts
"""

import os
import subprocess

VOICE = "pt-PT-DuarteNeural"
OUTPUT_DIR = "./public/audio/fonema"
RATE = "-20%"  # Slow down speech by 20% for better clarity

PHONETIC_MAP = {
    # Vowels
    "vowel_a_open": ("Água", "Á", "Open 'A' like in 'Father'"),
    "vowel_a_closed": ("Ana", "A", "Closed 'A', almost like a schwa [ɐ]"),
    "vowel_e_open": ("Café", "É", "Open 'E', sharp like 'Set'"),
    "vowel_e_closed": ("Cedo", "Ê", "Closed 'E', like 'Hey' without the 'y'"),
    "vowel_e_muted": ("Peixe", "E (muted)", "The nearly silent [ɨ]"),
    "vowel_i": ("Ali", "I", "High front vowel, like 'Bee'"),
    "vowel_o_open": ("Avó", "Ó", "Open 'O', like 'Owe'"),
    "vowel_o_closed": ("Avô", "Ô", "Closed 'O', like 'Go'"),
    "vowel_u": ("Tudo", "U", "Like 'Boot'"),
    # Nasals
    "nasal_ao": ("Pão", "ÃO", "Classic nasal 'ow'"),
    "nasal_am": ("Falam", "AM / AN", "Nasal 'A' at the end of words"),
    "nasal_oe": ("Corações", "ÕES", "Nasal 'oy-sh'"),
    "nasal_in": ("Sim", "IM / IN", "Nasal 'ee'"),
    # Consonant Shifts
    "cons_s_sh": ("Inglês", "S (final)", "Sounds like 'sh'"),
    "cons_s_z": ("Casas", "S (inter)", "Sounds like 'z' between vowels"),
    "cons_lh": ("Filho", "LH", "Soft 'ly' sound [ʎ]"),
    "cons_nh": ("Ninho", "NH", "Like the 'ny' in 'Canyon'"),
    "cons_rr": ("Carro", "RR / R-", "Guttural back-of-throat 'R'"),
    "cons_r_single": ("Caro", "R (single)", "Alveolar tap (flipped 'R')"),
    "cons_j": ("Janela", "J / G", "Like 'Measure' [ʒ]"),
    "cons_ch": ("Chave", "CH / X", "Always 'sh' [ʃ]"),
}


def generate_audio(filename: str, text: str) -> bool:
    """Generate audio file using edge-tts CLI."""
    output_path = f"{OUTPUT_DIR}/{filename}.mp3"
    cmd = [
        "edge-tts",
        "--voice",
        VOICE,
        f"--rate={RATE}",
        "--text",
        text,
        "--write-media",
        output_path,
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Error generating {filename}: {e.stderr}")
        return False
    except FileNotFoundError:
        print(f"✗ edge-tts not found. Please install with: pipx install edge-tts")
        return False


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"🎙️  Starting generation with voice: {VOICE}")
    print(f"📁 Output directory: {OUTPUT_DIR}")
    print("-" * 50)

    generated = 0
    skipped = 0

    for filename, (text, _, _) in PHONETIC_MAP.items():
        path = f"{OUTPUT_DIR}/{filename}.mp3"
        if not os.path.exists(path):
            if generate_audio(filename, text):
                print(f"✓ Generated: {filename}.mp3")
                generated += 1
            else:
                print(f"✗ Failed: {filename}.mp3")
        else:
            print(f"⚡ Skipped (exists): {filename}.mp3")
            skipped += 1

    print("-" * 50)
    print(f"🎉 Done! Generated: {generated}, Skipped: {skipped}")


if __name__ == "__main__":
    main()
