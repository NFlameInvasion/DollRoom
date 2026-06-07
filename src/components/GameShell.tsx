import { useEffect, useRef } from 'react'
import { createGame, destroyGame } from '../game/gameManager'

export function GameShell() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return

    gameRef.current = createGame({
      parent: containerRef.current,
    })

    return () => {
      destroyGame()
      gameRef.current = null
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: '100dvh' }}
    />
  )
}
