export const TileType = {
  Floor: 0,
  Wall: 1,
  Furniture: 2,
  Doorway: 3,
  Empty: 4,
} as const

export type TileType = (typeof TileType)[keyof typeof TileType]

export interface TileDef {
  type: number
  walkable: boolean
  color: string
  height?: number
}

const FLOOR_DEF: TileDef = { type: TileType.Floor, walkable: true, color: '#d4c5a9' }
const WALL_DEF: TileDef = { type: TileType.Wall, walkable: false, color: '#8b7d6b', height: 2 }
const FURN_DEF: TileDef = { type: TileType.Furniture, walkable: false, color: '#a0522d', height: 1 }
const DOOR_DEF: TileDef = { type: TileType.Doorway, walkable: true, color: '#b8a88a' }
const EMPTY_DEF: TileDef = { type: TileType.Empty, walkable: false, color: '#1a1a2e' }

export const TILE_DEFS: Record<number, TileDef> = {
  [TileType.Floor]: FLOOR_DEF,
  [TileType.Wall]: WALL_DEF,
  [TileType.Furniture]: FURN_DEF,
  [TileType.Doorway]: DOOR_DEF,
  [TileType.Empty]: EMPTY_DEF,
}

export interface RoomData {
  id: string
  name: string
  cols: number
  rows: number
  grid: number[][]
  doorways: { tileX: number; tileY: number; targetRoomId: string }[]
}

const _ = TileType.Empty
const F = TileType.Floor
const W = TileType.Wall
const D = TileType.Doorway

const SPALNYA: RoomData = {
  id: 'spalnya',
  name: 'Спальня',
  cols: 10,
  rows: 8,
  grid: [
    [_, _, _, _, _, _, _, _, _, _],
    [_, W, W, W, W, W, W, W, W, _],
    [_, W, F, F, F, F, F, F, W, _],
    [_, W, F, F, F, F, F, F, W, _],
    [_, W, F, F, F, F, F, F, W, _],
    [_, W, F, F, D, F, F, F, W, _],
    [_, W, W, W, W, W, W, W, W, _],
    [_, _, _, _, _, _, _, _, _, _],
  ],
  doorways: [{ tileX: 4, tileY: 5, targetRoomId: 'gostinaya' }],
}

const GOSTINAYA: RoomData = {
  id: 'gostinaya',
  name: 'Гостиная',
  cols: 12,
  rows: 10,
  grid: [
    [_, _, _, _, _, _, _, _, _, _, _, _],
    [_, W, W, W, W, W, W, W, W, W, W, _],
    [_, W, F, F, F, F, F, F, F, F, W, _],
    [_, W, F, F, F, F, F, F, F, F, W, _],
    [_, W, F, F, F, F, F, F, F, F, W, _],
    [_, W, F, F, F, F, F, F, F, F, W, _],
    [_, W, F, F, D, F, F, D, F, F, W, _],
    [_, W, F, F, F, F, F, F, F, F, W, _],
    [_, W, W, W, W, W, W, W, W, W, W, _],
    [_, _, _, _, _, _, _, _, _, _, _, _],
  ],
  doorways: [
    { tileX: 4, tileY: 6, targetRoomId: 'spalnya' },
    { tileX: 7, tileY: 6, targetRoomId: 'kuhnya' },
  ],
}

const KUHNYA: RoomData = {
  id: 'kuhnya',
  name: 'Кухня',
  cols: 10,
  rows: 8,
  grid: [
    [_, _, _, _, _, _, _, _, _, _],
    [_, W, W, W, W, W, W, W, W, _],
    [_, W, F, F, F, F, F, F, W, _],
    [_, W, F, F, F, F, F, F, W, _],
    [_, W, F, F, F, F, F, F, W, _],
    [_, W, F, F, F, F, D, F, W, _],
    [_, W, W, W, W, W, W, W, W, _],
    [_, _, _, _, _, _, _, _, _, _],
  ],
  doorways: [{ tileX: 6, tileY: 5, targetRoomId: 'gostinaya' }],
}

const VANNA: RoomData = {
  id: 'vanna',
  name: 'Ванная',
  cols: 8,
  rows: 8,
  grid: [
    [_, _, _, _, _, _, _, _],
    [_, W, W, W, W, W, W, _],
    [_, W, F, F, F, F, W, _],
    [_, W, F, F, F, F, W, _],
    [_, W, F, F, F, F, W, _],
    [_, W, F, D, F, F, W, _],
    [_, W, W, W, W, W, W, _],
    [_, _, _, _, _, _, _, _],
  ],
  doorways: [{ tileX: 3, tileY: 5, targetRoomId: 'gostinaya' }],
}

const IGROVAYA: RoomData = {
  id: 'igrovaya',
  name: 'Игровая',
  cols: 10,
  rows: 8,
  grid: [
    [_, _, _, _, _, _, _, _, _, _],
    [_, W, W, W, W, W, W, W, W, _],
    [_, W, F, F, F, F, F, F, W, _],
    [_, W, F, F, F, F, F, F, W, _],
    [_, W, F, F, F, F, F, F, W, _],
    [_, W, F, D, F, F, F, F, W, _],
    [_, W, W, W, W, W, W, W, W, _],
    [_, _, _, _, _, _, _, _, _, _],
  ],
  doorways: [{ tileX: 3, tileY: 5, targetRoomId: 'gostinaya' }],
}

export const ROOMS: Record<string, RoomData> = {
  spalnya: SPALNYA,
  gostinaya: GOSTINAYA,
  kuhnya: KUHNYA,
  vanna: VANNA,
  igrovaya: IGROVAYA,
}

export const START_ROOM_ID = 'spalnya'
