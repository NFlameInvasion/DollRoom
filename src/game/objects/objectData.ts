export interface ObjectDef {
  id: string
  roomId: string
  tileX: number
  tileY: number
  label: string
  offColor: string
  onColor: string
  /** Icon character (placeholder) */
  icon: string
}

export const OBJECT_DEFS: ObjectDef[] = [
  // Bedroom
  { id: 'light_bed', roomId: 'spalnya', tileX: 5, tileY: 3, label: 'Свет', offColor: '#888888', onColor: '#ffee88', icon: '💡' },
  { id: 'tv', roomId: 'spalnya', tileX: 7, tileY: 2, label: 'Телевизор', offColor: '#444444', onColor: '#66ccff', icon: '📺' },

  // Living room
  { id: 'light_living', roomId: 'gostinaya', tileX: 3, tileY: 3, label: 'Свет', offColor: '#888888', onColor: '#ffee88', icon: '💡' },
  { id: 'fan', roomId: 'gostinaya', tileX: 8, tileY: 3, label: 'Вентилятор', offColor: '#888888', onColor: '#88ccff', icon: '🌀' },

  // Kitchen
  { id: 'kettle', roomId: 'kuhnya', tileX: 3, tileY: 3, label: 'Чайник', offColor: '#ccaa88', onColor: '#ff8844', icon: '🫖' },
  { id: 'light_kitchen', roomId: 'kuhnya', tileX: 5, tileY: 3, label: 'Свет', offColor: '#888888', onColor: '#ffee88', icon: '💡' },

  // Bathroom
  { id: 'hairdryer', roomId: 'vanna', tileX: 4, tileY: 3, label: 'Фен', offColor: '#cc88cc', onColor: '#ff88ff', icon: '💨' },
  { id: 'light_bath', roomId: 'vanna', tileX: 3, tileY: 3, label: 'Свет', offColor: '#888888', onColor: '#ffee88', icon: '💡' },

  // Play room
  { id: 'light_play', roomId: 'igrovaya', tileX: 5, tileY: 3, label: 'Свет', offColor: '#888888', onColor: '#ffee88', icon: '💡' },
  { id: 'stereo', roomId: 'igrovaya', tileX: 7, tileY: 2, label: 'Музыка', offColor: '#886688', onColor: '#66ff66', icon: '🎵' },
]
