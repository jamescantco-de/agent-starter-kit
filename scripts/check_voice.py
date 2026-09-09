#!/usr/bin/env python3
import sys

BANNED_WORDS = [
    "delve", "seamless", "cutting-edge", "synergy", "tapestry", "myriad", "plethora",
    "embark", "foster", "holistic", "paradigm", "transformative", "underscore",
    "elevate", "harness", "unlock", "best-in-class", "world-class", "actionable",
    "in conclusion", "in summary", "it is important to note", "navigate the landscape",
    "in today's fast-paced", "low-hanging fruit", "move the needle", "leverage"
]

def check_text(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    lower_text = text.lower()
    violations = []
    for word in BANNED_WORDS:
        if word in lower_text:
            violations.append(word)

    chars = len(text)
    words = len(text.split())

    print(f"Character count: {chars:,}")
    print(f"Word count:      {words:,}")

    if violations:
        print(f"❌ Found {len(violations)} banned word(s): {violations}")
        sys.exit(1)
    else:
        print("✅ Zero banned words found! Clean voice profile.")
        sys.exit(0)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        check_text(sys.argv[1])
    else:
        print("Usage: check_voice.py <path_to_text>")
