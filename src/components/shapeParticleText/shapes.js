import * as THREE from 'three'

export const clamp01 = (n) => (n < 0 ? 0 : n > 1 ? 1 : n)

const parseShapePoints = (shapePoints) => {
  if (!shapePoints) return []

  if (shapePoints instanceof Float32Array) {
    const points = []
    for (let i = 0; i + 2 < shapePoints.length; i += 3) {
      points.push(new THREE.Vector3(shapePoints[i], shapePoints[i + 1], shapePoints[i + 2]))
    }
    return points
  }

  if (Array.isArray(shapePoints) && shapePoints.length > 0) {
    if (typeof shapePoints[0] === 'number') {
      const points = []
      for (let i = 0; i + 2 < shapePoints.length; i += 3) {
        points.push(new THREE.Vector3(shapePoints[i], shapePoints[i + 1], shapePoints[i + 2]))
      }
      return points
    }

    const points = []
    for (const p of shapePoints) {
      if (!p) continue
      if (typeof p.x === 'number' && typeof p.y === 'number' && typeof p.z === 'number') {
        points.push(new THREE.Vector3(p.x, p.y, p.z))
      }
    }
    return points
  }

  return []
}

const samplePointsToCount = ({ points, count }) => {
  if (!points || points.length === 0 || count <= 0) return []
  if (points.length === count) return points.slice()

  const sampled = []
  if (points.length > count) {
    const step = points.length / count
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(i * step)
      sampled.push(points[Math.min(idx, points.length - 1)].clone())
    }
    return sampled
  }

  for (let i = 0; i < count; i++) {
    sampled.push(points[i % points.length].clone())
  }
  return sampled
}

const generateBrainPoints = (count) => {
  const points = []
  const leftHemispherePoints = []
  const rightHemispherePoints = []

  const maxAttempts = Math.max(2000, count * 12)
  let attempts = 0

  while (points.length < count && attempts < maxAttempts) {
    const i = points.length
    const side = i < count / 2 ? -1 : 1

    const phi = Math.random() * Math.PI
    const theta = Math.random() * Math.PI * 2

    const radiusX = 1.4 + Math.random() * 0.3
    const radiusY = 1.2 + Math.random() * 0.2
    const radiusZ = 1.0 + Math.random() * 0.2

    let x = radiusX * Math.sin(phi) * Math.cos(theta)
    let y = radiusY * Math.sin(phi) * Math.sin(theta)
    let z = radiusZ * Math.cos(phi)

    x = x * 0.85 + side * 0.35

    const wrinkle = (Math.sin(phi * 8) * Math.cos(theta * 6) + Math.sin(phi * 12) * Math.sin(theta * 8)) * 0.12
    const r = Math.sqrt(x * x + y * y + z * z)
    if (r > 0.1) {
      x += wrinkle * (x / r)
      y += wrinkle * (y / r)
      z += wrinkle * (z / r)
    }

    const distance = Math.sqrt(x * x + y * y + z * z)
    if (distance < 1.0 || distance > 2.0) {
      attempts++
      continue
    }

    if ((side === -1 && x > -0.15) || (side === 1 && x < 0.15)) {
      attempts++
      continue
    }

    const point = new THREE.Vector3(x, y, z)
    points.push(point)
    if (point.x < 0) leftHemispherePoints.push(point.clone())
    else rightHemispherePoints.push(point.clone())

    attempts++
  }

  return { points, leftHemispherePoints, rightHemispherePoints }
}

const generateSpherePoints = (count) => {
  const points = []
  const radius = 1.75
  for (let i = 0; i < count; i++) {
    const u = Math.random()
    const v = Math.random()
    const theta = 2 * Math.PI * u
    const phi = Math.acos(2 * v - 1)
    const r = radius + (Math.random() - 0.5) * 0.06
    const sinPhi = Math.sin(phi)
    const x = r * sinPhi * Math.cos(theta)
    const y = r * sinPhi * Math.sin(theta)
    const z = r * Math.cos(phi)
    points.push(new THREE.Vector3(x, y, z))
  }
  return { points, leftHemispherePoints: [], rightHemispherePoints: [] }
}

const generateTorusPoints = (count) => {
  const points = []
  const majorR = 1.25
  const tubeR = 0.55
  for (let i = 0; i < count; i++) {
    const u = Math.random() * 2 * Math.PI
    const v = Math.random() * 2 * Math.PI
    const cosV = Math.cos(v)
    const sinV = Math.sin(v)
    const r = majorR + tubeR * cosV
    const x = r * Math.cos(u)
    const y = r * Math.sin(u)
    const z = tubeR * sinV
    points.push(new THREE.Vector3(x, y, z))
  }
  return { points, leftHemispherePoints: [], rightHemispherePoints: [] }
}

const generateTorusKnotPoints = (count) => {
  const points = []
  const p = 2
  const q = 3
  const majorR = 1.15
  const tubeR = 0.28

  const tmpTangent = new THREE.Vector3()
  const tmpNormal = new THREE.Vector3()
  const tmpBinormal = new THREE.Vector3()
  const up = new THREE.Vector3(0, 1, 0)

  const posAt = (t) => {
    const ct = Math.cos(t)
    const st = Math.sin(t)
    const cqt = Math.cos(q * t)
    const sqt = Math.sin(q * t)
    const r = majorR + tubeR * cqt * 1.25
    return new THREE.Vector3(r * Math.cos(p * t), r * Math.sin(p * t), tubeR * sqt * 1.35)
  }

  const eps = 0.0008
  for (let i = 0; i < count; i++) {
    const t = (i / count) * 2 * Math.PI
    const center = posAt(t)
    const ahead = posAt(t + eps)

    tmpTangent.copy(ahead).sub(center).normalize()
    tmpNormal.crossVectors(up, tmpTangent)
    if (tmpNormal.lengthSq() < 1e-6) tmpNormal.set(1, 0, 0)
    tmpNormal.normalize()
    tmpBinormal.crossVectors(tmpTangent, tmpNormal).normalize()

    const a = Math.random() * 2 * Math.PI
    const r = 0.32 + (Math.random() - 0.5) * 0.06
    const offset = tmpNormal.clone().multiplyScalar(Math.cos(a) * r).add(tmpBinormal.clone().multiplyScalar(Math.sin(a) * r))

    points.push(center.add(offset))
  }

  const scale = 1.55
  points.forEach((p) => p.multiplyScalar(scale))
  return { points, leftHemispherePoints: [], rightHemispherePoints: [] }
}

const generateCubePoints = (count) => {
  const points = []
  const half = 1.6
  for (let i = 0; i < count; i++) {
    const face = Math.floor(Math.random() * 6)
    const u = (Math.random() * 2 - 1) * half
    const v = (Math.random() * 2 - 1) * half
    const jitter = (Math.random() - 0.5) * 0.03
    let x = 0
    let y = 0
    let z = 0

    if (face === 0) {
      x = half
      y = u
      z = v
    } else if (face === 1) {
      x = -half
      y = u
      z = v
    } else if (face === 2) {
      y = half
      x = u
      z = v
    } else if (face === 3) {
      y = -half
      x = u
      z = v
    } else if (face === 4) {
      z = half
      x = u
      y = v
    } else {
      z = -half
      x = u
      y = v
    }

    points.push(new THREE.Vector3(x + jitter, y + jitter, z + jitter))
  }

  return { points, leftHemispherePoints: [], rightHemispherePoints: [] }
}

const generateHeartPoints = (count) => {
  const points = []
  const scale = 0.09
  for (let i = 0; i < count; i++) {
    const t = Math.random() * 2 * Math.PI
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)

    const z = (Math.random() - 0.5) * 6
    const p = new THREE.Vector3(x, y, z).multiplyScalar(scale)
    p.x *= 1.25
    p.y *= 1.25
    points.push(p)
  }

  const rot = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, 0, 0))
  points.forEach((p) => p.applyQuaternion(rot))
  return { points, leftHemispherePoints: [], rightHemispherePoints: [] }
}

const generateHelixPoints = (count) => {
  const points = []
  const turns = 3.2
  const height = 3.4
  const radius = 1.05
  const tube = 0.18

  for (let i = 0; i < count; i++) {
    const t = Math.random() * 2 * Math.PI * turns
    const strand = Math.random() < 0.5 ? 0 : Math.PI
    const a = t + strand

    const x = Math.cos(a) * radius
    const z = Math.sin(a) * radius
    const y = (t / (2 * Math.PI * turns) - 0.5) * height

    const jitterA = Math.random() * 2 * Math.PI
    const jitterR = (Math.random() - 0.5) * tube
    const px = x + Math.cos(jitterA) * jitterR
    const py = y + (Math.random() - 0.5) * tube
    const pz = z + Math.sin(jitterA) * jitterR
    points.push(new THREE.Vector3(px, py, pz))
  }

  const scale = 1.25
  points.forEach((p) => p.multiplyScalar(scale))
  return { points, leftHemispherePoints: [], rightHemispherePoints: [] }
}

const superformula = ({ angle, m, n1, n2, n3, a = 1, b = 1 }) => {
  const t1 = Math.pow(Math.abs(Math.cos((m * angle) / 4) / a), n2)
  const t2 = Math.pow(Math.abs(Math.sin((m * angle) / 4) / b), n3)
  const r = Math.pow(t1 + t2, -1 / n1)
  if (!Number.isFinite(r)) return 0
  return r
}

const generateBlobPoints = (count) => {
  const points = []
  const p1 = { m: 6, n1: 0.25, n2: 1.7, n3: 1.7 }
  const p2 = { m: 10, n1: 0.22, n2: 1.1, n3: 1.1 }

  for (let i = 0; i < count; i++) {
    const u = Math.random() * 2 * Math.PI - Math.PI
    const v = Math.random() * Math.PI - Math.PI / 2

    const r1 = superformula({ angle: u, ...p1 })
    const r2 = superformula({ angle: v, ...p2 })

    const cu = Math.cos(u)
    const su = Math.sin(u)
    const cv = Math.cos(v)
    const sv = Math.sin(v)

    const x = r1 * cu * r2 * cv
    const y = r1 * su * r2 * cv
    const z = r2 * sv

    const s = 2.05
    const jitter = (Math.random() - 0.5) * 0.045
    points.push(new THREE.Vector3(x, y, z).multiplyScalar(s + jitter))
  }

  return { points, leftHemispherePoints: [], rightHemispherePoints: [] }
}

const generateCrystalPoints = (count) => {
  const points = []
  const radius = 1.7
  const facetA = 6
  const facetB = 4

  for (let i = 0; i < count; i++) {
    const u = Math.random()
    const v = Math.random()
    const theta = 2 * Math.PI * u
    const phi = Math.acos(2 * v - 1)

    const faceting =
      Math.abs(Math.sin(phi * facetA) * Math.cos(theta * facetB)) * 0.22 +
      Math.abs(Math.cos(phi * (facetA + 2)) * Math.sin(theta * (facetB + 3))) * 0.12

    const jitter = (Math.random() - 0.5) * 0.07
    const r = radius + faceting + jitter

    const sinPhi = Math.sin(phi)
    const x = r * sinPhi * Math.cos(theta)
    const y = r * sinPhi * Math.sin(theta)
    const z = r * Math.cos(phi)

    points.push(new THREE.Vector3(x, y, z))
  }

  return { points, leftHemispherePoints: [], rightHemispherePoints: [] }
}

const generateSpiralPoints = (count) => {
  const points = []
  const turns = 4.75
  const tMax = Math.PI * 2 * turns

  for (let i = 0; i < count; i++) {
    const t = Math.random() * tMax
    const progress = t / tMax

    const baseR = 0.25 + progress * 1.7
    const armWobble = Math.sin(t * 0.8) * 0.08 + Math.cos(t * 1.4) * 0.05
    const r = baseR + armWobble + (Math.random() - 0.5) * 0.06

    const angle = t + Math.sin(progress * Math.PI * 2) * 0.18 + (Math.random() - 0.5) * 0.12
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    const z = (Math.random() - 0.5) * 0.9 + Math.sin(t * 0.35) * 0.25

    points.push(new THREE.Vector3(x, y, z).multiplyScalar(1.25))
  }

  return { points, leftHemispherePoints: [], rightHemispherePoints: [] }
}

export const resolveShapePoints = ({ shape, shapePoints, particleCount }) => {
  const parsed = parseShapePoints(shapePoints)
  if (parsed.length > 0) {
    return { points: samplePointsToCount({ points: parsed, count: particleCount }), leftHemispherePoints: [], rightHemispherePoints: [] }
  }

  if (shape === 'sphere') return generateSpherePoints(particleCount)
  if (shape === 'torus') return generateTorusPoints(particleCount)
  if (shape === 'torusKnot') return generateTorusKnotPoints(particleCount)
  if (shape === 'cube') return generateCubePoints(particleCount)
  if (shape === 'heart') return generateHeartPoints(particleCount)
  if (shape === 'helix') return generateHelixPoints(particleCount)
  if (shape === 'blob') return generateBlobPoints(particleCount)
  if (shape === 'crystal') return generateCrystalPoints(particleCount)
  if (shape === 'spiral') return generateSpiralPoints(particleCount)
  return generateBrainPoints(particleCount)
}
