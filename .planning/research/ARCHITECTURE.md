# Architecture Research

**Domain:** Isometric Life Simulator / Children's Game (Phaser 3 + React)
**Researched:** 2026-06-07
**Confidence:** HIGH

## Standard Architecture: Layered Bridge

The system uses three distinct layers connected only through Zustand:

```
+--------------------------------------------------------+
|                  React UI Layer (DOM)                   |
|  HUD | Inventory Panel | Dialog Box | Character Screen  |
+---------------------------+----------------------------+
                            |
                    Zustand Store Bridge
                    (shared state + actions)
                            |
+---------------------------+----------------------------+
|                 Phaser Engine Layer (Canvas)            |
|     GameScene: Isometric World | Sprites | Physics      |
+--------------------------------------------------------+
```

**Key principle:** Strict ownership boundaries. Phaser never imports React. React never imports Phaser. Zustand is the ONLY communication channel.

### Component Responsibilities

| Owned By Phaser | Owned By Zustand | Owned By React |
|---|---|---|
| Sprite positions, animations | Player position (synced) | Window layout, CSS |
| Tile map data | Inventory contents | Panel open/close state |
| Physics bodies, collisions | Dialog queue + state | Form inputs |
| Isometric depth sorting | Selected/interacted object | Toast notifications |
| Pathfinding state machine | Game progress | Responsive breakpoints |
| Sound playback | Character stats | Accessibility |
| Camera position | Object states (on/off) | Route transitions |

### Zustand Store Structure

Any state crossing the Phaser-React boundary goes in Zustand. Anything only one layer needs stays in that layer.

- **useGameStore** — Game phase (loading/playing/paused), load progress
- **usePlayerStore** — Position (tile coords), animation state, current action target
- **useWorldStore** — Room object interaction states, room layouts
- **useInventoryStore** — Item list, equipped items, counts
- **useDialogStore** — Open/closed, current lines, speaker, callbacks

## Data Flow Rules

Every user action flows in ONE direction through Zustand:

**React initiates:** `React UI → Zustand action → store state change → Phaser subscribe callback → Phaser game object update`

**Phaser initiates:** `Phaser input → Zustand action → store state change → React re-render (useStore hook)`

**Per-frame reads (Phaser):** Use `store.getState()` (synchronous, no subscription). Never subscribe Phaser to frequently-changing state.

**Throttled high-frequency writes:** Camera position changes 60fps but only needs Zustand sync ~6-10x/sec.

### React Shell Positioning Pattern

```tsx
<div className="relative w-full h-full">
  <div ref={canvasRef} className="w-full h-full" />
  {/* overlay: pointer-events-none lets clicks fall through to canvas */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="pointer-events-auto"><HUD /></div>
  </div>
  <DialogBox />
</div>
```

The `pointer-events-none` on the overlay wrapper is critical — prevents invisible React divs from blocking Phaser canvas input.

## Recommended Project Structure

```
doll-room/
├── src/
│   ├── game/                  # Phaser game code
│   │   ├── scenes/
│   │   │   ├── BootScene.ts
│   │   │   └── RoomScene.ts   # Single scene for all rooms
│   │   ├── entities/
│   │   │   ├── Player.ts
│   │   │   └── InteractiveObj.ts
│   │   ├── systems/
│   │   │   ├── IsoCoordinate.ts  # tile↔screen conversion
│   │   │   ├── YSorting.ts
│   │   │   └── RoomManager.ts
│   │   └── config.ts
│   ├── components/            # React UI components
│   │   ├── GameShell.tsx      # Mounts Phaser canvas
│   │   ├── HUD.tsx
│   │   └── DialogBox.tsx
│   ├── store/                 # Zustand stores
│   │   ├── useGameStore.ts
│   │   ├── usePlayerStore.ts
│   │   └── useWorldStore.ts
│   ├── assets/                # Sprites, audio
│   ├── App.tsx
│   └── main.tsx
├── public/
├── capacitor/                 # iOS/Android config
└── package.json
```

### Structure Rationale

- **game/**: All Phaser code isolated — React never imports from here directly
- **store/**: The bridge layer — both React and Phaser import from here
- **components/**: React UI overlay — imports from store but never from game/

## Anti-Patterns

1. **Phaser calling React setState directly** — Creates circular dependency. Use Zustand.
2. **Unmanaged pointer-events** — React overlays over the game area swallow Phaser input
3. **Per-frame store subscriptions from React** — Component subscribed to player position re-renders 60fps
4. **Zustand as full game state** — Tile maps and sprite positions stay in Phaser scene memory
5. **Phaser DOMElement plugin** — Creates DOM outside React's lifecycle. Let React own all DOM.
6. **Two copies of same state** — If both Phaser and React store player position, they desync

## Build Order (Dependency-Driven)

1. **Phase 1:** Zustand store shells + iso coordinate utility (zero dependencies)
2. **Phase 2:** RoomScene + TileMapManager + isometric rendering + Y-sorting
3. **Phase 3:** PlayerController + click-to-move + interactive objects + basic React HUD
4. **Phase 4:** Pet system (dog), save/load persistence, more room content
5. **Phase 5:** Polish, audio, Capacitor wrapper, PWA

## Capacitor Migration

The clean separation makes Capacitor integration a wrapper layer. Only I/O (save files, in-app purchases, haptics) needs platform-specific adapters, which slot in as Zustand middleware without affecting Phaser or React core logic.

---
*Architecture research for: Doll Room (isometric life simulator)*
*Researched: 2026-06-07*
