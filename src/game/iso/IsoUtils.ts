/** Tile dimensions in screen pixels */
export const TILE_WIDTH = 64
export const TILE_HEIGHT = 32
export const TILE_HEIGHT_HALF = TILE_HEIGHT / 2

/** Convert isometric tile coords to screen (pixel) coords */
export function tileToScreen(
  tileX: number,
  tileY: number,
  originX = 0,
  originY = 0,
): { x: number; y: number } {
  return {
    x: (tileX - tileY) * (TILE_WIDTH / 2) + originX,
    y: (tileX + tileY) * TILE_HEIGHT_HALF + originY,
  }
}

/** Convert screen coords back to isometric tile coords (float) */
export function screenToTile(
  sx: number,
  sy: number,
  originX = 0,
  originY = 0,
): { tileX: number; tileY: number } {
  const dx = sx - originX
  const dy = sy - originY
  return {
    tileX: (dx / (TILE_WIDTH / 2) + dy / TILE_HEIGHT_HALF) / 2,
    tileY: (dy / TILE_HEIGHT_HALF - dx / (TILE_WIDTH / 2)) / 2,
  }
}

/**
 * Y-sorting depth value for Phaser's depth buffer.
 * Objects with higher depth render in front.
 * Floor tiles: depth = tileX + tileY
 * Objects: depth = tileX + tileY + heightOffset (taller = closer to camera = higher depth)
 */
export function getDepth(tileX: number, tileY: number, heightOffset = 0): number {
  return tileX + tileY + heightOffset
}

/**
 * Get the screen position of the top-front corner of a tile.
 * originX/Y is the screen position of tile (0,0).
 */
export function getTileScreenPosition(
  tileX: number,
  tileY: number,
  originX: number,
  originY: number,
): { x: number; y: number } {
  return tileToScreen(tileX, tileY, originX, originY)
}

/** Is the given tile coordinate within grid bounds? */
export function isInBounds(
  tileX: number,
  tileY: number,
  cols: number,
  rows: number,
): boolean {
  return tileX >= 0 && tileX < cols && tileY >= 0 && tileY < rows
}
