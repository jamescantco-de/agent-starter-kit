In the first three parts of this series, we tackled the foundational plumbing: saving 18M tokens on CLI operations, restructuring bloated agent skills into 12 lean SuperSkills, and building a production shield for security and database reliability.

Now let’s talk about something most engineers avoid discussing:

Aesthetic taste.

You can spot a vibe-coded app from a mile away.

It almost always looks the same:
- A generic purple or indigo gradient button.
- Floating white cards on a grey background with zero depth.
- Jittery linear CSS transitions that feel like PowerPoint 2003.
- Tiny 16px icon buttons that are impossible to tap on a mobile screen.
- Text that wraps awkwardly with a single orphan word dangling on the second line.

The dirty secret of frontier LLMs is that they have no innate aesthetic taste.

If you tell Claude or Gemini to "build a landing page with modern UI", it will faithfully reach for the statistical mean of its training data: generic Tailwind UI templates from 2021. It builds interfaces that function, but feel cheap, lifeless, and unmistakably artificial.

I am not a trained UI designer. I lead revenue teams, and my background is commercial. But in enterprise software and consumer apps, taste is not an optional polish. Taste is trust.

If an interface feels tactile, fast, and deliberate, users trust the software with their credit cards and their data. If it feels like a template, they bounce.

Over the past year, I stopped asking agents to "make it look nice". Instead, I translated design engineering and Apple Human Interface Guidelines into deterministic rules.

I call this approach Taste as Code.

Here is how we use the design-polish and motion-engineering SuperSkills to force AI agents to build exceptional interfaces.

---

### 1. The 60-30-10 Rule: Killing the Colour Salad

The fastest way an agent ruins an interface is by using too many competing colours. It will give cards one shade of blue, tags another shade of teal, buttons a purple gradient, and icons orange badges.

The design-polish SuperSkill enforces strict chromatic discipline:
- 60% Dominant Canvas: One primary canvas colour (e.g. Midnight Slate #101420 or Ghost White #F8FAFC).
- 30% Structural Secondary: Subtle card surfaces and borders (e.g. 1px solid rgba(255, 255, 255, 0.08)).
- 10% High-Contrast Accent: A single vibrant accent (e.g. Hyper Pink #FF3388) reserved strictly for primary calls to action and active selection states.

If an element does not trigger an action or convey critical status, the agent is forbidden from giving it a saturated accent colour. This immediately gives apps a clean, editorial look.

---

### 2. Tactile Micro-Spacing & The 44px Law

Great design is physical. It responds to touch and gives immediate feedback.

When humans interact with an app on their phone or trackpad, their brain expects physical resistance. When an agent writes CSS, it rarely adds active states. You tap a button, nothing moves, and you wonder if the app registered your click.

Our design-polish SuperSkill enforces three tactile rules on every interactive element:
1. The 44px Law: Every clickable area must have a minimum bounding target of 44x44 pixels, even if the visible icon is only 16 pixels. No more tapping three times to hit a tiny 'X' button.
2. The Physical Compression State: Buttons must include active:scale-[0.98] with a subtle border glow. When pressed, the element physically compresses like a hardware switch.
3. Optical Balance: Headlines must enforce text-wrap: balance. This browser standard prevents orphan words and formats multi-line titles with balanced optical weight.

---

### 3. Physics Over Easing: Killing Linear Animations

Nothing makes a web app feel cheaper than bad animation.

By default, coding agents write CSS like this:
```css
/* What agents write by default: */
transition: all 0.3s ease-in-out;
```

Ease-in-out is a mathematical bezier curve. It accelerates, travels at a constant velocity, and decelerates abruptly. Nothing in the physical world moves like that. In the real world, objects have mass, tension, and friction.

The motion-engineering SuperSkill completely bans linear transitions in favour of physics-based spring tokens:

```typescript
// The Standardised Spring System:
export const springs = {
  // Snappy: For buttons, toggles, badges, micro-interactions
  snappy: { type: 'spring', stiffness: 400, damping: 28, mass: 0.8 },
  // Smooth: For modals, drawers, expanding cards, dropdowns
  smooth: { type: 'spring', stiffness: 260, damping: 26, mass: 1 },
  // Gentle: For page transitions and large reveals
  gentle: { type: 'spring', stiffness: 180, damping: 24, mass: 1.2 }
};
```

When a modal opens with a smooth spring, it feels organic, fluid, and responsive. It feels like an Apple iOS sheet rather than a website.

Crucially, the SuperSkill automatically pairs this with accessibility: if the user has "Reduce Motion" enabled on their operating system, the spring physics automatically collapses into an instant opacity fade.

---

### 4. Liquid Glass: Apple Materials in Code

On modern Apple platforms, interfaces feel rich because they use depth, blur, and light refraction rather than heavy drop shadows.

When building web and mobile PWAs, our design-polish SuperSkill uses a standardised dynamic glass specification:
- Background: rgba(255, 255, 255, 0.04)
- Backdrop Filter: blur(16px)
- Border: 1px solid rgba(255, 255, 255, 0.12)
- Top Specular Rim: inset 0 1px 0 rgba(255, 255, 255, 0.20)

This creates the illusion that the card is made of frosted optical glass resting above the canvas, catching ambient light from the top edge.

---

### You Don't Need an Eye for Design. You Need Rules.

You do not need to spend five years in design school to build software people fall in love with.

You simply have to stop letting your AI agent guess what good looks like.

By encoding design engineering, spring physics, and Apple HIG into two modular SuperSkills (`design-polish` and `motion-engineering`), you turn subjective taste into deterministic code.

Both design-engineering SuperSkills are open-source and MIT-licensed:

👉 **GitHub: [github.com/jamescantco-de/superskills](https://github.com/jamescantco-de/superskills)**

Inside, you will find the complete design token matrices, tactile spring configurations, and liquid glass styling references ready to plug straight into your agent.

If you haven't checked out the foundational configuration framework (`AGENTS.md`) and token-saving setup, you can find the complete **[Agent Starter Kit](https://github.com/jamescantco-de/agent-starter-kit)** as well.

Drop them into your repository, give your agent a spin on your next UI screen, and see how much faster users trust what you build.

Ta,

James

James Nunn  
Creator, James Can't Code  
[jamescantco.de](https://jamescantco.de) | [@JamesCantCode](https://x.com/JamesCantCode)
