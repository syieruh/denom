'use client'

import Menu from '../../components/Menu'
import { useEffect, useState } from 'react'
import { useFullscreen } from '../../hooks/useFullscreen'

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#000000]" style={{ backgroundColor: '#000000' }}>
      <Menu />
      {children}
    </div>
  )
}
