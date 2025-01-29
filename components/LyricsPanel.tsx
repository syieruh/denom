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

  useEffect(() => {
    if (!album.lyrics) return

    const index = album.lyrics.findIndex(
      lyric => currentTime >= lyric.startTime && currentTime <= lyric.endTime
    )
    
    if (index !== activeLyricIndex) {
      setActiveLyricIndex(index)
      const lyricElement = lyricsRef.current?.children[0]?.children[index]
      lyricElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentTime, album.lyrics, activeLyricIndex])

  if (!isVisible || !album.lyrics) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 right-0 bottom-0 z-40 overflow-hidden"
      >
        {/* Background blur layer - separated for better performance */}
        <div 
          className="absolute top-0 left-0 right-0 bottom-[96px] w-screen h-[calc(100%-96px)]"
          style={{ 
            background: isFullscreen ? 'rgba(0, 0, 0, 0.21)' : 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)', // For Safari
            transform: 'translateZ(0)', // Force GPU acceleration
          }} 
        />

        {/* Content container */}
        <div className="absolute top-0 left-0 right-0 bottom-[96px] flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={`w-full h-full max-h-screen flex items-center justify-center px-4 ${
              isFullscreen 
                ? 'max-w-4xl' 
                : 'max-w-2xl'
            }`}
          >
            <div 
              ref={lyricsRef}
              className="w-full h-full max-h-[75vh] overflow-y-auto scrollbar-hide py-4"
            >
              <div className="flex flex-col items-center justify-center min-h-full space-y-6 md:space-y-8">
                {album.lyrics.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0.4 }}
                    animate={{ 
                      opacity: index === activeLyricIndex ? 1 : 0.4,
                    }}
                    transition={{ duration: 0.4 }}
                    className={`text-center transition-all duration-300 px-4 py-1
                      ${index === activeLyricIndex
                        ? 'text-white font-medium text-xl md:text-3xl lg:text-4xl tracking-tight'
                        : 'text-white/60 text-base md:text-xl lg:text-2xl tracking-normal'
                      }`}
                  >
                    {line.text}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
