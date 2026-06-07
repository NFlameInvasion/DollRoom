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
}

/** Dimensions of generated textures */
export const TEX = {
  playerFrame: { w: 44, h: 52 },
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

  // ── Floor (no grid lines) ──
  genFloor(textures, 'tile_floor', '#d4c5a9')

  // ── Wall objects ──
  genAC(textures)
  genLightSwitch(textures)

  // ── Shadow and light effects ──
  genShadow(textures)
  genLightGlow(textures)

  // ── Interactive objects ──
  genLight(textures)
  genTV(textures)
  genFan(textures)
  genKettle(textures)
  genHairdryer(textures)
  genStereo(textures)

  // ── Furniture ──
  genBed(textures)
  genNightstand(textures)
  genWardrobe(textures)
  genSofa(textures)
  genCoffeeTable(textures)
  genChandelier(textures)
  genBookshelf(textures)
  genDiningTable(textures)
  genFridge(textures)
  genKitchenCabinets(textures)
  genMicrowave(textures)
  genBathroomCabinet(textures)
  genMirror(textures)
  genToyShelves(textures)
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

  // ── Shadow under feet ──
  ctx.fillStyle = 'rgba(0,0,0,0.15)'
  ctx.beginPath()
  ctx.ellipse(cx, 52, 10, 3, 0, 0, Math.PI * 2)
  ctx.fill()

  // ── Hair (blonde, back layer) ──
  ctx.fillStyle = '#d4b060'
  ctx.beginPath()
  ctx.ellipse(cx, 15, 15, 13, 0, 0, Math.PI * 2)
  ctx.fill()

  // ── Braid ──
  ctx.fillStyle = '#d4b060'
  ctx.beginPath()
  ctx.moveTo(cx + 4, 14)
  ctx.lineTo(cx + 10, 20)
  ctx.lineTo(cx + 8, 36)
  ctx.lineTo(cx + 4, 36)
  ctx.lineTo(cx + 6, 20)
  ctx.closePath()
  ctx.fill()
  // Braid bands
  ctx.fillStyle = '#e8c878'
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(cx + 5, 18 + i * 4, 4, 2)
  }
  // Ribbon at end
  ctx.fillStyle = '#cc6688'
  ctx.beginPath()
  ctx.ellipse(cx + 6, 36, 3, 2, 0.3, 0, Math.PI * 2)
  ctx.fill()

  // ── Head ──
  ctx.fillStyle = '#fce4c8'
  ctx.beginPath()
  ctx.ellipse(cx, 17, 10, 11, 0, 0, Math.PI * 2)
  ctx.fill()

  // ── Hair (front: bangs + side strands) ──
  ctx.fillStyle = '#e8c878'
  // Bangs - layered
  ctx.beginPath()
  ctx.moveTo(cx - 10, 8)
  ctx.lineTo(cx - 6, 6)
  ctx.lineTo(cx - 2, 7)
  ctx.lineTo(cx + 2, 6)
  ctx.lineTo(cx + 6, 7)
  ctx.lineTo(cx + 10, 8)
  ctx.lineTo(cx + 10, 13)
  ctx.lineTo(cx - 10, 13)
  ctx.closePath()
  ctx.fill()
  // Side strands
  ctx.fillRect(cx - 12, 9, 4, 12)
  ctx.fillRect(cx + 8, 9, 4, 12)
  // Hair highlights
  ctx.fillStyle = 'rgba(255,255,200,0.2)'
  ctx.fillRect(cx - 8, 7, 5, 2)
  ctx.fillRect(cx + 3, 7, 5, 2)

  // ── Eyebrows ──
  ctx.strokeStyle = '#c8a060'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(cx - 6, 15)
  ctx.lineTo(cx - 2, 14.5)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 2, 14.5)
  ctx.lineTo(cx + 6, 15)
  ctx.stroke()

  // ── Eyes ──
  // Left eye
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(cx - 6, 17, 5, 4)
  ctx.fillStyle = '#4488cc'
  ctx.fillRect(cx - 5, 18, 3, 3)
  ctx.fillStyle = '#222244'
  ctx.fillRect(cx - 4, 18, 2, 3)
  // Eye shine
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(cx - 4, 18, 2, 1)
  ctx.fillRect(cx - 5, 19, 1, 1)
  // Eyelashes
  ctx.strokeStyle = '#886644'
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(cx - 6, 17)
  ctx.lineTo(cx - 7, 16)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx - 1, 17)
  ctx.lineTo(cx - 1, 16)
  ctx.stroke()

  // Right eye
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(cx + 1, 17, 5, 4)
  ctx.fillStyle = '#4488cc'
  ctx.fillRect(cx + 2, 18, 3, 3)
  ctx.fillStyle = '#222244'
  ctx.fillRect(cx + 3, 18, 2, 3)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(cx + 3, 18, 2, 1)
  ctx.fillRect(cx + 2, 19, 1, 1)
  ctx.strokeStyle = '#886644'
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(cx + 1, 17)
  ctx.lineTo(cx, 16)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 6, 17)
  ctx.lineTo(cx + 6, 16)
  ctx.stroke()

  // ── Blush ──
  ctx.fillStyle = 'rgba(255, 150, 150, 0.2)'
  ctx.beginPath()
  ctx.ellipse(cx - 7, 20, 3, 2, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + 7, 20, 3, 2, 0, 0, Math.PI * 2)
  ctx.fill()

  // ── Mouth (happy smile) ──
  ctx.fillStyle = '#e8a090'
  ctx.beginPath()
  ctx.arc(cx, 24, 3, 0.1, Math.PI - 0.1)
  ctx.fill()
  // Lower lip highlight
  ctx.fillStyle = 'rgba(255,200,200,0.3)'
  ctx.beginPath()
  ctx.arc(cx, 24, 2, 0, Math.PI)
  ctx.fill()

  // ── Neck ──
  ctx.fillStyle = '#f0d4c0'
  ctx.fillRect(cx - 3, 26, 6, 4)
  // Neck shadow
  ctx.fillStyle = 'rgba(0,0,0,0.05)'
  ctx.fillRect(cx, 26, 3, 4)

  // ── Body / Dress ──
  // Dress base
  ctx.fillStyle = '#6db8d8'
  ctx.beginPath()
  ctx.moveTo(cx - 13, 28)
  ctx.lineTo(cx + 13, 28)
  ctx.lineTo(cx + 16, 46)
  ctx.lineTo(cx - 16, 46)
  ctx.closePath()
  ctx.fill()

  // Dress gradient shading
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  ctx.beginPath()
  ctx.moveTo(cx - 8, 28)
  ctx.lineTo(cx, 28)
  ctx.lineTo(cx - 4, 46)
  ctx.lineTo(cx - 10, 46)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = 'rgba(0,0,0,0.05)'
  ctx.beginPath()
  ctx.moveTo(cx + 4, 28)
  ctx.lineTo(cx + 13, 28)
  ctx.lineTo(cx + 16, 46)
  ctx.lineTo(cx + 6, 46)
  ctx.closePath()
  ctx.fill()

  // Bodice
  ctx.fillStyle = '#5aa0c0'
  ctx.fillRect(cx - 10, 28, 20, 6)
  // Bodice trim
  ctx.fillStyle = '#4a90b0'
  ctx.fillRect(cx - 10, 33, 20, 1)

  // Belt/ribbon
  ctx.fillStyle = '#cc6688'
  ctx.fillRect(cx - 10, 35, 20, 2)
  // Bow
  ctx.fillStyle = '#dd7799'
  ctx.beginPath()
  ctx.moveTo(cx - 2, 35)
  ctx.lineTo(cx - 6, 33)
  ctx.lineTo(cx - 5, 36)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(cx + 2, 35)
  ctx.lineTo(cx + 6, 33)
  ctx.lineTo(cx + 5, 36)
  ctx.closePath()
  ctx.fill()
  // Bow center
  ctx.fillStyle = '#cc6688'
  ctx.beginPath()
  ctx.arc(cx, 35, 1.5, 0, Math.PI * 2)
  ctx.fill()

  // Dress skirt folds
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  for (let i = -2; i <= 2; i += 2) {
    ctx.fillRect(cx + i * 4, 39, 1, 6)
  }

  // ── Arms ──
  ctx.fillStyle = '#fce4c8'
  const armSwing = state === 'walk' ? Math.sin(walkFrame * Math.PI / 1.5) * 4 : 0

  // Left arm
  ctx.beginPath()
  ctx.moveTo(cx - 15, 29 + armSwing)
  ctx.lineTo(cx - 12, 29)
  ctx.lineTo(cx - 13, 40 + armSwing)
  ctx.lineTo(cx - 16, 40 + armSwing)
  ctx.closePath()
  ctx.fill()
  // Left hand
  ctx.fillStyle = '#f0d0b8'
  ctx.fillRect(cx - 17, 40 + armSwing, 4, 3)

  // Right arm
  ctx.fillStyle = '#fce4c8'
  ctx.beginPath()
  ctx.moveTo(cx + 12, 29 - armSwing)
  ctx.lineTo(cx + 15, 29)
  ctx.lineTo(cx + 16, 40 - armSwing)
  ctx.lineTo(cx + 13, 40 - armSwing)
  ctx.closePath()
  ctx.fill()
  // Right hand
  ctx.fillStyle = '#f0d0b8'
  ctx.fillRect(cx + 13, 40 - armSwing, 4, 3)

  // ── Legs ──
  ctx.fillStyle = '#d4b89a'
  const shoeColor = '#cc6688'

  if (state === 'idle') {
    // Left leg
    ctx.fillRect(cx - 7, 46, 5, 4)
    // Left shoe
    ctx.fillStyle = shoeColor
    ctx.beginPath()
    ctx.ellipse(cx - 4, 50, 4, 2, 0, 0, Math.PI * 2)
    ctx.fill()
    // Right leg
    ctx.fillStyle = '#d4b89a'
    ctx.fillRect(cx + 2, 46, 5, 4)
    // Right shoe
    ctx.fillStyle = shoeColor
    ctx.beginPath()
    ctx.ellipse(cx + 5, 50, 4, 2, 0, 0, Math.PI * 2)
    ctx.fill()
  } else {
    const legOff = Math.sin(walkFrame * Math.PI / 1.5) * 5
    // Left leg
    ctx.fillStyle = '#d4b89a'
    ctx.fillRect(cx - 8 + legOff, 46, 5, 4)
    // Left shoe
    ctx.fillStyle = shoeColor
    ctx.beginPath()
    ctx.ellipse(cx - 5 + legOff, 50, 4, 2, 0, 0, Math.PI * 2)
    ctx.fill()
    // Right leg
    ctx.fillStyle = '#d4b89a'
    ctx.fillRect(cx + 3 - legOff, 46, 5, 4)
    // Right shoe
    ctx.fillStyle = shoeColor
    ctx.beginPath()
    ctx.ellipse(cx + 6 - legOff, 50, 4, 2, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // ── Sparkle trail (magic) ──
  if (state === 'walk') {
    ctx.fillStyle = 'rgba(200, 220, 255, 0.35)'
    const sx = Math.sin(walkFrame * 1.5) * 10
    ctx.beginPath()
    ctx.arc(cx + sx, 48, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(200, 220, 255, 0.2)'
    ctx.beginPath()
    ctx.arc(cx - sx, 46, 1.5, 0, Math.PI * 2)
    ctx.fill()
  }
}

// ─── Floor tile (no grid lines) ──────────────────────────────

function genFloor(textures: Phaser.Textures.TextureManager, key: string, _color: string): void {
  const { w, h } = TEX.tile
  const g = document.createElement('canvas')
  g.width = w
  g.height = h
  const ctx = g.getContext('2d')!

  // Clip to diamond shape
  ctx.beginPath()
  ctx.moveTo(w / 2, 0)
  ctx.lineTo(w, h / 2)
  ctx.lineTo(w / 2, h)
  ctx.lineTo(0, h / 2)
  ctx.closePath()
  ctx.clip()

  // Wood base color
  ctx.fillStyle = '#c4a87a'
  ctx.fillRect(0, 0, w, h)

  // Wood grain lines (horizontal streaks)
  ctx.strokeStyle = 'rgba(160, 130, 80, 0.3)'
  ctx.lineWidth = 1
  for (let y = 2; y < h; y += 4) {
    ctx.beginPath()
    const offset = Math.sin(y * 0.3) * 3
    ctx.moveTo(0, y + offset)
    ctx.lineTo(w, y + offset - 1)
    ctx.stroke()
  }

  // Darker grain knots
  ctx.fillStyle = 'rgba(140, 110, 60, 0.25)'
  ctx.beginPath()
  ctx.ellipse(20, 14, 4, 2, 0.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(44, 22, 3, 2, -0.1, 0, Math.PI * 2)
  ctx.fill()

  // Subtle edge darkening
  ctx.fillStyle = 'rgba(0,0,0,0.04)'
  ctx.beginPath()
  ctx.moveTo(w / 2, 0)
  ctx.lineTo(w, h / 2)
  ctx.lineTo(w / 2, h)
  ctx.lineTo(0, h / 2)
  ctx.closePath()
  ctx.fill()

  textures.addCanvas(key, g)
}

// ─── Wall decoration objects ─────────────────────────────────

function genAC(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 48
  g.height = 24
  const ctx = g.getContext('2d')!

  // AC unit body
  ctx.fillStyle = '#cccccc'
  ctx.fillRect(4, 4, 40, 16)
  // AC vent lines
  ctx.fillStyle = '#999999'
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(8 + i * 9, 8, 6, 8)
  }
  // AC indicator light
  ctx.fillStyle = '#44ff44'
  ctx.fillRect(38, 6, 4, 3)

  textures.addCanvas('obj_ac', g)
}

function genLightSwitch(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 12
  g.height = 20
  const ctx = g.getContext('2d')!

  // Switch plate
  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(0, 0, 12, 20)
  // Switch button
  ctx.fillStyle = '#333333'
  ctx.fillRect(4, 6, 4, 8)

  textures.addCanvas('obj_switch', g)
}

// ─── Shadow and light effects ────────────────────────────────

function genShadow(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 44
  g.height = 18
  const ctx = g.getContext('2d')!

  const grad = ctx.createRadialGradient(22, 9, 0, 22, 9, 20)
  grad.addColorStop(0, 'rgba(0,0,0,0.3)')
  grad.addColorStop(0.5, 'rgba(0,0,0,0.15)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.ellipse(22, 9, 22, 9, 0, 0, Math.PI * 2)
  ctx.fill()

  textures.addCanvas('fx_shadow', g)
}

function genLightGlow(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 128
  g.height = 128
  const ctx = g.getContext('2d')!

  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255, 238, 136, 0.3)')
  grad.addColorStop(0.3, 'rgba(255, 238, 136, 0.12)')
  grad.addColorStop(1, 'rgba(255, 238, 136, 0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 128)

  textures.addCanvas('fx_light_glow', g)
}

// ─── Interactive object textures ─────────────────────────────

function genLight(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 32
  g.height = 44
  const ctx = g.getContext('2d')!

  // Base
  ctx.fillStyle = '#666666'
  ctx.beginPath()
  ctx.ellipse(16, 38, 6, 3, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#777777'
  ctx.fillRect(12, 34, 8, 4)

  // Post
  ctx.fillStyle = '#999999'
  ctx.fillRect(14, 22, 4, 12)
  // Post highlight
  ctx.fillStyle = '#aaaaaa'
  ctx.fillRect(14, 22, 1, 12)

  // Shade (OFF)
  ctx.fillStyle = '#ddcc88'
  ctx.beginPath()
  ctx.moveTo(4, 6)
  ctx.lineTo(28, 6)
  ctx.lineTo(24, 22)
  ctx.lineTo(8, 22)
  ctx.closePath()
  ctx.fill()
  // Shade top rim
  ctx.fillStyle = '#ccbb77'
  ctx.fillRect(3, 4, 26, 3)
  // Shade bottom trim
  ctx.fillStyle = '#bbaa66'
  ctx.fillRect(8, 22, 16, 2)
  // Shade highlight
  ctx.fillStyle = 'rgba(255,255,200,0.2)'
  ctx.fillRect(6, 8, 6, 12)

  textures.addCanvas('obj_light_off', g)

  // ON version
  const g2 = document.createElement('canvas')
  g2.width = 32
  g2.height = 44
  const ctx2 = g2.getContext('2d')!
  ctx2.drawImage(g, 0, 0)
  // Bright inner glow
  ctx2.fillStyle = 'rgba(255, 238, 136, 0.35)'
  ctx2.beginPath()
  ctx2.arc(16, 14, 14, 0, Math.PI * 2)
  ctx2.fill()
  // Core hotspot
  ctx2.fillStyle = 'rgba(255, 255, 200, 0.5)'
  ctx2.beginPath()
  ctx2.arc(16, 14, 6, 0, Math.PI * 2)
  ctx2.fill()
  // Light cone downward
  ctx2.fillStyle = 'rgba(255, 238, 136, 0.08)'
  ctx2.beginPath()
  ctx2.moveTo(8, 22)
  ctx2.lineTo(10, 40)
  ctx2.lineTo(22, 40)
  ctx2.lineTo(24, 22)
  ctx2.closePath()
  ctx2.fill()
  textures.addCanvas('obj_light_on', g2)
}

function genTV(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 36
  g.height = 30
  const ctx = g.getContext('2d')!

  // Stand base
  ctx.fillStyle = '#555555'
  ctx.beginPath()
  ctx.ellipse(18, 28, 8, 3, 0, 0, Math.PI * 2)
  ctx.fill()
  // Stand neck
  ctx.fillStyle = '#666666'
  ctx.fillRect(15, 22, 6, 6)

  // TV body
  ctx.fillStyle = '#333333'
  ctx.fillRect(2, 2, 32, 20)
  // Body bevel
  ctx.fillStyle = '#3a3a3a'
  ctx.fillRect(3, 3, 30, 18)

  // Screen (OFF: dark gray)
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(6, 5, 24, 14)
  // Screen reflection
  ctx.fillStyle = 'rgba(255,255,255,0.05)'
  ctx.fillRect(8, 6, 10, 12)

  // Power LED
  ctx.fillStyle = '#44ff44'
  ctx.fillRect(28, 20, 2, 1)

  // Brand strip
  ctx.fillStyle = '#444444'
  ctx.fillRect(12, 20, 8, 1)

  textures.addCanvas('obj_tv_off', g)

  // ON version
  const g2 = document.createElement('canvas')
  g2.width = 36
  g2.height = 30
  const ctx2 = g2.getContext('2d')!
  ctx2.drawImage(g, 0, 0)
  // Screen ON
  ctx2.fillStyle = '#4488cc'
  ctx2.fillRect(6, 5, 24, 14)
  // TV content (color bars)
  ctx2.fillStyle = '#66ccff'
  ctx2.fillRect(6, 5, 6, 14)
  ctx2.fillStyle = '#66ff66'
  ctx2.fillRect(12, 5, 6, 14)
  ctx2.fillStyle = '#ff6688'
  ctx2.fillRect(18, 5, 6, 14)
  ctx2.fillStyle = '#ffcc44'
  ctx2.fillRect(24, 5, 6, 14)
  // Screen glare
  ctx2.fillStyle = 'rgba(255,255,255,0.15)'
  ctx2.fillRect(8, 6, 10, 2)
  ctx2.fillStyle = 'rgba(255,255,255,0.05)'
  ctx2.fillRect(8, 8, 10, 9)
  textures.addCanvas('obj_tv_on', g2)
}

function genFan(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 36
  g.height = 40
  const ctx = g.getContext('2d')!

  // Base
  ctx.fillStyle = '#777777'
  ctx.beginPath()
  ctx.ellipse(18, 36, 10, 4, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#888888'
  ctx.fillRect(10, 32, 16, 4)
  // Base highlight
  ctx.fillStyle = '#999999'
  ctx.fillRect(12, 33, 4, 2)

  // Stand pole
  ctx.fillStyle = '#aaaaaa'
  ctx.fillRect(16, 22, 4, 10)
  ctx.fillStyle = '#bbbbbb'
  ctx.fillRect(16, 22, 1, 10)

  // Oscillation knob
  ctx.fillStyle = '#666666'
  ctx.beginPath()
  ctx.arc(18, 22, 3, 0, Math.PI * 2)
  ctx.fill()

  // Motor housing
  ctx.fillStyle = '#888888'
  ctx.beginPath()
  ctx.arc(18, 12, 5, 0, Math.PI * 2)
  ctx.fill()

  // Fan cage (outer ring)
  ctx.fillStyle = '#999999'
  ctx.beginPath()
  ctx.arc(18, 12, 10, 0, Math.PI * 2)
  ctx.fill()
  // Cage center
  ctx.fillStyle = '#aaaaaa'
  ctx.beginPath()
  ctx.arc(18, 12, 9, 0, Math.PI * 2)
  ctx.fill()

  // Blades (OFF — visible as static)
  ctx.fillStyle = '#ccbbaa'
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2
    ctx.save()
    ctx.translate(18, 12)
    ctx.rotate(angle)
    ctx.beginPath()
    ctx.ellipse(0, -6, 3, 7, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // Center cap
  ctx.fillStyle = '#666666'
  ctx.beginPath()
  ctx.arc(18, 12, 2, 0, Math.PI * 2)
  ctx.fill()

  textures.addCanvas('obj_fan_off', g)

  // ON version
  const g2 = document.createElement('canvas')
  g2.width = 36
  g2.height = 40
  const ctx2 = g2.getContext('2d')!
  ctx2.drawImage(g, 0, 0)
  // Motion blur ring
  ctx2.fillStyle = 'rgba(180, 200, 220, 0.25)'
  ctx2.beginPath()
  ctx2.arc(18, 12, 9, 0, Math.PI * 2)
  ctx2.fill()
  ctx2.fillStyle = 'rgba(200, 220, 255, 0.2)'
  ctx2.beginPath()
  ctx2.arc(18, 12, 7, 0, Math.PI * 2)
  ctx2.fill()
  // Spinning blade traces
  ctx2.fillStyle = 'rgba(200, 220, 255, 0.15)'
  for (let i = 0; i < 3; i++) {
    ctx2.save()
    ctx2.translate(18, 12)
    ctx2.rotate((i * Math.PI * 2) / 3)
    ctx2.fillRect(13, -1, 4, 2)
    ctx2.restore()
  }
  textures.addCanvas('obj_fan_on', g2)
}

function genKettle(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 32
  g.height = 36
  const ctx = g.getContext('2d')!

  // Base
  ctx.fillStyle = '#555555'
  ctx.beginPath()
  ctx.ellipse(16, 32, 8, 3, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillRect(10, 30, 12, 2)

  // Body
  ctx.fillStyle = '#d4b08a'
  ctx.beginPath()
  ctx.ellipse(16, 18, 11, 13, 0, 0, Math.PI * 2)
  ctx.fill()
  // Body highlight
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.beginPath()
  ctx.ellipse(12, 14, 4, 8, -0.2, 0, Math.PI * 2)
  ctx.fill()

  // Lid
  ctx.fillStyle = '#c8a070'
  ctx.fillRect(8, 4, 16, 4)
  ctx.fillStyle = '#b89060'
  ctx.fillRect(7, 3, 18, 2)
  // Lid knob
  ctx.fillStyle = '#666666'
  ctx.beginPath()
  ctx.arc(16, 3, 2, 0, Math.PI * 2)
  ctx.fill()

  // Spout
  ctx.fillStyle = '#c8a070'
  ctx.fillRect(24, 12, 6, 5)
  ctx.fillStyle = '#b89060'
  ctx.fillRect(26, 10, 4, 3)

  // Handle
  ctx.strokeStyle = '#b89060'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(4, 16, 6, -Math.PI / 2, Math.PI / 2)
  ctx.stroke()

  // Water level indicator
  ctx.fillStyle = '#4488cc'
  ctx.fillRect(18, 20, 2, 6)

  textures.addCanvas('obj_kettle_off', g)

  // ON version
  const g2 = document.createElement('canvas')
  g2.width = 32
  g2.height = 36
  const ctx2 = g2.getContext('2d')!
  ctx2.drawImage(g, 0, 0)
  // Steam
  ctx2.fillStyle = 'rgba(255,255,255,0.3)'
  ctx2.beginPath()
  ctx2.arc(28, 6, 4, 0, Math.PI * 2)
  ctx2.fill()
  ctx2.beginPath()
  ctx2.arc(30, 2, 3, 0, Math.PI * 2)
  ctx2.fill()
  ctx2.beginPath()
  ctx2.arc(26, 0, 2, 0, Math.PI * 2)
  ctx2.fill()
  // Glow from hot base
  ctx2.fillStyle = 'rgba(255, 100, 0, 0.15)'
  ctx2.beginPath()
  ctx2.ellipse(16, 32, 8, 4, 0, 0, Math.PI * 2)
  ctx2.fill()
  textures.addCanvas('obj_kettle_on', g2)
}

function genHairdryer(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 40
  g.height = 28
  const ctx = g.getContext('2d')!

  // Body
  ctx.fillStyle = '#cc88cc'
  ctx.beginPath()
  ctx.moveTo(4, 12)
  ctx.lineTo(20, 6)
  ctx.lineTo(28, 6)
  ctx.lineTo(28, 16)
  ctx.lineTo(20, 16)
  ctx.lineTo(4, 16)
  ctx.closePath()
  ctx.fill()
  // Body highlight
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.beginPath()
  ctx.moveTo(6, 12)
  ctx.lineTo(20, 7)
  ctx.lineTo(22, 7)
  ctx.lineTo(8, 13)
  ctx.closePath()
  ctx.fill()

  // Nozzle
  ctx.fillStyle = '#aa66aa'
  ctx.fillRect(28, 8, 10, 6)
  ctx.fillStyle = '#996699'
  ctx.fillRect(28, 8, 10, 1)

  // Handle
  ctx.fillStyle = '#bb77bb'
  ctx.beginPath()
  ctx.moveTo(8, 16)
  ctx.lineTo(16, 16)
  ctx.lineTo(16, 24)
  ctx.lineTo(10, 24)
  ctx.lineTo(8, 20)
  ctx.closePath()
  ctx.fill()
  // Handle grip lines
  ctx.fillStyle = '#aa66aa'
  ctx.fillRect(10, 18, 5, 1)
  ctx.fillRect(10, 20, 5, 1)

  // Switch button
  ctx.fillStyle = '#884488'
  ctx.fillRect(20, 10, 3, 4)

  // Vent grille (back)
  ctx.fillStyle = '#aa66aa'
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(5 + i * 3, 11, 1, 4)
  }

  textures.addCanvas('obj_hairdryer_off', g)

  // ON version
  const g2 = document.createElement('canvas')
  g2.width = 40
  g2.height = 28
  const ctx2 = g2.getContext('2d')!
  ctx2.drawImage(g, 0, 0)
  // Blow effect
  ctx2.fillStyle = 'rgba(255, 136, 255, 0.25)'
  ctx2.beginPath()
  ctx2.ellipse(38, 10, 8, 5, 0, 0, Math.PI * 2)
  ctx2.fill()
  // Air flow lines
  ctx2.fillStyle = 'rgba(255, 180, 255, 0.3)'
  ctx2.fillRect(36, 8, 4, 1)
  ctx2.fillRect(34, 11, 6, 1)
  ctx2.fillRect(36, 14, 4, 1)
  // Power indicator
  ctx2.fillStyle = '#44ff44'
  ctx2.fillRect(22, 10, 1, 2)
  textures.addCanvas('obj_hairdryer_on', g2)
}

function genStereo(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 36
  g.height = 26
  const ctx = g.getContext('2d')!

  // Body
  ctx.fillStyle = '#775577'
  ctx.fillRect(2, 2, 32, 18)
  // Body top edge
  ctx.fillStyle = '#886688'
  ctx.fillRect(2, 1, 32, 2)

  // Left speaker
  ctx.fillStyle = '#554455'
  ctx.beginPath()
  ctx.arc(10, 11, 6, 0, Math.PI * 2)
  ctx.fill()
  // Left speaker cone rings
  ctx.strokeStyle = '#665566'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(10, 11, 4, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(10, 11, 2, 0, Math.PI * 2)
  ctx.stroke()
  // Left speaker center
  ctx.fillStyle = '#443344'
  ctx.beginPath()
  ctx.arc(10, 11, 1, 0, Math.PI * 2)
  ctx.fill()

  // Right speaker
  ctx.fillStyle = '#554455'
  ctx.beginPath()
  ctx.arc(26, 11, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#665566'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(26, 11, 4, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(26, 11, 2, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = '#443344'
  ctx.beginPath()
  ctx.arc(26, 11, 1, 0, Math.PI * 2)
  ctx.fill()

  // Center panel
  ctx.fillStyle = '#664466'
  ctx.fillRect(16, 4, 4, 14)
  // LED indicator
  ctx.fillStyle = '#44ff44'
  ctx.beginPath()
  ctx.arc(18, 6, 1, 0, Math.PI * 2)
  ctx.fill()
  // Knob
  ctx.fillStyle = '#886688'
  ctx.beginPath()
  ctx.arc(18, 13, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#775577'
  ctx.beginPath()
  ctx.arc(18, 13, 2, 0, Math.PI * 2)
  ctx.fill()

  // Feet
  ctx.fillStyle = '#554455'
  ctx.fillRect(4, 20, 6, 2)
  ctx.fillRect(26, 20, 6, 2)

  textures.addCanvas('obj_stereo_off', g)

  // ON version
  const g2 = document.createElement('canvas')
  g2.width = 36
  g2.height = 26
  const ctx2 = g2.getContext('2d')!
  ctx2.drawImage(g, 0, 0)
  // Equalizer bars
  ctx2.fillStyle = '#66ff66'
  ctx2.fillRect(17, 8, 1, 2)
  ctx2.fillRect(17, 10, 1, 4)
  ctx2.fillRect(17, 14, 1, 2)
  // LED on
  ctx2.fillStyle = '#ff4444'
  ctx2.beginPath()
  ctx2.arc(18, 6, 1, 0, Math.PI * 2)
  ctx2.fill()
  // Music note
  ctx2.fillStyle = '#88ff88'
  ctx2.font = '8px sans-serif'
  ctx2.fillText('♪', 5, 2)
  ctx2.fillText('♫', 24, 3)
  textures.addCanvas('obj_stereo_on', g2)
}

// ─── Furniture textures ────────────────────────────────────────

function genBed(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 56
  g.height = 44
  const ctx = g.getContext('2d')!

  // Headboard
  ctx.fillStyle = '#8b6f4e'
  ctx.fillRect(2, 2, 20, 36)
  // Headboard detail
  ctx.fillStyle = '#7a5f3e'
  ctx.fillRect(4, 4, 16, 4)
  ctx.fillRect(4, 12, 16, 4)
  ctx.fillRect(4, 20, 16, 4)

  // Mattress
  ctx.fillStyle = '#d4b8e0'
  ctx.fillRect(18, 8, 34, 24)
  // Pillow
  ctx.fillStyle = '#f0e4f6'
  ctx.fillRect(20, 10, 14, 10)
  // Blanket
  ctx.fillStyle = '#b88dd0'
  ctx.fillRect(30, 12, 20, 18)
  // Blanket pattern
  ctx.fillStyle = '#a07bb8'
  ctx.fillRect(32, 16, 16, 2)
  ctx.fillRect(32, 22, 16, 2)

  // Bed legs
  ctx.fillStyle = '#6b5340'
  ctx.fillRect(18, 36, 3, 6)
  ctx.fillRect(48, 36, 3, 6)

  textures.addCanvas('furn_bed', g)
}

function genNightstand(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 28
  g.height = 28
  const ctx = g.getContext('2d')!

  // Body
  ctx.fillStyle = '#8b6f4e'
  ctx.fillRect(2, 4, 24, 20)
  // Drawer
  ctx.fillStyle = '#7a5f3e'
  ctx.fillRect(4, 10, 20, 10)
  // Drawer handle
  ctx.fillStyle = '#c0a060'
  ctx.fillRect(11, 14, 6, 2)
  // Top surface
  ctx.fillStyle = '#9a7d5c'
  ctx.fillRect(0, 2, 28, 4)
  // Legs
  ctx.fillStyle = '#6b5340'
  ctx.fillRect(2, 24, 3, 4)
  ctx.fillRect(23, 24, 3, 4)

  textures.addCanvas('furn_nightstand', g)
}

function genWardrobe(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 36
  g.height = 60
  const ctx = g.getContext('2d')!

  // Body
  ctx.fillStyle = '#a08060'
  ctx.fillRect(2, 4, 32, 52)
  // Left door
  ctx.strokeStyle = '#7a6040'
  ctx.lineWidth = 2
  ctx.strokeRect(4, 6, 13, 48)
  // Right door
  ctx.strokeRect(19, 6, 13, 48)
  // Door handles
  ctx.fillStyle = '#c0a060'
  ctx.fillRect(14, 28, 2, 8)
  ctx.fillRect(20, 28, 2, 8)
  // Top trim
  ctx.fillStyle = '#b8906a'
  ctx.fillRect(0, 0, 36, 6)
  // Bottom trim
  ctx.fillRect(0, 54, 36, 6)
  // Legs
  ctx.fillStyle = '#6b5340'
  ctx.fillRect(2, 56, 3, 4)
  ctx.fillRect(31, 56, 3, 4)

  textures.addCanvas('furn_wardrobe', g)
}

function genSofa(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 52
  g.height = 36
  const ctx = g.getContext('2d')!

  // Back
  ctx.fillStyle = '#6ba0c8'
  ctx.fillRect(2, 4, 48, 16)
  // Back top trim
  ctx.fillStyle = '#5a8fb8'
  ctx.fillRect(0, 2, 52, 4)
  // Seat cushions
  ctx.fillStyle = '#7ab8e0'
  ctx.fillRect(4, 18, 20, 12)
  ctx.fillRect(28, 18, 20, 12)
  // Cushion gap
  ctx.fillStyle = '#5a8fb8'
  ctx.fillRect(24, 18, 4, 12)
  // Left armrest
  ctx.fillStyle = '#5a90b8'
  ctx.fillRect(0, 8, 6, 22)
  // Right armrest
  ctx.fillRect(46, 8, 6, 22)
  // Legs
  ctx.fillStyle = '#6b5340'
  ctx.fillRect(4, 30, 4, 6)
  ctx.fillRect(22, 30, 4, 6)
  ctx.fillRect(26, 30, 4, 6)
  ctx.fillRect(44, 30, 4, 6)

  textures.addCanvas('furn_sofa', g)
}

function genCoffeeTable(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 36
  g.height = 22
  const ctx = g.getContext('2d')!

  // Table top
  ctx.fillStyle = '#b8906a'
  ctx.fillRect(0, 0, 36, 8)
  // Top surface highlight
  ctx.fillStyle = '#c8a07a'
  ctx.fillRect(2, 2, 32, 4)
  // Legs
  ctx.fillStyle = '#6b5340'
  ctx.fillRect(2, 8, 3, 12)
  ctx.fillRect(13, 8, 3, 12)
  ctx.fillRect(20, 8, 3, 12)
  ctx.fillRect(31, 8, 3, 12)

  textures.addCanvas('furn_coffee_table', g)
}

function genChandelier(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 44
  g.height = 40
  const ctx = g.getContext('2d')!

  // Chain
  ctx.fillStyle = '#888888'
  ctx.fillRect(20, 0, 4, 10)
  // Chain links
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = '#999999'
    ctx.lineWidth = 1
    ctx.strokeRect(19, 1 + i * 3, 6, 2)
  }

  // Main bar
  ctx.fillStyle = '#c0a060'
  ctx.fillRect(6, 8, 32, 4)
  // Left arm
  ctx.fillRect(4, 12, 6, 14)
  // Right arm
  ctx.fillRect(34, 12, 6, 14)

  // Left candle
  ctx.fillStyle = '#ffee88'
  ctx.fillRect(6, 26, 4, 8)
  // Right candle
  ctx.fillRect(34, 26, 4, 8)
  // Center candle
  ctx.fillStyle = '#ffe060'
  ctx.fillRect(20, 22, 4, 10)

  // Flames
  ctx.fillStyle = '#ff6600'
  ctx.beginPath()
  ctx.arc(8, 24, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(36, 24, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(22, 20, 3, 0, Math.PI * 2)
  ctx.fill()

  // Glow
  ctx.fillStyle = 'rgba(255, 200, 50, 0.15)'
  ctx.beginPath()
  ctx.arc(8, 26, 10, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(36, 26, 10, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(22, 22, 12, 0, Math.PI * 2)
  ctx.fill()

  textures.addCanvas('furn_chandelier', g)
}

function genBookshelf(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 32
  g.height = 52
  const ctx = g.getContext('2d')!

  // Body
  ctx.fillStyle = '#8b6f4e'
  ctx.fillRect(2, 0, 28, 48)
  // Shelf lines
  ctx.fillStyle = '#7a5f3e'
  ctx.fillRect(2, 12, 28, 2)
  ctx.fillRect(2, 24, 28, 2)
  ctx.fillRect(2, 36, 28, 2)

  // Books - shelf 1 (top)
  const bookColors = ['#cc4444', '#44aa44', '#4488cc', '#cc8844', '#8844cc']
  let bx = 4
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = bookColors[i]
    ctx.fillRect(bx, 2, 4, 10)
    bx += 6
  }

  // Books - shelf 2
  bx = 4
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = bookColors[(i + 2) % 5]
    ctx.fillRect(bx, 14, 5, 10)
    bx += 7
  }

  // Books - shelf 3
  bx = 4
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = bookColors[(i + 4) % 5]
    ctx.fillRect(bx, 26, 3, 10)
    bx += 9
  }

  // Books - shelf 4
  bx = 4
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = bookColors[(i + 1) % 5]
    ctx.fillRect(bx, 38, 4, 10)
    bx += 7
  }

  // Top trim
  ctx.fillStyle = '#9a7d5c'
  ctx.fillRect(0, 0, 32, 3)
  // Bottom trim
  ctx.fillRect(0, 48, 32, 4)

  textures.addCanvas('furn_bookshelf', g)
}

function genDiningTable(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 48
  g.height = 36
  const ctx = g.getContext('2d')!

  // Table top
  ctx.fillStyle = '#c8a070'
  ctx.fillRect(8, 8, 32, 6)
  // Table top edge
  ctx.fillStyle = '#b89060'
  ctx.fillRect(6, 14, 36, 2)

  // Table legs
  ctx.fillStyle = '#8b6f4e'
  ctx.fillRect(10, 16, 3, 12)
  ctx.fillRect(35, 16, 3, 12)

  // Chair - top left (behind table)
  ctx.fillStyle = '#7a5f3e'
  ctx.fillRect(2, 0, 10, 14)
  // Chair back
  ctx.fillRect(0, 0, 14, 4)

  // Chair - top right (behind table)
  ctx.fillRect(36, 0, 10, 14)
  ctx.fillRect(34, 0, 14, 4)

  // Chair - bottom left (in front of table)
  ctx.fillStyle = '#8b6f4e'
  ctx.fillRect(2, 22, 10, 14)
  ctx.fillRect(0, 20, 14, 4)

  // Chair - bottom right (in front of table)
  ctx.fillRect(36, 22, 10, 14)
  ctx.fillRect(34, 20, 14, 4)

  // Chair seats
  ctx.fillStyle = '#9a7d5c'
  ctx.fillRect(2, 8, 10, 4)
  ctx.fillRect(36, 8, 10, 4)
  ctx.fillRect(2, 26, 10, 4)
  ctx.fillRect(36, 26, 10, 4)

  textures.addCanvas('furn_dining_table', g)
}

function genFridge(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 28
  g.height = 48
  const ctx = g.getContext('2d')!

  // Body
  ctx.fillStyle = '#e8e8e8'
  ctx.fillRect(2, 2, 24, 44)
  // Freezer door
  ctx.strokeStyle = '#cccccc'
  ctx.lineWidth = 1
  ctx.strokeRect(4, 4, 20, 12)
  // Fridge door
  ctx.strokeRect(4, 18, 20, 26)
  // Handle
  ctx.fillStyle = '#999999'
  ctx.fillRect(20, 8, 2, 4)
  ctx.fillRect(20, 22, 2, 6)
  // Freezer frost
  ctx.fillStyle = 'rgba(200, 220, 255, 0.2)'
  ctx.fillRect(4, 4, 20, 12)
  // Bottom grille
  ctx.fillStyle = '#cccccc'
  ctx.fillRect(6, 44, 16, 3)
  // Brand label
  ctx.fillStyle = '#bbbbbb'
  ctx.font = '6px sans-serif'
  ctx.fillText('COOL', 8, 34)

  textures.addCanvas('furn_fridge', g)
}

function genKitchenCabinets(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 52
  g.height = 32
  const ctx = g.getContext('2d')!

  // Upper cabinets
  ctx.fillStyle = '#d4c4a0'
  ctx.fillRect(0, 2, 24, 14)
  ctx.fillRect(28, 2, 24, 14)
  // Cabinet doors
  ctx.strokeStyle = '#c0b090'
  ctx.lineWidth = 1
  ctx.strokeRect(2, 4, 9, 10)
  ctx.strokeRect(13, 4, 9, 10)
  ctx.strokeRect(30, 4, 9, 10)
  ctx.strokeRect(41, 4, 9, 10)
  // Cabinet handles
  ctx.fillStyle = '#a09070'
  ctx.fillRect(9, 8, 2, 2)
  ctx.fillRect(20, 8, 2, 2)
  ctx.fillRect(37, 8, 2, 2)
  ctx.fillRect(48, 8, 2, 2)

  // Countertop
  ctx.fillStyle = '#8b7d6b'
  ctx.fillRect(0, 17, 52, 3)

  // Stove (right section)
  ctx.fillStyle = '#444444'
  ctx.fillRect(30, 21, 20, 9)
  // Burners
  ctx.fillStyle = '#333333'
  ctx.beginPath()
  ctx.arc(36, 25, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(44, 25, 3, 0, Math.PI * 2)
  ctx.fill()
  // Stove knob
  ctx.fillStyle = '#666666'
  ctx.fillRect(32, 22, 2, 2)
  ctx.fillRect(40, 22, 2, 2)

  // Counter surface (left)
  ctx.fillStyle = '#9a8d7b'
  ctx.fillRect(2, 21, 26, 9)

  textures.addCanvas('furn_kitchen_cabinets', g)
}

function genMicrowave(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 28
  g.height = 24
  const ctx = g.getContext('2d')!

  // Body
  ctx.fillStyle = '#aaaaaa'
  ctx.fillRect(2, 4, 24, 16)
  // Door (glass)
  ctx.fillStyle = '#333333'
  ctx.fillRect(4, 6, 16, 12)
  // Door frame
  ctx.strokeStyle = '#888888'
  ctx.lineWidth = 1
  ctx.strokeRect(4, 6, 16, 12)
  // Control panel
  ctx.fillStyle = '#888888'
  ctx.fillRect(22, 6, 3, 12)
  // Button
  ctx.fillStyle = '#666666'
  ctx.fillRect(23, 8, 2, 3)
  ctx.fillRect(23, 13, 2, 3)
  // Display
  ctx.fillStyle = '#44ff44'
  ctx.font = '5px sans-serif'
  ctx.fillText('0:00', 24, 10)

  textures.addCanvas('furn_microwave', g)
}

function genBathroomCabinet(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 28
  g.height = 40
  const ctx = g.getContext('2d')!

  // Body
  ctx.fillStyle = '#c0d4e0'
  ctx.fillRect(2, 2, 24, 34)
  // Door left
  ctx.strokeStyle = '#a0b4c0'
  ctx.lineWidth = 1
  ctx.strokeRect(4, 4, 9, 30)
  // Door right
  ctx.strokeRect(15, 4, 9, 30)
  // Handles
  ctx.fillStyle = '#c0a060'
  ctx.fillRect(11, 16, 2, 4)
  ctx.fillRect(15, 16, 2, 4)
  // Top trim
  ctx.fillStyle = '#a0b4c0'
  ctx.fillRect(0, 0, 28, 3)

  textures.addCanvas('furn_bath_cabinet', g)
}

function genMirror(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 24
  g.height = 36
  const ctx = g.getContext('2d')!

  // Frame
  ctx.fillStyle = '#c0a060'
  ctx.fillRect(0, 0, 24, 36)
  // Mirror surface
  ctx.fillStyle = '#d0e8f0'
  ctx.fillRect(3, 3, 18, 30)
  // Reflection highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.fillRect(6, 6, 6, 12)
  // Frame top decoration
  ctx.fillStyle = '#d4b070'
  ctx.fillRect(6, 0, 12, 3)
  ctx.fillRect(10, 34, 4, 2)

  textures.addCanvas('furn_mirror', g)
}

function genToyShelves(textures: Phaser.Textures.TextureManager): void {
  const g = document.createElement('canvas')
  g.width = 40
  g.height = 48
  const ctx = g.getContext('2d')!

  // Body
  ctx.fillStyle = '#c8a878'
  ctx.fillRect(2, 0, 36, 44)
  // Shelf lines
  ctx.fillStyle = '#b89868'
  ctx.fillRect(2, 12, 36, 2)
  ctx.fillRect(2, 24, 36, 2)
  ctx.fillRect(2, 36, 36, 2)

  // Toys - shelf 1 (top)
  // Teddy bear
  ctx.fillStyle = '#cc8844'
  ctx.beginPath()
  ctx.arc(12, 6, 4, 0, Math.PI * 2)
  ctx.fill()
  // Ball
  ctx.fillStyle = '#ff4444'
  ctx.beginPath()
  ctx.arc(22, 7, 3, 0, Math.PI * 2)
  ctx.fill()
  // Block
  ctx.fillStyle = '#4488ff'
  ctx.fillRect(28, 4, 4, 4)

  // Toys - shelf 2
  // Doll
  ctx.fillStyle = '#fce4c8'
  ctx.beginPath()
  ctx.arc(10, 17, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#e8c878'
  ctx.fillRect(8, 19, 4, 6)
  // Car
  ctx.fillStyle = '#ff6600'
  ctx.fillRect(20, 17, 8, 4)
  ctx.fillStyle = '#333333'
  ctx.beginPath()
  ctx.arc(23, 21, 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(27, 21, 2, 0, Math.PI * 2)
  ctx.fill()

  // Toys - shelf 3
  // Robot
  ctx.fillStyle = '#88aacc'
  ctx.fillRect(8, 28, 4, 6)
  ctx.fillRect(9, 26, 2, 2)
  // Stacked blocks
  ctx.fillStyle = '#44cc44'
  ctx.fillRect(18, 30, 4, 4)
  ctx.fillStyle = '#ffcc00'
  ctx.fillRect(22, 32, 4, 4)
  ctx.fillStyle = '#cc44cc'
  ctx.fillRect(26, 34, 4, 4)

  // Toys - shelf 4 (bottom)
  // Train
  ctx.fillStyle = '#dd4444'
  ctx.fillRect(6, 39, 10, 4)
  ctx.fillStyle = '#333333'
  ctx.beginPath()
  ctx.arc(8, 43, 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(14, 43, 2, 0, Math.PI * 2)
  ctx.fill()

  // Top trim
  ctx.fillStyle = '#d4b488'
  ctx.fillRect(0, 0, 40, 3)
  // Bottom trim
  ctx.fillRect(0, 44, 40, 4)

  textures.addCanvas('furn_toy_shelves', g)
}
