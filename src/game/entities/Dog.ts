import Phaser from 'phaser'
import { useGameStore } from '../../store/gameStore'
import { saveGame } from '../../store/saveSystem'
import { getDepth } from '../iso/IsoUtils'
import { ROOMS } from '../rooms/roomData'
import type { RoomManager } from '../rooms/RoomManager'

export class Dog {
  private scene: Phaser.Scene
  private roomManager: RoomManager
  private sprite: Phaser.GameObjects.Sprite
  private tileX: number
  private tileY: number
  private roomId: string
  private idleBob: Phaser.Tweens.Tween | null = null

  constructor(scene: Phaser.Scene, roomManager: RoomManager) {
    this.scene = scene
    this.roomManager = roomManager

    const state = useGameStore.getState()
    this.tileX = state.dog.tileX
    this.tileY = state.dog.tileY
    this.roomId = state.dog.roomId

    this.sprite = scene.add.sprite(0, 0, 'dog', 0)
    this.sprite.setDepth(9998)
    this.syncPosition()
    this.sprite.play('dog_idle')
  }

  get position() { return { tileX: this.tileX, tileY: this.tileY, roomId: this.roomId } }

  teleportTo(tileX: number, tileY: number, roomId: string): void {
    this.tileX = tileX
    this.tileY = tileY
    this.roomId = roomId
    this.syncPosition()
    useGameStore.getState().setDogPosition(tileX, tileY, roomId)
  }

  followToRoom(playerTileX: number, playerTileY: number, targetRoomId: string): void {
    const targetRoomData = ROOMS[targetRoomId]
    if (!targetRoomData) return
    const doorway = targetRoomData.doorways.find(d => d.targetRoomId === this.roomId)
    const targetX = doorway?.tileX ?? playerTileX
    const targetY = doorway?.tileY ?? playerTileY
    this.roomId = targetRoomId
    this.tileX = targetX
    this.tileY = targetY
    useGameStore.getState().setDogPosition(targetX, targetY, targetRoomId)
    this.syncPosition()
  }

  feed(onComplete?: () => void): void {
    useGameStore.getState().feedDog()
    this.sprite.play('dog_happy')
    this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y - 8,
      duration: 120,
      yoyo: true,
      repeat: 2,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.sprite.play('dog_idle')
        onComplete?.()
      },
    })
    saveGame()
  }

  private syncPosition(): void {
    const pos = this.roomManager.tileToWorld(this.tileX, this.tileY)
    this.sprite.setPosition(pos.x, pos.y)
    this.sprite.setDepth(getDepth(this.tileX, this.tileY) + 9988)
    if (this.idleBob) this.idleBob.stop()
    this.idleBob = this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y - 2,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  destroy(): void {
    this.idleBob?.stop()
    this.sprite.destroy()
  }
}
