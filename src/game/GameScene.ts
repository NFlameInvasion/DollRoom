import Phaser from 'phaser'
import { useGameStore } from '../store/gameStore'
import { saveGame, loadGame, applySaveData } from '../store/saveSystem'
import { generateAllTextures, initAnimations } from './graphics/TextureGenerator'
import { RoomManager } from './rooms/RoomManager'
import { Player } from './entities/Player'
import { Dog } from './entities/Dog'
import { InteractiveObject } from './objects/InteractiveObject'
import { OBJECT_DEFS } from './objects/objectData'
import { screenToTile, isInBounds } from './iso/IsoUtils'
import { ROOMS } from './rooms/roomData'

export class GameScene extends Phaser.Scene {
  private roomManager!: RoomManager
  private player!: Player
  private dog!: Dog
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

    // Dog
    this.dog = new Dog(this, this.roomManager)

    // Ensure dog is in the correct room (following player on load)
    const currentRoom = this.roomManager.currentRoom
    const dogState = useGameStore.getState().dog
    if (dogState.roomId !== currentRoom) {
      this.dog.teleportTo(playerState.tileX - 1, playerState.tileY, currentRoom)
    }

    // Input: click to move, interact, or feed dog
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.player.moving || this.roomManager.transitioning) return

      // Check dog hit first
      if (this.hitTestDog(pointer.x, pointer.y)) {
        this.player.interactWithObject(
          this.dog.position.tileX,
          this.dog.position.tileY,
          () => this.dog.feed(),
        )
        return
      }

      // Check interactive object
      const hitObj = this.hitTestObject(pointer.x, pointer.y)
      if (hitObj) {
        if (hitObj.state) {
          hitObj.toggle()
        } else {
          this.player.interactWithObject(
            hitObj.objectDef.tileX,
            hitObj.objectDef.tileY,
            () => hitObj.toggle(),
          )
        }
        return
      }

      // Move to tile
      const tile = screenToTile(pointer.x, pointer.y, this.roomManager.originX, this.roomManager.originY)
      const tx = Math.round(tile.tileX)
      const ty = Math.round(tile.tileY)
      const room = ROOMS[this.roomManager.currentRoom]
      if (room && isInBounds(tx, ty, room.cols, room.rows)) {
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

    // Update object/dog visibility
    for (const obj of this.objects) {
      obj.setVisible(obj.objectDef.roomId === currentRoom)
    }

    // Dog stays in player's room
    if (this.dog.position.roomId !== currentRoom) {
      const p = useGameStore.getState().player
      this.dog.followToRoom(p.tileX, p.tileY, currentRoom)
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

  private hitTestObject(px: number, py: number): InteractiveObject | null {
    const currentRoom = this.roomManager.currentRoom
    for (let i = this.objects.length - 1; i >= 0; i--) {
      const obj = this.objects[i]
      if (obj.objectDef.roomId !== currentRoom) continue
      const pos = this.roomManager.tileToWorld(obj.objectDef.tileX, obj.objectDef.tileY)
      if (Math.abs(px - pos.x) < 24 && Math.abs(py - pos.y) < 16) {
        return obj
      }
    }
    return null
  }

  private hitTestDog(px: number, py: number): boolean {
    if (this.dog.position.roomId !== this.roomManager.currentRoom) return false
    const pos = this.roomManager.tileToWorld(this.dog.position.tileX, this.dog.position.tileY)
    return Math.abs(px - pos.x) < 20 && Math.abs(py - pos.y) < 16
  }
}
