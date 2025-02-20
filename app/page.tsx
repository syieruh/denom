"use client"

import dynamic from "next/dynamic"
import { Suspense, useState, useEffect } from "react"
import { usePathname } from 'next/navigation'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ subsets: ['latin'] })
const Scene = dynamic(() => import("../components/Scene"), { ssr: false })

function Loading() {
  const pathname = usePathname()
  const [text, setText] = useState("")
  const [subText, setSubText] = useState("")
  const [showScene, setShowScene] = useState(false)
  const [isGlitching, setIsGlitching] = useState(false)
  const initialText = "Shoaib"
  const finalText = "Shxaib"
  const subFullText = "scroll up/down to interact"

  // Skip animation if not on home page
  useEffect(() => {
    if (pathname !== '/') {
      setShowScene(true)
      return
    }
    
    let currentIndex = 0
    
    // Initial typing of "Shoaib"
    const typeText = () => {
      if (currentIndex <= initialText.length) {
        setText(initialText.slice(0, currentIndex))
        currentIndex++
        setTimeout(typeText, 200) // Slower typing speed
      } else {
        // Start glitch effect after typing
        setTimeout(startGlitch, 500)
      }
    }

    // Glitch effect for 'o' to 'x' transition
    const startGlitch = () => {
      setIsGlitching(true)
      const glitchChars = ['o', 'x', '0', '1', 'x', 'o', 'x']
      let glitchIndex = 0

      const glitchInterval = setInterval(() => {
        if (glitchIndex < glitchChars.length) {
          setText(text => text.slice(0, 2) + glitchChars[glitchIndex] + text.slice(3))
          glitchIndex++
        } else {
          clearInterval(glitchInterval)
          setText(finalText)
          setIsGlitching(false)
          // Start subtext animation after glitch
          setTimeout(typeSubText, 500)
        }
      }, 100)
    }

    // Type out subtext
    const typeSubText = () => {
      let subIndex = 0
      const subTextInterval = setInterval(() => {
        if (subIndex <= subFullText.length) {
          setSubText(subFullText.slice(0, subIndex))
          subIndex++
        } else {
          clearInterval(subTextInterval)
          setTimeout(() => setShowScene(true), 1500)
        }
      }, 80)
    }

    setTimeout(typeText, 500) // Initial delay before starting
  }, [pathname])

  if (showScene || pathname !== '/') {
    return <Scene />
  }

  return (
    <div className={`w-full h-screen flex flex-col items-center justify-center bg-black text-white ${montserrat.className}`}>
      <div 
        className={`text-6xl font-bold mb-6 tracking-wider ${
          isGlitching ? 'animate-glitch' : 'transition-all duration-300'
        }`}
      >
        {text}
      </div>
      <div className="text-xl text-gray-400 font-light tracking-widest">
        {subText}
      </div>
      <style jsx>{`
        @keyframes glitch {
          0% { transform: translate(0); text-shadow: none; }
          20% { transform: translate(-2px, 2px); text-shadow: 2px 0 #ff0080, -2px 0 #0ff; }
          40% { transform: translate(2px, -2px); text-shadow: 3px 0 #0ff, -3px 0 #ff0080; }
          60% { transform: translate(-2px); text-shadow: -2px 0 #ff0080, 2px 0 #0ff; }
          80% { transform: translate(2px); text-shadow: 2px 0 #0ff, -2px 0 #ff0080; }
          100% { transform: translate(0); text-shadow: none; }
        }
        .animate-glitch {
          animation: glitch 0.3s infinite;
        }
      `}</style>
    </div>
  )
}

export default function Home() {
  return (
    <main className="w-full h-screen">
      <Loading />
    </main>
  )
}
