# Workout OS Design System

Derived from the refined Google Stitch output. Screenshots in `reference/` are visual references, not domain-data authority.

## Personality

Focused, technical, premium, calm, minimal, data-driven and strong without aggressive fitness clichés.

## Palette

```ts
background             #131313
surfaceLow             #1C1B1B
surface                #201F1F
surfaceHigh            #2A2A2A
surfaceHighest         #353534
textPrimary            #E5E2E1
textSecondary          #BDC9C6
outline                 #879391
outlineVariant          #3D4947
primary                 #71D7CD
primaryContainer        #4DB6AC
success                 #90D792
warning                 #E8C36A
error                   #FFB4AB
```

## Typography

Stitch reference:

- Hanken Grotesk for general UI.
- JetBrains Mono for numeric workout data.

Do not commit/share font binaries as part of this bootstrap. During implementation use platform fallbacks until the project owner chooses the font-loading/package strategy.

Recommended roles:

- display: 32 / bold
- headline: 20 / semibold
- body: 16 / regular
- body-small: 14 / regular
- data-large: 24 / semibold / monospaced
- data-small: 12 / medium / monospaced
- label-caps: 11 / bold / tracked

## Geometry

- 4dp baseline grid
- 16dp horizontal screen edge
- 12dp standard card radius
- 8dp small controls
- >= 48dp critical touch target

Use tonal layers and low-contrast outlines instead of shadows/glass effects.

## Navigation

Bottom tabs:

1. Home
2. Workouts
3. History
4. Library

Settings is secondary access, not a fifth core tab.

Hide bottom tabs during Active Workout.

## Active Workout

Highest-priority interaction.

- continuous vertical list of exercise cards;
- compact set table: `SET | PREV | KG | REPS | RIR | ✓`;
- `PREV` one line e.g. `40×12`;
- direct numeric entry first; optional steppers only when genuinely faster;
- completed row uses restrained success tint;
- timer sticky above safe area/footer;
- timer shows originating exercise;
- no decorative/dead space;
- no recommendation or “next load” UI.

## Progress indicators

Only render progress if semantics are explicit. `2 of 5 exercises` is valid if computed from session state. A bare teal bar with no defined meaning is invalid.

## Exercise detail

- exercise name once;
- compact media;
- tabs About / History / Execution;
- no global Log Set action;
- muscle/equipment information compact;
- video is support content, not dominant hero content.

## Workout complete

Calm confirmation, not gamified celebration.

Set history preserves resistance/reps coupling:

`40 kg × 12`, `40 kg × 11`, `37.5 kg × 12`.

Use `working sets` when warm-ups may exist.

## Anti-patterns

- bodybuilding stock-photo identity;
- neon/cyberpunk;
- social feed;
- giant motivational copy;
- meaningless volume KPI on home;
- arbitrary scores/percentages;
- “95% exercise match”;
- automatic progression messages;
- dense analytics dashboard on Home.
