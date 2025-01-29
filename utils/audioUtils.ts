import { Album } from '../types/Album'

// Function to get all audio files from my-audio folder
export const getAudioFiles = async (): Promise<string[]> => {
  try {
    const response = await fetch('/api/audio')
    const files = await response.json()
    return files
  } catch (error) {
    console.error('Error fetching audio files:', error)
    return []
  }
}

// Function to get audio file URL
export const getAudioUrl = (filename: string): string => {
  return `/my-audio/${filename}`
}

// Function to create album with audio
export const createAlbumWithAudio = (
  id: string,
  title: string,
  artist: string,
  cover: string,
  audioFilename: string
): Album => {
  return {
    id,
    title,
    artist,
    cover,
    audioPath: getAudioUrl(audioFilename)
  }
}
