import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const ShapeParticleText = ({
  text = 'AI',
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
  className = '',
  style = {}
}) => {
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const cleanupFunctionsRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error('ShapeParticleText: Canvas element not found')
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
        // Explicitly check for WebGL support first
        const contextAttributes = {
          alpha: true,
          antialias: true,
          powerPreference: 'default'
        }

        // Try getting context
        const context = canvas.getContext('webgl2', contextAttributes) || canvas.getContext('webgl', contextAttributes) || canvas.getContext('experimental-webgl', contextAttributes)

        if (!context) {
          console.error('ShapeParticleText: WebGL not supported in this environment')
          return
        }

        // --- ROBUST WEBGL MOCKING VIA INSTANCE PATCHING ---
        // Directly patch the context instance to ensure both main and fallback renderers use safe methods

        // Helper to check if already patched to avoid recursion/re-patching
        const isPatched = (obj, prop) => {
            const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
            return descriptor && !descriptor.writable && !descriptor.configurable; // Rough check, but mainly we want to avoid re-wrapping
        };

        // Patch getShaderPrecisionFormat
        if (!context.getShaderPrecisionFormat._isPatched) {
            const originalGetShaderPrecisionFormat = context.getShaderPrecisionFormat;
            const patchedGetShaderPrecisionFormat = function(...args) {
                // Always return a valid object to prevent crashes in unstable WebGL environments
                return { rangeMin: 127, rangeMax: 127, precision: 23 };
            };
            patchedGetShaderPrecisionFormat._isPatched = true;

            Object.defineProperty(context, 'getShaderPrecisionFormat', {
                value: patchedGetShaderPrecisionFormat,
                configurable: true
            });
        }

        // Patch getParameter
        if (!context.getParameter._isPatched) {
            const originalGetParameter = context.getParameter;
            const patchedGetParameter = function(...args) {
                let result = null;
                try {
                    result = originalGetParameter.apply(context, args);
                } catch(e) {}

                const pname = args[0];
                if (result === null || result === undefined) {
                    // Fallbacks
                    if (pname === 0x1F02) return 'WebGL 1.0 (Three.js Mock)'; // VERSION
                    if (pname === 0x8B8C) return 'WebGL GLSL ES 1.0 (Three.js Mock)'; // SHADING_LANGUAGE_VERSION
                    if (pname === 0x1F00) return 'Three.js Mock Vendor'; // VENDOR
                    if (pname === 0x1F01) return 'Three.js Mock Renderer'; // RENDERER

                    if (pname === 0x8869) return 16; // MAX_VERTEX_ATTRIBS
                    if (pname === 0x8872) return 16; // MAX_TEXTURE_IMAGE_UNITS
                    if (pname === 0x8B49) return 16; // MAX_VERTEX_TEXTURE_IMAGE_UNITS
                    if (pname === 0x8B4A) return 16; // MAX_COMBINED_TEXTURE_IMAGE_UNITS

                    return "";
                }
                return result;
            };
            patchedGetParameter._isPatched = true;

            Object.defineProperty(context, 'getParameter', {
                value: patchedGetParameter,
                configurable: true
            });
        }

        // Patch getExtension
        if (!context.getExtension._isPatched) {
            const originalGetExtension = context.getExtension;
            const patchedGetExtension = function(...args) {
                let result = null;
                try {
                    result = originalGetExtension.apply(context, args);
                } catch(e) {}

                if (result === null && args[0] === 'WEBGL_debug_renderer_info') {
                    return null; // Explicitly return null for debug info if missing
                }
                return result;
            };
            patchedGetExtension._isPatched = true;

            Object.defineProperty(context, 'getExtension', {
                value: patchedGetExtension,
                configurable: true
            });
        }

          renderer = new THREE.WebGLRenderer({
            canvas,
            context: context,
            precision: 'mediump',
            ...contextAttributes
          })

          // Force capabilities if they failed
          if (renderer.capabilities) {
              if (!renderer.capabilities.isWebGL2) renderer.capabilities.isWebGL2 = true;
              if (!renderer.capabilities.precision) renderer.capabilities.precision = 'mediump';
          }

        } catch (error) {
        console.warn('ShapeParticleText: Failed to initialize custom context renderer, attempting hard fallback...', error)
        try {
            // Hard fallback: Let Three.js try to handle everything with minimal settings
            // We need to create a fresh renderer instance, but if the context is tainted, this might fail too.
            // However, we can't easily create a new context on the same canvas if one exists.

            // Last resort: Just try to create it and hope for the best
            renderer = new THREE.WebGLRenderer({ canvas })
        } catch (fatalError) {
            console.error('ShapeParticleText: Fatal error initializing WebGL renderer:', fatalError)
            return
        }
      }

      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0) // Transparent background by default

      // Create rotating wireframe globe with brand color
      let globe = null

      if (showGlobe) {
        const globeGeometry = new THREE.SphereGeometry(2, 48, 48)

        let gColor
        if (globeColor) {
          gColor = typeof globeColor === 'string' ? new THREE.Color(globeColor) : new THREE.Color(globeColor.r, globeColor.g, globeColor.b)
        } else {
          gColor = new THREE.Color(primaryColor.r, primaryColor.g, primaryColor.b)
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

      // Create brain-shaped particle system
      const brainParticles = new THREE.Group()
      const positions = new Float32Array(particleCount * 3)
      const colors = new Float32Array(particleCount * 3)
      const sizes = new Float32Array(particleCount)
      const leftHemispherePoints = []
      const rightHemispherePoints = []

      // Arrays to store original brain positions and target text positions
      const brainPositions = []
      const textPositions = []

      // Generate realistic brain shape with many small particles
      let actualCount = 0
      for(let i = 0; i < particleCount; i++) {
        const side = i < particleCount / 2 ? -1 : 1 // Left or right hemisphere

        // Random spherical distribution for brain volume
        const phi = Math.random() * Math.PI
        const theta = Math.random() * Math.PI * 2

        // Brain proportions (ellipsoid)
        const radiusX = 1.4 + Math.random() * 0.3
        const radiusY = 1.2 + Math.random() * 0.2
        const radiusZ = 1.0 + Math.random() * 0.2

        let x = radiusX * Math.sin(phi) * Math.cos(theta)
        let y = radiusY * Math.sin(phi) * Math.sin(theta)
        let z = radiusZ * Math.cos(phi)

        // Add hemisphere offset
        x = x * 0.85 + side * 0.35

        // Add cortical folds/wrinkles for brain texture
        const wrinkle = (Math.sin(phi * 8) * Math.cos(theta * 6) +
                        Math.sin(phi * 12) * Math.sin(theta * 8)) * 0.12
        const r = Math.sqrt(x*x + y*y + z*z)
        if (r > 0.1) {
          x += wrinkle * (x / r)
          y += wrinkle * (y / r)
          z += wrinkle * (z / r)
        }

        // Only keep outer surface (cortex)
        const distance = Math.sqrt(x*x + y*y + z*z)
        if (distance < 1.0 || distance > 2.0) continue

        // Filter to show only outer hemisphere
        if ((side === -1 && x > -0.15) || (side === 1 && x < 0.15)) {
          continue
        }

        const point = new THREE.Vector3(x, y, z)
        if (point.x < 0) {
          leftHemispherePoints.push(point.clone())
        } else {
          rightHemispherePoints.push(point.clone())
        }

        positions[actualCount * 3] = point.x
        positions[actualCount * 3 + 1] = point.y
        positions[actualCount * 3 + 2] = point.z

        // Store brain position
        brainPositions.push(point.x, point.y, point.z)

        // Gradient coloring - Dynamic brand colors (brighter)
        const colorPos = (y + radiusY) / (radiusY * 2)
        if(colorPos < 0.3) {
          colors[actualCount * 3] = primaryColor.r * 0.5 + colorPos * 0.4
          colors[actualCount * 3 + 1] = primaryColor.g * 1.0 + colorPos * 0.05
          colors[actualCount * 3 + 2] = primaryColor.b * 1.0 + colorPos * 0.05
        } else if(colorPos < 0.6) {
          const mix = (colorPos - 0.3) / 0.3
          colors[actualCount * 3] = (primaryColor.r * (1 - mix) + secondaryColor.r * mix) * 1.1
          colors[actualCount * 3 + 1] = (primaryColor.g * (1 - mix) + secondaryColor.g * mix) * 1.1
          colors[actualCount * 3 + 2] = (primaryColor.b * (1 - mix) + secondaryColor.b * mix) * 1.1
        } else {
          colors[actualCount * 3] = secondaryColor.r * 1.0
          colors[actualCount * 3 + 1] = secondaryColor.g * 1.0
          colors[actualCount * 3 + 2] = secondaryColor.b * 1.0
        }

        sizes[actualCount] = Math.random() * 1.5 + 0.8
        actualCount++
      }

      // Generate text particle positions
      const generateTextParticles = (inputText, scale = 1.5) => {
        const textToRender = (inputText && inputText.trim().length > 0) ? inputText : 'AI'

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        // Increase canvas size to prevent cutoff and support higher resolution
        canvas.width = 1024
        canvas.height = 512

        ctx.fillStyle = 'white'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // Dynamic font sizing
        let fontSize = 350
        ctx.font = `bold ${fontSize}px Arial`

        // Measure and shrink if needed to fit width
        const maxTextWidth = canvas.width * 0.85
        let textMetrics = ctx.measureText(textToRender)

        while ((textMetrics.width > maxTextWidth || fontSize > canvas.height * 0.7) && fontSize > 20) {
            fontSize -= 10
            ctx.font = `bold ${fontSize}px Arial`
            textMetrics = ctx.measureText(textToRender)
        }

        ctx.fillText(textToRender, canvas.width / 2, canvas.height / 2)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const particles = []

        // Adjusted sampling for larger canvas (step 3 corresponds to ~1.5 on 500px width)
        const step = 3
        const scaleFactor = 220 // Adjusted divisor for larger canvas (approx 110 * 2)

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity

        for (let y = 0; y < canvas.height; y += step) {
          for (let x = 0; x < canvas.width; x += step) {
            const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4
            if (imageData.data[index + 3] > 160) { // Moderate alpha threshold
              const pX = (x - canvas.width / 2) / scaleFactor * scale
              const pY = -(y - canvas.height / 2) / scaleFactor * scale
              const pZ = (Math.random() - 0.5) * 0.25

              particles.push({ x: pX, y: pY, z: pZ })

              if (pX < minX) minX = pX
              if (pX > maxX) maxX = pX
              if (pY < minY) minY = pY
              if (pY > maxY) maxY = pY
            }
          }
        }

        // AUTO-FIT LOGIC: strictly enforce globe boundaries
        // Calculate current dimensions
        const currentWidth = maxX - minX
        const currentHeight = maxY - minY

        // Target max width/height to fit safely inside the globe (radius ~2)
        // We use 3.2 as max width (leaving padding) and 2.5 as max height
        const targetMaxWidth = 3.2
        const targetMaxHeight = 2.5

        let finalScale = 1.0
        if (currentWidth > targetMaxWidth) {
            finalScale = targetMaxWidth / currentWidth
        }
        // Also check height but width is usually the bottleneck for text
        if (currentHeight * finalScale > targetMaxHeight) {
            finalScale = targetMaxHeight / currentHeight
        }

        // Apply scaling if needed
        if (finalScale < 1.0) {
            particles.forEach(p => {
                p.x *= finalScale
                p.y *= finalScale
                p.z *= finalScale // Scale depth too to maintain aspect ratio feel
            })
        }

        return particles
      }

      const textParticlesData = generateTextParticles(text, 1.8)

      // Assign text positions to particles
      // Smart downsampling: If text has more particles than brain (actualCount),
      // we must downsample the text to fit the available particles without cutting off the end.
      if (textParticlesData.length > 0) {
        if (textParticlesData.length > actualCount) {
          // Downsample
          const step = textParticlesData.length / actualCount
          for (let i = 0; i < actualCount; i++) {
            const index = Math.floor(i * step)
            // Safety check
            const p = textParticlesData[Math.min(index, textParticlesData.length - 1)]
            textPositions.push(p.x, p.y, p.z)
          }
        } else {
          // Normal mapping + filler
          for (let i = 0; i < actualCount; i++) {
            if (i < textParticlesData.length) {
              textPositions.push(
                textParticlesData[i].x,
                textParticlesData[i].y,
                textParticlesData[i].z
              )
            } else {
              // For extra particles, distribute them randomly around the text
              const randomTextParticle = textParticlesData[Math.floor(Math.random() * textParticlesData.length)]
              textPositions.push(
                randomTextParticle.x + (Math.random() - 0.5) * 0.5,
                randomTextParticle.y + (Math.random() - 0.5) * 0.5,
                randomTextParticle.z + (Math.random() - 0.5) * 0.3
              )
            }
          }
        }
      } else {
          // Fallback if no text particles (shouldn't happen usually)
          for(let i=0; i < actualCount; i++) {
              textPositions.push(0, 0, 0);
          }
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
      const connectionColor = new THREE.Color(secondaryColor.r, secondaryColor.g, secondaryColor.b)
      const linesMaterial = new THREE.LineBasicMaterial({
        color: connectionColor,
        transparent: true,
        opacity: 0.2
      })

      const connectionLines = new THREE.Group()
      const availableLeft = leftHemispherePoints.length
      const availableRight = rightHemispherePoints.length

      if (availableLeft > 0 && availableRight > 0) {
        for (let i = 0; i < 80; i++) {
          const start = leftHemispherePoints[Math.floor(Math.random() * availableLeft)]?.clone()
          const end = rightHemispherePoints[Math.floor(Math.random() * availableRight)]?.clone()

          if (!start || !end) continue

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

      const randomOffsetVector = (strength) => new THREE.Vector3(
        (Math.random() - 0.5) * strength,
        (Math.random() - 0.5) * strength,
        (Math.random() - 0.5) * strength
      )

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

        const control1 = start.clone().lerp(end, 0.3).add(randomOffsetVector(zapSpread))
        const control2 = start.clone().lerp(end, 0.7).add(randomOffsetVector(zapSpread))

        const curve = new THREE.CatmullRomCurve3([start, control1, control2, end])
        // TubeGeometry for thickness
        const geometry = new THREE.TubeGeometry(curve, 12, zapWidth, 4, false)

        let color
        if (lightningColor) {
            // Use specific color if provided
            if (lightningColor.r !== undefined) {
                color = new THREE.Color(lightningColor.r, lightningColor.g, lightningColor.b)
            } else {
                color = new THREE.Color(lightningColor)
            }
        } else {
            // Default random bluish/white lightning
            color = new THREE.Color().setHSL(0.7 + Math.random() * 0.08, 1, 0.7 + Math.random() * 0.15)
        }

        const material = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending
        })

        const line = new THREE.Mesh(geometry, material)
        lightningGroup.add(line)

        lightningSegments.push({
          line,
          material,
          life: 0,
          maxLife: 0.5 + Math.random() * 0.9,
          flickerSpeed: 18 + Math.random() * 20,
          phase: Math.random() * Math.PI * 2
        })
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
              positionAttribute.array[i3] = brainPositions[i3] + (textPositions[i3] - brainPositions[i3]) * easeProgress
              positionAttribute.array[i3 + 1] = brainPositions[i3 + 1] + (textPositions[i3 + 1] - brainPositions[i3 + 1]) * easeProgress
              positionAttribute.array[i3 + 2] = brainPositions[i3 + 2] + (textPositions[i3 + 2] - brainPositions[i3 + 2]) * easeProgress
            } else {
              positionAttribute.array[i3] = textPositions[i3] + (brainPositions[i3] - textPositions[i3]) * easeProgress
              positionAttribute.array[i3 + 1] = textPositions[i3 + 1] + (brainPositions[i3 + 1] - textPositions[i3 + 1]) * easeProgress
              positionAttribute.array[i3 + 2] = textPositions[i3 + 2] + (brainPositions[i3 + 2] - textPositions[i3 + 2]) * easeProgress
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
          console.error('Cleanup error:', error)
        }
      })
    }
  }, [text, particleCount, particleSize, primaryColor, secondaryColor, morphDuration, rotationSpeed, hoverIntensity, lightningIntensity, lightningColor, zapSpread, zapWidth, cameraDistance, globeOpacity, globeColor, showGlobe, glowEffect])

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: transparent ? 'transparent' : backgroundColor, ...style }}>
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
