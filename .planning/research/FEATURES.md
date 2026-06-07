# Feature Research

**Domain:** Isometric Life Simulator / Children's Interactive Dollhouse
**Researched:** 2026-06-07
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Multiple rooms (4-8) | Genre convention | MEDIUM | Kitchen, living room, bedroom, bathroom + extras |
| Character movement between rooms | Core navigation mechanic | MEDIUM | Tap-to-walk, animated room transitions |
| Interactive objects with on/off states | Core interaction loop | MEDIUM | Lights, TV, stove, radio, sink, appliances |
| Food preparation | Core play pattern | MEDIUM | Cut, cook, serve, eat cycle |
| Save/load persistence | Must-have for repeat play | MEDIUM-HIGH | Auto-save, multiple slots for siblings |
| Zoom/pan camera | Required for isometric view | MEDIUM | Pinch-to-zoom on tablet, scroll on desktop |
| Ambient sound + object SFX | Immersion | LOW-MEDIUM | Per-room ambience, per-object audio |
| No fail states / scores / timers | Genre philosophy | LOW | Open-ended play, no wrong answers |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Elsa-like magical character with unique powers | Strong character attachment | HIGH | Visual effects, unique animations, transforms objects |
| Pets with deep interaction | High engagement | MEDIUM-HIGH | Follow player, feed, dress up, unique personalities |
| Simple quest/task system | Optional guided play | MEDIUM-HIGH | Visual checklist, rewards furniture/clothes |
| Room decoration | Creative expression | MEDIUM | Paint walls, choose flooring, place furniture |
| Dress-up / fashion system | #1 engagement driver for demographic | MEDIUM | Skin tone, hair, clothes, accessories |
| Collectibles system | Replayability | MEDIUM | Furniture sets, clothing collections, secret items |
| Day/night cycle + weather | Atmosphere | HIGH | Visual variety, routine play patterns |
| Secret/hidden rooms | Discovery | MEDIUM | Locked rooms requiring puzzle solving |
| Music/instrument system | Creative play | LOW-MEDIUM | Playable instruments, characters dance |
| Photo/scene capture | Shareability | MEDIUM | In-game camera, filters, gallery |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| In-app ads | Revenue | Parental rejection, UX destruction | Premium model / one-time purchase |
| Loot boxes / random rewards | Engagement | Regulatory risk, predatory mechanics | Fixed rewards for exploration |
| Competitive leaderboards | Some kids enjoy score | Anxiety, not age-appropriate | Personal achievement tracking |
| Unfiltered text chat | Social feature | Safety risk for children | Pre-written phrases / emoji only |
| Time gates ("wait 4 hours") | Session control | Frustrates kids and parents | Natural play cadence |
| Reading-heavy UI | "Educational" angle | 6-year-olds are emergent readers | Icons + voice-over + minimal text |
| Account requirement | Save sync | COPPA/GDPR-K compliance burden | Guest play with local save |
| Violence/destruction | Some games do it | Brand-inappropriate for dolls | Constructive, nurturing interactions |

## Feature Dependencies

```
Character System
    └──requires──> Room System (tile map, Y-sorting)
    └──requires──> Input System (tap/click to move)

Interactive Objects
    └──requires──> Object State System (on/off)
    └──enhances──> Character System (walk to object, then interact)

Room Transitions
    └──requires──> Room System
    └──requires──> Character System

Pets
    └──requires──> Character System (follow AI)
    └──enhances──> Interactive Objects (feed pet)

Avatar Customization / Dress-up
    └──requires──> Character System (sprite swapping)

Save/Load
    └──requires──> Room System (object states)
    └──requires──> Character System (position, state)
```

### Dependency Notes

- **Interactive Objects depend on Character System**: character must walk to the object before interacting
- **Room Transitions need both Room and Character**: character must be at door, then room swaps
- **Save/Load touches everything**: must be designed early, implemented after core systems stabilize
- **Pets are additive**: can be added after core character and object systems work

## MVP Definition

### Launch With (v1)

- [x] Character movement (tap-to-walk, Elsa-like character)
- [x] 5 rooms (bedroom, living room, kitchen, bathroom, play room)
- [x] Interactive objects (light, kettle, hairdryer, TV, fan) — on/off states
- [x] Room transitions (character walks between rooms)
- [x] Isometric rendering with Y-sorting
- [x] Dog pet (feed interaction)

### Add After Validation (v1.x)

- [ ] Dress-up system (clothes, accessories)
- [ ] More interactive objects (stove, sink, radio, music instruments)
- [ ] Room decoration (wallpaper, flooring, furniture placement)

### Future Consideration (v2+)

- [ ] Day/night cycle
- [ ] More pets (cat, fish)
- [ ] Quest/task system
- [ ] Photo/scene capture
- [ ] Collectibles system
- [ ] Secret rooms
- [ ] Multiplayer

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Character movement | HIGH | MEDIUM | P1 |
| Interactive objects (on/off) | HIGH | MEDIUM | P1 |
| 5 rooms with transitions | HIGH | MEDIUM | P1 |
| Isometric rendering | HIGH | HIGH | P1 |
| Dog pet (feed) | MEDIUM | LOW | P2 |
| Dress-up system | HIGH | MEDIUM | P2 |
| Room decoration | MEDIUM | MEDIUM | P2 |
| Sound effects | MEDIUM | LOW | P2 |
| Save/load persistence | HIGH | MEDIUM | P2 |
| Day/night cycle | MEDIUM | HIGH | P3 |
| Quests / tasks | MEDIUM | HIGH | P3 |
| Photo capture | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---
*Feature research for: Doll Room (isometric life simulator)*
*Researched: 2026-06-07*
