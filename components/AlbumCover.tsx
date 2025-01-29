"use client"

import { useRef, useState } from "react"
import { useFrame, type ThreeElements } from "@react-three/fiber"
import type { Album } from "../types/Album"
import * as THREE from "three"

interface AlbumCoverProps extends ThreeElements.MeshProps {
  album: Album
  onClick: () => void
}

export default function AlbumCover({ album, onClick, ...props }: AlbumCoverProps) {
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)

  // Create texture from image
  if (!textureRef.current) {
    const img = new Image()
    img.src = album.cover
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        textureRef.current = new THREE.CanvasTexture(canvas)
        textureRef.current.needsUpdate = true
      }
    }
  }

  useFrame((state, delta) => {
    if (hovered) {
      mesh.current.rotation.y += delta
    }
  })

  return (
    <mesh
      {...props}
      ref={mesh}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        setHover(true)
      }}
      onPointerOut={(event) => {
        event.stopPropagation()
        setHover(false)
      }}
    >
      <planeGeometry args={[2, 2]} />
      <meshStandardMaterial>
        {textureRef.current && <primitive attach="map" object={textureRef.current} />}
      </meshStandardMaterial>
    </mesh>
  )
}
