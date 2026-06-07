import Phaser from 'phaser'
import { TILE_WIDTH, TILE_HEIGHT } from '../iso/IsoUtils'

/**
 * Create Phaser animations from generated sprite sheets.
 * Call once after generateAllTextures().
 */
export function initAnimations(scene: Phaser.Scene): void {
  scene.anims.create({
    key: 'player_walk',
    frames: scene.anims.generateFrameNumbers('player', { start: 1, end: 3 }),
    frameRate: 8,
    repeat: -1,
  })

  scene.anims.create({
    key: 'player_idle',
    frames: [{ key: 'player', frame: 0 }],
    frameRate: 1,
    repeat: -1,
  })

  scene.anims.create({
    key: 'dog_idle',
    frames: scene.anims.generateFrameNumbers('dog', { start: 0, end: 1 }),
    frameRate: 3,
    repeat: -1,
  })

  scene.anims.create({
    key: 'dog_happy',
    frames: scene.anims.generateFrameNumbers('dog', { start: 2, end: 3 }),
    frameRate: 5,
    repeat: 2,
  })
}

/** Dimensions of generated textures */
export const TEX = {
  playerFrame: { w: 44, h: 52 },
  dogFrame: { w: 28, h: 22 },
  tile: { w: TILE_WIDTH, h: TILE_HEIGHT },
  objTile: { w: TILE_WIDTH, h: TILE_HEIGHT },
} as const

/**
 * Generate all game textures at boot. Call once from GameScene.create().
 */
export function generateAllTextures(scene: Phaser.Scene): void {
  const textures = scene.textures

  // ── Player sprite sheet (4 walk frames + 1 idle baseline) ──
  generatePlayerSheet(textures)

  // ── Dog sprite sheet (2 idle + 2 happy frames) ──
  generateDogSheet(textures)

  // ── Tiles ──
  generateTileTexture(textures, 'tile_floor', '#d4c5a9', '#c4b599')
  generateTileTexture(textures, 'tile_wall', '#8b7d6b', '#7a6e5e')
  generateTileTexture(textures, 'tile_doorway', '#c8b88a', '#b8a87a')

  // ── Interactive objects ──
  genLight(textures)
  genTV(textures)
  genFan(textures)
  genKettle(textures)
  genHairdryer(textures)
  genStereo(textures)
}

// ─── Player sprite sheet ─────────────────────────────────────

function generatePlayerSheet(textures: Phaser.Textures.TextureManager): void {
  const { w, h } = TEX.playerFrame
  const frameCount = 4 // idle(1) + walk(3)
  const canvas = document.createElement('canvas')
  canvas.width = w * frameCount
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  drawPlayer(ctx, 0, 'idle')
  for (let i = 0; i < 3; i++) {
    drawPlayer(ctx, i * w, 'walk', i)
  }

  const tex = textures.addCanvas('player', canvas)
  if (!tex) return
  for (let i = 0; i < frameCount; i++) {
    tex.add(i, 0, i * w, 0, w, h)
  }
}

function drawPlayer(ctx: CanvasRenderingContext2D, dx: number, state: 'idle' | 'walk', walkFrame = 0): void {
  const cx = dx + 22 // center X within frame

  // --- Hair (blonde) ---
  ctx.fillStyle = '#e8c878'
  // Main hair (back)
  ctx.beginPath()
  ctx.ellipse(cx, 16, 14, 12, 0, 0, Math.PI * 2)
  ctx.fill()

  // Braid
  ctx.fillStyle = '#d4b060'
  ctx.fillRect(cx - 4, 22, 8, 18)
  // Braid segments
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#e8c878' : '#d4b060'
    ctx.fillRect(cx - 3, 24 + i * 4, 6, 4)
  }

  // --- Head ---
  ctx.fillStyle = '#fce4c8'
  ctx.beginPath()
  ctx.ellipse(cx, 18, 10, 11, 0, 0, Math.PI * 2)
  ctx.fill()

  // Bangs
  ctx.fillStyle = '#e8c878'
  ctx.fillRect(cx - 10, 8, 20, 6)
  // Side strands
  ctx.fillRect(cx - 11, 10, 4, 10)
  ctx.fillRect(cx + 7, 10, 4, 10)

  // --- Eyes ---
  ctx.fillStyle = '#4488cc'
  ctx.fillRect(cx - 5, 17, 4, 3)
  ctx.fillRect(cx + 1, 17, 4, 3)
  // Eye shine
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(cx - 4, 17, 2, 2)
  ctx.fillRect(cx + 2, 17, 2, 2)

  // --- Mouth (small smile) ---
  ctx.strokeStyle = '#d4887a'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(cx, 25, 3, 0.1, Math.PI - 0.1)
  ctx.stroke()

  // --- Body / Dress ---
  ctx.fillStyle = '#6db8d8'
  ctx.beginPath()
  ctx.moveTo(cx - 12, 28)
  ctx.lineTo(cx + 12, 28)
  ctx.lineTo(cx + 14, 44)
  ctx.lineTo(cx - 14, 44)
  ctx.closePath()
  ctx.fill()

  // Bodice top
  ctx.fillStyle = '#5aa0c0'
  ctx.fillRect(cx - 10, 28, 20, 6)

  // Dress sparkles
  ctx.fillStyle = '#ffffff'
  ctx.globalAlpha = 0.3
  ctx.fillRect(cx - 6, 34, 2, 2)
  ctx.fillRect(cx + 4, 38, 2, 2)
  ctx.globalAlpha = 1

  // --- Arms (walk swing) ---
  ctx.fillStyle = '#fce4c8'
  const armSwing = state === 'walk' ? Math.sin(walkFrame * Math.PI / 1.5) * 3 : 0
  // Left arm
  ctx.fillRect(cx - 15, 30 + armSwing, 4, 10)
  // Right arm
  ctx.fillRect(cx + 11, 30 - armSwing, 4, 10)

  // --- Legs ---
  ctx.fillStyle = '#c8a882'
  if (state === 'idle') {
    ctx.fillRect(cx - 6, 44, 5, 8)
    ctx.fillRect(cx + 1, 44, 5, 8)
  } else {
    const legOff = Math.sin(walkFrame * Math.PI / 1.5) * 4
    ctx.fillRect(cx - 7 + legOff, 44, 5, 8)
    ctx.fillRect(cx + 2 - legOff, 44, 5, 8)
  }

  // --- Sparkle trail (magic) ---
  if (state === 'walk') {
    ctx.fillStyle = 'rgba(200, 220, 255, 0.4)'
    const sx = Math.sin(walkFrame * 1.5) * 8
    ctx.beginPath()
    ctx.arc(cx + sx, 46, 2, 0, Math.PI * 2)
    ctx.fill()
  }
}

// ─── Dog sprite sheet ─────────────────────────────────────────

function generateDogSheet(textures: Phaser.Textures.TextureManager): void {
  const { w, h } = TEX.dogFrame
  const frameCount = 4 // 2 idle + 2 happy
  const canvas = document.createElement('canvas')
  canvas.width = w * frameCount
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  for (let i = 0; i < 2; i++) drawDog(ctx, i * w, 'idle', i)
  for (let i = 0; i < 2; i++) drawDog(ctx, (i + 2) * w, 'happy', i)

  const tex = textures.addCanvas('dog', canvas)
  if (!tex) return
  for (let i = 0; i < frameCount; i++) {
    tex.add(i, 0, i * w, 0, w, h)
  }
}

function drawDog(ctx: CanvasRenderingContext2D, dx: number, state: 'idle' | 'happy', frame: number): void {
  const cx = dx + 14

  // Body
  ctx.fillStyle = '#c68a5e'
  ctx.beginPath()
  ctx.ellipse(cx, 10, 12, 8, 0, 0, Math.PI * 2)
  ctx.fill()

  // Head
  ctx.fillStyle = '#c68a5e'
  ctx.beginPath()
  ctx.arc(cx + 10, 6, 7, 0, Math.PI * 2)
  ctx.fill()

  // Ear
  ctx.fillStyle = '#8b5e34'
  ctx.beginPath()
  ctx.ellipse(cx + 14, 2, 4, 6, -0.3, 0, Math.PI * 2)
  ctx.fill()

  // Eye
  ctx.fillStyle = '#000000'
  ctx.fillRect(cx + 12, 4, 3, 3)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(cx + 12, 4, 1, 1)

  // Nose
  ctx.fillStyle = '#333333'
  ctx.beginPath()
  ctx.arc(cx + 16, 6, 2, 0, Math.PI * 2)
  ctx.fill()

  // Tail (wag based on frame + state)
  ctx.fillStyle = '#c68a5e'
  const tailAngle = state === 'happy' ? Math.sin(frame * Math.PI) * 0.5 : (frame === 0 ? -0.3 : 0.3)
  ctx.save()
  ctx.translate(cx - 12, 4)
  ctx.rotate(tailAngle)
  ctx.fillRect(0, -4, 6, 4)
  ctx.restore()

  // Tongue (happy only)
  if (state === 'happy') {
    ctx.fillStyle = '#ff8888'
    ctx.fillRect(cx + 15, 8, 3, 5)
  }
}

// ─── Tile textures ────────────────────────────────────────────

function generateTileTexture(
  textures: Phaser.Textures.TextureManager,
  key: string,
  mainColor: string,
  edgeColor: string,
): void {
  const { w, h } = TEX.tile
  const g = document.createElement('canvas')
  g.width = w
  g.height = h
  const ctx = g.getContext('2d')!

  // Isometric diamond
  ctx.fillStyle = mainColor
  ctx.beginPath()
  ctx.moveTo(w / 2, 0)
  ctx.lineTo(w, h / 2)
  ctx.lineTo(w / 2, h)
  ctx.lineTo(0, h / 2)
  ctx.closePath()
  ctx.fill()

  // Edge highlight
  ctx.strokeStyle = edgeColor
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(w / 2, 0)
  ctx.lineTo(w, h / 2)
  ctx.lineTo(w / 2, h)
  ctx.lineTo(0, h / 2)
  ctx.closePath()
  ctx.stroke()

  textures.addCanvas(key, g)
}

// ─── Interactive object textures ─────────────────────────────

function genLight(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 32
  g.height = 40
  const ctx = g.getContext('2d')!

  // Lamp post
  ctx.fillStyle = '#888888'
  ctx.fillRect(14, 20, 4, 16)
  // Lamp shade
  ctx.fillStyle = '#ffee88'
  ctx.beginPath()
  ctx.moveTo(6, 8)
  ctx.lineTo(26, 8)
  ctx.lineTo(22, 20)
  ctx.lineTo(10, 20)
  ctx.closePath()
  ctx.fill()
  // Glow
  ctx.fillStyle = 'rgba(255, 238, 136, 0.2)'
  ctx.beginPath()
  ctx.arc(16, 16, 12, 0, Math.PI * 2)
  ctx.fill()

  textures.addCanvas('obj_light_off', g)

  // ON version
  const g2 = document.createElement('canvas')
  g2.width = 32
  g2.height = 40
  const ctx2 = g2.getContext('2d')!
  ctx2.drawImage(g, 0, 0)
  // Bright glow
  ctx2.fillStyle = 'rgba(255, 238, 136, 0.4)'
  ctx2.beginPath()
  ctx2.arc(16, 16, 18, 0, Math.PI * 2)
  ctx2.fill()
  textures.addCanvas('obj_light_on', g2)
}

function genTV(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 32
  g.height = 28
  const ctx = g.getContext('2d')!

  // TV body
  ctx.fillStyle = '#444444'
  ctx.fillRect(2, 4, 28, 20)
  // Screen
  ctx.fillStyle = '#222222'
  ctx.fillRect(6, 6, 20, 14)
  // Stand
  ctx.fillStyle = '#666666'
  ctx.fillRect(12, 24, 8, 4)
  textures.addCanvas('obj_tv_off', g)

  const g2 = document.createElement('canvas')
  g2.width = 32
  g2.height = 28
  const ctx2 = g2.getContext('2d')!
  ctx2.drawImage(g, 0, 0)
  // Screen ON
  ctx2.fillStyle = '#66ccff'
  ctx2.fillRect(6, 6, 20, 14)
  // Screen shimmer
  ctx2.fillStyle = 'rgba(255,255,255,0.2)'
  ctx2.fillRect(10, 8, 12, 2)
  textures.addCanvas('obj_tv_on', g2)
}

function genFan(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 32
  g.height = 36
  const ctx = g.getContext('2d')!

  // Stand
  ctx.fillStyle = '#888888'
  ctx.fillRect(14, 20, 4, 12)
  // Base
  ctx.fillRect(8, 32, 16, 4)
  // Fan head (off)
  ctx.fillStyle = '#999999'
  ctx.beginPath()
  ctx.arc(16, 12, 8, 0, Math.PI * 2)
  ctx.fill()
  textures.addCanvas('obj_fan_off', g)

  const g2 = document.createElement('canvas')
  g2.width = 32
  g2.height = 36
  const ctx2 = g2.getContext('2d')!
  ctx2.drawImage(g, 0, 0)
  // Blur effect (spinning)
  ctx2.fillStyle = 'rgba(136, 204, 255, 0.3)'
  ctx2.beginPath()
  ctx2.arc(16, 12, 10, 0, Math.PI * 2)
  ctx2.fill()
  // Blades
  ctx2.fillStyle = 'rgba(200, 220, 255, 0.5)'
  ctx2.fillRect(13, 3, 6, 18)
  textures.addCanvas('obj_fan_on', g2)
}

function genKettle(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 28
  g.height = 32
  const ctx = g.getContext('2d')!

  // Body
  ctx.fillStyle = '#ccaa88'
  ctx.beginPath()
  ctx.ellipse(14, 18, 10, 12, 0, 0, Math.PI * 2)
  ctx.fill()
  // Lid
  ctx.fillStyle = '#bb9966'
  ctx.fillRect(8, 6, 12, 4)
  // Spout
  ctx.fillStyle = '#ccaa88'
  ctx.fillRect(20, 14, 6, 4)
  textures.addCanvas('obj_kettle_off', g)

  const g2 = document.createElement('canvas')
  g2.width = 28
  g2.height = 32
  const ctx2 = g2.getContext('2d')!
  ctx2.drawImage(g, 0, 0)
  // Steam (boiling)
  ctx2.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx2.beginPath()
  ctx2.arc(23, 8, 4, 0, Math.PI * 2)
  ctx2.fill()
  ctx2.beginPath()
  ctx2.arc(26, 4, 3, 0, Math.PI * 2)
  ctx2.fill()
  textures.addCanvas('obj_kettle_on', g2)
}

function genHairdryer(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 36
  g.height = 24
  const ctx = g.getContext('2d')!

  // Body
  ctx.fillStyle = '#cc88cc'
  ctx.fillRect(4, 6, 20, 10)
  // Nozzle
  ctx.fillStyle = '#aa66aa'
  ctx.fillRect(24, 8, 10, 6)
  // Handle
  ctx.fillStyle = '#cc88cc'
  ctx.fillRect(10, 16, 8, 6)
  textures.addCanvas('obj_hairdryer_off', g)

  const g2 = document.createElement('canvas')
  g2.width = 36
  g2.height = 24
  const ctx2 = g2.getContext('2d')!
  ctx2.drawImage(g, 0, 0)
  // Blow effect
  ctx2.fillStyle = 'rgba(255, 136, 255, 0.3)'
  ctx2.beginPath()
  ctx2.ellipse(34, 10, 6, 4, 0, 0, Math.PI * 2)
  ctx2.fill()
  textures.addCanvas('obj_hairdryer_on', g2)
}

function genStereo(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 32
  g.height = 24
  const ctx = g.getContext('2d')!

  // Body
  ctx.fillStyle = '#886688'
  ctx.fillRect(2, 4, 28, 16)
  // Speakers
  ctx.fillStyle = '#665566'
  ctx.beginPath()
  ctx.arc(10, 12, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(22, 12, 6, 0, Math.PI * 2)
  ctx.fill()
  textures.addCanvas('obj_stereo_off', g)

  const g2 = document.createElement('canvas')
  g2.width = 32
  g2.height = 24
  const ctx2 = g2.getContext('2d')!
  ctx2.drawImage(g, 0, 0)
  // Music notes
  ctx2.fillStyle = '#66ff66'
  ctx2.font = '10px sans-serif'
  ctx2.fillText('♪', 4, 4)
  ctx2.fillText('♫', 20, 2)
  textures.addCanvas('obj_stereo_on', g2)
}
