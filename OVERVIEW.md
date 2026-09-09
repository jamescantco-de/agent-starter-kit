I don’t know how to code.

I’m a Dad, I’ve spent my entire career on the commercial side of tech, and until relatively recently, opening a terminal window felt like looking into the engine bay of a modern hybrid car - fascinating, but if I touched anything, I was terrified it wouldn't start again.

Yet over the past year, I’ve built and shipped real, functioning web apps, mobile PWAs, and production workflows using AI agents and sheer willpower.

Along the way, my machine has processed and burned over 1.13 billion tokens... and counting. I have watched context windows collapse into chaos, had Claude rewrite working files into oblivion, and paid real money for agents to run in circles. I've watched context windows collapse into chaos, had Claude rewrite working files into oblivion, and paid real money for agents to run in circles. 

Over time, through endless trial and error - and borrowing brilliant ideas from across the community - I managed to save over 18 million tokens on CLI operations alone, and put together an agent setup that actually works day in, day out.

This isn’t a sales pitch. It’s not a dictatorial "how you must build" guide. It’s purely my personal opinion and the practical lessons I learnt after hitting every wall imaginable.

Hopefully, it saves you a few hundred hours and a few million tokens.

---

### The Myth of "Just Vibe Coding" (And The Three Walls You Hit)

When AI coding tools first exploded, the narrative was that you could sit back, type two casual sentences into an agent, and watch a production app appear out of thin air.

If you’ve tried to build anything more complex than a single-page counter, you know that reality hits hard around day two. Specifically, you run straight into three massive walls:

1. **The Context Sinkhole**: You ask an agent to run a test or check git status. The terminal outputs 3,000 lines of noise. Suddenly, 80% of your context window is eaten up by raw terminal vomit. The agent gets slow, loses its train of thought, and starts forgetting rules you gave it ten minutes ago.
2. **AI Groundhog Day**: You catch the agent making an assumption - say, trying to use an outdated library or refactoring a file it shouldn't touch. You correct it. Forty-five minutes later, in a fresh context window, it makes the exact same mistake.
3. **Configuration Drift**: You have instructions in a CLAUDE.md file, completely different prompts in Cursor, and another set in Google Antigravity or Gemini. Nothing is aligned, and you spend more time managing configuration files than actually building.

To get past these walls, I had to stop treating AI agents like magic magicians and start treating them like capable junior engineers who need clear guardrails, disciplined systems, and good tools.

Here is how my personal setup is structured today.

---

### 1. The 3-Tier Execution Hierarchy & The 1-2-3 Rule

The single most expensive mistake people make with coding agents is treating frontier models (Claude, Gemini, GPT-4) like all-purpose execution engines for everything.

Frontier LLMs are brilliant at high-level reasoning, architecture, and edge-case detection. But asking a frontier model to reformat a 500-line JSON file or parse a build log is like hiring a senior architect to sweep the driveway with a toothbrush. It's slow, expensive, and a waste of intellect.

I organise everything into three tiers:

* **Tier 1 — Brains (Frontier LLMs)**: Strategy, architecture, system design, trade-off analysis, complex debugging, and final review. This is where Claude Code, Google Antigravity, and Gemini do what they do best.
* **Tier 2 — Skills (Procedural SOPs)**: Structured markdown routines stored in a local `skills/` directory. These are step-by-step procedures that teach the agent how to execute repeatable jobs - such as running a test-driven development loop or auditing a PR before claiming it's done.
* **Tier 3 — Scripts (0-Token Determinism)**: Local Bash, Python, or Node scripts in a `scripts/` folder. These handle mechanical tasks - checking environment health, formatting data, or filtering logs - in 5 milliseconds for zero tokens.

To keep this hierarchy clean, I use **The 1-2-3 Rule**:

1. **First time**: Work through the task manually with the agent in chat.
2. **Second time**: Document the repeatable sequence as a procedural skill in markdown.
3. **Third time in a week**: Automate it into a local script. 

Never spend LLM tokens on mechanical work that a 10-line script solves for free.

---

### 2. Token Economics & How I Saved 18+ Million Tokens (RTK)

Here is a dirty secret of agentic development: terminal commands are token gluttons.

When an agent runs `git diff`, `git log`, `npm test`, or `ls -la`, the raw shell output gets pushed straight into the model’s context window. A single noisy diff can swallow 50,000 characters without batting an eyelid.

If you do ten commands in a session, you’ve quietly burned hundreds of thousands of tokens on whitespace, unchanged lines, and build boilerplate.

To fix this, I run **RTK (Rust Token Killer)** as a CLI proxy. 

Instead of the agent receiving raw shell output, RTK intercepts common terminal commands (`git status`, `git diff`, `git log`, test runners) and compresses them before they hit the LLM context. It strips boilerplate, deduplicates lines, and delivers only the signal the agent actually needs to make its next decision.

The result? On terminal and git operations, my token savings consistently hover between 60% and 90%. My global RTK counter has recorded over 18 million tokens saved. 

More importantly, because the context window stays clean and uncluttered, the model retains architectural context for hours without drifting or hallucinating.

---

### 3. Single Source of Truth Across Agents (AgentSync)

Like many builders, I don't use just one tool. Depending on the job, I switch between Claude Code in the terminal, Google Antigravity, Gemini CLI, and Cursor.

Early on, keeping instructions aligned across all these platforms was a nightmare. I would update a coding convention in Claude, forget to update Cursor, and spend the afternoon wondering why one was behaving and the other wasn’t.

Now, I use a single-source-of-truth architecture powered by **AgentSync**:

* All master instructions live in one canonical `AGENTS.md` file.
* All shared skills live in a central `skills/` folder.
* Through an `agentsync.toml` configuration, symlinks automatically project these instructions into `CLAUDE.md`, `GEMINI.md`, `ANTIGRAVITY.md`, and `.github/copilot-instructions.md`.

Whenever I refine a rule or add a skill, I update it once in `AGENTS.md`. Every agent across my entire machine updates instantly. Zero drift.

---

### 4. Self-Healing & The Correction Rules Protocol

We’ve all experienced the frustration of an agent apologising for a mistake, only to make the exact same error half an hour later.

My standing rule is simple: **Never correct an agent twice for the same mistake.**

To enforce this, I keep an append-only file called `Correction Rules.md`. 

Whenever an agent makes an erroneous assumption, introduces an anti-pattern, or forgets a project convention, I don't just say "fix that." I make the agent immediately log a single, concise, checkable rule into `Correction Rules.md`.

For example:
* *"Always check if a CLI tool exists before attempting to install an alternative."*
* *"Never report that code is fixed without running deterministic tests directly and inspecting the exit code."*
* *"Surgical edits only - do not reformat adjacent untouched functions."*

Because my master `AGENTS.md` binds the agent to review `Correction Rules.md` before executing work, the system self-heals over time. The longer you build in a repository, the smarter and more disciplined your agents become.

---

### 5. Dual Operational Modes: "Strong Opinion + Creative Upside"

When you pair with an AI, you usually get one of two extremes:
1. The agent acts like a timid yes-man, blindly following your half-baked idea even if it’s technically flawed.
2. The agent gives you a menu of four academic options and asks you to pick one, which isn't helpful when you don't know the deep technical trade-offs.

To solve this, I split agent operations into two explicit cognitive modes:

* **Builder Mode (Execution)**: When writing code or fixing bugs, the agent makes surgical changes, writes the minimum necessary code, runs tests, and delivers finished output with zero preamble.
* **Advisor Mode (Strategy & Architecture)**: When reviewing system architecture, product hooks, or UI design, the agent acts as a senior sparring partner. It is explicitly mandated to push back on fragile assumptions.

And when design choices arise, I enforce the **"Strong Opinion + Creative Upside" Protocol**:
1. Execute the single best solution based on established evidence and good taste.
2. Append 1–2 non-obvious creative ideas or stronger creative angles with a brief rationale that I can greenlight in one word.

You get the speed of ruthless execution paired with the upside of genuine creative collaboration.

---

### 6. Standing on the Shoulders of Giants

None of this was invented in a vacuum. A huge amount of what I use today was influenced and inspired by brilliant minds in the developer and AI communities:

* **The Everything Claude Code (ECC) community**: For demonstrating how modular skills, custom commands, and clean agent setups can turn a CLI into a proper operating system.
* **Anthropic’s Research Team**: Their papers on agent architectures and evaluation loops completely changed how I think about autonomous verification.
* **Boris Cherny & Early Claude Code Explorers**: For proving what's possible when you give an LLM raw terminal access and the freedom to build.
* **The Unix Philosophy**: The timeless idea that tools should do one thing well and communicate through clean text streams remains the best guide for AI orchestration.

Credit where credit is due - I simply adapted their insights into a setup that a non-technical builder could operate reliably.

---

### 7. The Open Source Starter Kit (`agent-starter-kit`)

Rather than just talking about this in an essay, I wanted to give you something tangible you can use today.

I have put together a completely free, open-source template repository containing the foundation of this setup:

👉 **GitHub: github.com/jamescantco-de/agent-starter-kit**

Inside, you will find:
* The production-tested master `AGENTS.md` instruction framework.
* Pre-configured symlinks for Claude Code (`CLAUDE.md`) and Google Gemini / Antigravity (`GEMINI.md`).
* The `Correction Rules.md` self-healing ledger with real starter rules.
* The `agentsync.toml` multi-agent configuration.
* Curated starter skills for test-driven development (`tdd-workflow`), verification gates (`verification-loop`), script optimisation (`script-optimizer`), and authentic tone (`brand-voice`).
* A 0-token setup health verification script (`scripts/verify_setup.sh`).

You can clone it, customise Section 1 for your own stack, and be up and running in under five minutes.

---

### Final Thoughts

I’m still learning every single day. My setup continues to shift as new models drop and better patterns emerge. 

Building software without a traditional computer science background used to feel like an insurmountable barrier. Today, if you have curiosity, clear systems, and the patience to learn from your mistakes, the barrier is virtually gone.

Hopefully, sharing this setup gives you a head start and saves you a few million tokens along the way.

Please let me know if you give the starter kit a spin or if you have questions about how any of it fits together.

Ta,

James

James Nunn  
Creator, James Can't Code  
[jamescantco.de](https://jamescantco.de) | [@JamesCantCode](https://x.com/JamesCantCode)
