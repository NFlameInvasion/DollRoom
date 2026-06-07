# Stack Research

**Domain:** Isometric Life Simulator / Children's Game (Phaser 3 + React)
**Researched:** 2026-06-07
**Confidence:** MEDIUM

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

```bash
# Core
npm create vite@latest doll-room -- --template react-ts
npm install phaser zustand howler

# Dev dependencies
npm install -D @types/react @types/react-dom tailwindcss
```

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

Phaser has no built-in isometric tilemap engine. Build a lightweight utility:

```
screenX = (tileX - tileY) * (tILE_WIDTH / 2)
screenY = (tileX + tileY) * (tILE_HEIGHT / 2)
sprite.depth = tileX + tileY  // Y-sorting depth
```

Tile recommendation: 64x32 pixels (2:1 ratio) — optimal for mobile GPU fill-rate.

## Phase-Specific Stack Rollout

- **Phase 1 (Skeleton):** Phaser 3 + Vite + TypeScript + Zustand. No React yet.
- **Phase 2 (Rooms):** Add isometric coordinate utility, tile map rendering.
- **Phase 3 (UI + Interaction):** Add React 19 + TailwindCSS + Howler.js.
- **Phase 4 (Content):** TexturePacker atlas, save/load.
- **Phase 5 (Polish):** Service Worker caching, PWA, Capacitor.

## Mobile Edge Cases

1. **iOS audio autoplay:** AudioContext blocked until user gesture — implement "tap to start" screen
2. **PWA fullscreen:** `apple-mobile-web-app-capable` meta tag, `Phaser.Scale.FIT`
3. **Pixel art + retina:** `pixelArt: true, antialias: false` in Phaser config
4. **Low-end Android:** Keep texture atlas under 100MB, prefer RGB565
5. **Touch targets:** 48x48dp minimum for children, 64px recommended

---
*Stack research for: Doll Room (isometric life simulator)*
*Researched: 2026-06-07*
