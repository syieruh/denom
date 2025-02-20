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
          const buffer = fs.readFileSync(filePath)
          const metadata = await parseBuffer(new Uint8Array(buffer))
          
          // Extract album art from metadata
          let coverUrl = '/placeholder.svg?height=300&width=300&text=' + encodeURIComponent(path.parse(file).name)
          
          if (metadata.common.picture && metadata.common.picture.length > 0) {
            const picture = metadata.common.picture[0]
            const imageBuffer = picture.data
            const imageFormat = picture.format
            
            // Save the image to public/covers directory
            const coverFileName = `${path.parse(file).name}.${imageFormat.split('/')[1]}`
            const coverPath = path.join(process.cwd(), 'public', 'covers', coverFileName)
            
            // Create covers directory if it doesn't exist
            const coversDir = path.join(process.cwd(), 'public', 'covers')
            if (!fs.existsSync(coversDir)) {
              fs.mkdirSync(coversDir, { recursive: true })
            }
            
            fs.writeFileSync(coverPath, imageBuffer)
            coverUrl = `/covers/${coverFileName}`
          }

          return {
            id: file,
            title: metadata.common.title || path.parse(file).name,
            artist: metadata.common.artist || 'Unknown Artist',
            cover: coverUrl,
            audioPath: `/audio/${file}`,
            lyrics: []
          }
        } catch (error) {
          console.error(`Error processing file ${file}:`, error)
          // Simplified fallback that still allows playback
          return {
            id: file,
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
