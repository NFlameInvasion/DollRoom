# Doll Room

## What This Is

Уютная изометрическая 2.5D комната — симулятор жизни для девочек 6–12 лет. Персонаж, похожий на Эльзу, перемещается по пяти комнатам, взаимодействует с предметами (вкл/выкл приборы и свет), ухаживает за питомцами.

## Core Value

Персонаж свободно перемещается по комнатам и может включать/выключать интерактивные объекты. Всё остальное — улучшения поверх этого.

## Current Milestone: v2.0 Room Overhaul + Graphics

**Goal:** Полностью переработать визуальное качество и архитектуру комнат на основе фидбека после v1 MVP.

**Target features:**
- Удаление собаки (блокирует pathfinding)
- Добавление мебели (кровать, диван, стол, холодильник, шкафы)
- Новая планировка: главная комната по центру, остальные вокруг с прямыми переходами
- Исправление переключения света
- Удаление видимой плитки с пола, комнаты длиннее
- Стены: фоновая стена (кондиционер, выключатели) + боковые стены
- Улучшение графики — более реалистичные и детальные предметы

## Requirements

### Validated

(v1 MVP shipped on 2026-06-08)

- [x] **CHAR-01**: Персонаж (стиль Эльзы) отображается в изометрической комнате
- [x] **CHAR-02**: Персонаж перемещается по клику/тапу (point-and-click movement)
- [x] **CHAR-03**: Персонаж переходит между комнатами
- [x] **OBJ-01**: Интерактивные объекты (свет, чайник, фен, телевизор) — вкл/выкл
- [x] **ROOM-01**: 5 комнат: спальня, гостиная, кухня, ванна, игровая
- [x] **ROOM-02**: Изометрический рендеринг с Y-sorting
- [x] **PET-01**: Питомец (собака) — можно покормить

### Active

(Defined in REQUIREMENTS.md for v2.0)

### Out of Scope

- Механика воды/пены в ванной — defer
- Смена одежды персонажа — defer
- Мультиплеер — не планируется
- Генерация изображений/спрайтов через AI — нецелесообразно

## Context

- Целевая платформа: Web (браузер, планшет), в будущем iOS/Android через Capacitor
- Управление: мышь (point-and-click) и тачскрин
- Визуальный стиль: изометрия (2.5D), LEGO-like (яркие цвета, чёткие формы, уют)
- Исходное описание в Readme.md содержит полный Technical Design и план на 14 дней

## Constraints

- **Tech Stack**: React + Vite + TypeScript + TailwindCSS + Phaser 3
- **State Management**: Zustand (мост между React UI и Phaser)
- **Graphics**: Спрайтовая 2.5D с Y-sorting
- **Управление**: Mouse + Touch (оба должны работать)
- **Packaging**: Упаковка в iOS/Android через Capacitor (без переписывания на Swift/Kotlin)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Phaser 3 + React | Мощный 2D-движок с изометрической поддержкой, React для UI | Validated in v1 |
| Zustand | Лёгкий мост между React и Phaser | Validated in v1 |
| Начинать с персонажа + объектов | Самая важная механика — движение и интерактивность | Validated in v1 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-08 after v2.0 milestone start*
