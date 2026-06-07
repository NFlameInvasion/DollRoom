import { useGameStore } from '../store/gameStore'

export function LoadingScreen() {
  const isGameReady = useGameStore((s) => s.isGameReady)

  if (isGameReady) return null

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1a1a2e]">
      {/* Logo / title */}
      <h1 className="text-4xl font-bold text-white/90 mb-2 tracking-wide">
        Doll Room
      </h1>
      <p className="text-white/50 text-sm mb-12">
        уютная изометрическая комната
      </p>

      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-purple-400 rounded-full animate-spin" />
      </div>

      <p className="text-white/40 text-xs mt-6">загрузка...</p>
    </div>
  )
}
