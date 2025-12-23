import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'

const mulberry32 = (seed) => {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const clamp = (n, min, max) => (n < min ? min : n > max ? max : n)

const centerScaleFloat32 = (positions, targetRadius) => {
  if (!positions || positions.length < 3) return positions

  let minX = Infinity
  let minY = Infinity
  let minZ = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  let maxZ = -Infinity

  for (let i = 0; i + 2 < positions.length; i += 3) {
    const x = positions[i]
    const y = positions[i + 1]
    const z = positions[i + 2]
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (z < minZ) minZ = z
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
    if (z > maxZ) maxZ = z
  }

  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  const cz = (minZ + maxZ) / 2

  let maxR2 = 0
  for (let i = 0; i + 2 < positions.length; i += 3) {
    const x = positions[i] - cx
    const y = positions[i + 1] - cy
    const z = positions[i + 2] - cz
    const r2 = x * x + y * y + z * z
    if (r2 > maxR2) maxR2 = r2
  }

  const maxR = Math.sqrt(maxR2)
  const s = maxR > 0 ? targetRadius / maxR : 1

  const next = new Float32Array(positions.length)
  for (let i = 0; i + 2 < positions.length; i += 3) {
    next[i] = (positions[i] - cx) * s
    next[i + 1] = (positions[i + 1] - cy) * s
    next[i + 2] = (positions[i + 2] - cz) * s
  }

  return next
}

const buildTriangleAreas = (geometry) => {
  const posAttr = geometry.getAttribute('position')
  if (!posAttr) return null

  const indexAttr = geometry.getIndex()
  const positions = posAttr.array
  const indices = indexAttr ? indexAttr.array : null

  const triCount = indices ? indices.length / 3 : posAttr.count / 3
  const cdf = new Float32Array(triCount)

  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  const ab = new THREE.Vector3()
  const ac = new THREE.Vector3()
  const cross = new THREE.Vector3()

  let total = 0
  for (let t = 0; t < triCount; t++) {
    const i0 = indices ? indices[t * 3] * 3 : t * 9
    const i1 = indices ? indices[t * 3 + 1] * 3 : t * 9 + 3
    const i2 = indices ? indices[t * 3 + 2] * 3 : t * 9 + 6

    a.set(positions[i0], positions[i0 + 1], positions[i0 + 2])
    b.set(positions[i1], positions[i1 + 1], positions[i1 + 2])
    c.set(positions[i2], positions[i2 + 1], positions[i2 + 2])

    ab.subVectors(b, a)
    ac.subVectors(c, a)
    cross.crossVectors(ab, ac)
    const area = 0.5 * cross.length()
    const safeArea = Number.isFinite(area) ? area : 0

    total += safeArea
    cdf[t] = total
  }

  return { positions, indices, cdf, totalArea: total }
}

const sampleSurfacePoints = ({ geometry, count, rand }) => {
  const areaData = buildTriangleAreas(geometry)
  if (!areaData || areaData.totalArea <= 0) return new Float32Array()

  const { positions, indices, cdf, totalArea } = areaData
  const triCount = cdf.length

  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  const p = new THREE.Vector3()

  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = rand() * totalArea
    let lo = 0
    let hi = triCount - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (r <= cdf[mid]) hi = mid
      else lo = mid + 1
    }

    const t = lo
    const i0 = indices ? indices[t * 3] * 3 : t * 9
    const i1 = indices ? indices[t * 3 + 1] * 3 : t * 9 + 3
    const i2 = indices ? indices[t * 3 + 2] * 3 : t * 9 + 6

    a.set(positions[i0], positions[i0 + 1], positions[i0 + 2])
    b.set(positions[i1], positions[i1 + 1], positions[i1 + 2])
    c.set(positions[i2], positions[i2 + 1], positions[i2 + 2])

    const u = rand()
    const v = rand()
    const su = Math.sqrt(u)
    const w1 = 1 - su
    const w2 = su * (1 - v)
    const w3 = su * v

    p.set(0, 0, 0)
    p.addScaledVector(a, w1)
    p.addScaledVector(b, w2)
    p.addScaledVector(c, w3)

    const o = i * 3
    out[o] = p.x
    out[o + 1] = p.y
    out[o + 2] = p.z
  }

  return out
}

const applyTwist = ({ geometry, amount }) => {
  if (!amount) return geometry
  const posAttr = geometry.getAttribute('position')
  if (!posAttr) return geometry

  geometry.computeBoundingBox()
  const box = geometry.boundingBox
  const height = Math.max(0.0001, box.max.y - box.min.y)

  const v = new THREE.Vector3()
  const axis = new THREE.Vector3(0, 1, 0)
  const q = new THREE.Quaternion()

  for (let i = 0; i < posAttr.count; i++) {
    v.fromBufferAttribute(posAttr, i)
    const t = (v.y - box.min.y) / height
    q.setFromAxisAngle(axis, amount * (t - 0.5))
    v.applyQuaternion(q)
    posAttr.setXYZ(i, v.x, v.y, v.z)
  }

  posAttr.needsUpdate = true
  geometry.computeVertexNormals()
  return geometry
}

const applyWarp = ({ geometry, amount }) => {
  if (!amount) return geometry
  const posAttr = geometry.getAttribute('position')
  if (!posAttr) return geometry

  const v = new THREE.Vector3()
  for (let i = 0; i < posAttr.count; i++) {
    v.fromBufferAttribute(posAttr, i)
    const wobble = Math.sin(v.y * 1.8) * Math.cos(v.x * 1.3) * amount
    v.multiplyScalar(1 + wobble)
    posAttr.setXYZ(i, v.x, v.y, v.z)
  }

  posAttr.needsUpdate = true
  geometry.computeVertexNormals()
  return geometry
}

const generateTemplateGeometry = ({ template, params }) => {
  const size = clamp(params.size ?? 1.75, 0.3, 5)
  const detail = Math.floor(clamp(params.detail ?? 2, 0, 6))

  if (template === 'knot') {
    const tube = clamp(params.tube ?? 0.42, 0.05, 1.2)
    const p = Math.floor(clamp(params.p ?? 2, 1, 10))
    const q = Math.floor(clamp(params.q ?? 3, 1, 10))
    const tubularSegments = Math.floor(clamp(params.tubularSegments ?? 220, 40, 600))
    const radialSegments = Math.floor(clamp(params.radialSegments ?? 18, 6, 60))
    return new THREE.TorusKnotGeometry(size * 0.7, tube, tubularSegments, radialSegments, p, q)
  }

  if (template === 'ring') {
    const tube = clamp(params.tube ?? 0.5, 0.05, 1.2)
    const radialSegments = Math.floor(clamp(params.radialSegments ?? 22, 6, 80))
    const tubularSegments = Math.floor(clamp(params.tubularSegments ?? 180, 30, 600))
    return new THREE.TorusGeometry(size * 0.75, tube, radialSegments, tubularSegments)
  }

  if (template === 'capsule') {
    const radius = clamp(params.radius ?? size * 0.42, 0.05, 4)
    const length = clamp(params.length ?? size * 1.35, 0.05, 6)
    const capSegments = Math.floor(clamp(params.capSegments ?? 10, 2, 30))
    const radialSegments = Math.floor(clamp(params.radialSegments ?? 18, 6, 64))
    return new THREE.CapsuleGeometry(radius, length, capSegments, radialSegments)
  }

  if (template === 'spikeball') {
    const geo = new THREE.IcosahedronGeometry(size * 0.9, detail)
    geo.computeVertexNormals()
    return geo
  }

  return new THREE.DodecahedronGeometry(size, detail)
}

const shapesFromSvgText = (svgText) => {
  const svg = svgText && svgText.includes('<svg') ? svgText : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><path d="${svgText || ''}"/></svg>`
  const loader = new SVGLoader()
  const data = loader.parse(svg)
  const shapes = []
  for (const path of data.paths || []) {
    shapes.push(...SVGLoader.createShapes(path))
  }
  return shapes
}

export const generateShapePoints = ({ mode, template, params, svgText, importedPoints, count, seed }) => {
  const rand = mulberry32(seed)
  const targetRadius = clamp(params.targetRadius ?? 1.75, 0.4, 4)

  if (mode === 'import') {
    if (!importedPoints || importedPoints.length < 3) return new Float32Array()
    return centerScaleFloat32(importedPoints, targetRadius)
  }

  if (mode === 'svg') {
    const depth = clamp(params.depth ?? 18, 0.2, 80)
    const curveSegments = Math.floor(clamp(params.curveSegments ?? 14, 2, 80))
    const shapes = shapesFromSvgText(svgText)
    if (!shapes || shapes.length === 0) return new Float32Array()

    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth,
      bevelEnabled: false,
      curveSegments,
      steps: 1
    })

    geo.rotateX(Math.PI)
    geo.translate(0, 0, -depth / 2)

    const twist = clamp(params.twist ?? 0, -6, 6)
    const warp = clamp(params.warp ?? 0, -0.6, 0.6)
    applyTwist({ geometry: geo, amount: twist })
    applyWarp({ geometry: geo, amount: warp })

    const sampled = sampleSurfacePoints({ geometry: geo, count, rand })
    return centerScaleFloat32(sampled, targetRadius)
  }

  const geo = generateTemplateGeometry({ template, params })
  const twist = clamp(params.twist ?? 0, -6, 6)
  const warp = clamp(params.warp ?? 0, -0.6, 0.6)
  applyTwist({ geometry: geo, amount: twist })
  applyWarp({ geometry: geo, amount: warp })

  const sampled = sampleSurfacePoints({ geometry: geo, count, rand })
  return centerScaleFloat32(sampled, targetRadius)
}

export const formatShapePointsForExport = (shapePoints) => {
  if (!shapePoints) return ''
  const arr = shapePoints instanceof Float32Array ? Array.from(shapePoints) : Array.isArray(shapePoints) ? shapePoints : []
  if (arr.length === 0) return ''
  const rounded = arr.map((n) => (Number.isFinite(n) ? Math.round(n * 100000) / 100000 : 0))
  return JSON.stringify(rounded)
}

