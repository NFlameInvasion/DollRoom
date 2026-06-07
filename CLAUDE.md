<!-- GSD:project-start source:PROJECT.md -->

## Project

**Doll Room**

Уютная изометрическая 2.5D комната — симулятор жизни для девочек 6–12 лет. Персонаж, похожий на Эльзу, перемещается по пяти комнатам, взаимодействует с предметами (вкл/выкл приборы и свет), ухаживает за питомцами.

**Core Value:** Персонаж свободно перемещается по комнатам и может включать/выключать интерактивные объекты. Всё остальное — улучшения поверх этого.

### Constraints

- **Tech Stack**: React + Vite + TypeScript + TailwindCSS + Phaser 3
- **State Management**: Zustand (мост между React UI и Phaser)
- **Graphics**: Спрайтовая 2.5D с Y-sorting
- **Управление**: Mouse + Touch (оба должны работать)
- **Packaging**: Упаковка в iOS/Android через Capacitor (без переписывания на Swift/Kotlin)

<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->

## Technology Stack

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Phaser 3 | ~3.80.x | Game engine (WebGL renderer, scenes, input) | Mature 2D game engine with built-in TypeScript defs, Arcade physics, pointer/touch input, scene management |
| React | ~19.x | UI shell (menus, HUD, settings) | Industry standard, mounts Phaser canvas via ref, never renders game sprites |
| Vite | ~6.x | Build tool | Sub-second HMR, native TS/JSX, fast asset handling |
| TypeScript | ~5.7+ | Language | Phaser ships `.d.ts`, TS prevents scene-key typos and config errors |
| TailwindCSS | ~4.x | React UI styling | CSS-first v4 removes config file, never for game rendering |
| Zustand | ~5.x | State bridge between React and Phaser | 1KB, works outside React (`getState()`), selector subscriptions prevent cascading re-renders |
| Howler.js | latest | Audio engine | More reliable than Phaser's built-in audio on iOS Safari; handles AudioContext unlock, sprite sheets |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| idb-keyval | latest | IndexedDB wrapper | Save/load persistence (JSON blob format) |
| TexturePacker | latest | Sprite atlas generation | Production asset pipeline, GPU-friendly atlases |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint + Prettier | Code quality | Standard TS setup |
| Capacitor | iOS/Android wrapper | Phase 5+; no code changes needed |

## Installation

# Core

# Dev dependencies

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Phaser 3 | PixiJS | PixiJS is renderer-only (no scenes, physics, audio); use only for custom engine |
| Zustand | Redux | Redux is 11KB for what Zustand does in 1KB; no benefit for single-page game |
| Zustand | React Context | Context causes cascading re-renders; Zustand has selector subscriptions |
| Phaser built-in audio | Howler.js | Howler when iOS audio reliability matters |
| Vite | Webpack | Webpack is slower; Vite is standard for new TS projects |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| create-react-app | Deprecated; replaced by Vite | Vite |
| react-phaser-fiber | Unmaintained since 2022, breaks on Phaser updates | Direct Phaser + Zustand bridge |
| Next.js / SSR | Game engines are client-only; SSR ships empty canvas | Vite SPA |
| Three.js | 700KB 3D engine for 2.5D game | Phaser 3 |
| GSAP | Phaser has built-in tweens for all needs | Phaser tweens |
| phaser3-plugin-isometric | Unverified mobile performance; own the math | Custom isometric coordinate system |
| Redux | Too heavy for single-page game | Zustand |

## Isometric Coordinate Math (Critical)

## Phase-Specific Stack Rollout

- **Phase 1 (Skeleton):** Phaser 3 + Vite + TypeScript + Zustand. No React yet.
- **Phase 2 (Rooms):** Add isometric coordinate utility, tile map rendering.
- **Phase 3 (UI + Interaction):** Add React 19 + TailwindCSS + Howler.js.
- **Phase 4 (Content):** TexturePacker atlas, save/load.
- **Phase 5 (Polish):** Service Worker caching, PWA, Capacitor.

## Mobile Edge Cases

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
