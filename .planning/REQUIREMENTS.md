# Requirements: Doll Room

**Defined:** 2026-06-07
**Core Value:** Персонаж свободно перемещается по комнатам и может включать/выключать интерактивные объекты

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Rooms

- [ ] **ROOM-01**: 5 изометрических комнат — спальня, гостиная, кухня, ванна, игровая
- [ ] **ROOM-02**: Комнаты рендерятся с правильным Y-sorting (depth по изометрической координате)
- [ ] **ROOM-03**: Персонаж плавно переходит между комнатами (camera pan, не black screen)

### Character

- [ ] **CHAR-01**: Персонаж (визуальный стиль Эльзы) отображается в изометрической комнате
- [ ] **CHAR-02**: Персонаж перемещается по клику/тапу (point-and-click movement) с анимацией ходьбы
- [ ] **CHAR-03**: Анимации — idle, walk, interact

### Interactive Objects

- [ ] **OBJ-01**: Базовый класс интерактивного объекта (клик/тап для взаимодействия)
- [ ] **OBJ-02**: Объекты с состоянием вкл/выкл: свет, чайник, фен, телевизор
- [ ] **OBJ-03**: Визуальная обратная связь при взаимодействии (смена спрайта/анимация)

### Pets

- [ ] **PET-01**: Собака присутствует в комнатах
- [ ] **PET-02**: Собаку можно покормить (интерактивное взаимодействие)

### UI / Shell

- [ ] **UI-01**: Phaser canvas смонтирован в React (GameShell)
- [ ] **UI-02**: Zustand store как мост между Phaser и React
- [ ] **UI-03**: HUD overlay (React, pointer-events-none)

### Save / Load

- [ ] **SAVE-01**: Состояние игры сохраняется (localStorage / IndexedDB)
- [ ] **SAVE-02**: Игра загружается из сохранения при старте

## v2 Requirements

Deferred to future release.

### Pets

- **PET-03**: Котик (покормить, погладить)
- **PET-04**: Рыбки (покормить)

### Advanced Interactions

- **OBJ-04**: Механика воды/пены в ванне
- **OBJ-05**: Фен для сушки волос
- **OBJ-06**: Еда (мороженое, сок) — анимация + шкалы

### Customization

- **CUST-01**: Смена одежды персонажа
- **CUST-02**: Декорирование комнат (обои, мебель)

### Social

- **SOCL-01**: Обниматься с NPC
- **SOCL-02**: Собирать игрушки

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multiplayer | Не планируется |
| AI-генерация спрайтов | Нецелесообразно |
| Микротранзакции | Целевая аудитория — дети |
| Текст/чат | Безопасность детей |
| Озвучка голосом | Высокая сложность для MVP |

## Traceability

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

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

**Note:** Phase 5 (Polish + Mobile) covers delivery quality (audio, loading screens, Capacitor, PWA) and has no specific requirement IDs. All 16 v1 requirements are fully covered in Phases 1-4.

---
*Requirements defined: 2026-06-07*
*Last updated: 2026-06-07 after roadmap creation*
