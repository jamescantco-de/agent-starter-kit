#!/usr/bin/env bash
# =============================================================================
# Agent Starter Kit — Health & Environment Verification Script
# Checks configuration files, symlinks, and tool availability.
# =============================================================================
set -euo pipefail

echo "🔍 Verifying Agent Starter Kit configuration..."

ERRORS=0

# 1. Check Master Config
if [ ! -f "AGENTS.md" ]; then
  echo "❌ Missing AGENTS.md in repository root."
  ERRORS=$((ERRORS + 1))
else
  echo "✅ AGENTS.md exists."
fi

# 2. Check Symlinks
for target in "CLAUDE.md" "GEMINI.md"; do
  if [ -L "$target" ] || [ -f "$target" ]; then
    echo "✅ $target found."
  else
    echo "⚠️ $target missing (run 'ln -s AGENTS.md $target' or configure agentsync)."
  fi
done

# 3. Check Correction Rules
if [ -f "Correction Rules.md" ]; then
  echo "✅ Correction Rules.md exists."
else
  echo "❌ Missing Correction Rules.md."
  ERRORS=$((ERRORS + 1))
fi

# 4. Check Skills Directory
if [ -d "skills" ]; then
  SKILL_COUNT=$(find skills -name "SKILL.md" | wc -l | tr -d ' ')
  echo "✅ Found $SKILL_COUNT active skill(s)."
else
  echo "⚠️ skills/ directory not found."
fi

# 5. Check RTK (Rust Token Killer) presence
if command -v rtk >/dev/null 2>&1; then
  echo "✅ RTK installed ($(rtk --version 2>/dev/null || echo 'active'))."
else
  echo "ℹ️  RTK not installed. Optional token-optimization proxy: https://github.com/rtk-ai/rtk"
fi

echo ""
if [ "$ERRORS" -eq 0 ]; then
  echo "🎉 Environment check passed! Your AI agent architecture is ready to go."
  exit 0
else
  echo "❌ Verification failed with $ERRORS error(s)."
  exit 1
fi
