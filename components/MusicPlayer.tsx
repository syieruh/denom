import { useState, useRef, useEffect } from 'react'
import { Album, Position3D } from '../types/Album'
import LyricsPanel from './LyricsPanel'

interface MusicPlayerProps {
  album: Album
  onClose: () => void
  initialPosition: Position3D
  onPlayingChange: (isPlaying: boolean) => void
  isFullscreen: boolean
}

export default function MusicPlayer({ album, onClose, initialPosition, onPlayingChange, isFullscreen }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [showLyrics, setShowLyrics] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    console.log("Loading audio:", album.audioPath)
    
    if (audioRef.current) {
      audioRef.current.load() // Force reload when album changes
      audioRef.current.volume = 1.0 // Ensure volume is set
      
      const handleLoadStart = () => console.log('Audio loading started')
      const handleLoadedData = () => console.log('Audio data loaded')
      const handleCanPlay = () => console.log('Audio can play')
      const handlePlaying = () => console.log('Audio playing')
      const handleError = (e: Event) => {
        const error = (e.target as HTMLAudioElement).error
        console.error("Audio error:", error)
        setError(`Failed to load audio: ${error?.message || 'Unknown error'}`)
      }
      const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current?.currentTime || 0)
      }
      
      // Add event listeners
      audioRef.current.addEventListener('loadstart', handleLoadStart)
      audioRef.current.addEventListener('loadeddata', handleLoadedData)
      audioRef.current.addEventListener('canplay', handleCanPlay)
      audioRef.current.addEventListener('playing', handlePlaying)
      audioRef.current.addEventListener('error', handleError)
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
      
      if (isPlaying) {
        console.log("Attempting to play audio")
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Audio playback started successfully")
              onPlayingChange(true)
            })
            .catch((error: Error) => {
              console.error("Audio playback error:", error)
              setError(`Failed to play audio: ${error.message}`)
              setIsPlaying(false)
              onPlayingChange(false)
            })
        }
      } else {
        audioRef.current.pause()
        onPlayingChange(false)
      }
      
      // Cleanup event listeners
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadstart', handleLoadStart)
          audioRef.current.removeEventListener('loadeddata', handleLoadedData)
          audioRef.current.removeEventListener('canplay', handleCanPlay)
          audioRef.current.removeEventListener('playing', handlePlaying)
          audioRef.current.removeEventListener('error', handleError)
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
        }
      }
    }
  }, [isPlaying, album.audioPath, onPlayingChange])

  const togglePlay = () => {
    console.log("Toggle play clicked, current state:", isPlaying)
    setError(null)
    setIsPlaying(!isPlaying)
  }

  return (
    <>
      <audio ref={audioRef} src={album.audioPath} />
      
      <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-4 z-50" style={{ pointerEvents: 'none' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between" style={{ pointerEvents: 'auto' }}>
          <div className="flex items-center space-x-4">
            <img src={album.cover} alt={album.title} className="w-16 h-16 rounded-lg" />
            <div>
              <h3 className="font-bold text-white text-lg tracking-wide">{album.title}</h3>
              <p className="text-white/90 font-medium text-sm tracking-wide">{album.artist}</p>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full p-3"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {album.lyrics && (
              <button
                onClick={() => setShowLyrics(!showLyrics)}
                className={`p-2 rounded-full transition-colors ${
                  showLyrics 
                    ? 'bg-white/20 text-white hover:bg-white/30' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                title="Toggle Lyrics"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
            
            <button
              onClick={onClose}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full p-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <LyricsPanel
        album={album}
        isFullscreen={isFullscreen}
        currentTime={currentTime * 1000} // Convert to milliseconds
        isVisible={showLyrics}
        onClose={() => setShowLyrics(false)}
      />
    </>
  )
}