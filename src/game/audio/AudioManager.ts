import { Howl } from 'howler'

/**
 * AudioManager wraps Howler.js with iOS AudioContext unlock,
 * placeholder sound placeholders, and a clean API.
 *
 * Actual audio files should be placed in public/audio/ and
 * registered here once available.
 */
export class AudioManager {
  private sounds = new Map<string, Howl>()
  private sfxVolume = 0.5
  private musicVolume = 0.3
  private initialized = false

  init(): void {
    if (this.initialized) return

    // iOS AudioContext unlock: Howler handles this automatically,
    // but we register a user-gesture handler as a fallback
    const unlock = () => {
      const ctx = Howler.ctx
      if (ctx?.state === 'suspended') {
        ctx.resume()
      }
    }
    document.addEventListener('pointerdown', unlock, { once: true })
    document.addEventListener('touchstart', unlock, { once: true })

    this.initialized = true
  }

  /** Register a sound effect (called when audio files are available) */
  register(id: string, src: string | string[], volume = 1): void {
    const howl = new Howl({
      src: Array.isArray(src) ? src : [src],
      volume: volume * this.sfxVolume,
      format: ['mp3', 'ogg'],
    })
    this.sounds.set(id, howl)
  }

  /** Play a registered sound */
  play(id: string): void {
    const howl = this.sounds.get(id)
    if (howl) {
      howl.play()
    }
  }

  /** Play ambient background music (looping) */
  playMusic(id: string): void {
    const howl = this.sounds.get(id)
    if (howl) {
      howl.loop(true)
      howl.volume(this.musicVolume)
      howl.play()
    }
  }

  stopAll(): void {
    Howler.stop()
  }

  setSfxVolume(v: number): void {
    this.sfxVolume = v
    this.sounds.forEach((howl) => howl.volume(v))
  }

  setMusicVolume(v: number): void {
    this.musicVolume = v
  }

  destroy(): void {
    Howler.unload()
    this.sounds.clear()
  }
}

/** Singleton instance */
export const audioManager = new AudioManager()
