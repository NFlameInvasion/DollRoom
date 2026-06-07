# Pitfalls Research

**Domain:** Isometric Life Simulator / Children's Game (Phaser 3 + React)
**Researched:** 2026-06-07
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: React-Phaser Render Loop Conflict

**What goes wrong:** React re-renders destroy and recreate the Phaser Game instance. Canvas flickers, game state resets, orphaned instances leak memory.

**Why it happens:** React's virtual DOM reconciliation fights Phaser's `requestAnimationFrame` loop. When parent state changes, the component unmounts the Phaser canvas div.

**How to avoid:**
- Mount Phaser as an uncontrolled singleton. `Phaser.Game` lives outside React's component tree.
- Use `useEffect(() => { new Phaser.Game(config); return () => game.destroy(true); }, [])` — empty deps, never re-run.
- Wrap game container in `React.memo`.

**Warning signs:** Scene `create()` fires multiple times; canvas flashes on state changes.

**Phase to address:** Phase 1 (Skeleton).

---

### Pitfall 2: Split Game State (React + Phaser Each Owning State)

**What goes wrong:** Character position, inventory, room state exist in both React context and Phaser scene data. Copies drift apart.

**How to avoid:**
- Single source of truth in Zustand. Phaser is a renderer — never holds authoritative state.
- Unidirectional data flow: Input → Action → Store Update → Render (Phaser + React).
- Only ephemeral visual flags live in Phaser.

**Warning signs:** `this.gameState` mutated inside Phaser scenes; save/load serializes two separate blobs.

**Phase to address:** Phase 1 (Skeleton).

---

### Pitfall 3: Naive Isometric Y-Sorting Without Z-Awareness

**What goes wrong:** Characters float above furniture, flicker on overlap. Tall objects (bookshelves) clip through characters above them.

**How to avoid:**
- True isometric depth: `depth = (tileX + tileY) * TILE_HEIGHT + verticalOffset`
- Sort per-frame for moving objects using Phaser's `displayList.sort()`
- Group by layer: floor (no sort), furniture+characters (per-frame), effects (always on top)

**Warning signs:** Sprites set `depth` once in `create()` and never update it; adding a chair causes other objects to render incorrectly.

**Phase to address:** Phase 2 (Room Rendering).

---

### Pitfall 4: Children's Touch Targets Below Accessibility Thresholds

**What goes wrong:** Children under 8 cannot reliably tap small buttons or drag to small drop zones.

**How to avoid:**
- Minimum touch target: 64px (recommended for ages 4-8)
- 72px minimum for drag-and-drop zones
- Invisible hit area padding via Phaser's `setInteractive()` with custom hit area
- Touch debouncing: ignore touches within 200ms of the last accepted touch
- Visual feedback on every touch (highlight, scale bounce)

**Warning signs:** Testers under 8 miss taps repeatedly; children tap the same button multiple times.

**Phase to address:** Phase 1 (Skeleton) for touch system; validated in Phase 3 playtesting.

---

### Pitfall 5: Tile-By-Tile Movement Without Visual Continuity

**What goes wrong:** Characters snap between isometric tile positions with no animation — looks robotic.

**How to avoid:**
- Always animate tile-to-tile movement with tweens (200-300ms per tile)
- Separate logical position (tileX, tileY) from visual position (sprite.x, sprite.y)
- Implement movement buffer queue for rapid taps
- Match sprite orientation to movement direction

**Warning signs:** Character position snaps instantly on tap; tapping far tile teleports the character.

**Phase to address:** Phase 3 (Movement).

---

### Pitfall 6: Phaser Scene Architecture That Fights Room-Based Gameplay

**What goes wrong:** Each room gets its own Phaser Scene. Transitions cause loading delays and state loss.

**How to avoid:**
- Use a single Phaser Scene for the entire game. Rooms are data structures.
- Never use `this.scene.start()` for room switching. Use `camera.pan()` for smooth scrolls.
- Organize objects by room groups, toggle visibility.

**Warning signs:** More than 2 Phaser Scenes; room switching calls `this.scene.start('Kitchen')`.

**Phase to address:** Phase 2 (Room Rendering).

---

### Pitfall 7: Asset Loading Freezes Low-End Devices

**What goes wrong:** On common children's tablets, loading assets freezes the main thread for 2-10 seconds.

**How to avoid:**
- Use Phaser's scene-based preloading with visible animated loading bar
- Split assets into bundles: core first (character, floor tiles), optional in background
- Keep texture atlases under 1024x1024 to reduce decode spikes
- Use animated loading indicator (not static)

**Phase to address:** Phase 1 (Skeleton) for loading system; Phase 4 for asset bundles.

## Moderate Pitfalls

**Pitfall 8: Deeply nested React component trees for game UI** — Cascading re-renders drop Phaser frame rate. Keep game UI flat. Use React.memo.

**Pitfall 9: Ignoring children's cognitive load** — Limit visible options to 3-5. Use progressive disclosure. Replace confirmation dialogs with visible undo buttons.

**Pitfall 10: Input event bleed between Phaser and React** — Use a single pointer abstraction layer. Set `pointer-events: none` on canvas when React modals open.

**Pitfall 11: Inconsistent coordinate systems** — Store persistent positions in tile grid coords only. Use a single module for all conversions.

**Pitfall 12: Children tapping too fast** — Input rate limiting (ignore within 200ms). Limit action queue depth to 1-3.

**Pitfall 13: Tilemap that can't support multi-tile furniture** — Use two-layer system: floor tiles (2D grid) + furniture entities (object list with footprint).

## Minor Pitfalls

- **Phaser particles/tweens not cleaned up** — Clean up in scene `shutdown` events
- **iOS AudioContext not resumed on gesture** — Resume on first tap
- **Orientation change breaks layout** — Listen for `window.resize`, call `game.scale.resize()`
- **Save files using asset keys** — Use stable GUIDs; version the save format

## Phase-Specific Warning Summary

| Phase | Critical Pitfalls |
|-------|-------------------|
| Phase 1 (Skeleton) | React-Phaser loop conflict, dual state, input queue, iOS audio |
| Phase 2 (Rooms) | Naive Y-sorting, multi-tile furniture, coordinate confusion, wrong scene arch |
| Phase 3 (Movement/UI) | Tile-snapping, touch targets too small, deep React tree frame drops |
| Phase 4 (Content) | Save files using asset keys, asset loading freezes |
| Phase 5 (Polish) | Orientation breaks, tween/particle leaks |

---
*Pitfalls research for: Doll Room (isometric life simulator)*
*Researched: 2026-06-07*
