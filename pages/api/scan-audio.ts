import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { parseBuffer } from 'music-metadata'

// Define the audio directory path relative to public folder
const AUDIO_DIR = path.join(process.cwd(), 'public', 'audio')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Create audio directory if it doesn't exist
    if (!fs.existsSync(AUDIO_DIR)) {
      fs.mkdirSync(AUDIO_DIR, { recursive: true })
    }

    // Read all files in the audio directory
    const files = fs.readdirSync(AUDIO_DIR)
    
    // Filter for audio files
    const audioFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.mp3', '.wav', '.m4a', '.ogg'].includes(ext)
    })

    // Process each audio file
    const albums = await Promise.all(
      audioFiles.map(async (file, index) => {
        const filePath = path.join(AUDIO_DIR, file)
        try {
          // Parse metadata from the audio file
          const buffer = fs.readFileSync(filePath)
          const metadata = await parseBuffer(new Uint8Array(buffer))
          
          // Extract title and artist from metadata or filename
          const title = metadata.common.title || path.parse(file).name
          const artist = metadata.common.artist || 'Unknown Artist'
          
          // Get album art if available, otherwise use placeholder
          let cover = '/placeholder.svg?height=300&width=300&text=' + encodeURIComponent(title)
          if (metadata.common.picture && metadata.common.picture.length > 0) {
            // Convert the first picture to base64
            const picture = metadata.common.picture[0]
            const base64 = Buffer.from(picture.data).toString('base64')
            cover = `data:${picture.format};base64,${base64}`
          }

          return {
            id: String(index + 1),
            title,
            artist,
            cover,
            audioPath: `/audio/${file}`,
            lyrics: [] // Add lyrics if available in metadata
          }
        } catch (error) {
          console.error(`Error processing file ${file}:`, error)
          // Return basic info if metadata parsing fails
          return {
            id: String(index + 1),
            title: path.parse(file).name,
            artist: 'Unknown Artist',
            cover: '/placeholder.svg?height=300&width=300&text=' + encodeURIComponent(path.parse(file).name),
            audioPath: `/audio/${file}`,
            lyrics: []
          }
        }
      })
    )

    res.status(200).json({ albums })
  } catch (error) {
    console.error('Error scanning audio directory:', error)
    res.status(500).json({ message: 'Error scanning audio directory', error: String(error) })
  }
}
