"use client"

import * as THREE from "three"
import { useLayoutEffect, useRef, useState, useMemo, useEffect } from "react"
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber"
import { Image, ScrollControls, useScroll, Billboard, Text, Stars, Environment } from "@react-three/drei"
import { easing, geometry } from "maath"
import MusicPlayer from "./MusicPlayer"
import Menu from "./Menu"
import { CameraDebug } from "./CameraDebug"
import type { Album } from "../types/Album"

extend(geometry)

// Default albums array as fallback
const defaultAlbums: Album[] = [
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
  }
  // Add more default albums here if needed
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
  albums: Album[]
}

interface AlbumsProps {
  onPointerOver: (index: number) => void
  onPointerOut: (index: number | null) => void
  onSelectAlbum: (album: Album) => void
  selectedAlbum: Album | null
  transitioning: boolean
  albums: Album[]
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
      camera.position.lerp(lockedPosition, 0.15)
      camera.quaternion.slerp(lockedQuaternion, 0.12)
      camera.fov = 45.00000000000002
      camera.updateProjectionMatrix()
    }
  })

  return null
}

// Update Scene component to include background
export default function Scene() {
  const [albums, setAlbums] = useState<Album[]>(defaultAlbums)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [previewPosition, setPreviewPosition] = useState<Position3D>({ x: 0, y: 0, z: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Add this interface near the top of the file, after other imports
  interface WebkitDocument extends Document {
    webkitExitFullscreen?: () => Promise<void>;
    webkitFullscreenElement?: Element;
  }

  interface WebkitHTMLElement extends HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      try {
        const docElement = document.documentElement as WebkitHTMLElement;
        // Try standard fullscreen API first
        if (docElement.requestFullscreen) {
          docElement.requestFullscreen();
        } 
        // iOS Safari specific
        else if (docElement.webkitRequestFullscreen) {
          docElement.webkitRequestFullscreen();
        }
        // Fallback for iOS - use viewport meta tag
        else {
          const meta = document.createElement('meta');
          meta.name = 'viewport';
          meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
          document.getElementsByTagName('head')[0].appendChild(meta);
        }
        setIsFullscreen(true);
      } catch (err) {
        console.warn('Fullscreen not supported:', err);
      }
    } else {
      try {
        const doc = document as WebkitDocument;
        if (doc.exitFullscreen) {
          doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        }
        setIsFullscreen(false);
      } catch (err) {
        console.warn('Exit fullscreen failed:', err);
      }
    }
  }

  // Function to fetch albums from API
  const fetchAlbums = async () => {
    try {
      const response = await fetch('/api/scan-audio', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Fetched data:', data)
      
      if (data.albums?.length > 0) {
        // Validate album data structure
        const validAlbums = data.albums.filter(album => 
          album && 
          album.id && 
          album.title && 
          album.audioPath &&
          typeof album.audioPath === 'string'
        )
        
        if (validAlbums.length > 0) {
          console.log('Setting valid albums:', validAlbums)
          setAlbums(validAlbums)
        } else {
          console.warn('No valid albums found in response')
          setAlbums(defaultAlbums)
        }
      } else {
        console.log('No albums found, using default albums')
        setAlbums(defaultAlbums)
      }
    } catch (error) {
      console.error('Error fetching albums:', error)
      setAlbums(defaultAlbums)
    }
  }

  useEffect(() => {
    fetchAlbums()
    // Remove the interval to prevent multiple scans
    // const intervalId = setInterval(fetchAlbums, 5000)
    // return () => clearInterval(intervalId)
  }, [])

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
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 8, 30]} />
        
        {/* Remove gradient background mesh */}
        
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
            onSelectAlbum={setSelectedAlbum}
            selectedAlbum={selectedAlbum}
            transitioning={transitioning}
            setPreviewPosition={setPreviewPosition}
            albums={albums}
          />
        </ScrollControls>
        <CameraDebug />
      </Canvas>
      
      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 backdrop-blur-lg rounded-xl p-3 text-white/90 transition-all duration-300 hover:scale-105 shadow-lg border border-white/10"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        style={{
          background: 'linear-gradient(135deg, rgba(13, 15, 48, 0.4), rgba(48, 12, 48, 0.4), rgba(255, 128, 0, 0.1))',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        {isFullscreen ? (
          <svg 
            className="w-5 h-5 transform transition-transform duration-300 group-hover:rotate-90" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <path 
              d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="drop-shadow-md"
            />
          </svg>
        ) : (
          <svg 
            className="w-5 h-5 transform transition-transform duration-300 group-hover:rotate-90" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <path 
              d="M15 3h6m0 0v6m0-6L14 10M9 21H3m0 0v-6m0 6l7-7m4 4l7-7" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="drop-shadow-md"
            />
          </svg>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

function SceneContent({ position, onSelectAlbum, selectedAlbum, transitioning, setPreviewPosition, albums }: SceneContentProps) {
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
        albums={albums}
      />
      <ActiveCard album={selectedAlbum} setPreviewPosition={setPreviewPosition} />
    </group>
  )
}

function Albums({ onPointerOver, onPointerOut, onSelectAlbum, selectedAlbum, transitioning, albums }: AlbumsProps) {
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
            onPointerOver={(e: React.PointerEvent) => {
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

function Card({ album, active, hovered, selected, transitioning, onClick, onPointerOver, onPointerOut, position, rotation, angle }: any) {
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
        <Billboard follow={true} lockX={false} lockY={false}>
          <Text 
            fontSize={0.15}
            position={[0, -0.7, 0]}
            anchorX="center"
            anchorY="top"
            color="white"
            outlineWidth={0.02}
            outlineColor="black"
            renderOrder={1}
          >
            {album.title}
          </Text>
        </Billboard>
      </mesh>
    </group>
  )
}

function ActiveCard({ album, setPreviewPosition }: any) {
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
    <group>
      {album && (
        <Billboard follow={true} lockX={false} lockY={false}>
          <Image
            ref={ref}
            transparent
            radius={0.3}
            position={[0, 1.5, 0]}
            scale={[3.5, 1.618 * 3.5]}
            url={album?.cover}
          />
        </Billboard>
      )}
    </group>
  )
}
