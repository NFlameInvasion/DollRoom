# STATE: Doll Room

> Isometric life simulator for girls ages 6-12. Last updated during roadmap creation.

---

## Project Reference

**Core Value**: The character moves freely through rooms and can turn interactive objects on and off. Everything else is an enhancement on top of this.

**Current Focus**: Roadmap creation (Phase structure and success criteria defined)

**Milestone**: v1 MVP

---

## Current Position

- **Phase**: 0 (roadmapping)
- **Plan**: None yet
- **Status**: Roadmap drafted, awaiting approval
- **Progress**: [###-----------------------] 5%

---

## Performance Metrics

_(To be tracked during development)_

| Metric | Target | Current |
|--------|--------|---------|
| Phase completion rate | N/A | 0/5 |
| Requirement coverage | 100% | 16/16 (100%) |
| Plans per phase | TBD | 0 |

---

## Accumulated Context

### Decisions

| # | Decision | Rationale | Status |
|---|----------|-----------|--------|
| 1 | Phaser 3 + React | Game engine for isometric rendering, React for UI shell | Pending validation |
| 2 | Zustand as bridge | Single source of truth between React and Phaser | Pending validation |
| 3 | One Phaser Scene for all rooms | Room switching via camera pan, not scene restart | Pending validation |
| 4 | Start with character + objects | Core mechanic is movement and interactivity | Confirmed in roadmap |

### Technical Constraints

- **Stack**: React + Vite + TypeScript + TailwindCSS + Phaser 3
- **State**: Zustand (bridge between React UI and Phaser)
- **Graphics**: Sprite-based 2.5D with Y-sorting
- **Input**: Mouse + Touch (both must work)
- **Mobile**: Capacitor for iOS/Android packaging
- **Audio**: Howler.js recommended (more reliable than Phaser audio on iOS)

### Critical Pitfalls to Avoid

1. React-Phaser render loop conflict -- Phaser singleton outside React component tree, mount with empty deps
2. Split game state -- Zustand is single source of truth; Phaser only renders
3. Naive Y-sorting -- depth formula: `(tileX + tileY) * TILE_HEIGHT + verticalOffset`
4. Children's touch targets -- 64px minimum touch area, debounce 200ms

### Open Items

- Verify Phaser 3.80+ and Zustand 5+ API compatibility
- UX patterns for children 6-12 -- playtesting recommended
- iOS PWA edge cases and Capacitor plugin APIs need deeper research
- Save format schema stability and migration strategy

### Blocker History

_(None yet)_

---

## Session Continuity

### Last Session (Roadmap Creation)

- Read PROJECT.md, REQUIREMENTS.md, research/SUMMARY.md, config.json
- Identified 16 v1 requirements across 6 categories
- Derived 5 phases with goal-backward success criteria
- Mapped all 16 requirements to Phases 1-4 (Phase 5 is delivery quality)
- Wrote ROADMAP.md, STATE.md

### Next: Await roadmap approval, then `/gsd-plan-phase 1`

---

*State last updated: 2026-06-07*
