import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { parseBuffer } from 'music-metadata'

// Define the audio directory path relative to public folder
const AUDIO_DIR = path.join(process.cwd(), 'public', 'audio')  // Make sure this path exists

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Create audio directory if it doesn't exist
    if (!fs.existsSync(AUDIO_DIR)) {
      fs.mkdirSync(AUDIO_DIR, { recursive: true })
      console.log('Created audio directory:', AUDIO_DIR)
    }

    // Read all files in the audio directory
    const files = fs.readdirSync(AUDIO_DIR)
    console.log('Found files:', files)
    
    // Filter for audio files
    const audioFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.mp3', '.wav', '.m4a', '.ogg'].includes(ext)
    })
    console.log('Filtered audio files:', audioFiles)

    // Process each audio file
    const albums = await Promise.all(
      audioFiles.map(async (file) => {
        const filePath = path.join(AUDIO_DIR, file)
        try {
          // Inside the map function:
          return {
            id: file,
            title: path.parse(file).name,
            artist: 'Unknown Artist',
            cover: '/placeholder.svg?height=300&width=300&text=' + encodeURIComponent(path.parse(file).name),
            audioPath: `/audio/${encodeURIComponent(file)}`,  // Add URL encoding
            lyrics: []
          }
        } catch (error) {
          console.error(`Error processing file ${file}:`, error)
          return null
        }
      })
    )

    const validAlbums = albums.filter(album => album !== null)
    console.log('Processed albums:', validAlbums)

    if (validAlbums.length === 0) {
      console.log('No valid albums found, using default album')
      return res.status(200).json({ albums: defaultAlbums })
    }

    res.status(200).json({ albums: validAlbums })
  } catch (error) {
    console.error('Error scanning audio directory:', error)
    res.status(500).json({ message: 'Error scanning audio directory', error: String(error) })
  }
}
