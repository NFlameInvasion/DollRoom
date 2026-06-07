export interface ObjectDef {
  id: string
  roomId: string
  /** World tile X coordinate */
  tileX: number
  /** World tile Y coordinate */
  tileY: number
  label: string
  offColor: string
  onColor: string
  /** Icon character (placeholder) */
  icon: string
}

// Room world offsets (each room is 10 cols wide):
// gostinaya: 0-9, kuhnya: 10-19, spalnya: 20-29, vanna: 30-39, igrovaya: 40-49

export const OBJECT_DEFS: ObjectDef[] = [
  // Living room
  { id: 'light_living', roomId: 'gostinaya', tileX: 4, tileY: 3, label: 'Свет', offColor: '#888888', onColor: '#ffee88', icon: '💡' },
  { id: 'fan', roomId: 'gostinaya', tileX: 7, tileY: 6, label: 'Вентилятор', offColor: '#888888', onColor: '#88ccff', icon: '🌀' },

  // Kitchen
  { id: 'kettle', roomId: 'kuhnya', tileX: 13, tileY: 4, label: 'Чайник', offColor: '#ccaa88', onColor: '#ff8844', icon: '🫖' },
  { id: 'light_kitchen', roomId: 'kuhnya', tileX: 15, tileY: 3, label: 'Свет', offColor: '#888888', onColor: '#ffee88', icon: '💡' },

  // Bedroom
  { id: 'light_bed', roomId: 'spalnya', tileX: 24, tileY: 3, label: 'Свет', offColor: '#888888', onColor: '#ffee88', icon: '💡' },
  { id: 'tv', roomId: 'spalnya', tileX: 27, tileY: 4, label: 'Телевизор', offColor: '#444444', onColor: '#66ccff', icon: '📺' },

  // Bathroom
  { id: 'hairdryer', roomId: 'vanna', tileX: 34, tileY: 5, label: 'Фен', offColor: '#cc88cc', onColor: '#ff88ff', icon: '💨' },
  { id: 'light_bath', roomId: 'vanna', tileX: 33, tileY: 3, label: 'Свет', offColor: '#888888', onColor: '#ffee88', icon: '💡' },

  // Playroom
  { id: 'light_play', roomId: 'igrovaya', tileX: 44, tileY: 3, label: 'Свет', offColor: '#888888', onColor: '#ffee88', icon: '💡' },
  { id: 'stereo', roomId: 'igrovaya', tileX: 47, tileY: 4, label: 'Музыка', offColor: '#886688', onColor: '#66ff66', icon: '🎵' },
]
