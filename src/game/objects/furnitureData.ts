export interface FurnitureDef {
  id: string
  roomId: string
  tileX: number
  tileY: number
  textureKey: string
  width: number
  height: number
}

// Room world offsets (each room is 10 cols wide):
// gostinaya: 0-9, kuhnya: 10-19, spalnya: 20-29, vanna: 30-39, igrovaya: 40-49

export const FURNITURE_DEFS: FurnitureDef[] = [
  // ── Living room ──
  { id: 'sofa', roomId: 'gostinaya', tileX: 2, tileY: 5, textureKey: 'furn_sofa', width: 52, height: 36 },
  { id: 'coffee_table', roomId: 'gostinaya', tileX: 4, tileY: 6, textureKey: 'furn_coffee_table', width: 36, height: 22 },
  { id: 'chandelier', roomId: 'gostinaya', tileX: 5, tileY: 1, textureKey: 'furn_chandelier', width: 44, height: 40 },
  { id: 'bookshelf', roomId: 'gostinaya', tileX: 8, tileY: 2, textureKey: 'furn_bookshelf', width: 32, height: 52 },

  // ── Kitchen ──
  { id: 'dining_table', roomId: 'kuhnya', tileX: 13, tileY: 6, textureKey: 'furn_dining_table', width: 48, height: 36 },
  { id: 'fridge', roomId: 'kuhnya', tileX: 11, tileY: 2, textureKey: 'furn_fridge', width: 28, height: 48 },
  { id: 'kitchen_cabinets', roomId: 'kuhnya', tileX: 18, tileY: 2, textureKey: 'furn_kitchen_cabinets', width: 52, height: 32 },
  { id: 'microwave', roomId: 'kuhnya', tileX: 17, tileY: 4, textureKey: 'furn_microwave', width: 28, height: 24 },

  // ── Bedroom ──
  { id: 'bed', roomId: 'spalnya', tileX: 23, tileY: 5, textureKey: 'furn_bed', width: 56, height: 44 },
  { id: 'nightstand', roomId: 'spalnya', tileX: 22, tileY: 5, textureKey: 'furn_nightstand', width: 28, height: 28 },
  { id: 'wardrobe', roomId: 'spalnya', tileX: 28, tileY: 2, textureKey: 'furn_wardrobe', width: 36, height: 60 },

  // ── Bathroom ──
  { id: 'bath_cabinet', roomId: 'vanna', tileX: 32, tileY: 3, textureKey: 'furn_bath_cabinet', width: 28, height: 40 },
  { id: 'mirror', roomId: 'vanna', tileX: 32, tileY: 1, textureKey: 'furn_mirror', width: 24, height: 36 },

  // ── Playroom ──
  { id: 'toy_shelves', roomId: 'igrovaya', tileX: 42, tileY: 2, textureKey: 'furn_toy_shelves', width: 40, height: 48 },
]
