import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { normalizeRgb } from './shapeParticleText/colors'
import { createDebugLogger } from './shapeParticleText/debug'
import { createLightningSegment } from './shapeParticleText/lightning'
import { createThreeRendererWithFallback } from './shapeParticleText/renderer'
import { clamp01, resolveShapePoints } from './shapeParticleText/shapes'
import { fillTextPositions, generateTextParticles } from './shapeParticleText/textParticles'

const ShapeParticleText = ({
  text = 'AI',
  shape = 'brain',
  shapePoints = null,
  particleCount = 24000,
  particleSize = 0.01,
  primaryColor = { r: 0.396, g: 0.239, b: 0.820 }, // #653DD1
  secondaryColor = { r: 0.537, g: 0.239, b: 0.820 }, // Purple variant
  backgroundColor = '#000000',
  transparent = false,
  morphDuration = 2.5,
  rotationSpeed = 0.4,
  hoverIntensity = 0.05,
  lightningIntensity = 1.0,
  lightningColor = null, // Optional hex or {r,g,b} object. If null, uses random colors
  zapSpread = 0.7, // Amplitude/Spread of lightning
  zapWidth = 0.02, // Thickness of lightning
  cameraDistance = 5.5,
  globeOpacity = 0.08,
  globeColor = null, // Optional override for globe color
  showGlobe = true,
  glowEffect = true,
  debug = false,
  className = '',
  style = {},
  ...rest
}) => {
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const log = createDebugLogger(debug)
    if (!canvas) {
      log.error('ShapeParticleText: Canvas element not found')
      return
    }

    let isComponentMounted = true
    const cleanupFunctions = []

    // Check if Three.js is already loaded
    const initializeScene = () => {
      if (!isComponentMounted) return

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(50, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000)

      let renderer
      try {
        const contextAttributes = {
          alpha: true,
          antialias: true,
          powerPreference: 'default'
        }

        let context = null
        try {
          context =
            canvas.getContext('webgl2', contextAttributes) ||
            canvas.getContext('webgl', contextAttributes) ||
            canvas.getContext('experimental-webgl', contextAttributes)
        } catch {
          context = null
        }

        if (!context) {
          log.error('ShapeParticleText: WebGL not supported in this environment')
          return
        }

        renderer = createThreeRendererWithFallback({ canvas, context, contextAttributes, log })
        if (!renderer) return
      } catch (error) {
        log.error('ShapeParticleText: Unexpected error initializing scene:', error)
        return
      }

      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0) // Transparent background by default

      const primaryRgb = normalizeRgb(primaryColor, { r: 0.396, g: 0.239, b: 0.82 })
      const secondaryRgb = normalizeRgb(secondaryColor, { r: 0.537, g: 0.239, b: 0.82 })

      let globe = null

      // Create brain-shaped particle system
      const brainParticles = new THREE.Group()
      const positions = new Float32Array(particleCount * 3)
      const colors = new Float32Array(particleCount * 3)
      const sizes = new Float32Array(particleCount)

      const shapeData = resolveShapePoints({ shape, shapePoints, particleCount })
      const leftHemispherePoints = shapeData.leftHemispherePoints || []
      const rightHemispherePoints = shapeData.rightHemispherePoints || []
      const allPoints = shapeData.points || []

      const fromPositions = []
      const textPositions = []

      const actualCount = allPoints.length
      let maxFromSq = 0
      for (let i = 0; i < actualCount; i++) {
        const d2 = allPoints[i].lengthSq()
        if (d2 > maxFromSq) maxFromSq = d2
      }

      const textParticlesData = generateTextParticles(text, 1.8)
      textPositions.push(...fillTextPositions({ textParticlesData, actualCount }))

      let maxTextSq = 0
      for (let i = 0; i + 2 < textPositions.length; i += 3) {
        const x = textPositions[i]
        const y = textPositions[i + 1]
        const z = textPositions[i + 2]
        const d2 = x * x + y * y + z * z
        if (d2 > maxTextSq) maxTextSq = d2
      }

      const globeRadius = 2
      const contentRadius = Math.sqrt(Math.max(maxFromSq, maxTextSq))
      const targetContentRadius = globeRadius * 0.94
      const contentScale = contentRadius > 0 ? targetContentRadius / contentRadius : 1

      if (contentScale !== 1) {
        for (let i = 0; i < actualCount; i++) {
          allPoints[i].multiplyScalar(contentScale)
        }
        for (let i = 0; i < leftHemispherePoints.length; i++) {
          leftHemispherePoints[i].multiplyScalar(contentScale)
        }
        for (let i = 0; i < rightHemispherePoints.length; i++) {
          rightHemispherePoints[i].multiplyScalar(contentScale)
        }
        for (let i = 0; i + 2 < textPositions.length; i += 3) {
          textPositions[i] *= contentScale
          textPositions[i + 1] *= contentScale
          textPositions[i + 2] *= contentScale
        }
      }

      for (let i = 0; i < actualCount; i++) {
        const point = allPoints[i]
        const i3 = i * 3

        positions[i3] = point.x
        positions[i3 + 1] = point.y
        positions[i3 + 2] = point.z

        fromPositions[i3] = point.x
        fromPositions[i3 + 1] = point.y
        fromPositions[i3 + 2] = point.z

        const colorPos = clamp01((point.y + 2.0) / 4.0)
        if (colorPos < 0.3) {
          colors[i3] = primaryRgb.r * 0.5 + colorPos * 0.4
          colors[i3 + 1] = primaryRgb.g * 1.0 + colorPos * 0.05
          colors[i3 + 2] = primaryRgb.b * 1.0 + colorPos * 0.05
        } else if (colorPos < 0.6) {
          const mix = (colorPos - 0.3) / 0.3
          colors[i3] = (primaryRgb.r * (1 - mix) + secondaryRgb.r * mix) * 1.1
          colors[i3 + 1] = (primaryRgb.g * (1 - mix) + secondaryRgb.g * mix) * 1.1
          colors[i3 + 2] = (primaryRgb.b * (1 - mix) + secondaryRgb.b * mix) * 1.1
        } else {
          colors[i3] = secondaryRgb.r * 1.0
          colors[i3 + 1] = secondaryRgb.g * 1.0
          colors[i3 + 2] = secondaryRgb.b * 1.0
        }

        sizes[i] = Math.random() * 1.5 + 0.8
      }

      if (showGlobe) {
        const globeGeometry = new THREE.SphereGeometry(globeRadius, 48, 48)

        let gColor
        if (globeColor) {
          gColor = typeof globeColor === 'string' ? new THREE.Color(globeColor) : new THREE.Color(globeColor.r, globeColor.g, globeColor.b)
        } else {
          gColor = new THREE.Color(primaryRgb.r, primaryRgb.g, primaryRgb.b)
        }

        const globeMaterial = new THREE.MeshBasicMaterial({
          color: gColor,
          wireframe: true,
          transparent: true,
          opacity: globeOpacity
        })
        globe = new THREE.Mesh(globeGeometry, globeMaterial)
        scene.add(globe)
      }

      const trimmedPositions = positions.slice(0, actualCount * 3)
      const trimmedColors = colors.slice(0, actualCount * 3)
      const trimmedSizes = sizes.slice(0, actualCount)

      const particlesGeometry = new THREE.BufferGeometry()
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(trimmedPositions, 3))
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(trimmedColors, 3))
      particlesGeometry.setAttribute('size', new THREE.BufferAttribute(trimmedSizes, 1))
      particlesGeometry.setDrawRange(0, actualCount)

      const particlesMaterial = new THREE.PointsMaterial({
        size: particleSize,
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        blending: glowEffect ? THREE.AdditiveBlending : THREE.NormalBlending,
        sizeAttenuation: true
      })

      const particles = new THREE.Points(particlesGeometry, particlesMaterial)
      brainParticles.add(particles)
      scene.add(brainParticles)

      // Neural connections (synapses)
      const connectionColor = new THREE.Color(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b)
      const linesMaterial = new THREE.LineBasicMaterial({
        color: connectionColor,
        transparent: true,
        opacity: 0.2
      })

      const connectionLines = new THREE.Group()
      const availableLeft = leftHemispherePoints.length
      const availableRight = rightHemispherePoints.length

      if (shape === 'brain' && availableLeft > 0 && availableRight > 0) {
        for (let i = 0; i < 80; i++) {
          const start = leftHemispherePoints[Math.floor(Math.random() * availableLeft)]?.clone()
          const end = rightHemispherePoints[Math.floor(Math.random() * availableRight)]?.clone()

          if (!start || !end) continue

          const lineGeometry = new THREE.BufferGeometry().setFromPoints([start, end])
          const line = new THREE.Line(lineGeometry, linesMaterial)
          connectionLines.add(line)
        }
      } else if (allPoints.length > 1) {
        for (let i = 0; i < 80; i++) {
          const start = allPoints[Math.floor(Math.random() * allPoints.length)]?.clone()
          const end = allPoints[Math.floor(Math.random() * allPoints.length)]?.clone()
          if (!start || !end) continue
          if (start.distanceToSquared(end) < 0.5) continue

          const lineGeometry = new THREE.BufferGeometry().setFromPoints([start, end])
          const line = new THREE.Line(lineGeometry, linesMaterial)
          connectionLines.add(line)
        }
      }
      brainParticles.add(connectionLines)

      const lightningGroup = new THREE.Group()
      brainParticles.add(lightningGroup)

      const lightningSegments = []
      let lightningCooldown = 0
      const maxLightningSegments = 6

      const spawnLightning = () => {
        if (!isComponentMounted || !actualCount) return

        // Pick two random particles from the current active set
        const idx1 = Math.floor(Math.random() * actualCount)
        const idx2 = Math.floor(Math.random() * actualCount)

        // Read CURRENT position from the geometry attributes (updated during animation)
        const posAttr = particlesGeometry.attributes.position.array

        const start = new THREE.Vector3(posAttr[idx1 * 3], posAttr[idx1 * 3 + 1], posAttr[idx1 * 3 + 2])
        const end = new THREE.Vector3(posAttr[idx2 * 3], posAttr[idx2 * 3 + 1], posAttr[idx2 * 3 + 2])

        // Ensure we aren't connecting to 0,0,0 (hidden particles) or extremely close points
        if (start.lengthSq() < 0.1 || end.lengthSq() < 0.1 || start.distanceToSquared(end) < 0.5) return

        const { line, segment } = createLightningSegment({ start, end, zapSpread, zapWidth, lightningColor })
        lightningGroup.add(line)
        lightningSegments.push(segment)
      }

      const clock = new THREE.Clock()
      camera.position.set(0, 0, cameraDistance)

      // Mouse interaction
      const mouse = { x: 0, y: 0 }
      const targetRotation = { x: 0, y: 0 }
      const currentRotation = { x: 0, y: 0 }

      const handleMouseMove = (event) => {
        if (!canvas) return
        const rect = canvas.getBoundingClientRect()
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

        targetRotation.y = mouse.x * 0.3 * (hoverIntensity / 0.05)
        targetRotation.x = mouse.y * 0.2 * (hoverIntensity / 0.05)
      }

      canvas.addEventListener('mousemove', handleMouseMove)
      cleanupFunctions.push(() => {
        canvas.removeEventListener('mousemove', handleMouseMove)
      })

      // Animation
      let time = 0
      // const maxRotationY = 0.12 // replaced by rotationSpeed prop
      const maxRotationX = 0.08

      let morphProgress = 0
      let morphDirection = 1
      const holdDuration = 3.0
      let holdTimer = holdDuration

      function animate() {
        if (!isComponentMounted) return
        animationFrameRef.current = requestAnimationFrame(animate)

        const delta = clock.getDelta()
        time += delta

        // Smooth mouse interaction
        currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05
        currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05

        if (globe) {
          globe.rotation.y += delta * 0.1
          globe.rotation.x = Math.sin(time * 0.3) * 0.03
        }

        brainParticles.rotation.y = Math.sin(time * 0.4) * rotationSpeed + currentRotation.y
        brainParticles.rotation.x = Math.sin(time * 0.25) * maxRotationX + currentRotation.x
        brainParticles.rotation.z = Math.cos(time * 0.15) * 0.015

        // Morphing animation logic
        holdTimer -= delta
        if (holdTimer <= 0) {
          morphProgress += delta / morphDuration

          if (morphProgress >= 1.0) {
            morphProgress = 0
            morphDirection *= -1
            holdTimer = holdDuration
          }

          const easeProgress = morphProgress < 0.5
            ? 2 * morphProgress * morphProgress
            : 1 - Math.pow(-2 * morphProgress + 2, 2) / 2

          const positionAttribute = particlesGeometry.attributes.position
          for (let i = 0; i < actualCount; i++) {
            const i3 = i * 3

            if (morphDirection === 1) {
              positionAttribute.array[i3] = fromPositions[i3] + (textPositions[i3] - fromPositions[i3]) * easeProgress
              positionAttribute.array[i3 + 1] = fromPositions[i3 + 1] + (textPositions[i3 + 1] - fromPositions[i3 + 1]) * easeProgress
              positionAttribute.array[i3 + 2] = fromPositions[i3 + 2] + (textPositions[i3 + 2] - fromPositions[i3 + 2]) * easeProgress
            } else {
              positionAttribute.array[i3] = textPositions[i3] + (fromPositions[i3] - textPositions[i3]) * easeProgress
              positionAttribute.array[i3 + 1] = textPositions[i3 + 1] + (fromPositions[i3 + 1] - textPositions[i3 + 1]) * easeProgress
              positionAttribute.array[i3 + 2] = textPositions[i3 + 2] + (fromPositions[i3 + 2] - textPositions[i3 + 2]) * easeProgress
            }
          }
          positionAttribute.needsUpdate = true
        }

        // Lightning effects
        lightningCooldown -= delta
        // Adjust frequency based on lightningIntensity
        // Higher intensity -> faster cooldown -> more lightning
        if (lightningIntensity > 0 && lightningCooldown <= 0 && lightningSegments.length < maxLightningSegments * lightningIntensity) {
          spawnLightning()
          lightningCooldown = (0.12 + Math.random() * 0.25) / Math.max(0.1, lightningIntensity)
        }

        for (let i = lightningSegments.length - 1; i >= 0; i--) {
          const segment = lightningSegments[i]
          if (!segment || !segment.material) continue

          segment.life += delta
          const progress = segment.life / segment.maxLife
          const baseOpacity = Math.pow(Math.max(0, 1 - progress), 1.5)
          const flicker = 0.6 + Math.sin(time * segment.flickerSpeed + segment.phase) * 0.4
          segment.material.opacity = Math.max(0, baseOpacity * flicker * Math.min(1, lightningIntensity))

          if (segment.life >= segment.maxLife) {
            lightningGroup.remove(segment.line)
            if (segment.line.geometry) segment.line.geometry.dispose()
            if (segment.material) segment.material.dispose()
            lightningSegments.splice(i, 1)
          }
        }

        // Ensure scene is rendered

        renderer.render(scene, camera)
      }

      animate()

      const handleResize = () => {
        if (!isComponentMounted || !canvas) return
        const width = canvas.offsetWidth
        const height = canvas.offsetHeight
        if (width === 0 || height === 0) return
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio * 1.5, 3))
      }

      window.addEventListener('resize', handleResize)

      cleanupFunctions.push(() => {
        window.removeEventListener('resize', handleResize)

        lightningSegments.forEach((segment) => {
          if (segment.line) {
            lightningGroup.remove(segment.line)
            if (segment.line.geometry) segment.line.geometry.dispose()
            if (segment.material) segment.material.dispose()
          }
        })
        lightningSegments.length = 0

        scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose()
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose())
            } else {
              object.material.dispose()
            }
          }
        })

        renderer.dispose()
        // renderer.forceContextLoss() // Do NOT force context loss as it persists across re-mounts in Strict Mode
      })
    }

    // Try to use window.THREE if available (from CDN), otherwise wait or use import
    // In this package version, we expect THREE to be available via import (handled at top)
    // But we kept the dynamic check structure just in case
    initializeScene()

    return () => {
      isComponentMounted = false
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      cleanupFunctions.forEach(cleanup => {
        try {
          cleanup()
        } catch (error) {
          log.error('Cleanup error:', error)
        }
      })
    }
  }, [text, shape, shapePoints, particleCount, particleSize, primaryColor, secondaryColor, morphDuration, rotationSpeed, hoverIntensity, lightningIntensity, lightningColor, zapSpread, zapWidth, cameraDistance, globeOpacity, globeColor, showGlobe, glowEffect, debug])

  return (
    <div
      {...rest}
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: transparent ? 'transparent' : backgroundColor, ...style }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          outline: 'none'
        }}
      />
    </div>
  )
}

export default ShapeParticleText
