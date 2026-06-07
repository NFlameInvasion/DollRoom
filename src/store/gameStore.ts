import { create } from 'zustand'

export interface PlayerState {
  tileX: number
  tileY: number
  roomId: string
  isMoving: boolean
  isInteracting: boolean
}

export interface ObjectState {
  id: string
  roomId: string
  tileX: number
  tileY: number
  label: string
  isOn: boolean
}

interface GameState {
  isGameReady: boolean
  currentScene: string
  gameWidth: number
  gameHeight: number
  interactionPrompt: string
  player: PlayerState
  objects: ObjectState[]

  setGameReady: (ready: boolean) => void
  setCurrentScene: (key: string) => void
  setGameDimensions: (w: number, h: number) => void
  setInteractionPrompt: (text: string) => void
  setPlayerPosition: (tileX: number, tileY: number, roomId: string) => void
  setPlayerMoving: (moving: boolean) => void
  setPlayerInteracting: (interacting: boolean) => void
  toggleObject: (objectId: string) => void
  setObjects: (objects: ObjectState[]) => void
}

export interface SaveData {
  player: { tileX: number; tileY: number; roomId: string }
  objects: { id: string; isOn: boolean }[]
}

export const useGameStore = create<GameState>((set) => ({
  isGameReady: false,
  currentScene: '',
  gameWidth: 800,
  gameHeight: 600,
  interactionPrompt: '',
  player: {
    tileX: 24,
    tileY: 5,
    roomId: 'spalnya',
    isMoving: false,
    isInteracting: false,
  },
  objects: [],

  setGameReady: (ready) => set({ isGameReady: ready }),
  setCurrentScene: (key) => set({ currentScene: key }),
  setGameDimensions: (w, h) => set({ gameWidth: w, gameHeight: h }),
  setInteractionPrompt: (text) => set({ interactionPrompt: text }),
  setPlayerPosition: (tileX, tileY, roomId) =>
    set((s) => ({ player: { ...s.player, tileX, tileY, roomId } })),
  setPlayerMoving: (moving) =>
    set((s) => ({ player: { ...s.player, isMoving: moving } })),
  setPlayerInteracting: (interacting) =>
    set((s) => ({ player: { ...s.player, isInteracting: interacting } })),
  toggleObject: (objectId) =>
    set((s) => ({
      objects: s.objects.map((o) =>
        o.id === objectId ? { ...o, isOn: !o.isOn } : o,
      ),
    })),
  setObjects: (objects) => set({ objects }),
}))
