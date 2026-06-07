import { useGameStore, type SaveData } from './gameStore'

const SAVE_KEY = 'dollroom_save'

export function saveGame(): void {
  const state = useGameStore.getState()
  const data: SaveData = {
    player: {
      tileX: state.player.tileX,
      tileY: state.player.tileY,
      roomId: state.player.roomId,
    },
    objects: state.objects.map((o) => ({ id: o.id, isOn: o.isOn })),
    dog: {
      hunger: state.dog.hunger,
      roomId: state.dog.roomId,
      tileX: state.dog.tileX,
      tileY: state.dog.tileY,
    },
  }
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
  } catch {
    // localStorage full or unavailable
  }
}

export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SaveData
  } catch {
    return null
  }
}

export function applySaveData(data: SaveData): void {
  const state = useGameStore.getState()
  state.setPlayerPosition(data.player.tileX, data.player.tileY, data.player.roomId)
  for (const savedObj of data.objects) {
    const match = state.objects.find((o) => o.id === savedObj.id)
    if (match && savedObj.isOn) {
      state.toggleObject(savedObj.id)
    }
  }
  state.setDogPosition(data.dog.tileX, data.dog.tileY, data.dog.roomId)
  state.setDogHunger(data.dog.hunger)
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    // ignore
  }
}
