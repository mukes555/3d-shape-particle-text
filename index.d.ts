import * as React from 'react'

export type RGBColor = { r: number; g: number; b: number }

export type Color = string | RGBColor

export interface ShapeParticleTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
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
