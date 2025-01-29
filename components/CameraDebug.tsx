'use client'

import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { PerspectiveCamera } from 'three'

export function CameraDebug() {
  const { camera } = useThree()

  useEffect(() => {
    const logCameraPosition = () => {
      console.log('Camera Position:', {
        position: {
          x: camera.position.x.toFixed(2),
          y: camera.position.y.toFixed(2),
          z: camera.position.z.toFixed(2)
        },
        rotation: {
          x: (camera.rotation.x * (180/Math.PI)).toFixed(2) + '°',
          y: (camera.rotation.y * (180/Math.PI)).toFixed(2) + '°',
          z: (camera.rotation.z * (180/Math.PI)).toFixed(2) + '°'
        },
        quaternion: {
          x: camera.quaternion.x.toFixed(3),
          y: camera.quaternion.y.toFixed(3),
          z: camera.quaternion.z.toFixed(3),
          w: camera.quaternion.w.toFixed(3)
        },
        fov: camera instanceof PerspectiveCamera ? camera.fov + '°' : 'N/A'
      })
    }

    // Log initial position
    logCameraPosition()

    // Add keyboard shortcut (Ctrl + Shift + C) to log camera position
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        logCameraPosition()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [camera])

  return null // This component doesn't render anything
}
