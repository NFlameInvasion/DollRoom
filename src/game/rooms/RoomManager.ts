import Phaser from 'phaser'
import { tileToScreen, getDepth, TILE_WIDTH } from '../iso/IsoUtils'
import { ROOMS, TILE_DEFS, TileType, type RoomData, START_ROOM_ID } from './roomData'

export class RoomManager {
  private scene: Phaser.Scene
  private roomContainers = new Map<string, Phaser.GameObjects.Container>()
  private currentRoomId = START_ROOM_ID
  private isTransitioning = false
  /** Screen origin where tile (0,0) renders */
  private _originX = 0
  private _originY = 0

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  get currentRoom(): string {
    return this.currentRoomId
  }

  get transitioning(): boolean {
    return this.isTransitioning
  }

  get originX(): number {
    return this._originX
  }

  get originY(): number {
    return this._originY
  }

  /** Build all rooms (off-screen) and show the starting room */
  init(): void {
    // Find the largest room dimensions
    let maxCols = 0
    let maxRows = 0
    for (const room of Object.values(ROOMS)) {
      if (room.cols > maxCols) maxCols = room.cols
      if (room.rows > maxRows) maxRows = room.rows
    }

    // Center the isometric grid horizontally
    const { width, height } = this.scene.scale
    this._originX = width / 2 - (maxCols - maxRows) * (TILE_WIDTH / 2) / 2
    this._originY = height * 0.15

    // Build each room in its own container
    for (const roomData of Object.values(ROOMS)) {
      const container = this.buildRoom(roomData)
      container.setVisible(false)
      this.scene.add.existing(container)
      this.roomContainers.set(roomData.id, container)
    }

    // Show starting room
    this.showRoom(START_ROOM_ID)
  }

  /** Show a specific room instantly (used at init) */
  private showRoom(roomId: string): void {
    for (const [id, container] of this.roomContainers) {
      container.setVisible(id === roomId)
    }
    this.currentRoomId = roomId
  }

  /** Pan camera to target room, then toggle container visibility */
  panToRoom(targetRoomId: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.isTransitioning || targetRoomId === this.currentRoomId) {
        resolve()
        return
      }

      const targetContainer = this.roomContainers.get(targetRoomId)
      const currentContainer = this.roomContainers.get(this.currentRoomId)
      if (!targetContainer || !currentContainer) {
        resolve()
        return
      }

      this.isTransitioning = true

      // Show target room faded out, fade in during pan
      targetContainer.setVisible(true)
      targetContainer.setAlpha(0)

      const panDuration = 400

      // Flash fade: current out → switch → target in
      this.scene.tweens.add({
        targets: currentContainer,
        alpha: 0,
        duration: panDuration / 2,
        ease: 'Power2',
        onComplete: () => {
          currentContainer.setVisible(false)
          this.currentRoomId = targetRoomId

          this.scene.tweens.add({
            targets: targetContainer,
            alpha: 1,
            duration: panDuration / 2,
            ease: 'Power2',
            onComplete: () => {
              this.isTransitioning = false
              resolve()
            },
          })
        },
      })
    })
  }

  /** Check if a tile coordinate is walkable in the current room */
  isWalkable(tileX: number, tileY: number): boolean {
    const room = ROOMS[this.currentRoomId]
    if (!room) return false
    if (tileX < 0 || tileX >= room.cols || tileY < 0 || tileY >= room.rows) return false
    const tileType = room.grid[tileY]?.[tileX]
    if (tileType === undefined) return false
    return TILE_DEFS[tileType].walkable
  }

  /** Get the doorway at tile coords in the current room, or null */
  getDoorwayAt(tileX: number, tileY: number): { targetRoomId: string } | null {
    const room = ROOMS[this.currentRoomId]
    if (!room) return null
    return room.doorways.find((d) => d.tileX === tileX && d.tileY === tileY) ?? null
  }

  /** Convert room tile coords to world screen position */
  tileToWorld(tileX: number, tileY: number): { x: number; y: number } {
    return tileToScreen(tileX, tileY, this.originX, this.originY)
  }

  private buildRoom(roomData: RoomData): Phaser.GameObjects.Container {
    const container = this.scene.add.container(0, 0)
    const { grid, cols, rows } = roomData

    const tileKey = (type: number) =>
      type === TileType.Floor ? 'tile_floor' :
      type === TileType.Wall ? 'tile_wall' :
      type === TileType.Doorway ? 'tile_doorway' : null

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tileType = grid[row][col]
        if (tileType === TileType.Empty) continue
        const pos = tileToScreen(col, row, this.originX, this.originY)
        const key = tileKey(tileType)
        if (!key) continue

        const img = this.scene.add.image(pos.x, pos.y, key)
        img.setDepth(getDepth(col, row))
        container.add(img)
      }
    }

    return container
  }

  /** Clean up */
  destroy(): void {
    for (const container of this.roomContainers.values()) {
      container.destroy(true)
    }
    this.roomContainers.clear()
  }
}
