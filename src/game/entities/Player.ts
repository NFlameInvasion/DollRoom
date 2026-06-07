import Phaser from 'phaser'
import { useGameStore } from '../../store/gameStore'
import { tileToScreen, getDepth } from '../iso/IsoUtils'
import { ROOMS, TileType } from '../rooms/roomData'
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
  const t = grid[y][x]
  return t === TileType.Floor || t === TileType.Doorway
}

const MOVE_SPEED_MS = 200

export class Player {
  private scene: Phaser.Scene
  private roomManager: RoomManager
  private sprite: Phaser.GameObjects.Sprite
  private tileX: number
  private tileY: number
  private roomId: string
  private path: PathTile[] = []
  private isMoving = false
  private customCallback: (() => void) | null = null

  constructor(scene: Phaser.Scene, roomManager: RoomManager, startTileX: number, startTileY: number, startRoomId: string) {
    this.scene = scene
    this.roomManager = roomManager
    this.tileX = startTileX
    this.tileY = startTileY
    this.roomId = startRoomId

    this.sprite = scene.add.sprite(0, 0, 'player', 0)
    this.sprite.setDepth(9999)
    this.syncPosition()
    this.sprite.play('player_idle')

    useGameStore.getState().setPlayerPosition(startTileX, startTileY, startRoomId)
  }

  get position() { return { tileX: this.tileX, tileY: this.tileY, roomId: this.roomId } }
  get moving() { return this.isMoving }

  moveTo(targetX: number, targetY: number): boolean {
    const room = ROOMS[this.roomId]
    if (!room) return false
    const p = findPath(room.grid, this.tileX, this.tileY, targetX, targetY)
    if (p.length === 0) return false
    this.path = p
    this.isMoving = true
    useGameStore.getState().setPlayerMoving(true)
    this.sprite.play('player_walk')
    this.walkNext()
    return true
  }

  interactWithObject(objTileX: number, objTileY: number, onReached: () => void): boolean {
    const room = ROOMS[this.roomId]
    if (!room) return false
    const adj = this.findAdjacentWalkable(objTileX, objTileY)
    if (!adj) return false
    const p = findPath(room.grid, this.tileX, this.tileY, adj.tileX, adj.tileY)
    if (p.length === 0 && (this.tileX !== adj.tileX || this.tileY !== adj.tileY)) return false
    this.path = p
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
    const from = tileToScreen(this.tileX, this.tileY, 0, 0)
    const to = tileToScreen(next.tileX, next.tileY, 0, 0)
    this.scene.tweens.add({
      targets: this.sprite,
      x: this.sprite.x + (to.x - from.x),
      y: this.sprite.y + (to.y - from.y),
      duration: MOVE_SPEED_MS,
      ease: 'Linear',
      onUpdate: () => { this.sprite.setDepth(getDepth(next.tileX, next.tileY) + 9990) },
      onComplete: () => {
        this.tileX = next.tileX
        this.tileY = next.tileY
        const doorway = this.roomManager.getDoorwayAt(this.tileX, this.tileY)
        if (doorway) this.handleDoorway(doorway.targetRoomId)
        this.walkNext()
      },
    })
  }

  private finishMoving(): void {
    this.isMoving = false
    useGameStore.getState().setPlayerMoving(false)
    useGameStore.getState().setPlayerPosition(this.tileX, this.tileY, this.roomId)
    this.sprite.play('player_idle')
    if (this.customCallback) {
      const cb = this.customCallback
      this.customCallback = null
      cb()
    }
  }

  private handleDoorway(targetRoomId: string): void {
    const targetRoom = ROOMS[targetRoomId]
    if (!targetRoom) return
    const targetDoorway = targetRoom.doorways.find(d => d.targetRoomId === this.roomId)
    if (!targetDoorway) return
    this.roomId = targetRoomId
    this.tileX = targetDoorway.tileX
    this.tileY = targetDoorway.tileY
    this.sprite.setPosition(0, 0)
    this.roomManager.panToRoom(targetRoomId).then(() => {
      this.syncPosition()
      this.sprite.play('player_idle')
    })
  }

  private syncPosition(): void {
    const pos = this.roomManager.tileToWorld(this.tileX, this.tileY)
    this.sprite.setPosition(pos.x, pos.y)
    this.sprite.setDepth(getDepth(this.tileX, this.tileY) + 9990)
  }

  private findAdjacentWalkable(objTileX: number, objTileY: number): PathTile | null {
    const room = ROOMS[this.roomId]
    if (!room) return null
    const dirs = [
      { tileX: 0, tileY: -1 }, { tileX: 1, tileY: 0 },
      { tileX: 0, tileY: 1 }, { tileX: -1, tileY: 0 },
    ]
    dirs.sort((a, b) =>
      Math.abs(this.tileX - (objTileX + a.tileX)) + Math.abs(this.tileY - (objTileY + a.tileY))
      - (Math.abs(this.tileX - (objTileX + b.tileX)) + Math.abs(this.tileY - (objTileY + b.tileY)))
    )
    for (const d of dirs) {
      const tx = objTileX + d.tileX, ty = objTileY + d.tileY
      const tile = room.grid[ty]?.[tx]
      if (tile === TileType.Floor || tile === TileType.Doorway)
        return { tileX: tx, tileY: ty }
    }
    return null
  }

  destroy(): void { this.sprite.destroy() }
}
