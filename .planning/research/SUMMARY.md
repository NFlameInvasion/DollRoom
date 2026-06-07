# Project Research Summary

**Project:** Doll Room
**Domain:** Isometric Life Simulator / Children's Interactive Dollhouse
**Researched:** 2026-06-07
**Confidence:** MEDIUM-HIGH

## Executive Summary

Doll Room — уютная изометрическая 2.5D комната-симулятор жизни для девочек 6–12 лет. Игра строится на Phaser 3 с React-оболочкой, используя Zustand как единый мост состояний. Рекомендованный подход: 5 фаз, начиная со скелета проекта (Phaser + Zustand без React) и заканчивая полировкой и упаковкой в Capacitor.

Ключевые риски: конфликт render loop между React и Phaser (фатально), расщепление состояния между двумя системами, наивная Y-sorting в изометрии, и неадаптированные touch-targets для детской аудитории. Все эти риски адресуются в первых фазах.

## Key Findings

### Recommended Stack

**Core technologies:**
- **Phaser 3.80+**: Игровой движок (WebGL renderer, сцены, input)
- **React 19+**: UI-оболочка (меню, HUD, настройки)
- **Vite 6+**: Сборщик (sub-second HMR)
- **TypeScript 5.7+**: Язык
- **Zustand 5+**: Мост состояний между Phaser и React (1KB)
- **Howler.js**: Аудио (надёжнее Phaser audio на iOS)

### Expected Features

**Must have (table stakes):**
- Movement (point-and-click) — character walks between rooms
- Interactive objects with on/off states (light, TV, kettle, hairdryer, fan)
- 5 rooms with smooth transitions — bedroom, living room, kitchen, bathroom, play room
- Isometric rendering with Y-sorting
- Dog pet (feed interaction)

**Should have (competitive):**
- Elsa-like magical character (main differentiator)
- Dress-up / fashion system
- Interactive food preparation
- Room decoration

**Defer (v2+):**
- Day/night cycle, weather
- More pets (cat, fish)
- Quest system, secret rooms
- Multiplayer / photo capture

### Architecture Approach

Трёхслойная архитектура: Phaser (рендеринг игры) — Zustand (мост) — React (UI). Phaser никогда не импортирует React и наоборот. Единственный канал связи — Zustand store. Рекомендуется одна Phaser Scene для всех комнат (room switching через camera pan, не scene restart).

**Major components:**
1. **Phaser Layer** — GameScene, Player entity, InteractiveObj, IsoCoordinate system, Y-sorting
2. **Zustand Bridge** — useGameStore, usePlayerStore, useWorldStore
3. **React Layer** — GameShell, HUD, DialogBox (pointer-events-none overlay)

### Critical Pitfalls

1. **React-Phaser render loop conflict** — Phaser singleton вне React component tree, mount с пустыми deps
2. **Split game state** — Single source of truth в Zustand; Phaser только рендерит
3. **Naive Y-sorting** — `depth = (tileX + tileY) * TILE_HEIGHT + verticalOffset`
4. **Children's touch targets** — 64px minimum, debounce 200ms, visual feedback
5. **Wrong scene architecture** — Одна Phaser Scene для всех комнат, rooms как data structure

## Implications for Roadmap

### Phase 1: Project Skeleton
**Rationale:** Must establish the architectural foundation before any gameplay code
**Delivers:** Vite + Phaser + Zustand scaffold, BootScene, singleton mount pattern, input handling
**Addresses:** Core stack setup
**Avoids:** React-Phaser loop conflict, split state, iOS audio silence
**Research flag:** Verify Phaser 3.80+ and Zustand 5+ API compatibility

### Phase 2: Isometric Room System
**Rationale:** Rooms are the stage for all gameplay — must work before anything else
**Delivers:** IsoCoordinate utility, tile map rendering, Y-sorting, RoomManager, 5 rooms
**Uses:** Phaser tilemap, custom isometric math
**Implements:** Tile map data structure with multi-tile furniture support
**Avoids:** Naive Y-sorting, wrong scene architecture, coordinate confusion

### Phase 3: Character Movement + Interaction + UI
**Rationale:** Core gameplay loop — player moves and interacts with objects
**Delivers:** Player entity with click-to-move, InteractiveObj base class, React HUD overlay, Zustand stores
**Uses:** Phaser tweens, Howler.js, React + TailwindCSS
**Avoids:** Tile-snapping, touch targets too small, deep React tree frame drops
**Research flag:** UX patterns for children — playtesting data needed

### Phase 4: Pet System + Content + Persistence
**Rationale:** Pet enriches the world; save/load is essential for repeat play
**Delivers:** Dog entity (follow AI, feed interaction), save/load system, asset pipeline
**Avoids:** Save files using asset keys, asset loading freezes

### Phase 5: Polish + PWA + Mobile
**Rationale:** Production readiness for web and app stores
**Delivers:** Audio system, loading screens, Capacitor wrapper, PWA, performance tuning
**Research flag:** iOS PWA edge cases, Capacitor plugin APIs

### Phase Ordering Rationale

- **Phase 1 first** because architecture decisions (singleton pattern, state management) are irreversible
- **Phase 2 before Phase 3** because the isometric world must exist before the player can move through it
- **Phase 3 before Phase 4** because interactive objects must work before pet interaction is built on top
- **Phase 5 last** because Capacitor wrapping and PWA only matter when the game is feature-complete

### Research Flags

- **Phase 3**: UX patterns for children 6-12 — playtesting recommended
- **Phase 5**: iOS PWA edge cases, Capacitor plugin APIs need deeper research

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Phaser + React + Zustand is well-established; specific versions need npm verification |
| Features | HIGH | Genre conventions are stable (Toca Boca, My PlayHome, etc.) |
| Architecture | HIGH | Layered bridge pattern is production-proven |
| Pitfalls | MEDIUM | Based on training data patterns; validated via playtesting needed |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Mobile benchmarks**: performance targets for low-end Android tablets need testing
- **Playtesting**: children's UX patterns should be validated with real users
- **Dress-up system**: approach needs deeper research (sprite swapping, layering system)
- **Save format**: schema stability and migration strategy need design
- **Audio**: iOS audio context unlock flow needs device testing

---
*Research completed: 2026-06-07*
*Ready for roadmap: yes*
