#!/usr/bin/env python3
"""
Simple 0-Token Context Auditor.
Demonstrates the Tier-3 principle: perform mechanical inspection locally
without spending LLM tokens.
"""

import sys

def audit_stream():
    content = sys.stdin.read()
    char_count = len(content)
    # Rule of thumb: ~4 characters per token for English text & code
    estimated_tokens = char_count // 4
    lines = content.count('\n')

    print(f"--- Stream Audit ---")
    print(f"Lines:            {lines:,}")
    print(f"Characters:       {char_count:,}")
    print(f"Estimated Tokens: ~{estimated_tokens:,}")
    
    if estimated_tokens > 2000:
        print("⚠️ Warning: Output exceeds 2,000 tokens. Consider filtering with grep/head or an RTK proxy.")
    else:
        print("✅ Output size fits comfortably within agent context budgets.")

if __name__ == "__main__":
    audit_stream()
