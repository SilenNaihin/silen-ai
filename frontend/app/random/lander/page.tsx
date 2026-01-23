'use client'

import { Suspense, useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Environment, MeshTransmissionMaterial, Text, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

// ============================================================================
// 3D COMPONENTS
// ============================================================================

// Animated prostate gland with cancer spots
function ProstateGland({ showCancerSpots = true, animate = true }: { showCancerSpots?: boolean; animate?: boolean }) {
  const prostateRef = useRef<THREE.Group>(null)
  const time = useRef(0)

  // Cancer spot positions (roughly distributed within the gland)
  const cancerSpots = useMemo(() => [
    { pos: [0.3, 0.1, 0.2] as [number, number, number], size: 0.12 },
    { pos: [-0.2, -0.1, 0.15] as [number, number, number], size: 0.08 },
    { pos: [0.1, 0.2, -0.1] as [number, number, number], size: 0.1 },
    { pos: [-0.15, 0, 0.3] as [number, number, number], size: 0.06 },
  ], [])

  useFrame((state, delta) => {
    if (!prostateRef.current || !animate) return
    time.current += delta

    // Smooth backflip animation
    prostateRef.current.rotation.x = Math.sin(time.current * 0.5) * Math.PI * 2
    prostateRef.current.rotation.y += delta * 0.3

    // Gentle floating
    prostateRef.current.position.y = Math.sin(time.current * 0.8) * 0.1
  })

  return (
    <group ref={prostateRef}>
      {/* Main prostate body - walnut-shaped */}
      <mesh>
        <sphereGeometry args={[0.8, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          resolution={512}
          transmission={0.95}
          roughness={0.1}
          thickness={0.5}
          ior={1.5}
          chromaticAberration={0.06}
          anisotropy={0.1}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          color="#ffcccc"
        />
      </mesh>

      {/* Inner structure */}
      <mesh scale={0.7}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#ff9999"
          transparent
          opacity={0.3}
          roughness={0.8}
        />
      </mesh>

      {/* Cancer spots */}
      {showCancerSpots && cancerSpots.map((spot, i) => (
        <mesh key={i} position={spot.pos}>
          <sphereGeometry args={[spot.size, 16, 16]} />
          <meshStandardMaterial
            color="#cc0000"
            emissive="#ff0000"
            emissiveIntensity={0.5}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

// CT scan slice effect
function CTScanSlice() {
  const sliceRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!sliceRef.current) return
    sliceRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 1.5
  })

  return (
    <mesh ref={sliceRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.5, 2, 64]} />
      <meshBasicMaterial
        color="#00ff88"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Pelvis CT scan outline (simplified)
function PelvisCT() {
  const gridRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!gridRef.current) return
    gridRef.current.rotation.y = state.clock.elapsedTime * 0.1
  })

  return (
    <group ref={gridRef}>
      {/* Pelvis bone outline - simplified */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1.8, 0.05, 16, 100]} />
        <meshBasicMaterial color="#333" transparent opacity={0.5} />
      </mesh>

      {/* Scan grid lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, (i - 4) * 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5 + Math.sin(i * 0.5) * 0.3, 1.52 + Math.sin(i * 0.5) * 0.3, 64]} />
          <meshBasicMaterial color="#222" transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  )
}

// Hero scene with prostate
function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={0.5} />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <ProstateGland showCancerSpots={true} animate={true} />
      </Float>

      <PelvisCT />
      <CTScanSlice />

      <Environment preset="city" />
    </>
  )
}

// Radiation seed (brachytherapy seed)
function RadiationSeed({ position, delay = 0, target }: { position: [number, number, number]; delay?: number; target: [number, number, number] }) {
  const seedRef = useRef<THREE.Group>(null)
  const trailRef = useRef<THREE.Mesh>(null)
  const [fired, setFired] = useState(false)
  const [hit, setHit] = useState(false)
  const progress = useRef(0)

  useEffect(() => {
    const timer = setTimeout(() => setFired(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useFrame((state, delta) => {
    if (!seedRef.current || !fired || hit) return

    progress.current += delta * 2

    if (progress.current >= 1) {
      setHit(true)
      progress.current = 1
    }

    // Lerp position
    seedRef.current.position.x = THREE.MathUtils.lerp(position[0], target[0], progress.current)
    seedRef.current.position.y = THREE.MathUtils.lerp(position[1], target[1], progress.current)
    seedRef.current.position.z = THREE.MathUtils.lerp(position[2], target[2], progress.current)

    // Trail effect
    if (trailRef.current) {
      trailRef.current.scale.y = (1 - progress.current) * 2
    }
  })

  if (!fired) return null

  return (
    <group ref={seedRef} position={position}>
      {/* Seed body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
        <meshStandardMaterial
          color={hit ? "#00ff00" : "#ffcc00"}
          emissive={hit ? "#00ff00" : "#ffaa00"}
          emissiveIntensity={hit ? 2 : 1}
          metalness={0.8}
        />
      </mesh>

      {/* Trail */}
      {!hit && (
        <mesh ref={trailRef} position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.005, 0.02, 1, 8]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Impact glow */}
      {hit && (
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#00ff00" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  )
}

// Precision targeting scene
function TargetingScene() {
  const cancerTargets: [number, number, number][] = [
    [0.3, 0.1, 0.2],
    [-0.2, -0.1, 0.15],
    [0.1, 0.2, -0.1],
    [-0.15, 0, 0.3],
  ]

  const seedOrigins: [number, number, number][] = [
    [2, 1, 1],
    [-2, 0.5, 1],
    [1.5, 1.5, -1],
    [-1.5, 0.5, 2],
  ]

  return (
    <>
      <ambientLight intensity={0.3} />
      <spotLight position={[5, 5, 5]} angle={0.2} penumbra={1} intensity={1} />

      {/* Static prostate for targeting */}
      <ProstateGland showCancerSpots={true} animate={false} />

      {/* Targeting reticle */}
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[1.2, 1.25, 64]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
      </mesh>

      {/* Crosshairs */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot, i) => (
        <mesh key={i} rotation={[0, 0, rot]} position={[Math.cos(rot) * 1.4, Math.sin(rot) * 1.4, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.02]} />
          <meshBasicMaterial color="#00ff88" />
        </mesh>
      ))}

      {/* Radiation seeds firing */}
      {seedOrigins.map((origin, i) => (
        <RadiationSeed
          key={i}
          position={origin}
          target={cancerTargets[i]}
          delay={i * 500 + 1000}
        />
      ))}

      <Environment preset="city" />
    </>
  )
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          className="text-2xl font-bold tracking-tight"
          whileHover={{ scale: 1.02 }}
        >
          <span className="text-black">PRECISION</span>
          <span className="text-gray-400">ONCOLOGY</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          {['Technology', 'Research', 'About', 'Contact'].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-gray-600 hover:text-black transition-colors"
              whileHover={{ y: -2 }}
            >
              {item}
            </motion.a>
          ))}
        </div>

        <motion.button
          className="px-5 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </div>
    </motion.nav>
  )
}

function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white/80 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block px-4 py-1 bg-black/5 rounded-full text-sm text-gray-600 mb-6">
            Next-Generation Cancer Treatment
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight text-black mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Precision Targeting.
          <br />
          <span className="text-gray-400">Zero Collateral.</span>
        </motion.h1>

        <motion.p
          className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Revolutionary brachytherapy and TURP procedures that eliminate prostate cancer
          with surgical precision, preserving healthy tissue.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.button
            className="px-8 py-4 bg-black text-white rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Treatment
          </motion.button>
          <motion.button
            className="px-8 py-4 bg-white text-black border border-gray-200 rounded-full text-lg font-medium hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Watch Demo
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

function StatsSection() {
  const stats = [
    { value: '99.2%', label: 'Precision Rate' },
    { value: '<0.5mm', label: 'Targeting Accuracy' },
    { value: '15min', label: 'Average Procedure' },
    { value: '98%', label: 'Patient Satisfaction' },
  ]

  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TargetingSection() {
  const [isInView, setIsInView] = useState(false)

  return (
    <section className="py-32 bg-white" id="technology">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* 3D Targeting Demo */}
          <motion.div
            className="h-[500px] bg-gray-50 rounded-3xl overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onViewportEnter={() => setIsInView(true)}
          >
            <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
              <Suspense fallback={null}>
                {isInView && <TargetingScene />}
              </Suspense>
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm mb-6">
              Precision Brachytherapy
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Surgical Strike
              <br />
              <span className="text-gray-400">Against Cancer</span>
            </h2>

            <p className="text-gray-600 text-lg mb-8">
              Our radioactive seed implants deliver targeted radiation directly to cancer cells,
              like a precision-guided missile system. Each seed is placed with sub-millimeter
              accuracy, maximizing tumor destruction while protecting surrounding healthy tissue.
            </p>

            <div className="space-y-4">
              {[
                { icon: '🎯', title: 'Pinpoint Accuracy', desc: 'Sub-millimeter seed placement using real-time imaging' },
                { icon: '⚡', title: 'Rapid Treatment', desc: 'Outpatient procedure with minimal recovery time' },
                { icon: '🛡️', title: 'Tissue Preservation', desc: 'Minimal impact on urinary and sexual function' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="font-semibold text-black">{item.title}</h4>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function TURPSection() {
  return (
    <section className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-6">
            TURP Technology
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Minimally Invasive.
            <br />
            <span className="text-gray-400">Maximum Results.</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Transurethral resection combines with our precision targeting system
            to remove cancerous tissue with unprecedented accuracy.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Imaging & Mapping',
              desc: '3D reconstruction of the prostate identifies all cancer locations with millimeter precision.',
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              )
            },
            {
              step: '02',
              title: 'Precision Resection',
              desc: 'Computer-guided instruments remove only targeted tissue, preserving healthy structures.',
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0 0L12 12" />
                </svg>
              )
            },
            {
              step: '03',
              title: 'Seed Implantation',
              desc: 'Radioactive seeds are placed at calculated positions to eliminate remaining microscopic cancer.',
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-4xl font-bold text-gray-200">{item.step}</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{item.title}</h3>
              <p className="text-gray-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialSection() {
  const testimonials = [
    {
      quote: "The precision was remarkable. My cancer was eliminated with minimal side effects. I'm back to my normal life.",
      name: "Michael R.",
      role: "Patient, 62",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      quote: "As a urologist, I've never seen technology this accurate. It's changing how we approach prostate cancer treatment.",
      name: "Dr. Sarah Chen",
      role: "Chief of Urology",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
    },
  ]

  return (
    <section className="py-32 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-black mb-4">
            Trusted by Patients & Physicians
          </h2>
          <p className="text-gray-500">Real results from real people</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="p-8 bg-gray-50 rounded-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-lg text-gray-700 mb-6 italic">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-black">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-32 bg-black text-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center relative">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-white" />
        </div>

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Take
            <br />
            Precise Action?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto">
            Schedule a consultation to learn how our precision oncology
            can target your cancer with surgical accuracy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="px-8 py-4 bg-white text-black rounded-full text-lg font-medium hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Consultation
            </motion.button>
            <motion.button
              className="px-8 py-4 border border-white/30 text-white rounded-full text-lg font-medium hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-12 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-bold tracking-tight">
            <span className="text-black">PRECISION</span>
            <span className="text-gray-400">ONCOLOGY</span>
          </div>

          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
            <a href="#" className="hover:text-black transition-colors">Contact</a>
          </div>

          <div className="text-sm text-gray-400">
            © 2025 Precision Oncology. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function PrecisionOncologyPage() {
  return (
    <main className="bg-white min-h-screen">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <TargetingSection />
      <TURPSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </main>
  )
}
