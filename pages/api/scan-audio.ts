import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { parseBuffer } from 'music-metadata'

// Add LYRICS_DIR constant
const LYRICS_DIR = path.join(process.cwd(), 'public', 'lyrics')

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
        // Inside the audioFiles.map callback, modify the return object:
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
      
          // Add lyrics parsing with proper typing
          let lyrics: LyricLine[] = []
          const lyricsFile = path.join(LYRICS_DIR, `${path.parse(file).name}.lrc`)
          if (fs.existsSync(lyricsFile)) {
            const lrcContent = fs.readFileSync(lyricsFile, 'utf-8')
            lyrics = parseLRC(lrcContent)
          }
          
          return {
            id: file,
            title: metadata.common.title || path.parse(file).name,
            artist: metadata.common.artist || 'Unknown Artist',
            cover: coverUrl,
            audioPath: `/audio/${file}`,
            lyrics: lyrics
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

// Add this helper function at the bottom of the file
// Update the parseLRC function
// Add interface for lyrics
interface LyricLine {
  text: string
  startTime: number
  endTime: number
}

function parseLRC(lrcContent: string): LyricLine[] {
  const lines = lrcContent.split('\n')
  const lyrics = []
  
  for (const line of lines) {
    // Skip metadata lines and empty lines
    if (!line.trim() || line.startsWith('[ti:') || 
        line.startsWith('[ar:') || line.startsWith('[al:') || 
        line.startsWith('[by:') || line.startsWith('[re:') || 
        line.startsWith('[ve:') || line.startsWith('[la:')) {
      continue
    }
    
    // Parse timestamp and text
    const match = line.match(/^\[(\d{2}):(\d{2})\.(\d{2})\](.*)/)
    if (match) {
      const minutes = parseInt(match[1])
      const seconds = parseInt(match[2])
      const centiseconds = parseInt(match[3])
      
      // Extract only the main text and combine words that have timestamps
      let text = match[4].trim()
      text = text.replace(/<\d{2}:\d{2}\.\d{2}>/g, '') // Remove timestamp tags
      text = text.split(/\s+<\d{2}:\d{2}\.\d{2}>/g).join(' ') // Join split words
      text = text.trim()
      
      // Convert to milliseconds
      const startTime = (minutes * 60 * 1000) + (seconds * 1000) + (centiseconds * 10)
      const endTime = startTime + 3000 // 3 seconds duration for each line
      
      if (text) {
        lyrics.push({
          text,
          startTime,
          endTime
        })
      }
    }
  }
  
  return lyrics
}
