import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const audioDir = path.join(process.cwd(), 'my-audio')
    const files = await fs.promises.readdir(audioDir)
    
    // Filter for audio files
    const audioFiles = files.filter(file => 
      file.endsWith('.mp3') || 
      file.endsWith('.wav') || 
      file.endsWith('.ogg')
    )
    
    res.status(200).json(audioFiles)
  } catch (error) {
    console.error('Error reading audio directory:', error)
    res.status(500).json({ message: 'Error reading audio files' })
  }
}
