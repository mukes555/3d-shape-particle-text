import * as THREE from 'three'

export const normalizeRgb = (value, fallback) => {
  if (!value) return fallback
  if (typeof value === 'string') {
    const c = new THREE.Color(value)
    return { r: c.r, g: c.g, b: c.b }
  }
  if (typeof value === 'object' && typeof value.r === 'number') return value
  return fallback
}

