import * as THREE from 'three'

const patchWebGLContextForThree = (context) => {
  if (!context || context.__shapeParticleTextPatched) return
  Object.defineProperty(context, '__shapeParticleTextPatched', {
    value: true,
    configurable: true
  })

  if (typeof context.getShaderPrecisionFormat === 'function' && !context.getShaderPrecisionFormat.__shapeParticleTextPatched) {
    const original = context.getShaderPrecisionFormat.bind(context)
    const patched = (...args) => {
      try {
        const result = original(...args)
        if (result && typeof result.precision === 'number') return result
      } catch {}
      return { rangeMin: 127, rangeMax: 127, precision: 23 }
    }
    Object.defineProperty(patched, '__shapeParticleTextPatched', { value: true })
    Object.defineProperty(context, 'getShaderPrecisionFormat', { value: patched, configurable: true })
  }

  if (typeof context.getParameter === 'function' && !context.getParameter.__shapeParticleTextPatched) {
    const original = context.getParameter.bind(context)
    const patched = (...args) => {
      let result
      try {
        result = original(...args)
      } catch {
        result = undefined
      }

      const pname = args[0]
      if (result === null || result === undefined) {
        if (pname === 0x1F02) return 'WebGL 1.0 (Three.js Mock)'
        if (pname === 0x8B8C) return 'WebGL GLSL ES 1.0 (Three.js Mock)'
        if (pname === 0x1F00) return 'Three.js Mock Vendor'
        if (pname === 0x1F01) return 'Three.js Mock Renderer'
        if (pname === 0x8869) return 16
        if (pname === 0x8872) return 16
        if (pname === 0x8B49) return 16
        if (pname === 0x8B4A) return 16
        return ''
      }

      return result
    }
    Object.defineProperty(patched, '__shapeParticleTextPatched', { value: true })
    Object.defineProperty(context, 'getParameter', { value: patched, configurable: true })
  }

  if (typeof context.getExtension === 'function' && !context.getExtension.__shapeParticleTextPatched) {
    const original = context.getExtension.bind(context)
    const patched = (...args) => {
      let result
      try {
        result = original(...args)
      } catch {
        result = null
      }

      if (result === null && args[0] === 'WEBGL_debug_renderer_info') return null
      return result
    }
    Object.defineProperty(patched, '__shapeParticleTextPatched', { value: true })
    Object.defineProperty(context, 'getExtension', { value: patched, configurable: true })
  }
}

const createWebGLRenderer = ({ canvas, context, contextAttributes, log }) => {
  try {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      context,
      precision: 'mediump',
      ...contextAttributes
    })

    if (renderer.capabilities) {
      if (!renderer.capabilities.isWebGL2) renderer.capabilities.isWebGL2 = true
      if (!renderer.capabilities.precision) renderer.capabilities.precision = 'mediump'
    }

    return renderer
  } catch (error) {
    log.warn('ShapeParticleText: Failed to initialize WebGL renderer', error)
    return null
  }
}

export const createThreeRendererWithFallback = ({ canvas, context, contextAttributes, log }) => {
  const firstAttempt = createWebGLRenderer({ canvas, context, contextAttributes, log: { warn: () => {} } })
  if (firstAttempt) return firstAttempt

  patchWebGLContextForThree(context)
  const patchedAttempt = createWebGLRenderer({ canvas, context, contextAttributes, log })
  if (patchedAttempt) return patchedAttempt

  log.warn('ShapeParticleText: Failed to initialize custom context renderer, attempting hard fallback...')
  try {
    return new THREE.WebGLRenderer({ canvas })
  } catch (fatalError) {
    log.error('ShapeParticleText: Fatal error initializing WebGL renderer:', fatalError)
    return null
  }
}

