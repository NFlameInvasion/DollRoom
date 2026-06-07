export const TileType = {
  Floor: 0,
  Empty: 1,
} as const

export type TileType = (typeof TileType)[keyof typeof TileType]

export interface RoomData {
  id: string
  name: string
  cols: number
  rows: number
  grid: number[][]
  /** Index in the linear sequence (0-4, left to right in isometric) */
  linearIndex: number
  /** Adjacent room connections */
  connections: {
    left?: string
    right?: string
  }
}

const F = TileType.Floor

function makeGrid(cols: number, rows: number, fill = F): number[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(fill))
}

const COLS = 10
const ROWS = 10

const GOSTINAYA: RoomData = {
  id: 'gostinaya',
  name: 'Гостиная',
  cols: COLS,
  rows: ROWS,
  grid: makeGrid(COLS, ROWS),
  linearIndex: 0,
  connections: { right: 'kuhnya' },
}

const KUHNYA: RoomData = {
  id: 'kuhnya',
  name: 'Кухня',
  cols: COLS,
  rows: ROWS,
  grid: makeGrid(COLS, ROWS),
  linearIndex: 1,
  connections: { left: 'gostinaya', right: 'spalnya' },
}

const SPALNYA: RoomData = {
  id: 'spalnya',
  name: 'Спальня',
  cols: COLS,
  rows: ROWS,
  grid: makeGrid(COLS, ROWS),
  linearIndex: 2,
  connections: { left: 'kuhnya', right: 'vanna' },
}

const VANNA: RoomData = {
  id: 'vanna',
  name: 'Ванная',
  cols: COLS,
  rows: ROWS,
  grid: makeGrid(COLS, ROWS),
  linearIndex: 3,
  connections: { left: 'spalnya', right: 'igrovaya' },
}

const IGROVAYA: RoomData = {
  id: 'igrovaya',
  name: 'Игровая',
  cols: COLS,
  rows: ROWS,
  grid: makeGrid(COLS, ROWS),
  linearIndex: 4,
  connections: { left: 'vanna' },
}

export const ROOMS: Record<string, RoomData> = {
  gostinaya: GOSTINAYA,
  kuhnya: KUHNYA,
  spalnya: SPALNYA,
  vanna: VANNA,
  igrovaya: IGROVAYA,
}

export const ROOM_ORDER: RoomData[] = [GOSTINAYA, KUHNYA, SPALNYA, VANNA, IGROVAYA]

export const START_ROOM_ID = 'spalnya'
