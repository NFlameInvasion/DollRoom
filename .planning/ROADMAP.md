# Roadmap: Doll Room

**Doll Room** — an isometric life simulator for girls ages 6-12. A character (Elsa-like) moves through five rooms, interacts with objects (on/off), and cares for a pet dog.

**Core Value:** The character moves freely through rooms and can turn interactive objects on and off. Everything else is an enhancement on top of this.

---

## Phases

- [ ] **Phase 1: Project Skeleton** - Vite + Phaser + Zustand scaffold with singleton mount pattern
- [ ] **Phase 2: Isometric Room System** - 5 rooms with Y-sorting and camera pan
- [ ] **Phase 3: Character + Interaction + UI** - Player movement, interactive objects, React HUD
- [ ] **Phase 4: Pet System + Save/Load** - Dog entity, feed interaction, persistence
- [ ] **Phase 5: Polish + Mobile** - Audio, loading screens, Capacitor, PWA

---

## Phase Details

### Phase 1: Project Skeleton
**Goal**: The application bootstraps correctly with React hosting a Phaser canvas and Zustand bridging the two systems
**Depends on**: Nothing
**Requirements**: UI-01, UI-02
**Success Criteria** (what must be TRUE):
  1. Phaser 3 canvas renders inside a React component (GameShell) without render loop conflicts
  2. Zustand store exists and is readable/writable from both the React component tree and Phaser game code
  3. Vite dev server starts with sub-second HMR and the empty game scene displays in browser
  4. Source code is organized into three layers (React, Zustand, Phaser) with no circular imports
**Plans**: TBD
**UI hint**: yes

### Phase 2: Isometric Room System
**Goal**: Players can see and navigate between five isometric rooms with correct depth sorting
**Depends on**: Phase 1
**Requirements**: ROOM-01, ROOM-02, ROOM-03
**Success Criteria** (what must be TRUE):
  1. Five distinct rooms (spalnya, gostinaya, kuhnya, vanna, igrovaya) are rendered in isometric projection
  2. Furniture and room elements are depth-sorted by Y-coordinate so nearer objects render in front of farther ones
  3. Camera pans smoothly between rooms when the player moves between them (no black screen, no scene restart)
  4. Each room has a defined tile map with walkable and non-walkable areas
**Plans**: TBD

### Phase 3: Character + Interaction + UI
**Goal**: Players can move the character through rooms with point-and-click, interact with objects, and see game info on a HUD
**Depends on**: Phase 2
**Requirements**: CHAR-01, CHAR-02, CHAR-03, OBJ-01, OBJ-02, OBJ-03, UI-03
**Success Criteria** (what must be TRUE):
  1. Elsa-like character sprite appears in the starting room with an idle animation loop
  2. Player clicks/taps any walkable tile and the character walks there with a matching walk animation
  3. Character transitions smoothly between rooms through designated doorway tiles, with the camera following
  4. Player clicks interactive objects (light, kettle, hairdryer, TV) and each toggles on/off with a visible sprite change or animation
  5. React HUD overlay (pointer-events-none) displays above the Phaser canvas, showing current room name and interaction prompts
**Plans**: TBD
**UI hint**: yes

### Phase 4: Pet System + Save/Load
**Goal**: A dog pet enriches the world, and all game state persists across sessions
**Depends on**: Phase 3
**Requirements**: PET-01, PET-02, SAVE-01, SAVE-02
**Success Criteria** (what must be TRUE):
  1. Dog sprite appears in rooms and follows basic behavior (follows player or stays in room)
  2. Player can interact with the dog (feed action) with visible animation/feedback
  3. Game state (character position, object on/off states, pet state) persists via localStorage or IndexedDB
  4. Game loads from saved state on restart -- character position, object states, and pet state resume exactly as saved
**Plans**: TBD

### Phase 5: Polish + Mobile
**Goal**: The game is production-ready for web and mobile app stores
**Depends on**: Phase 4
**Requirements**: (none -- delivery quality, all v1 requirements covered in Phases 1-4)
**Success Criteria** (what must be TRUE):
  1. Ambient background audio and sound effects play correctly, including iOS audio context unlock
  2. A loading screen displays during asset loading before the game starts
  3. Game builds and runs inside a Capacitor wrapper on iOS and Android without code changes
  4. Game can be installed as a PWA with offline cached assets for repeat play
**Plans**: TBD
**UI hint**: yes

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Skeleton | 0/0 | Not started | - |
| 2. Isometric Room System | 0/0 | Not started | - |
| 3. Character + Interaction + UI | 0/0 | Not started | - |
| 4. Pet System + Save/Load | 0/0 | Not started | - |
| 5. Polish + Mobile | 0/0 | Not started | - |

---

## Requirement Coverage

| Requirement | Phase | Status |
|-------------|-------|--------|
| UI-01 | Phase 1 | Pending |
| UI-02 | Phase 1 | Pending |
| ROOM-01 | Phase 2 | Pending |
| ROOM-02 | Phase 2 | Pending |
| ROOM-03 | Phase 2 | Pending |
| CHAR-01 | Phase 3 | Pending |
| CHAR-02 | Phase 3 | Pending |
| CHAR-03 | Phase 3 | Pending |
| OBJ-01 | Phase 3 | Pending |
| OBJ-02 | Phase 3 | Pending |
| OBJ-03 | Phase 3 | Pending |
| UI-03 | Phase 3 | Pending |
| PET-01 | Phase 4 | Pending |
| PET-02 | Phase 4 | Pending |
| SAVE-01 | Phase 4 | Pending |
| SAVE-02 | Phase 4 | Pending |

**Coverage:** 16/16 requirements mapped (100%). Phase 5 covers delivery quality only.

---

*Roadmap created: 2026-06-07*
