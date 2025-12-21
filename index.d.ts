import * as React from 'react'

export type RGBColor = { r: number; g: number; b: number }

export type Color = string | RGBColor

export type ShapePreset = 'brain' | 'sphere' | 'torus' | 'torusKnot' | 'cube' | 'heart' | 'helix' | 'blob' | 'crystal' | 'spiral'

export type ShapePoint = { x: number; y: number; z: number }

export type ShapePoints = ShapePoint[] | Float32Array | number[]

export interface ShapeParticleTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
  shape?: ShapePreset | (string & {})
  shapePoints?: ShapePoints
  particleCount?: number
  particleSize?: number
  primaryColor?: Color
  secondaryColor?: Color
  backgroundColor?: string
  transparent?: boolean
  morphDuration?: number
  rotationSpeed?: number
  hoverIntensity?: number
  lightningIntensity?: number
  lightningColor?: Color | null
  zapSpread?: number
  zapWidth?: number
  cameraDistance?: number
  globeOpacity?: number
  globeColor?: Color | null
  showGlobe?: boolean
  glowEffect?: boolean
  debug?: boolean
}

export const ShapeParticleText: React.FC<ShapeParticleTextProps>
