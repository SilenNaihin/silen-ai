'use client'

import { Suspense, useRef, useMemo, useState, useEffect, createContext, useContext, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Trail } from '@react-three/drei'
import * as THREE from 'three'

// Types
type CameraMode = 'third-person' | 'side' | 'first-person'
type PowerupType = 'speed' | 'nitro' | 'magnet' | 'shield'

interface Powerup {
  id: number
  type: PowerupType
  position: THREE.Vector3
  collected: boolean
}

interface RaceCheckpoint {
  id: number
  position: THREE.Vector3
  passed: boolean
}

interface GameState {
  speed: number
  maxSpeed: number
  heading: number
  nitroFuel: number
  nitroActive: boolean
  shield: boolean
  shieldTime: number
  score: number
  // Race state
  raceActive: boolean
  raceTime: number
  currentCheckpoint: number
  bestTime: number | null
  raceComplete: boolean
}

// Contexts
const CameraModeContext = createContext<{ mode: CameraMode; setMode: (m: CameraMode) => void }>({
  mode: 'third-person',
  setMode: () => {},
})

// Use refs for mutable game data to avoid re-renders
const gameDataRef = {
  powerups: [] as Powerup[],
  checkpoints: [] as RaceCheckpoint[],
  collectedIds: new Set<number>(),
  passedCheckpoints: new Set<number>(),
}

// Generate powerups once
function initPowerups(): Powerup[] {
  const types: PowerupType[] = ['speed', 'nitro', 'magnet', 'shield']
  const powerups: Powerup[] = []
  for (let i = 0; i < 30; i++) {
    // Spread them out more, avoid race track area
    let x, z
    do {
      x = (Math.random() - 0.5) * 90
      z = (Math.random() - 0.5) * 90
    } while (Math.abs(x) < 15 && z > -10 && z < 50) // Avoid race track start

    powerups.push({
      id: i,
      type: types[Math.floor(Math.random() * types.length)],
      position: new THREE.Vector3(x, 1.5, z),
      collected: false,
    })
  }
  return powerups
}

// Generate race checkpoints in a loop
function initCheckpoints(): RaceCheckpoint[] {
  const checkpoints: RaceCheckpoint[] = [
    { id: 0, position: new THREE.Vector3(0, 0, 20), passed: false },
    { id: 1, position: new THREE.Vector3(25, 0, 35), passed: false },
    { id: 2, position: new THREE.Vector3(40, 0, 20), passed: false },
    { id: 3, position: new THREE.Vector3(40, 0, -10), passed: false },
    { id: 4, position: new THREE.Vector3(25, 0, -25), passed: false },
    { id: 5, position: new THREE.Vector3(0, 0, -30), passed: false },
    { id: 6, position: new THREE.Vector3(-25, 0, -25), passed: false },
    { id: 7, position: new THREE.Vector3(-40, 0, -10), passed: false },
    { id: 8, position: new THREE.Vector3(-40, 0, 20), passed: false },
    { id: 9, position: new THREE.Vector3(-25, 0, 35), passed: false },
  ]
  return checkpoints
}

// Initialize on load
if (typeof window !== 'undefined' && gameDataRef.powerups.length === 0) {
  gameDataRef.powerups = initPowerups()
  gameDataRef.checkpoints = initCheckpoints()
}

// Particle system for wake/spray
function WakeParticles({ boatPosition, velocity, nitroActive }: { boatPosition: React.MutableRefObject<THREE.Vector3>; velocity: React.MutableRefObject<THREE.Vector3>; nitroActive: boolean }) {
  const count = 600
  const mesh = useRef<THREE.Points>(null)

  const [positions, velocities, lifetimes] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const lifetimes = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] = -100
      lifetimes[i] = 0
    }
    return [positions, velocities, lifetimes]
  }, [])

  const particleIndex = useRef(0)

  useFrame((_, delta) => {
    if (!mesh.current) return
    const posAttr = mesh.current.geometry.attributes.position as THREE.BufferAttribute
    const posArray = posAttr.array as Float32Array
    const bp = boatPosition.current
    const vel = velocity.current

    const speed = vel.length()
    const spawnRate = Math.floor(speed * (nitroActive ? 80 : 40))

    for (let s = 0; s < Math.min(spawnRate, 20); s++) {
      const i = particleIndex.current
      posArray[i * 3] = bp.x + (Math.random() - 0.5) * 0.8
      posArray[i * 3 + 1] = bp.y - 0.3
      posArray[i * 3 + 2] = bp.z + (Math.random() - 0.5) * 0.8

      velocities[i * 3] = -vel.x * 0.3 + (Math.random() - 0.5) * 0.8
      velocities[i * 3 + 1] = Math.random() * 2.5 + 0.8
      velocities[i * 3 + 2] = -vel.z * 0.3 + (Math.random() - 0.5) * 0.8
      lifetimes[i] = 1.0

      particleIndex.current = (particleIndex.current + 1) % count
    }

    for (let i = 0; i < count; i++) {
      if (lifetimes[i] > 0) {
        posArray[i * 3] += velocities[i * 3] * delta
        posArray[i * 3 + 1] += velocities[i * 3 + 1] * delta
        posArray[i * 3 + 2] += velocities[i * 3 + 2] * delta
        velocities[i * 3 + 1] -= 10 * delta
        lifetimes[i] -= delta * 0.8
        if (posArray[i * 3 + 1] < -0.5) {
          lifetimes[i] = 0
          posArray[i * 3 + 1] = -100
        }
      }
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.1} color={nitroActive ? '#ff6600' : '#00ffff'} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

// Ambient particles
function AmbientParticles() {
  const count = 1500
  const mesh = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const colorOptions = [[0, 1, 1], [1, 0, 1], [1, 0.5, 0], [0.5, 0, 1]]
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120
      positions[i * 3 + 1] = Math.random() * 25 - 3
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)]
      colors[i * 3] = color[0]
      colors[i * 3 + 1] = color[1]
      colors[i * 3 + 2] = color[2]
    }
    return [positions, colors]
  }, [])

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.y = state.clock.elapsedTime * 0.01
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.12} vertexColors transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

// 3D Powerup orb - simplified for performance
function PowerupOrb({ powerup, onCollect }: { powerup: Powerup; onCollect: () => void }) {
  const meshRef = useRef<THREE.Group>(null)
  const collected = useRef(false)

  const colors: Record<PowerupType, string> = {
    speed: '#00ff00',
    nitro: '#ff6600',
    magnet: '#ff00ff',
    shield: '#00ffff',
  }

  useFrame((state) => {
    if (!meshRef.current || collected.current) return
    meshRef.current.rotation.y += 0.02
    meshRef.current.position.y = powerup.position.y + Math.sin(state.clock.elapsedTime * 2 + powerup.id) * 0.3
  })

  if (gameDataRef.collectedIds.has(powerup.id)) return null

  return (
    <group ref={meshRef} position={[powerup.position.x, powerup.position.y, powerup.position.z]}>
      <mesh>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={colors[powerup.type]} emissive={colors[powerup.type]} emissiveIntensity={1.5} metalness={0.8} roughness={0.2} />
      </mesh>
      <pointLight color={colors[powerup.type]} intensity={2} distance={6} />
    </group>
  )
}

// Race start gate
function RaceStartGate({ onEnter }: { onEnter: () => void }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh && i > 1) {
          (child.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse * 2
        }
      })
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 5]}>
      {/* Gate pillars */}
      <mesh position={[-6, 4, 0]}>
        <boxGeometry args={[1, 8, 1]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[6, 4, 0]}>
        <boxGeometry args={[1, 8, 1]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Top bar */}
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[13, 0.5, 0.5]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
      </mesh>
      {/* Start lights */}
      <mesh position={[-3, 7, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 7, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={2} />
      </mesh>
      <mesh position={[3, 7, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
      </mesh>
      {/* Ground marker */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <planeGeometry args={[12, 4]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>
      <pointLight position={[0, 5, 0]} color="#ff00ff" intensity={10} distance={15} />
    </group>
  )
}

// Race checkpoint
function RaceCheckpointGate({ checkpoint, isNext, isPassed }: { checkpoint: RaceCheckpoint; isNext: boolean; isPassed: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current && isNext) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1
      meshRef.current.scale.setScalar(scale)
    }
  })

  const color = isPassed ? '#00ff00' : isNext ? '#ffff00' : '#444444'
  const intensity = isPassed ? 1 : isNext ? 2 : 0.3

  return (
    <group position={[checkpoint.position.x, 0, checkpoint.position.z]}>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
        <ringGeometry args={[3, 4, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
      {isNext && <pointLight color={color} intensity={5} distance={10} position={[0, 2, 0]} />}
    </group>
  )
}

// Cyber boat
function CyberBoat({ position, rotation, isBoosting, hasShield }: { position: THREE.Vector3; rotation: number; isBoosting: boolean; hasShield: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 2) * 0.08
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.04
    groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 1.2) * 0.02
  })

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]} rotation={[0, rotation, 0]}>
      {hasShield && (
        <mesh>
          <sphereGeometry args={[2.5, 24, 24]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
      )}
      <mesh><boxGeometry args={[1.2, 0.4, 3]} /><meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.2} /></mesh>
      <mesh position={[0, -0.25, 0]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.6, 0.6, 2.8]} /><meshStandardMaterial color="#0f0f1a" metalness={0.9} roughness={0.2} /></mesh>
      <mesh position={[0, 0.4, -0.3]}><boxGeometry args={[0.8, 0.5, 1.2]} /><meshStandardMaterial color="#16213e" metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[0, 0.5, 0.3]} rotation={[-0.5, 0, 0]}><boxGeometry args={[0.75, 0.4, 0.05]} /><meshStandardMaterial color="#00ffff" transparent opacity={0.4} emissive="#00ffff" emissiveIntensity={0.3} /></mesh>
      <mesh position={[0.6, 0, 0]}><boxGeometry args={[0.02, 0.1, 2.9]} /><meshStandardMaterial color={isBoosting ? '#ff6600' : '#ff00ff'} emissive={isBoosting ? '#ff6600' : '#ff00ff'} emissiveIntensity={isBoosting ? 3 : 1.5} /></mesh>
      <mesh position={[-0.6, 0, 0]}><boxGeometry args={[0.02, 0.1, 2.9]} /><meshStandardMaterial color={isBoosting ? '#ff6600' : '#ff00ff'} emissive={isBoosting ? '#ff6600' : '#ff00ff'} emissiveIntensity={isBoosting ? 3 : 1.5} /></mesh>
      <mesh position={[0, 0, 1.5]}><boxGeometry args={[1.1, 0.1, 0.02]} /><meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} /></mesh>
      <mesh position={[0, -0.1, -1.5]}><cylinderGeometry args={[0.2, 0.3, 0.3, 8]} /><meshStandardMaterial color={isBoosting ? '#ff0000' : '#ff6600'} emissive={isBoosting ? '#ff0000' : '#ff6600'} emissiveIntensity={isBoosting ? 4 : 2} /></mesh>
      <mesh position={[0.35, -0.1, -1.5]}><cylinderGeometry args={[0.15, 0.2, 0.3, 8]} /><meshStandardMaterial color={isBoosting ? '#ff0000' : '#ff6600'} emissive={isBoosting ? '#ff0000' : '#ff6600'} emissiveIntensity={isBoosting ? 4 : 2} /></mesh>
      <mesh position={[-0.35, -0.1, -1.5]}><cylinderGeometry args={[0.15, 0.2, 0.3, 8]} /><meshStandardMaterial color={isBoosting ? '#ff0000' : '#ff6600'} emissive={isBoosting ? '#ff0000' : '#ff6600'} emissiveIntensity={isBoosting ? 4 : 2} /></mesh>
      <pointLight position={[0, 0.3, 1.6]} color="#00ffff" intensity={4} distance={8} />
      <pointLight position={[0, -0.2, -1.6]} color={isBoosting ? '#ff0000' : '#ff6600'} intensity={isBoosting ? 12 : 6} distance={isBoosting ? 12 : 6} />
    </group>
  )
}

// Water
function CyberWater() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[200, 200, 50, 50]} />
        <meshStandardMaterial color="#0a0a20" metalness={0.9} roughness={0.1} transparent opacity={0.9} />
      </mesh>
      <gridHelper args={[200, 40, '#ff00ff', '#00ffff']} position={[0, -0.45, 0]} />
    </>
  )
}

// Controllable boat
function ControllableBoat({ gameState, setGameState }: { gameState: GameState; setGameState: React.Dispatch<React.SetStateAction<GameState>> }) {
  const keysRef = useRef({ forward: false, backward: false, left: false, right: false, boost: false })
  const position = useRef(new THREE.Vector3(0, 0, -5))
  const velocity = useRef(new THREE.Vector3(0, 0, 0))
  const rotation = useRef(0)
  const [renderKey, setRenderKey] = useState(0)
  const lastCollectTime = useRef(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault()
      }
      if (key === 'w' || key === 'arrowup') keysRef.current.forward = true
      if (key === 's' || key === 'arrowdown') keysRef.current.backward = true
      if (key === 'a' || key === 'arrowleft') keysRef.current.left = true
      if (key === 'd' || key === 'arrowright') keysRef.current.right = true
      if (e.shiftKey) keysRef.current.boost = true
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key === 'w' || key === 'arrowup') keysRef.current.forward = false
      if (key === 's' || key === 'arrowdown') keysRef.current.backward = false
      if (key === 'a' || key === 'arrowleft') keysRef.current.left = false
      if (key === 'd' || key === 'arrowright') keysRef.current.right = false
      if (!e.shiftKey) keysRef.current.boost = false
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const isBoosting = keysRef.current.boost && gameState.nitroFuel > 0

  useFrame((state, delta) => {
    const keys = keysRef.current
    const baseSpeed = 25
    const boostMultiplier = isBoosting ? 2.2 : 1
    const speed = Math.min(baseSpeed * boostMultiplier, gameState.maxSpeed * boostMultiplier)
    const turnSpeed = 2.8
    const friction = 0.97

    if (keys.left) rotation.current += turnSpeed * delta
    if (keys.right) rotation.current -= turnSpeed * delta

    const thrust = new THREE.Vector3(0, 0, 0)
    if (keys.forward) {
      thrust.x = Math.sin(rotation.current) * speed
      thrust.z = Math.cos(rotation.current) * speed
    }
    if (keys.backward) {
      thrust.x = -Math.sin(rotation.current) * speed * 0.35
      thrust.z = -Math.cos(rotation.current) * speed * 0.35
    }

    velocity.current.add(thrust.multiplyScalar(delta))
    velocity.current.multiplyScalar(friction)
    position.current.add(velocity.current.clone().multiplyScalar(delta))

    // Boundary wrapping
    if (position.current.x > 55) position.current.x = -55
    if (position.current.x < -55) position.current.x = 55
    if (position.current.z > 55) position.current.z = -55
    if (position.current.z < -55) position.current.z = 55

    const now = state.clock.elapsedTime

    // Check powerup collisions - throttled
    if (now - lastCollectTime.current > 0.1) {
      for (const p of gameDataRef.powerups) {
        if (!gameDataRef.collectedIds.has(p.id)) {
          const dx = position.current.x - p.position.x
          const dz = position.current.z - p.position.z
          const dist = Math.sqrt(dx * dx + dz * dz)
          if (dist < 2.5) {
            gameDataRef.collectedIds.add(p.id)
            lastCollectTime.current = now

            // Apply powerup effect
            setGameState(prev => {
              let newState = { ...prev }
              switch (p.type) {
                case 'speed':
                  newState.maxSpeed = Math.min(prev.maxSpeed + 8, 55)
                  newState.score += 50
                  break
                case 'nitro':
                  newState.nitroFuel = Math.min(prev.nitroFuel + 40, 100)
                  newState.score += 25
                  break
                case 'magnet':
                  newState.score += 100
                  break
                case 'shield':
                  newState.shield = true
                  newState.shieldTime = 8
                  newState.score += 25
                  break
              }
              return newState
            })
            break // Only collect one per frame
          }
        }
      }
    }

    // Check race start gate
    if (!gameState.raceActive && !gameState.raceComplete) {
      const distToStart = Math.sqrt(position.current.x ** 2 + (position.current.z - 5) ** 2)
      if (distToStart < 5) {
        gameDataRef.passedCheckpoints.clear()
        setGameState(prev => ({ ...prev, raceActive: true, raceTime: 0, currentCheckpoint: 0, raceComplete: false }))
      }
    }

    // Check checkpoint collisions during race
    if (gameState.raceActive) {
      const currentCp = gameDataRef.checkpoints[gameState.currentCheckpoint]
      if (currentCp) {
        const dx = position.current.x - currentCp.position.x
        const dz = position.current.z - currentCp.position.z
        const dist = Math.sqrt(dx * dx + dz * dz)
        if (dist < 5) {
          gameDataRef.passedCheckpoints.add(currentCp.id)
          const nextCp = gameState.currentCheckpoint + 1
          if (nextCp >= gameDataRef.checkpoints.length) {
            // Race complete!
            setGameState(prev => ({
              ...prev,
              raceActive: false,
              raceComplete: true,
              currentCheckpoint: 0,
              score: prev.score + 500,
              bestTime: prev.bestTime === null ? prev.raceTime : Math.min(prev.bestTime, prev.raceTime)
            }))
          } else {
            setGameState(prev => ({ ...prev, currentCheckpoint: nextCp }))
          }
        }
      }
    }

    // Update display state less frequently
    const currentSpeed = velocity.current.length() * 12
    let heading = (rotation.current * 180 / Math.PI) % 360
    if (heading < 0) heading += 360

    setGameState(prev => ({
      ...prev,
      speed: currentSpeed,
      heading,
      nitroActive: isBoosting,
      nitroFuel: isBoosting ? Math.max(0, prev.nitroFuel - delta * 15) : Math.min(100, prev.nitroFuel + delta * 8),
      shieldTime: prev.shield ? Math.max(0, prev.shieldTime - delta) : 0,
      shield: prev.shield && prev.shieldTime > delta,
      raceTime: prev.raceActive ? prev.raceTime + delta : prev.raceTime,
    }))

    setRenderKey(prev => prev + 1)
  })

  return (
    <>
      <Trail width={isBoosting ? 2.5 : 1.8} length={isBoosting ? 10 : 6} color={isBoosting ? '#ff6600' : '#00ffff'} attenuation={(t) => t * t}>
        <CyberBoat position={position.current} rotation={rotation.current} isBoosting={isBoosting} hasShield={gameState.shield} />
      </Trail>
      <WakeParticles boatPosition={position} velocity={velocity} nitroActive={isBoosting} />
      <CameraFollow target={position} boatRotation={rotation} />
    </>
  )
}

// Camera follow
function CameraFollow({ target, boatRotation }: { target: React.MutableRefObject<THREE.Vector3>; boatRotation: React.MutableRefObject<number> }) {
  const { camera } = useThree()
  const { mode } = useContext(CameraModeContext)

  useFrame(() => {
    const pos = target.current
    const rot = boatRotation.current
    let targetPos: THREE.Vector3

    switch (mode) {
      case 'first-person':
        targetPos = new THREE.Vector3(
          pos.x + Math.sin(rot) * 1.2,
          pos.y + 1.0,
          pos.z + Math.cos(rot) * 1.2
        )
        camera.position.lerp(targetPos, 0.25)
        camera.lookAt(
          pos.x + Math.sin(rot) * 25,
          pos.y + 0.5,
          pos.z + Math.cos(rot) * 25
        )
        break

      case 'side':
        targetPos = new THREE.Vector3(
          pos.x + Math.cos(rot) * 10,
          pos.y + 3.5,
          pos.z - Math.sin(rot) * 10
        )
        camera.position.lerp(targetPos, 0.1)
        camera.lookAt(pos.x, pos.y, pos.z)
        break

      default:
        targetPos = new THREE.Vector3(
          pos.x - Math.sin(rot) * 12,
          pos.y + 5,
          pos.z - Math.cos(rot) * 12
        )
        camera.position.lerp(targetPos, 0.08)
        camera.lookAt(pos.x, pos.y, pos.z)
    }
  })

  return null
}

// Scene
function Scene({ gameState, setGameState }: { gameState: GameState; setGameState: React.Dispatch<React.SetStateAction<GameState>> }) {
  return (
    <>
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 25, 90]} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 20, 10]} intensity={0.25} />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
      <AmbientParticles />
      <CyberWater />
      <ControllableBoat gameState={gameState} setGameState={setGameState} />

      {/* Powerups */}
      {gameDataRef.powerups.map(p => (
        <PowerupOrb key={p.id} powerup={p} onCollect={() => {}} />
      ))}

      {/* Race track */}
      <RaceStartGate onEnter={() => {}} />
      {gameDataRef.checkpoints.map((cp, i) => (
        <RaceCheckpointGate
          key={cp.id}
          checkpoint={cp}
          isNext={gameState.raceActive && gameState.currentCheckpoint === i}
          isPassed={gameDataRef.passedCheckpoints.has(cp.id)}
        />
      ))}

      {/* Distant structures */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[Math.sin(i * Math.PI / 4) * 55, 12, Math.cos(i * Math.PI / 4) * 55]}>
          <boxGeometry args={[2, 24, 2]} />
          <meshStandardMaterial color="#1a0a2e" emissive={i % 2 === 0 ? '#ff00ff' : '#00ffff'} emissiveIntensity={0.4} />
        </mesh>
      ))}
    </>
  )
}

// Speedometer gauge
function Speedometer({ speed, maxSpeed }: { speed: number; maxSpeed: number }) {
  const percentage = Math.min(speed / maxSpeed, 1)
  const rotation = -135 + percentage * 270

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <path d="M 15 75 A 40 40 0 1 1 85 75" fill="none" stroke="#1a1a2e" strokeWidth="8" strokeLinecap="round" />
        <path d="M 15 75 A 40 40 0 1 1 85 75" fill="none" stroke="url(#speedGradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${percentage * 188} 188`} />
        <defs>
          <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="50%" stopColor="#ff00ff" />
            <stop offset="100%" stopColor="#ff6600" />
          </linearGradient>
        </defs>
        {[...Array(11)].map((_, i) => {
          const angle = (-135 + i * 27) * Math.PI / 180
          return <line key={i} x1={50 + 35 * Math.cos(angle)} y1={50 + 35 * Math.sin(angle)} x2={50 + 40 * Math.cos(angle)} y2={50 + 40 * Math.sin(angle)} stroke="#444" strokeWidth="1" />
        })}
        <g transform={`rotate(${rotation} 50 50)`}>
          <line x1="50" y1="50" x2="50" y2="20" stroke="#ff0000" strokeWidth="2" />
          <circle cx="50" cy="50" r="3" fill="#ff0000" />
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
        <div className="text-2xl font-bold text-white font-mono">{Math.floor(speed)}</div>
        <div className="text-[10px] text-gray-500 tracking-widest">KM/H</div>
      </div>
    </div>
  )
}

// HUD
function HUD({ gameState }: { gameState: GameState }) {
  const { mode, setMode } = useContext(CameraModeContext)

  return (
    <>
      {/* Bottom left - Speedometer */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-black/60 backdrop-blur border border-cyan-500/30 rounded-xl p-3">
          <Speedometer speed={gameState.speed} maxSpeed={100} />
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">HEADING</span>
              <span className="text-cyan-400 font-mono">{gameState.heading.toFixed(0)}°</span>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className="text-gray-500">NITRO</span>
                <span className={`font-mono ${gameState.nitroActive ? 'text-orange-400' : 'text-orange-400/70'}`}>{gameState.nitroFuel.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                <div className={`h-full transition-all ${gameState.nitroActive ? 'bg-orange-500' : 'bg-orange-600'}`} style={{ width: `${gameState.nitroFuel}%` }} />
              </div>
            </div>
            {gameState.shield && (
              <div>
                <div className="flex items-center justify-between text-xs mb-0.5">
                  <span className="text-gray-500">SHIELD</span>
                  <span className="text-cyan-400 font-mono">{gameState.shieldTime.toFixed(1)}s</span>
                </div>
                <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500" style={{ width: `${(gameState.shieldTime / 8) * 100}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top right - Score & Camera */}
      <div className="absolute top-16 right-4 z-10 space-y-3">
        <div className="bg-black/60 backdrop-blur border border-fuchsia-500/30 rounded-lg p-3 text-center">
          <div className="text-fuchsia-400/60 text-[10px] tracking-widest">SCORE</div>
          <div className="text-2xl font-bold text-white font-mono">{gameState.score}</div>
        </div>
        <div className="bg-black/60 backdrop-blur border border-cyan-500/30 rounded-lg p-2">
          <div className="text-cyan-400/60 text-[10px] tracking-widest mb-1.5">CAMERA</div>
          <div className="flex gap-1">
            {(['third-person', 'side', 'first-person'] as CameraMode[]).map((m, i) => (
              <button key={m} onClick={() => setMode(m)} className={`px-2 py-1 text-xs rounded ${mode === m ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        {gameState.bestTime !== null && (
          <div className="bg-black/60 backdrop-blur border border-green-500/30 rounded-lg p-2 text-center">
            <div className="text-green-400/60 text-[10px] tracking-widest">BEST LAP</div>
            <div className="text-lg font-bold text-green-400 font-mono">{gameState.bestTime.toFixed(2)}s</div>
          </div>
        )}
      </div>

      {/* Race HUD */}
      {gameState.raceActive && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/80 backdrop-blur border border-yellow-500/50 rounded-lg px-6 py-3 text-center">
            <div className="text-yellow-400/60 text-xs tracking-widest">RACE TIME</div>
            <div className="text-3xl font-bold text-yellow-400 font-mono">{gameState.raceTime.toFixed(2)}s</div>
            <div className="text-xs text-gray-400 mt-1">
              Checkpoint {gameState.currentCheckpoint + 1} / {gameDataRef.checkpoints.length}
            </div>
          </div>
        </div>
      )}

      {/* Race complete notification */}
      {gameState.raceComplete && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
          <div className="bg-black/90 border-2 border-green-500 rounded-xl px-8 py-4 text-center">
            <div className="text-green-400 text-3xl font-bold">LAP COMPLETE!</div>
            <div className="text-white text-xl font-mono mt-2">{gameState.raceTime.toFixed(2)}s</div>
            <div className="text-gray-400 text-sm mt-2">+500 points</div>
          </div>
        </div>
      )}

      {/* Race prompt */}
      {!gameState.raceActive && !gameState.raceComplete && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/60 backdrop-blur rounded-lg px-4 py-2 text-center animate-pulse">
            <div className="text-fuchsia-400 text-sm">Drive through the <span className="text-yellow-400">START GATE</span> to race!</div>
          </div>
        </div>
      )}

      {/* Bottom center - Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black/40 backdrop-blur-sm rounded px-3 py-1.5">
          <div className="text-gray-500 text-[10px]">
            <span className="text-white">WASD</span> Move · <span className="text-orange-400">SHIFT</span> Nitro · <span className="text-cyan-400">1-3</span> Camera
          </div>
        </div>
      </div>

      {gameState.nitroActive && <div className="absolute inset-0 pointer-events-none border-2 border-orange-500/20" />}
    </>
  )
}

// Header
function Header() {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-orange-500 bg-clip-text text-transparent tracking-wider">
            CYBER CRUISE
          </h1>
          <p className="text-cyan-400/50 text-[10px] tracking-widest">QUANTUM WAVE RIDER v2.077</p>
        </div>
        <a href="/qa" className="px-2 py-1 bg-black/50 border border-fuchsia-500/50 rounded text-xs text-fuchsia-400 hover:bg-fuchsia-500/20">
          ← Back
        </a>
      </div>
    </div>
  )
}

export default function CoolPage() {
  const [cameraMode, setCameraMode] = useState<CameraMode>('third-person')
  const [gameState, setGameState] = useState<GameState>({
    speed: 0,
    maxSpeed: 30,
    heading: 0,
    nitroFuel: 100,
    nitroActive: false,
    shield: false,
    shieldTime: 0,
    score: 0,
    raceActive: false,
    raceTime: 0,
    currentCheckpoint: 0,
    bestTime: null,
    raceComplete: false,
  })

  // Clear race complete after delay
  useEffect(() => {
    if (gameState.raceComplete) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, raceComplete: false }))
        gameDataRef.passedCheckpoints.clear()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [gameState.raceComplete])

  // Camera keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '1') setCameraMode('third-person')
      if (e.key === '2') setCameraMode('side')
      if (e.key === '3') setCameraMode('first-person')
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <CameraModeContext.Provider value={{ mode: cameraMode, setMode: setCameraMode }}>
      <div className="w-full h-screen bg-black relative overflow-hidden">
        <Header />
        <HUD gameState={gameState} />

        <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.03]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)' }} />
        <div className="absolute inset-0 pointer-events-none z-20" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)' }} />

        <Canvas camera={{ position: [0, 10, -15], fov: cameraMode === 'first-person' ? 95 : 60 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
          <CameraModeContext.Provider value={{ mode: cameraMode, setMode: setCameraMode }}>
            <Suspense fallback={null}>
              <Scene gameState={gameState} setGameState={setGameState} />
            </Suspense>
          </CameraModeContext.Provider>
        </Canvas>
      </div>
    </CameraModeContext.Provider>
  )
}
