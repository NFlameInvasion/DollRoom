import Phaser from 'phaser'
import { useGameStore } from '../store/gameStore'
import { saveGame, loadGame, applySaveData } from '../store/saveSystem'
import { generateAllTextures, initAnimations } from './graphics/TextureGenerator'
import { RoomManager } from './rooms/RoomManager'
import { Player } from './entities/Player'
import { InteractiveObject } from './objects/InteractiveObject'
import { OBJECT_DEFS } from './objects/objectData'
import { screenToTile } from './iso/IsoUtils'

export class GameScene extends Phaser.Scene {
  private roomManager!: RoomManager
  private player!: Player
  private objects: InteractiveObject[] = []
  private unsubSave?: () => void

  constructor() {
    super({ key: 'GameScene' })
  }

  create(): void {
    const { width, height } = this.scale
    useGameStore.getState().setGameDimensions(width, height)
    useGameStore.getState().setCurrentScene('GameScene')

    this.cameras.main.setBackgroundColor('#1a1a2e')

    // Generate all textures + animations at boot
    generateAllTextures(this)
    initAnimations(this)

    // Room system
    this.roomManager = new RoomManager(this)
    this.roomManager.init()

    // Init objects first (store needs them for save/load)
    this.initObjects()
    useGameStore.getState().setObjects(
      OBJECT_DEFS.map((def) => ({
        id: def.id,
        roomId: def.roomId,
        tileX: def.tileX,
        tileY: def.tileY,
        label: def.label,
        isOn: false,
      })),
    )

    // Try loading saved state
    const saved = loadGame()
    if (saved) {
      applySaveData(saved)
    }

    // Player
    const playerState = useGameStore.getState().player
    this.player = new Player(this, this.roomManager, playerState.tileX, playerState.tileY, playerState.roomId)

    // Input: click to move
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.player.moving || this.roomManager.transitioning) return

      // Convert to world coordinates (accounting for camera scroll)
      const worldX = pointer.x + this.cameras.main.scrollX
      const worldY = pointer.y + this.cameras.main.scrollY

      const tile = screenToTile(worldX, worldY, this.roomManager.originX, this.roomManager.originY)
      const tx = Math.round(tile.tileX)
      const ty = Math.round(tile.tileY)

      // Only allow movement if the tile is walkable
      if (this.roomManager.isWalkable(tx, ty)) {
        this.player.moveTo(tx, ty)
      }
    })

    // Auto-save on state changes
    this.unsubSave = useGameStore.subscribe((state, prev) => {
      if (state.player.roomId !== prev.player.roomId || state.objects !== prev.objects) {
        saveGame()
      }
    })

    useGameStore.getState().setGameReady(true)
  }

  update(): void {
    const currentRoom = this.roomManager.currentRoom

    // Update object visibility
    for (const obj of this.objects) {
      obj.setVisible(obj.objectDef.roomId === currentRoom)
    }
  }

  shutdown(): void {
    this.unsubSave?.()
    saveGame()
  }

  private initObjects(): void {
    this.objects = OBJECT_DEFS.map(
      (def) => new InteractiveObject(this, def, this.roomManager.originX, this.roomManager.originY),
    )
  }
}
