import * as THREE from 'three'

const randomOffsetVector = (strength) =>
  new THREE.Vector3(
    (Math.random() - 0.5) * strength,
    (Math.random() - 0.5) * strength,
    (Math.random() - 0.5) * strength
  )

export const createLightningSegment = ({ start, end, zapSpread, zapWidth, lightningColor }) => {
  const control1 = start.clone().lerp(end, 0.3).add(randomOffsetVector(zapSpread))
  const control2 = start.clone().lerp(end, 0.7).add(randomOffsetVector(zapSpread))
  const curve = new THREE.CatmullRomCurve3([start, control1, control2, end])
  const geometry = new THREE.TubeGeometry(curve, 12, zapWidth, 4, false)

  let color
  if (lightningColor) {
    if (lightningColor.r !== undefined) {
      color = new THREE.Color(lightningColor.r, lightningColor.g, lightningColor.b)
    } else {
      color = new THREE.Color(lightningColor)
    }
  } else {
    color = new THREE.Color().setHSL(0.7 + Math.random() * 0.08, 1, 0.7 + Math.random() * 0.15)
  }

  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  })

  const line = new THREE.Mesh(geometry, material)
  const segment = {
    line,
    material,
    life: 0,
    maxLife: 0.5 + Math.random() * 0.9,
    flickerSpeed: 18 + Math.random() * 20,
    phase: Math.random() * Math.PI * 2
  }

  return { line, material, segment }
}

