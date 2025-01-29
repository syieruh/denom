"use client"

import { useState } from "react"
import Image from "next/image"
import type { Album } from "../types/Album"
import MusicPlayer from "./MusicPlayer"

interface AlbumGridProps {
  albums: Album[]
}

export default function AlbumGrid({ albums }: AlbumGridProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [previewPosition] = useState({ x: 0, y: 0, z: 0 })

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {albums.map((album) => (
          <div
            key={album.id}
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setSelectedAlbum(album)}
          >
            <div className="relative w-full aspect-square">
              <Image
                src={album.cover || "/placeholder.svg"}
                alt={`${album.title} by ${album.artist}`}
                fill
                className="rounded-lg shadow-lg object-cover"
              />
            </div>
            <h2 className="mt-2 text-lg font-semibold text-white">{album.title}</h2>
            <p className="text-sm text-gray-400">{album.artist}</p>
          </div>
        ))}
      </div>
      {selectedAlbum && (
        <MusicPlayer 
          album={selectedAlbum} 
          onClose={() => setSelectedAlbum(null)} 
          initialPosition={previewPosition}
        />
      )}
    </div>
  )
}
