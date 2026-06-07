import Phaser from 'phaser'
import { tileToScreen, getDepth } from '../iso/IsoUtils'
import { ROOMS, ROOM_ORDER, START_ROOM_ID, type RoomData } from './roomData'
import { FURNITURE_DEFS } from '../objects/furnitureData'

const WALL_HEIGHT = 48

export class RoomManager {
  private scene: Phaser.Scene
  private roomContainers = new Map<string, Phaser.GameObjects.Container>()
  private currentRoomId = START_ROOM_ID
  private isTransitioning = false
  private _originX = 0
  private _originY = 0
  /** Camera target for current room (screen coords) */
  private cameraTarget = { x: 0, y: 0 }

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  get currentRoom(): string { return this.currentRoomId }
  get transitioning(): boolean { return this.isTransitioning }
  get originX(): number { return this._originX }
  get originY(): number { return this._originY }

  /** Build all rooms side by side and show them all */
  init(): void {
    const { width, height } = this.scene.scale

    // Center the whole layout
    this._originX = width / 2
    this._originY = height * 0.1

    for (const roomData of ROOM_ORDER) {
      const container = this.buildRoom(roomData)
      this.scene.add.existing(container)
      this.roomContainers.set(roomData.id, container)
    }

    // Camera scroll to starting room
    this.scrollToRoom(START_ROOM_ID, false)

    // Show all rooms
    for (const container of this.roomContainers.values()) {
      container.setVisible(true)
    }
  }

  /** Get world tile coordinates for a room */
  getWorldTile(roomData: RoomData, localCol: number, localRow: number): { x: number; y: number } {
    return {
      x: roomData.linearIndex * roomData.cols + localCol,
      y: localRow,
    }
  }

  /** Find which room a world tile belongs to */
  getRoomAtWorldTile(worldX: number, _worldY: number): RoomData | null {
    for (const room of ROOM_ORDER) {
      if (worldX >= room.linearIndex * room.cols && worldX < (room.linearIndex + 1) * room.cols) {
        return room
      }
    }
    return null
  }

  /** Convert world tile to room-local tile */
  worldToLocal(worldX: number, worldY: number, room: RoomData): { col: number; row: number } {
    return {
      col: worldX - room.linearIndex * room.cols,
      row: worldY,
    }
  }

  /** Check if a world tile is walkable */
  isWalkable(worldX: number, worldY: number): boolean {
    const room = this.getRoomAtWorldTile(worldX, worldY)
    if (!room) return false
    const local = this.worldToLocal(worldX, worldY, room)
    return local.col >= 0 && local.col < room.cols && local.row >= 0 && local.row < room.rows
  }

  /** Try to transition to an adjacent room when walking past edge */
  tryTransition(worldTileX: number, worldTileY: number): { newRoomId: string; localCol: number; localRow: number } | null {
    const currentRoom = ROOMS[this.currentRoomId]
    if (!currentRoom) return null

    // Check if we walked past the right edge (into next room)
    if (worldTileX >= (currentRoom.linearIndex + 1) * currentRoom.cols) {
      const nextId = currentRoom.connections.right
      if (nextId) {
        const nextRoom = ROOMS[nextId]
        if (nextRoom) {
          // Enter from the left edge
          const localCol = 0
          const localRow = worldTileY
          return { newRoomId: nextId, localCol, localRow }
        }
      }
    }

    // Check if we walked past the left edge (into previous room)
    if (worldTileX < currentRoom.linearIndex * currentRoom.cols) {
      const prevId = currentRoom.connections.left
      if (prevId) {
        const prevRoom = ROOMS[prevId]
        if (prevRoom) {
          // Enter from the right edge
          const localCol = prevRoom.cols - 1
          const localRow = worldTileY
          return { newRoomId: prevId, localCol, localRow }
        }
      }
    }

    return null
  }

  /** Get room data by ID */
  getRoomData(id: string): RoomData | undefined {
    return ROOMS[id]
  }

  /** Convert world tile coords to screen position */
  tileToWorld(worldX: number, worldY: number): { x: number; y: number } {
    return tileToScreen(worldX, worldY, this._originX, this._originY)
  }

  /** Depth for world tile coords */
  getWorldDepth(worldX: number, worldY: number, offset = 0): number {
    return getDepth(worldX, worldY, offset)
  }

  /** Get camera target for centering on a room */
  getCameraTarget(roomId: string): { x: number; y: number } {
    const room = ROOMS[roomId]
    if (!room) return this.cameraTarget

    const centerCol = room.cols / 2
    const centerRow = room.rows / 2
    const worldCenter = this.getWorldTile(room, centerCol, centerRow)
    const screenPos = this.tileToWorld(worldCenter.x, worldCenter.y)

    return {
      x: screenPos.x - this.scene.scale.width / 2,
      y: screenPos.y - this.scene.scale.height / 3,
    }
  }

  /** Scroll camera to center on a room */
  scrollToRoom(roomId: string, animated = true): void {
    const target = this.getCameraTarget(roomId)
    this.cameraTarget = target
    this.currentRoomId = roomId

    if (animated) {
      this.scene.tweens.add({
        targets: this.scene.cameras.main,
        scrollX: target.x,
        scrollY: target.y,
        duration: 400,
        ease: 'Power2',
        onComplete: () => {
          this.isTransitioning = false
        },
      })
    } else {
      this.scene.cameras.main.setScroll(target.x, target.y)
    }
  }

  /** Transition to a different room */
  panToRoom(targetRoomId: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.isTransitioning || targetRoomId === this.currentRoomId) {
        resolve()
        return
      }
      this.isTransitioning = true
      this.scrollToRoom(targetRoomId, true)
      // Resolve after the tween duration
      setTimeout(() => resolve(), 400)
    })
  }

  private buildRoom(roomData: RoomData): Phaser.GameObjects.Container {
    const container = this.scene.add.container(0, 0)

    // Position container at the world offset
    const worldOffsetX = roomData.linearIndex * roomData.cols
    const containerPos = tileToScreen(worldOffsetX, 0, this._originX, this._originY)
    container.setPosition(containerPos.x, containerPos.y)

    const { cols, rows } = roomData

    // ── Back wall ──
    const wallG = this.scene.add.graphics()
    this.drawBackWall(wallG, cols)
    wallG.setDepth(getDepth(worldOffsetX, -1) + 10)
    container.add(wallG)

    // ── Floor tiles (no grid lines) ──
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const pos = tileToScreen(col, row, 0, 0)
        const img = this.scene.add.image(pos.x, pos.y, 'tile_floor')
        const worldTileX = worldOffsetX + col
        img.setDepth(getDepth(worldTileX, row))
        container.add(img)
      }
    }

    // ── Side walls ──
    const leftWall = this.scene.add.graphics()
    this.drawSideWall(leftWall, cols - 1, 'left')
    leftWall.setDepth(getDepth(worldOffsetX, rows - 1) + 5)
    container.add(leftWall)

    const rightWall = this.scene.add.graphics()
    this.drawSideWall(rightWall, cols - 1, 'right')
    // Right wall view starts in front and goes back, depth varies
    rightWall.setDepth(getDepth(worldOffsetX + cols - 1, rows - 1) + 5)
    container.add(rightWall)

    // ── Wall decorations: AC unit and switches ──
    // AC at col 5 on the back wall
    const acPos = tileToScreen(5, -0.3, 0, 0)
    const ac = this.scene.add.image(acPos.x, acPos.y - 40, 'obj_ac')
    ac.setDepth(getDepth(worldOffsetX + 5, 0) + 20)
    container.add(ac)

    // Light switches at col 2 and col 8
    for (const swCol of [2, 8]) {
      const swPos = tileToScreen(swCol, -0.2, 0, 0)
      const sw = this.scene.add.image(swPos.x, swPos.y - 36, 'obj_switch')
      sw.setDepth(getDepth(worldOffsetX + swCol, 0) + 20)
      container.add(sw)
    }

    // ── Furniture (decorative, non-interactive) ──
    const roomFurniture = FURNITURE_DEFS.filter((f: { roomId: string }) => f.roomId === roomData.id)
    for (const furn of roomFurniture) {
      const pos = tileToScreen(furn.tileX, furn.tileY, 0, 0)
      const depth = getDepth(furn.tileX, furn.tileY)

      // Shadow
      const shadow = this.scene.add.image(pos.x, pos.y + 6, 'fx_shadow')
      shadow.setDepth(depth + 1995)
      container.add(shadow)

      // Furniture sprite
      const img = this.scene.add.image(pos.x, pos.y - furn.height / 2 + 12, furn.textureKey)
      img.setDepth(depth + 2000)
      container.add(img)
    }

    return container
  }

  private drawBackWall(g: Phaser.GameObjects.Graphics, cols: number): void {
    // Back wall spans from tile (0, -0.5) to (cols-1, -0.5) in local coords
    const left = tileToScreen(0, -0.5, 0, 0)   // (16, -8) for cols=10
    const right = tileToScreen(cols - 1, -0.5, 0, 0)  // (304, 152) for cols=10

    // Wall face extends upward
    const wallTop = WALL_HEIGHT

    // Wall fill (base color)
    g.fillStyle(0x8b7d6b, 1)
    g.beginPath()
    g.moveTo(left.x, left.y)
    g.lineTo(right.x, right.y)
    g.lineTo(right.x, right.y - wallTop)
    g.lineTo(left.x, left.y - wallTop)
    g.closePath()
    g.fillPath()

    // Wainscoting (lower wall panel)
    const panelHeight = 20
    g.fillStyle(0x7a6e5e, 1)
    g.beginPath()
    g.moveTo(left.x, left.y)
    g.lineTo(right.x, right.y)
    g.lineTo(right.x, right.y - panelHeight)
    g.lineTo(left.x, left.y - panelHeight)
    g.closePath()
    g.fillPath()

    // Wainscoting top rail
    g.fillStyle(0x6a5e4e, 1)
    g.beginPath()
    g.moveTo(left.x, left.y - panelHeight)
    g.lineTo(right.x, right.y - panelHeight)
    g.lineTo(right.x + 2, right.y - panelHeight - 1)
    g.lineTo(left.x + 2, left.y - panelHeight - 1)
    g.closePath()
    g.fillPath()

    // Wainscoting panel lines (vertical)
    g.lineStyle(1, 0x6a5e4e, 0.5)
    const panelCount = cols
    for (let i = 1; i < panelCount; i++) {
      const p = tileToScreen(i, -0.5, 0, 0)
      g.beginPath()
      g.moveTo(p.x, p.y)
      g.lineTo(p.x, p.y - panelHeight)
      g.strokePath()
    }

    // Wallpaper stripe pattern (upper wall)
    g.lineStyle(1, 0x9a8d7b, 0.3)
    for (let i = 0; i < cols * 2; i++) {
      const t = i / 2
      const p = tileToScreen(t, -0.5, 0, 0)
      g.beginPath()
      g.moveTo(p.x, p.y - panelHeight)
      g.lineTo(p.x, p.y - wallTop)
      g.strokePath()
    }

    // Wall top edge (lighter)
    g.fillStyle(0x9a8d7b, 1)
    g.beginPath()
    g.moveTo(left.x, left.y - wallTop)
    g.lineTo(right.x, right.y - wallTop)
    g.lineTo(right.x + 10, right.y - wallTop - 5)
    g.lineTo(left.x + 10, left.y - wallTop - 5)
    g.closePath()
    g.fillPath()

    // Wall bottom trim
    g.lineStyle(2, 0x6a5e4e, 1)
    g.beginPath()
    g.moveTo(left.x, left.y)
    g.lineTo(right.x, right.y)
    g.strokePath()
  }

  private drawSideWall(g: Phaser.GameObjects.Graphics, maxRow: number, side: 'left' | 'right'): void {
    const col = side === 'left' ? -0.5 : maxRow + 0.5
    const top = tileToScreen(col, 0, 0, 0)
    const bottom = tileToScreen(col, maxRow, 0, 0)
    const wallTop = WALL_HEIGHT
    const panelHeight = 20

    // Wall fill
    g.fillStyle(0x8b7d6b, 1)
    g.beginPath()
    g.moveTo(top.x, top.y)
    g.lineTo(bottom.x, bottom.y)
    g.lineTo(bottom.x, bottom.y - wallTop)
    g.lineTo(top.x, top.y - wallTop)
    g.closePath()
    g.fillPath()

    // Wainscoting
    g.fillStyle(0x7a6e5e, 1)
    g.beginPath()
    g.moveTo(top.x, top.y)
    g.lineTo(bottom.x, bottom.y)
    g.lineTo(bottom.x, bottom.y - panelHeight)
    g.lineTo(top.x, top.y - panelHeight)
    g.closePath()
    g.fillPath()

    // Wainscoting top rail
    g.fillStyle(0x6a5e4e, 1)
    g.beginPath()
    g.moveTo(top.x, top.y - panelHeight)
    g.lineTo(bottom.x, bottom.y - panelHeight)
    g.lineTo(bottom.x + (side === 'left' ? -2 : 2), bottom.y - panelHeight - 1)
    g.lineTo(top.x + (side === 'left' ? -2 : 2), top.y - panelHeight - 1)
    g.closePath()
    g.fillPath()

    // Side wall vertical panel lines
    g.lineStyle(1, 0x6a5e4e, 0.4)
    for (let r = 1; r < maxRow; r++) {
      const p = tileToScreen(col, r, 0, 0)
      g.beginPath()
      g.moveTo(p.x, p.y)
      g.lineTo(p.x, p.y - panelHeight)
      g.strokePath()
    }

    // Top edge
    g.fillStyle(0x9a8d7b, 1)
    g.beginPath()
    g.moveTo(top.x, top.y - wallTop)
    g.lineTo(bottom.x, bottom.y - wallTop)
    g.lineTo(bottom.x + (side === 'left' ? -10 : 10), bottom.y - wallTop - 5)
    g.lineTo(top.x + (side === 'left' ? -10 : 10), top.y - wallTop - 5)
    g.closePath()
    g.fillPath()
  }

  destroy(): void {
    for (const container of this.roomContainers.values()) {
      container.destroy(true)
    }
    this.roomContainers.clear()
  }
}
