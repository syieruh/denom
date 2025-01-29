'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useFullscreen } from '../hooks/useFullscreen'
import { usePathname } from 'next/navigation'

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isFullscreen = useFullscreen()
  const pathname = usePathname()

  // Handle mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close menu when entering fullscreen
  useEffect(() => {
    if (isFullscreen) {
      setIsOpen(false)
    }
  }, [isFullscreen])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  if (isFullscreen) {
    return null
  }

  const menuItems = [
    ...(pathname !== '/' ? [{
      title: 'Home',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      href: '/'
    }] : []),
    {
      title: 'Shop',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      href: '/shop'
    },
    {
      title: 'Socials',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      href: '/socials'
    },
    {
      title: 'About',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: '/about'
    }
  ]

  return (
    <>
      <button
        onClick={toggleMenu}
        className="fixed left-6 top-1/2 -translate-y-1/2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full p-3 text-white transition-all duration-200 hover:scale-110 z-20"
        aria-label="Toggle menu"
      >
        <svg 
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div 
        className={`fixed left-20 top-1/2 -translate-y-1/2 bg-white bg-opacity-5 backdrop-blur-md text-white transition-all duration-300 ease-in-out z-10 rounded-xl overflow-hidden ${
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
        }`}
        style={{
          width: isOpen ? '12rem' : '0',
          visibility: isOpen ? 'visible' : 'hidden'
        }}
      >
        <div className="py-4" style={{ width: '12rem' }}>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-2.5 hover:bg-white hover:bg-opacity-10 transition-colors text-sm"
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
