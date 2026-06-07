# Roadmap: Doll Room

**Doll Room** — an isometric life simulator for girls ages 6-12. A character (Elsa-like) moves through five rooms, interacts with objects (on/off), and cares for a pet dog.

**Core Value:** The character moves freely through rooms and can turn interactive objects on and off. Everything else is an enhancement on top of this.

---

## Milestones

- ✅ **v1.0 MVP** — Phases 1-5 (shipped 2026-06-08)
- ✅ **v2.0 Room Overhaul + Graphics** — Phases 6-9 (shipped 2026-06-08)

## Phases

### ✅ v1.0 MVP (Phases 1-5) — SHIPPED 2026-06-08

<details>
<summary>v1.0 MVP — 5 phases, shipped 2026-06-08</summary>

- [x] **Phase 1: Project Skeleton** — Vite + Phaser + Zustand scaffold with singleton mount pattern
- [x] **Phase 2: Isometric Room System** — 5 rooms with Y-sorting and camera pan
- [x] **Phase 3: Character + Interaction + UI** — Player movement, interactive objects, React HUD
- [x] **Phase 4: Pet System + Save/Load** — Dog entity, feed interaction, persistence
- [x] **Phase 5: Polish + Mobile** — Audio, loading screens, Capacitor, PWA

</details>

### ✅ v2.0 Room Overhaul + Graphics (Shipped 2026-06-08)

**Milestone Goal:** Fully redesign the visual quality and room architecture based on feedback from v1 MVP.

- [x] **Phase 6: Cleanup & Fixes** — Remove blocking dog entity, fix light toggle bug
- [x] **Phase 7: Room Layout & Walls** — Linear room layout with walls, no tile grid
- [x] **Phase 8: Furniture** — Decorative furniture across all 5 rooms
- [x] **Phase 9: Graphics Polish** — Improved textures, sprites, shadows, and lighting

---

## Phase Details

### Phase 6: Cleanup & Fixes
**Goal**: Legacy code is cleaned up and core interaction bugs are fixed
**Depends on**: Nothing (first v2.0 phase)
**Requirements**: CHAR-04, OBJ-04
**Success Criteria** (what must be TRUE):
  1. Dog is no longer visible in any room — Dog.ts removed, dog removed from GameScene
  2. Feed dog button no longer appears in the React HUD
  3. Clicking a light that is OFF turns it ON (correct toggle behavior)
  4. Clicking a light that is ON turns it OFF (correct toggle behavior)
**Plans**: TBD

### Phase 7: Room Layout & Walls
**Goal**: Rooms are restructured into a linear layout with walls and no visible tile grid
**Depends on**: Phase 6
**Requirements**: ROOM-04, ROOM-05, ROOM-06, WALL-01, WALL-02
**Success Criteria** (what must be TRUE):
  1. Five rooms are arranged linearly: Living-Kitchen-Bedroom-Bathroom-Playroom with Bedroom at center
  2. Rooms connect side-by-side without doorways — character walks directly between adjacent rooms
  3. Room dimensions are longer than before, and the floor has no visible tile grid
  4. Each room has a back wall at the top edge with an AC unit and light switches visible
  5. Each room has side walls visible on both left and right edges
**Plans**: TBD

### Phase 8: Furniture
**Goal**: All five rooms are furnished with decorative non-interactive objects
**Depends on**: Phase 7
**Requirements**: FURN-01, FURN-02, FURN-03, FURN-04, FURN-05, FURN-06, FURN-07, FURN-08, FURN-09, FURN-10, FURN-11, FURN-12, FURN-13, FURN-14
**Success Criteria** (what must be TRUE):
  1. All 5 rooms have their assigned furniture visible and correctly positioned ✓
  2. Furniture items are depth-sorted correctly in isometric projection ✓
  3. None of the furniture items respond to click/tap — they are purely decorative ✓
**Status**: Complete 2026-06-08

### Phase 9: Graphics Polish
**Goal**: Visual quality of all game elements is improved with procedural canvas textures
**Depends on**: Phase 8
**Requirements**: GFX-01, GFX-02, GFX-03, GFX-04
**Success Criteria** (what must be TRUE):
  1. All interactive objects (light, kettle, hairdryer, TV, switches) show visibly improved detail ✓
  2. The character sprite has visibly more detail and looks more realistic ✓
  3. Wall and floor surfaces show realistic textures (not flat colors) ✓
  4. Drop shadows are visible under objects and the character in all rooms ✓
  5. Lighting effects (e.g., light cone from lamps, glow from light switches) are visible when objects are on ✓
**Status**: Complete 2026-06-08

---

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Project Skeleton | v1.0 | 0/0 | Complete | 2026-06-08 |
| 2. Isometric Room System | v1.0 | 0/0 | Complete | 2026-06-08 |
| 3. Character + Interaction + UI | v1.0 | 0/0 | Complete | 2026-06-08 |
| 4. Pet System + Save/Load | v1.0 | 0/0 | Complete | 2026-06-08 |
| 5. Polish + Mobile | v1.0 | 0/0 | Complete | 2026-06-08 |
| 6. Cleanup & Fixes | v2.0 | 0/0 | Complete | 2026-06-08 |
| 7. Room Layout & Walls | v2.0 | 0/0 | Complete | 2026-06-08 |
| 8. Furniture | v2.0 | 14/14 | Complete | 2026-06-08 |
| 9. Graphics Polish | v2.0 | 4/4 | Complete | 2026-06-08 |

---

## Requirement Coverage

### v1.0 (Shipped)

| Requirement | Phase | Milestone | Status |
|-------------|-------|-----------|--------|
| UI-01 | Phase 1 | v1.0 | Done |
| UI-02 | Phase 1 | v1.0 | Done |
| ROOM-01 | Phase 2 | v1.0 | Done |
| ROOM-02 | Phase 2 | v1.0 | Done |
| ROOM-03 | Phase 2 | v1.0 | Done |
| CHAR-01 | Phase 3 | v1.0 | Done |
| CHAR-02 | Phase 3 | v1.0 | Done |
| CHAR-03 | Phase 3 | v1.0 | Done |
| OBJ-01 | Phase 3 | v1.0 | Done |
| OBJ-02 | Phase 3 | v1.0 | Done |
| OBJ-03 | Phase 3 | v1.0 | Done |
| UI-03 | Phase 3 | v1.0 | Done |
| PET-01 | Phase 4 | v1.0 | Done |
| PET-02 | Phase 4 | v1.0 | Done |
| SAVE-01 | Phase 4 | v1.0 | Done |
| SAVE-02 | Phase 4 | v1.0 | Done |

### v2.0 (Active)

| Requirement | Phase | Milestone | Status |
|-------------|-------|-----------|--------|
| CHAR-04 | Phase 6 | v2.0 | Pending |
| OBJ-04 | Phase 6 | v2.0 | Pending |
| ROOM-04 | Phase 7 | v2.0 | Pending |
| ROOM-05 | Phase 7 | v2.0 | Pending |
| ROOM-06 | Phase 7 | v2.0 | Pending |
| WALL-01 | Phase 7 | v2.0 | Pending |
| WALL-02 | Phase 7 | v2.0 | Pending |
| FURN-01 | Phase 8 | v2.0 | Done |
| FURN-02 | Phase 8 | v2.0 | Done |
| FURN-03 | Phase 8 | v2.0 | Done |
| FURN-04 | Phase 8 | v2.0 | Done |
| FURN-05 | Phase 8 | v2.0 | Done |
| FURN-06 | Phase 8 | v2.0 | Done |
| FURN-07 | Phase 8 | v2.0 | Done |
| FURN-08 | Phase 8 | v2.0 | Done |
| FURN-09 | Phase 8 | v2.0 | Done |
| FURN-10 | Phase 8 | v2.0 | Done |
| FURN-11 | Phase 8 | v2.0 | Done |
| FURN-12 | Phase 8 | v2.0 | Done |
| FURN-13 | Phase 8 | v2.0 | Done |
| FURN-14 | Phase 8 | v2.0 | Done |
| GFX-01 | Phase 9 | v2.0 | Done |
| GFX-02 | Phase 9 | v2.0 | Done |
| GFX-03 | Phase 9 | v2.0 | Done |
| GFX-04 | Phase 9 | v2.0 | Done |

**Coverage:** 25/25 v2.0 requirements mapped (100%). 16/16 v1.0 shipped.

---

*Roadmap created: 2026-06-07 (v1.0). v2.0 phases added: 2026-06-08*
