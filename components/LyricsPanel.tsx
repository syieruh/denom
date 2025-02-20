"use client"

import { useEffect, useRef, useState } from 'react'
import { Album, LyricLine } from '../types/Album'
import { motion, AnimatePresence } from 'framer-motion'

interface LyricsPanelProps {
  album: Album
  isFullscreen: boolean
  currentTime: number
  isVisible: boolean
  onClose: () => void
}

export default function LyricsPanel({ album, isFullscreen, currentTime, isVisible, onClose }: LyricsPanelProps) {
  const [activeLyricIndex, setActiveLyricIndex] = useState<number>(-1)
  const lyricsRef = useRef<HTMLDivElement>(null)
  const [screenWidth, setScreenWidth] = useState(0)

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth)
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  useEffect(() => {
    if (!album.lyrics) return

    const index = album.lyrics.findIndex(
      lyric => currentTime >= lyric.startTime && currentTime <= lyric.endTime
    )
    
    if (index !== activeLyricIndex) {
      setActiveLyricIndex(index)
      const lyricElement = lyricsRef.current?.children[index]
      lyricElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentTime, album.lyrics, activeLyricIndex])

  if (!isVisible || !album.lyrics) return null

  const panelWidth = screenWidth <= 640 ? '100%' : screenWidth <= 1024 ? '50%' : '400px'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 21 }}
        className={`fixed right-0 top-0 bg-black/80 backdrop-blur-xl text-white p-6 overflow-y-auto z-[51] ${
          isFullscreen ? 'h-screen' : 'h-[calc(100vh-96px)]'
        }`}
        style={{ 
          width: panelWidth,
          bottom: isFullscreen ? '0' : '80px'  // Add space for the player
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Lyrics</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div ref={lyricsRef} className="space-y-4">
          {album.lyrics.map((lyric, index) => (
            <div
              key={lyric.startTime}
              className={`transition-all duration-300 ${
                index === activeLyricIndex
                  ? 'text-white text-lg font-medium'
                  : 'text-white/40 text-base'
              }`}
            >
              {lyric.text}
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}