export interface LyricLine {
  text: string
  startTime: number  // in milliseconds
  endTime: number    // in milliseconds
}

export interface Album {
  id: string
  title: string
  artist: string
  cover: string
  audioPath: string
  lyrics?: LyricLine[]
}

export interface Position3D {
  x: number
  y: number
  z: number
}
