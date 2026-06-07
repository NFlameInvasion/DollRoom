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

export interface DogState {
  hunger: number
  roomId: string
  tileX: number
  tileY: number
}

interface GameState {
  isGameReady: boolean
  currentScene: string
  gameWidth: number
  gameHeight: number
  interactionPrompt: string
  player: PlayerState
  objects: ObjectState[]
  dog: DogState

  setGameReady: (ready: boolean) => void
  setCurrentScene: (key: string) => void
  setGameDimensions: (w: number, h: number) => void
  setInteractionPrompt: (text: string) => void
  setPlayerPosition: (tileX: number, tileY: number, roomId: string) => void
  setPlayerMoving: (moving: boolean) => void
  setPlayerInteracting: (interacting: boolean) => void
  toggleObject: (objectId: string) => void
  setObjects: (objects: ObjectState[]) => void
  setDogPosition: (tileX: number, tileY: number, roomId: string) => void
  feedDog: () => void
  setDogHunger: (hunger: number) => void
}

export interface SaveData {
  player: { tileX: number; tileY: number; roomId: string }
  objects: { id: string; isOn: boolean }[]
  dog: { hunger: number; roomId: string; tileX: number; tileY: number }
}

const DEFAULT_DOG: DogState = {
  hunger: 50,
  roomId: 'spalnya',
  tileX: 5,
  tileY: 3,
}

export const useGameStore = create<GameState>((set) => ({
  isGameReady: false,
  currentScene: '',
  gameWidth: 800,
  gameHeight: 600,
  interactionPrompt: '',
  player: {
    tileX: 2,
    tileY: 2,
    roomId: 'spalnya',
    isMoving: false,
    isInteracting: false,
  },
  objects: [],
  dog: { ...DEFAULT_DOG },

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
  setDogPosition: (tileX, tileY, roomId) =>
    set((s) => ({ dog: { ...s.dog, tileX, tileY, roomId } })),
  feedDog: () =>
    set((s) => ({ dog: { ...s.dog, hunger: Math.min(100, s.dog.hunger + 30) } })),
  setDogHunger: (hunger) =>
    set((s) => ({ dog: { ...s.dog, hunger } })),
}))
