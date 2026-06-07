import Phaser from 'phaser'
import { useGameStore } from '../../store/gameStore'
import { tileToScreen, getDepth } from '../iso/IsoUtils'
import { TileType, ROOMS } from '../rooms/roomData'
import type { RoomManager } from '../rooms/RoomManager'

interface PathTile {
  tileX: number
  tileY: number
}

function findPath(
  grid: number[][],
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): PathTile[] {
  const cols = grid[0].length
  if (startX === endX && startY === endY) return []
  if (!isTraversable(grid, endX, endY)) return []

  const visited = new Set<number>()
  const parent = new Map<number, PathTile | null>()
  const queue: PathTile[] = [{ tileX: startX, tileY: startY }]
  const key = (x: number, y: number) => y * cols + x
  visited.add(key(startX, startY))
  parent.set(key(startX, startY), null)

  const dirs = [
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
  ]

  while (queue.length > 0) {
    const cur = queue.shift()!
    if (cur.tileX === endX && cur.tileY === endY) {
      const path: PathTile[] = []
      let node: PathTile | null = cur
      while (node) { path.unshift(node); node = parent.get(key(node.tileX, node.tileY)) ?? null }
      path.shift()
      return path
    }
    for (const d of dirs) {
      const nx = cur.tileX + d.dx, ny = cur.tileY + d.dy, k = key(nx, ny)
      if (!visited.has(k) && isTraversable(grid, nx, ny)) {
        visited.add(k); parent.set(k, cur); queue.push({ tileX: nx, tileY: ny })
      }
    }
  }
  return []
}

function isTraversable(grid: number[][], x: number, y: number): boolean {
  const rows = grid.length, cols = grid[0].length
  if (x < 0 || x >= cols || y < 0 || y >= rows) return false
  return grid[y][x] === TileType.Floor
}

const MOVE_SPEED_MS = 200

export class Player {
  private scene: Phaser.Scene
  private roomManager: RoomManager
  private sprite: Phaser.GameObjects.Sprite
  private shadow: Phaser.GameObjects.Image
  /** World tile coordinates */
  private worldX: number
  private worldY: number
  private roomId: string
  private path: PathTile[] = []
  private isMoving = false
  private customCallback: (() => void) | null = null

  constructor(
    scene: Phaser.Scene, roomManager: RoomManager,
    startWorldX: number, startWorldY: number, startRoomId: string,
  ) {
    this.scene = scene
    this.roomManager = roomManager
    this.worldX = startWorldX
    this.worldY = startWorldY
    this.roomId = startRoomId

    this.shadow = scene.add.image(0, 0, 'fx_shadow')
    this.shadow.setDepth(getDepth(startWorldX, startWorldY) + 9989)

    this.sprite = scene.add.sprite(0, 0, 'player', 0)
    this.sprite.setDepth(getDepth(startWorldX, startWorldY) + 9990)
    this.syncPosition()
    this.sprite.play('player_idle')

    useGameStore.getState().setPlayerPosition(startWorldX, startWorldY, startRoomId)
  }

  get position() { return { tileX: this.worldX, tileY: this.worldY, roomId: this.roomId } }
  get moving() { return this.isMoving }

  moveTo(targetWorldX: number, targetWorldY: number): boolean {
    const room = ROOMS[this.roomId]
    if (!room) return false

    // Convert world coords to room-local coords for BFS
    const localStartX = this.worldX - room.linearIndex * room.cols
    const localStartY = this.worldY
    const localEndX = targetWorldX - room.linearIndex * room.cols
    const localEndY = targetWorldY

    // Only pathfind within the current room
    if (localEndX < 0 || localEndX >= room.cols || localEndY < 0 || localEndY >= room.rows) {
      // Target is outside current room — path to the edge closest to target
      const edgeX = Math.max(0, Math.min(room.cols - 1, localEndX))
      const edgeY = Math.max(0, Math.min(room.rows - 1, localEndY))
      const p = findPath(room.grid, localStartX, localStartY, edgeX, edgeY)
      if (p.length === 0) return false
      this.path = p.map(t => ({
        tileX: t.tileX + room.linearIndex * room.cols,
        tileY: t.tileY,
      }))
    } else {
      const p = findPath(room.grid, localStartX, localStartY, localEndX, localEndY)
      if (p.length === 0) return false
      this.path = p.map(t => ({
        tileX: t.tileX + room.linearIndex * room.cols,
        tileY: t.tileY,
      }))
    }

    this.isMoving = true
    useGameStore.getState().setPlayerMoving(true)
    this.sprite.play('player_walk')
    this.walkNext()
    return true
  }

  interactWithObject(objWorldX: number, objWorldY: number, onReached: () => void): boolean {
    const room = ROOMS[this.roomId]
    if (!room) return false

    const adj = this.findAdjacentWalkable(objWorldX, objWorldY)
    if (!adj) return false

    // Convert to local for BFS
    const localStartX = this.worldX - room.linearIndex * room.cols
    const localStartY = this.worldY
    const localEndX = adj.tileX - room.linearIndex * room.cols
    const localEndY = adj.tileY

    const p = findPath(room.grid, localStartX, localStartY, localEndX, localEndY)
    if (p.length === 0 && (this.worldX !== adj.tileX || this.worldY !== adj.tileY)) return false

    this.path = p.map(t => ({
      tileX: t.tileX + room.linearIndex * room.cols,
      tileY: t.tileY,
    }))
    this.customCallback = onReached
    this.isMoving = true
    useGameStore.getState().setPlayerMoving(true)
    this.sprite.play('player_walk')
    this.walkNext()
    return true
  }

  private walkNext(): void {
    if (this.path.length === 0) {
      this.finishMoving()
      return
    }
    const next = this.path.shift()!
    const from = tileToScreen(this.worldX, this.worldY, 0, 0)
    const to = tileToScreen(next.tileX, next.tileY, 0, 0)

    const depth = getDepth(next.tileX, next.tileY)
    const dx = to.x - from.x
    const dy = to.y - from.y

    this.shadow.setDepth(depth + 9989)
    this.scene.tweens.add({
      targets: [this.sprite, this.shadow],
      x: (target: { x: number }) => target.x + dx,
      y: (target: { y: number }) => target.y + dy,
      duration: MOVE_SPEED_MS,
      ease: 'Linear',
      onUpdate: () => {
        this.sprite.setDepth(depth + 9990)
      },
      onComplete: () => {
        this.worldX = next.tileX
        this.worldY = next.tileY

        // Check for room transition
        const transition = this.roomManager.tryTransition(this.worldX, this.worldY)
        if (transition) {
          this.handleRoomTransition(transition.newRoomId, transition.localCol, transition.localRow)
        }

        this.walkNext()
      },
    })
  }

  private handleRoomTransition(newRoomId: string, localCol: number, localRow: number): void {
    const newRoom = ROOMS[newRoomId]
    if (!newRoom) return

    this.roomId = newRoomId
    this.worldX = newRoom.linearIndex * newRoom.cols + localCol
    this.worldY = localRow

    // Reset sprite position relative to new container
    this.sprite.setPosition(0, 0)
    this.shadow.setPosition(0, 0)
    this.roomManager.panToRoom(newRoomId).then(() => {
      this.syncPosition()
      this.sprite.play('player_idle')
    })
  }

  private finishMoving(): void {
    this.isMoving = false
    useGameStore.getState().setPlayerMoving(false)
    useGameStore.getState().setPlayerPosition(this.worldX, this.worldY, this.roomId)
    this.sprite.play('player_idle')
    if (this.customCallback) {
      const cb = this.customCallback
      this.customCallback = null
      cb()
    }
  }

  private syncPosition(): void {
    const pos = this.roomManager.tileToWorld(this.worldX, this.worldY)
    const depth = getDepth(this.worldX, this.worldY)
    this.shadow.setPosition(pos.x, pos.y + 2)
    this.shadow.setDepth(depth + 9989)
    this.sprite.setPosition(pos.x, pos.y)
    this.sprite.setDepth(depth + 9990)
  }

  private findAdjacentWalkable(objWorldX: number, objWorldY: number): PathTile | null {
    const room = ROOMS[this.roomId]
    if (!room) return null
    const dirs = [
      { tileX: 0, tileY: -1 }, { tileX: 1, tileY: 0 },
      { tileX: 0, tileY: 1 }, { tileX: -1, tileY: 0 },
    ]
    dirs.sort((a, b) =>
      Math.abs(this.worldX - (objWorldX + a.tileX)) + Math.abs(this.worldY - (objWorldY + a.tileY))
      - (Math.abs(this.worldX - (objWorldX + b.tileX)) + Math.abs(this.worldY - (objWorldY + b.tileY)))
    )
    for (const d of dirs) {
      const wx = objWorldX + d.tileX, wy = objWorldY + d.tileY
      const local = {
        col: wx - room.linearIndex * room.cols,
        row: wy,
      }
      if (local.col >= 0 && local.col < room.cols && local.row >= 0 && local.row < room.rows) {
        const tile = room.grid[local.row]?.[local.col]
        if (tile === TileType.Floor)
          return { tileX: wx, tileY: wy }
      }
    }
    return null
  }

  destroy(): void { this.shadow.destroy(); this.sprite.destroy() }
}
