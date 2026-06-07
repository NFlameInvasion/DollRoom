import Phaser from 'phaser'
import { GameScene } from './GameScene'

let game: Phaser.Game | null = null

export interface CreateGameOptions {
  parent: HTMLElement | string
  width?: number
  height?: number
}

export function createGame({ parent, width = 800, height = 600 }: CreateGameOptions): Phaser.Game {
  if (game) {
    game.destroy(true)
  }

  game = new Phaser.Game({
    type: Phaser.AUTO,
    width,
    height,
    parent,
    backgroundColor: '#1a1a2e',
    scene: [GameScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  })

  return game
}

export function getGame(): Phaser.Game | null {
  return game
}

export function destroyGame(): void {
  if (game) {
    game.destroy(true)
    game = null
  }
}
