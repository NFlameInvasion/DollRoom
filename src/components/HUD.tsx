import { useGameStore } from '../store/gameStore'
import { ROOMS } from '../game/rooms/roomData'

export function HUD() {
  const player = useGameStore((s) => s.player)
  const interactionPrompt = useGameStore((s) => s.interactionPrompt)
  const objects = useGameStore((s) => s.objects)

  const roomName = ROOMS[player.roomId]?.name ?? ''

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-center p-3">
        <div className="bg-black/50 text-white px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
          {roomName}
        </div>
      </div>

      {/* Interaction prompt */}
      {interactionPrompt && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
          <div className="bg-black/60 text-white px-5 py-2 rounded-xl text-sm backdrop-blur-sm whitespace-nowrap">
            {interactionPrompt}
          </div>
        </div>
      )}

      {/* Object states indicator (bottom right) */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1 items-end">
        {objects
          .filter((o) => o.roomId === player.roomId && o.isOn)
          .map((o) => (
            <div
              key={o.id}
              className="bg-black/50 text-white/80 text-xs px-2 py-0.5 rounded-full backdrop-blur-sm"
            >
              {o.label}: ON
            </div>
          ))}
      </div>
    </div>
  )
}
