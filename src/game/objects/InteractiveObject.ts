import Phaser from 'phaser'
import { useGameStore } from '../../store/gameStore'
import { tileToScreen, getDepth, TILE_WIDTH, TILE_HEIGHT } from '../iso/IsoUtils'
import type { ObjectDef } from './objectData'

/** Map object IDs to texture key prefixes */
const TEX_MAP: Record<string, string> = {
  light_bed: 'obj_light',
  light_living: 'obj_light',
  light_kitchen: 'obj_light',
  light_bath: 'obj_light',
  light_play: 'obj_light',
  tv: 'obj_tv',
  fan: 'obj_fan',
  kettle: 'obj_kettle',
  hairdryer: 'obj_hairdryer',
  stereo: 'obj_stereo',
}

export class InteractiveObject {
  private scene: Phaser.Scene
  private def: ObjectDef
  private container: Phaser.GameObjects.Container
  private img: Phaser.GameObjects.Image
  private shadow: Phaser.GameObjects.Image
  private glow: Phaser.GameObjects.Image
  private labelText: Phaser.GameObjects.Text
  private isOn = false
  private texPrefix: string
  private hasGlow: boolean

  constructor(scene: Phaser.Scene, def: ObjectDef, originX: number, originY: number) {
    this.scene = scene
    this.def = def
    this.texPrefix = TEX_MAP[def.id] ?? 'obj_light'

    const pos = tileToScreen(def.tileX, def.tileY, originX, originY)
    const depth = getDepth(def.tileX, def.tileY)

    this.container = scene.add.container(pos.x, pos.y)
    this.container.setDepth(depth + 5000)

    // Shadow
    this.shadow = scene.add.image(0, 6, 'fx_shadow')
    this.shadow.setDepth(-1)
    this.container.add(this.shadow)

    this.img = scene.add.image(0, 0, `${this.texPrefix}_off`)
    this.container.add(this.img)

    // Light glow (only for lights and TV)
    this.hasGlow = def.id.startsWith('light_') || def.id === 'tv'
    this.glow = scene.add.image(0, 0, 'fx_light_glow')
    this.glow.setDepth(-1)
    this.glow.setVisible(false)
    this.container.add(this.glow)

    this.labelText = scene.add.text(0, -TILE_HEIGHT - 12, def.label, {
      fontSize: '11px',
      color: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 4, y: 2 },
    })
    this.labelText.setOrigin(0.5, 1)
    this.labelText.setDepth(depth + 5001)
    this.labelText.setVisible(false)
    this.container.add(this.labelText)

    const hitZone = scene.add.zone(0, 0, TILE_WIDTH, TILE_HEIGHT).setInteractive({ useHandCursor: true })
    this.container.add(hitZone)

    hitZone.on('pointerover', () => {
      this.labelText.setVisible(true)
      useGameStore.getState().setInteractionPrompt(this.def.label)
    })
    hitZone.on('pointerout', () => {
      this.labelText.setVisible(false)
      useGameStore.getState().setInteractionPrompt('')
    })
    hitZone.on('pointerdown', () => this.handleClick())
  }

  get objectDef() { return this.def }
  get state() { return this.isOn }

  toggle(): void {
    this.isOn = !this.isOn
    useGameStore.getState().toggleObject(this.def.id)
    this.img.setTexture(`${this.texPrefix}_${this.isOn ? 'on' : 'off'}`)
    if (this.hasGlow) {
      this.glow.setVisible(this.isOn)
    }
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 1.15, scaleY: 1.15,
      duration: 100, yoyo: true, ease: 'Quad.easeOut',
    })
  }

  private handleClick(): void {
    this.toggle()
  }

  setVisible(v: boolean): void { this.container.setVisible(v) }
  destroy(): void { this.container.destroy(true) }
}
