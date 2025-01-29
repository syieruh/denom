"use client"

import * as THREE from "three"
import { useLayoutEffect, useRef, useState, useMemo } from "react"
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber"
import { Image, ScrollControls, useScroll, Billboard, Text, Stars, Environment } from "@react-three/drei"
import { easing, geometry } from "maath"
import MusicPlayer from "./MusicPlayer"
import Menu from "./Menu"
import { CameraDebug } from "./CameraDebug"
import type { Album } from "../types/Album"

extend(geometry)

const albums: Album[] = [
  // First set of 9 songs
  {
    id: "1",
    title: "Song 1",
    artist: "Artist 1",
    cover: "/placeholder.svg?height=300&width=300&text=Song+1",
    audioPath: "/audio/SONG1.mp3",
    lyrics: [
      { text: "One minute they arrive", startTime: 0, endTime: 4000 },
      { text: "Next you know they're gone", startTime: 4000, endTime: 8000 },
      { text: "Fly on", startTime: 8000, endTime: 12000 },
      { text: "Fly on, on", startTime: 12000, endTime: 16000 },
      { text: "So fly on, ride through", startTime: 16000, endTime: 20000 },
      { text: "Maybe one day I'll fly next to you", startTime: 20000, endTime: 24000 },
      { text: "Fly on, ride through", startTime: 24000, endTime: 28000 },
      { text: "When I'm heavy through and through", startTime: 28000, endTime: 32000 }
    ]
  },
  {
    id: "2",
    title: "Song 2",
    artist: "Artist 2",
    cover: "/placeholder.svg?height=300&width=300&text=Song+2",
    audioPath: "/audio/SONG2.wav",
    lyrics: [
      { text: "It makes me want to dribble, dribble, you know", startTime: 0, endTime: 4000 },
      { text: "Riding in my Fiat, you really have to see it", startTime: 4000, endTime: 8000 },
      { text: "Six feet two, in a compact, no slack", startTime: 8000, endTime: 12000 },
      { text: "But luckily the seats go back", startTime: 12000, endTime: 16000 },
      { text: "I got a knack to relax", startTime: 16000, endTime: 20000 },
      { text: "In my mind we're together", startTime: 20000, endTime: 24000 }
    ]
  },
  {
    id: "3",
    title: "Song 3",
    artist: "Artist 3",
    cover: "/placeholder.svg?height=300&width=300&text=Song+3",
    audioPath: "/audio/SONG3.mp3"
  },
  {
    id: "4",
    title: "Song 4",
    artist: "Artist 4",
    cover: "/placeholder.svg?height=300&width=300&text=Song+4",
    audioPath: "/audio/SONG4.wav"
  },
  {
    id: "5",
    title: "Song 5",
    artist: "Artist 5",
    cover: "/placeholder.svg?height=300&width=300&text=Song+5",
    audioPath: "/audio/SONG5.wav"
  },
  {
    id: "6",
    title: "Song 6",
    artist: "Artist 6",
    cover: "/placeholder.svg?height=300&width=300&text=Song+6",
    audioPath: "/audio/SONG6.wav"
  },
  {
    id: "7",
    title: "Song 7",
    artist: "Artist 7",
    cover: "/placeholder.svg?height=300&width=300&text=Song+7",
    audioPath: "/audio/SONG7.mp3"
  },
  {
    id: "8",
    title: "Song 8",
    artist: "Artist 8",
    cover: "/placeholder.svg?height=300&width=300&text=Song+8",
    audioPath: "/audio/SONG8.mp3"
  },
  {
    id: "9",
    title: "Song 9",
    artist: "Artist 9",
    cover: "/placeholder.svg?height=300&width=300&text=Song+9",
    audioPath: "/audio/SONG9.mp3"
  },
  // Second set of 9 songs (repeat)
  {
    id: "10",
    title: "Song 1",
    artist: "Artist 1",
    cover: "/placeholder.svg?height=300&width=300&text=Song+1",
    audioPath: "/audio/SONG1.mp3"
  },
  {
    id: "11",
    title: "Song 2",
    artist: "Artist 2",
    cover: "/placeholder.svg?height=300&width=300&text=Song+2",
    audioPath: "/audio/SONG2.wav"
  },
  {
    id: "12",
    title: "Song 3",
    artist: "Artist 3",
    cover: "/placeholder.svg?height=300&width=300&text=Song+3",
    audioPath: "/audio/SONG3.mp3"
  },
  {
    id: "13",
    title: "Song 4",
    artist: "Artist 4",
    cover: "/placeholder.svg?height=300&width=300&text=Song+4",
    audioPath: "/audio/SONG4.wav"
  },
  {
    id: "14",
    title: "Song 5",
    artist: "Artist 5",
    cover: "/placeholder.svg?height=300&width=300&text=Song+5",
    audioPath: "/audio/SONG5.wav"
  },
  {
    id: "15",
    title: "Song 6",
    artist: "Artist 6",
    cover: "/placeholder.svg?height=300&width=300&text=Song+6",
    audioPath: "/audio/SONG6.wav"
  },
  {
    id: "16",
    title: "Song 7",
    artist: "Artist 7",
    cover: "/placeholder.svg?height=300&width=300&text=Song+7",
    audioPath: "/audio/SONG7.mp3"
  },
  {
    id: "17",
    title: "Song 8",
    artist: "Artist 8",
    cover: "/placeholder.svg?height=300&width=300&text=Song+8",
    audioPath: "/audio/SONG8.mp3"
  },
  {
    id: "18",
    title: "Song 9",
    artist: "Artist 9",
    cover: "/placeholder.svg?height=300&width=300&text=Song+9",
    audioPath: "/audio/SONG9.mp3"
  },
  // Third set of 9 songs (repeat)
  {
    id: "19",
    title: "Song 1",
    artist: "Artist 1",
    cover: "/placeholder.svg?height=300&width=300&text=Song+1",
    audioPath: "/audio/SONG1.mp3"
  },
  {
    id: "20",
    title: "Song 2",
    artist: "Artist 2",
    cover: "/placeholder.svg?height=300&width=300&text=Song+2",
    audioPath: "/audio/SONG2.wav"
  },
  {
    id: "21",
    title: "Song 3",
    artist: "Artist 3",
    cover: "/placeholder.svg?height=300&width=300&text=Song+3",
    audioPath: "/audio/SONG3.mp3"
  },
  {
    id: "22",
    title: "Song 4",
    artist: "Artist 4",
    cover: "/placeholder.svg?height=300&width=300&text=Song+4",
    audioPath: "/audio/SONG4.wav"
  },
  {
    id: "23",
    title: "Song 5",
    artist: "Artist 5",
    cover: "/placeholder.svg?height=300&width=300&text=Song+5",
    audioPath: "/audio/SONG5.wav"
  },
  {
    id: "24",
    title: "Song 6",
    artist: "Artist 6",
    cover: "/placeholder.svg?height=300&width=300&text=Song+6",
    audioPath: "/audio/SONG6.wav"
  },
  {
    id: "25",
    title: "Song 7",
    artist: "Artist 7",
    cover: "/placeholder.svg?height=300&width=300&text=Song+7",
    audioPath: "/audio/SONG7.mp3"
  },
  {
    id: "26",
    title: "Song 8",
    artist: "Artist 8",
    cover: "/placeholder.svg?height=300&width=300&text=Song+8",
    audioPath: "/audio/SONG8.mp3"
  },
  {
    id: "27",
    title: "Song 9",
    artist: "Artist 9",
    cover: "/placeholder.svg?height=300&width=300&text=Song+9",
    audioPath: "/audio/SONG9.mp3"
  }
]

interface Position3D {
  x: number
  y: number
  z: number
}

interface SceneContentProps {
  position: [number, number, number]
  onSelectAlbum: (album: Album) => void
  selectedAlbum: Album | null
  transitioning: boolean
  setPreviewPosition: (position: Position3D) => void
}

interface AlbumsProps {
  onPointerOver: (index: number) => void
  onPointerOut: (index: number | null) => void
  onSelectAlbum: (album: Album) => void
  selectedAlbum: Album | null
  transitioning: boolean
}

interface CardProps {
  album: Album
  active: boolean
  hovered: boolean
  selected: boolean
  transitioning: boolean
  onClick: () => void
  onPointerOver: (event: any) => void
  onPointerOut: () => void
  position: [number, number, number]
  rotation: [number, number, number]
  angle: number
}

interface ActiveCardProps {
  album: Album | null
  setPreviewPosition: (position: Position3D) => void
}

// Custom moving stars component
function MovingStars() {
  const ref = useRef<THREE.Points>(null!)
  const [stars] = useState(() => {
    const positions = new Float32Array(1000 * 3)
    const velocities = new Float32Array(1000)
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
      velocities[i] = Math.random() * 0.02
    }
    return { positions, velocities }
  })

  useFrame((state, delta) => {
    if (!ref.current) return
    const positions = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < 1000; i++) {
      positions[i * 3 + 2] += stars.velocities[i]
      if (positions[i * 3 + 2] > 25) {
        positions[i * 3 + 2] = -25
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={stars.positions.length / 3}
          array={stars.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

// Camera lock component that maintains fixed position when music is playing
function CameraLock({ isPlaying }: { isPlaying: boolean }) {
  const { camera } = useThree()
  const lockedPosition = useMemo(() => new THREE.Vector3(-0.35, 3.46, 12.00), [])
  const lockedQuaternion = useMemo(() => new THREE.Quaternion(-0.140, -0.014, -0.002, 0.990), [])

  useFrame(() => {
    if (isPlaying && camera instanceof THREE.PerspectiveCamera) {
      camera.position.lerp(lockedPosition, 0.3)
      camera.quaternion.slerp(lockedQuaternion, 0.3)
      camera.fov = 45.00000000000002
      camera.updateProjectionMatrix()
    }
  })

  return null
}

// Update Scene component to include background
export default function Scene() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [previewPosition, setPreviewPosition] = useState<Position3D>({ x: 0, y: 0, z: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleSelectAlbum = (album: Album) => {
    setSelectedAlbum(album)
  }

  return (
    <div className="h-screen w-screen relative">
      <Menu />
      <style>
        {`
          canvas {
            touch-action: none;
          }
          
          /* Hide scrollbars */
          * {
            scrollbar-width: none;  /* Firefox */
            -ms-overflow-style: none;  /* IE and Edge */
          }
          
          *::-webkit-scrollbar {
            display: none;  /* Chrome, Safari and Opera */
          }
        `}
      </style>
      <Canvas dpr={[1, 1.5]} camera={{ position: [-0.35, 3.46, 12.00], fov: 45.00000000000002 }}>
        <color attach="background" args={['#000020']} />
        <fog attach="fog" args={['#000020', 8, 30]} />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        <directionalLight position={[0, 5, 5]} intensity={0.5} />
        
        <Stars 
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        <MovingStars />
        <CameraLock isPlaying={isPlaying} />
        <ScrollControls pages={4} infinite damping={0.3}>
          <SceneContent
            position={[0, 0, 0]}
            onSelectAlbum={handleSelectAlbum}
            selectedAlbum={selectedAlbum}
            transitioning={transitioning}
            setPreviewPosition={setPreviewPosition}
          />
        </ScrollControls>
        <CameraDebug />
      </Canvas>
      
      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full p-3 text-white transition-all duration-200 hover:scale-110"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6m0 0v6m0-6L14 10M9 21H3m0 0v-6m0 6l7-7m4-4l7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {selectedAlbum && !transitioning && (
        <MusicPlayer 
          album={selectedAlbum} 
          onClose={() => {
            setSelectedAlbum(null)
            setIsPlaying(false)
          }} 
          initialPosition={previewPosition}
          onPlayingChange={setIsPlaying}
          isFullscreen={isFullscreen}
        />
      )}
    </div>
  )
}

function SceneContent({ position, onSelectAlbum, selectedAlbum, transitioning, setPreviewPosition }: SceneContentProps) {
  const ref = useRef<THREE.Group>(null!)
  const scroll = useScroll()
  const [hovered, hover] = useState<number | null>(null)

  useFrame((state, delta) => {
    if (!ref.current) return
    
    if (scroll?.offset !== undefined) {
      ref.current.rotation.y = -scroll.offset * (Math.PI * 2 * 0.85)
    }
    
    if (transitioning) {
      easing.damp3(state.camera.position, [0, 2, 12], 0.4, delta)
    } else {
      easing.damp3(state.camera.position, [-state.pointer.x * 2, 2 + state.pointer.y * 2, 12], 0.3, delta)
    }
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={ref} position={position}>
      <Albums
        onPointerOver={hover}
        onPointerOut={hover}
        onSelectAlbum={onSelectAlbum}
        selectedAlbum={selectedAlbum}
        transitioning={transitioning}
      />
      <ActiveCard album={selectedAlbum} setPreviewPosition={setPreviewPosition} />
    </group>
  )
}

function Albums({ onPointerOver, onPointerOut, onSelectAlbum, selectedAlbum, transitioning }: AlbumsProps) {
  const [hovered, hover] = useState<number | null>(null)
  const radius = 5.5
  const totalCards = albums.length
  
  return (
    <group>
      {albums.map((album, i) => {
        const angle = (i * 2 * Math.PI) / totalCards
        const isSelected = selectedAlbum?.id === album.id
        const position: [number, number, number] = [
          radius * Math.sin(angle),
          0,
          radius * Math.cos(angle)
        ]

        const rotation: [number, number, number] = [0, angle + Math.PI / 2, 0]

        return (
          <Card
            key={album.id}
            album={album}
            onPointerOver={(e) => {
              e.stopPropagation()
              hover(i)
              onPointerOver(i)
            }}
            onPointerOut={() => {
              hover(null)
              onPointerOut(null)
            }}
            onClick={() => onSelectAlbum(album)}
            position={position}
            rotation={rotation}
            angle={angle}
            active={hovered !== null}
            hovered={hovered === i}
            selected={isSelected || false}
            transitioning={transitioning && (isSelected || false)}
          />
        )
      })}
    </group>
  )
}

function Card({ album, active, hovered, selected, transitioning, onClick, onPointerOver, onPointerOut, position, rotation, angle }: CardProps) {
  const ref = useRef<THREE.Group>(null!)
  const scroll = useScroll()
  const { camera } = useThree()

  useFrame((state, delta) => {
    if (!ref.current) return

    const f = active && hovered ? 1.5 : 1
    easing.damp3(ref.current.scale, [1 * f, 1 * f, 1], 0.15, delta)

    const scrollRotation = -scroll.offset * (Math.PI * 2 * 0.85)
    
    const worldPosition = new THREE.Vector3()
    ref.current.getWorldPosition(worldPosition)
    
    const cameraDirection = new THREE.Vector3()
    camera.getWorldDirection(cameraDirection)
    const cardToCamera = new THREE.Vector3().subVectors(camera.position, worldPosition).normalize()
    
    const facingAngle = Math.abs(cardToCamera.angleTo(cameraDirection))

    const scrollSpeed = Math.abs(scroll.delta || 0)
    const facingThreshold = Math.PI/6 + scrollSpeed * 2 

    if (facingAngle < facingThreshold) {
      const targetQuaternion = new THREE.Quaternion()
      const up = new THREE.Vector3(0, 1, 0)
      
      const lookAtPosition = new THREE.Vector3().copy(camera.position)
      const direction = new THREE.Vector3().subVectors(lookAtPosition, worldPosition).normalize()
      
      const lookMatrix = new THREE.Matrix4().lookAt(worldPosition, lookAtPosition, up)
      targetQuaternion.setFromRotationMatrix(lookMatrix)
      
      ref.current.quaternion.slerp(targetQuaternion, delta * 3)
    } else {
      ref.current.quaternion.identity()
      
      const targetRotation = angle + scrollRotation + Math.PI/2
      easing.damp(ref.current.rotation, 'y', targetRotation, 0.3, delta)
    }
  })

  return (
    <group ref={ref} position={position}>
      <mesh
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <Image 
          transparent 
          radius={0.075} 
          url={album.cover} 
          scale={[1, 1]}
          side={THREE.DoubleSide}
          color="#FAFAFA" 
        />
      </mesh>
    </group>
  )
}

function ActiveCard({ album, setPreviewPosition }: ActiveCardProps) {
  const ref = useRef<THREE.Mesh>(null)
  
  useLayoutEffect(() => {
    if (ref.current) {
      const position = ref.current.position.clone()
      setPreviewPosition({
        x: position.x || 0,
        y: position.y || 0,
        z: position.z || 0
      })
    }
  }, [setPreviewPosition])

  return (
    <Billboard>
      <Text fontSize={0.5} position={[2.15, 3.85, 0]} anchorX="left" color="black">
        {album && `${album.title}\n${album.artist}`}
      </Text>
      {album && (
        <Image
          ref={ref}
          transparent
          radius={0.3}
          position={[0, 1.5, 0]}
          scale={[3.5, 1.618 * 3.5]}
          url={album?.cover}
        />
      )}
    </Billboard>
  )
}
