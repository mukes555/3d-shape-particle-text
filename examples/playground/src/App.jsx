import { useState, useEffect } from 'react'
import { ShapeParticleText } from '3d-shape-particle-text'

// Debounced Control Component
const DebouncedControl = ({ type = 'range', value, onChange, delay = 300, ...props }) => {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(localValue)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [localValue, delay]) // Removed onChange from dependencies to avoid loop if not memoized

  const handleChange = (e) => {
    const val = type === 'checkbox' ? e.target.checked : e.target.value
    setLocalValue(val)
  }

  return (
    <input
      type={type}
      value={type === 'checkbox' ? undefined : localValue}
      checked={type === 'checkbox' ? localValue : undefined}
      onChange={handleChange}
      {...props}
    />
  )
}

// Custom Switch Component
const Switch = ({ checked, onChange, color }) => (
  <div
    onClick={() => onChange(!checked)}
    style={{
      width: '40px',
      height: '22px',
      backgroundColor: checked ? (color || '#653DD1') : 'rgba(255,255,255,0.2)',
      borderRadius: '11px',
      position: 'relative',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
      flexShrink: 0,
      border: `1px solid ${checked ? (color || '#653DD1') : 'rgba(255,255,255,0.1)'}`
    }}
  >
    <div
      style={{
        width: '18px',
        height: '18px',
        backgroundColor: 'white',
        borderRadius: '50%',
        position: 'absolute',
        top: '1px',
        left: checked ? '19px' : '1px',
        transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}
    />
  </div>
)

const THEMES = {
  default: {
    name: 'Default Purple',
    config: {
      text: 'AI',
      particleCount: 26000,
      particleSize: 0.01,
      morphDuration: 2.5,
      rotationSpeed: 0.1,
      hoverIntensity: 0.05,
      lightningIntensity: 1.7,
      lightningColor: '#ffffff',
      cameraDistance: 5.5,
      globeOpacity: 0.15,
      glowEffect: true,
      backgroundColor: '#000000',
      primaryColor: '#653DD1',
      secondaryColor: '#893DD1',
      enableRotation: true,
      enableLightning: true,
      zapSpread: 0.7,
      zapWidth: 0.003,
      globeColor: '#653DD1',
      showGlobe: true,
      enableTransparentBg: false
    }
  },
  cyberpunk: {
    name: 'Cyberpunk Neon',
    config: {
      text: 'CYBER',
      particleCount: 26000,
      particleSize: 0.01,
      morphDuration: 2.5,
      rotationSpeed: 0.1,
      hoverIntensity: 0.05,
      lightningIntensity: 1.7,
      lightningColor: '#ff00ff',
      cameraDistance: 5.5,
      globeOpacity: 0.15,
      glowEffect: true,
      backgroundColor: '#050510',
      primaryColor: '#00f3ff',
      secondaryColor: '#ff00ff',
      enableRotation: true,
      enableLightning: true,
      zapSpread: 0.7,
      zapWidth: 0.003,
      globeColor: '#00f3ff',
      showGlobe: true,
      enableTransparentBg: false
    }
  },
  matrix: {
    name: 'The Matrix',
    config: {
      text: 'MATRIX',
      particleCount: 26000,
      particleSize: 0.01,
      morphDuration: 2.5,
      rotationSpeed: 0.1,
      hoverIntensity: 0.05,
      lightningIntensity: 1.7,
      lightningColor: '#00ff41',
      cameraDistance: 5.5,
      globeOpacity: 0.15,
      glowEffect: true,
      backgroundColor: '#000000',
      primaryColor: '#00ff41',
      secondaryColor: '#003b00',
      enableRotation: true,
      enableLightning: true,
      zapSpread: 0.7,
      zapWidth: 0.003,
      globeColor: '#003b00',
      showGlobe: true,
      enableTransparentBg: false
    }
  },
  fire: {
    name: 'Inferno',
    config: {
      text: 'HOT',
      particleCount: 26000,
      particleSize: 0.01,
      morphDuration: 2.5,
      rotationSpeed: 0.1,
      hoverIntensity: 0.05,
      lightningIntensity: 1.7,
      lightningColor: '#ffff00',
      cameraDistance: 5.5,
      globeOpacity: 0.15,
      glowEffect: true,
      backgroundColor: '#1a0000',
      primaryColor: '#ff4500',
      secondaryColor: '#ffa500',
      enableRotation: true,
      enableLightning: true,
      zapSpread: 0.7,
      zapWidth: 0.003,
      globeColor: '#ff0000',
      showGlobe: true,
      enableTransparentBg: false
    }
  },
  ice: {
    name: 'Deep Freeze',
    config: {
      text: 'ICE',
      particleCount: 26000,
      particleSize: 0.01,
      morphDuration: 2.5,
      rotationSpeed: 0.1,
      hoverIntensity: 0.05,
      lightningIntensity: 1.7,
      lightningColor: '#ffffff',
      cameraDistance: 5.5,
      globeOpacity: 0.15,
      glowEffect: true,
      backgroundColor: '#00001a',
      primaryColor: '#00ffff',
      secondaryColor: '#ffffff',
      enableRotation: true,
      enableLightning: true,
      zapSpread: 0.7,
      zapWidth: 0.003,
      globeColor: '#e0ffff',
      showGlobe: true,
      enableTransparentBg: false
    }
  }
}

function App() {
  const [config, setConfig] = useState({
    text: 'AI',
    particleCount: 26000,
    particleSize: 0.01,
    morphDuration: 2.5,
    rotationSpeed: 0.1,
    hoverIntensity: 0.05,
    lightningIntensity: 1.7,
    lightningColor: '#ffffff',
    cameraDistance: 5.5,
    globeOpacity: 0.15,
    glowEffect: true,
    backgroundColor: '#000000',
    primaryColor: '#653DD1',
    secondaryColor: '#893DD1',
    enableRotation: true,
    enableLightning: true,
    zapSpread: 0.7,
    zapWidth: 0.003,
    globeColor: '#653DD1',
    showGlobe: true,
    enableTransparentBg: false
  })

  const [showControls, setShowControls] = useState(true)

  const handleThemeChange = (themeKey) => {
    if (THEMES[themeKey]) {
      setConfig(THEMES[themeKey].config)
    }
  }

  // Helper to convert hex to RGB object {r, g, b} (0-1 range)
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : null
  }

  const handleChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* 3D Component */}
      <ShapeParticleText
        text={config.text}
        particleCount={config.particleCount}
        particleSize={config.particleSize}
        morphDuration={config.morphDuration}
        rotationSpeed={config.enableRotation ? config.rotationSpeed : 0}
        hoverIntensity={config.hoverIntensity}
        lightningIntensity={config.enableLightning ? config.lightningIntensity : 0}
        lightningColor={config.lightningColor}
        zapSpread={config.zapSpread}
        zapWidth={config.zapWidth}
        cameraDistance={config.cameraDistance}
        globeOpacity={config.globeOpacity}
        globeColor={config.globeColor}
        showGlobe={config.showGlobe}
        glowEffect={config.glowEffect}
        backgroundColor={config.backgroundColor}
        transparent={config.enableTransparentBg}
        primaryColor={hexToRgb(config.primaryColor)}
        secondaryColor={hexToRgb(config.secondaryColor)}
      />

      {/* Toggle Controls Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 20,
          padding: '8px 16px',
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '4px',
          cursor: 'pointer',
          backdropFilter: 'blur(5px)'
        }}
      >
        {showControls ? 'Hide Controls' : 'Show Config'}
      </button>

          {/* Control Panel */}
          {showControls && (
            <div style={{
              position: 'absolute',
              top: 60,
              right: 20,
              width: '320px',
              padding: '24px',
              background: 'rgba(10, 10, 15, 0.85)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'white',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              maxHeight: 'calc(100vh - 100px)',
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', letterSpacing: '-0.02em' }}>Configuration</h2>
                <div style={{ fontSize: '10px', padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontWeight: '600' }}>v1.0</div>
              </div>

              {/* Theme Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Presets</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {Object.entries(THEMES).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => handleThemeChange(key)}
                      style={{
                        padding: '12px',
                        fontSize: '13px',
                        fontWeight: '500',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                      }}
                    >
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: theme.config.primaryColor }} />
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />

              {/* Text Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Content</label>
                <DebouncedControl
                  type="text"
                  value={config.text}
                  onChange={(val) => handleChange('text', val)}
                  maxLength={10}
                  placeholder="Enter Text"
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '12px',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '15px',
                    width: '100%',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = config.primaryColor
                    e.target.style.background = 'rgba(0,0,0,0.4)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.target.style.background = 'rgba(0,0,0,0.2)'
                  }}
                />
              </div>

              {/* Main Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Particle Size */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '12px', color: '#ccc' }}>Particle Size</label>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{config.particleSize}</span>
                  </div>
                  <DebouncedControl
                    type="range"
                    min="0.01"
                    max="0.1"
                    step="0.005"
                    value={config.particleSize}
                    onChange={(val) => handleChange('particleSize', parseFloat(val))}
                    style={{ width: '100%', accentColor: config.primaryColor, height: '4px' }}
                  />
                </div>

                {/* Rotation */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                     <label style={{ fontSize: '14px', fontWeight: '500' }}>Auto Rotation</label>
                     <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Spin the brain</span>
                   </div>
                   <Switch
                     checked={config.enableRotation}
                     onChange={(val) => handleChange('enableRotation', val)}
                     color={config.primaryColor}
                   />
                </div>
                {config.enableRotation && (
                  <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                     <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                       <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{config.rotationSpeed}</span>
                     </div>
                     <DebouncedControl
                      type="range"
                      min="0"
                      max="1.0"
                      step="0.05"
                      value={config.rotationSpeed}
                      onChange={(val) => handleChange('rotationSpeed', parseFloat(val))}
                      style={{ width: '100%', accentColor: config.primaryColor, height: '4px' }}
                    />
                  </div>
                )}

                {/* Lightning */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                     <label style={{ fontSize: '14px', fontWeight: '500' }}>Neural Activity</label>
                     <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Lightning effects</span>
                   </div>
                   <Switch
                     checked={config.enableLightning}
                     onChange={(val) => handleChange('enableLightning', val)}
                     color={config.primaryColor}
                   />
                </div>
                {config.enableLightning && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Intensity</label>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{config.lightningIntensity}</span>
                      </div>
                      <DebouncedControl
                        type="range"
                        min="0"
                        max="5.0"
                        step="0.1"
                        value={config.lightningIntensity}
                        onChange={(val) => handleChange('lightningIntensity', parseFloat(val))}
                        style={{ width: '60%', accentColor: config.primaryColor, height: '4px' }}
                      />
                    </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Zap Spread</label>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{config.zapSpread}</span>
                      </div>
                      <DebouncedControl
                        type="range"
                        min="0"
                        max="2.0"
                        step="0.1"
                        value={config.zapSpread}
                        onChange={(val) => handleChange('zapSpread', parseFloat(val))}
                        style={{ width: '60%', accentColor: config.primaryColor, height: '4px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Zap Width</label>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{config.zapWidth}</span>
                      </div>
                      <DebouncedControl
                        type="range"
                        min="0.001"
                        max="0.010"
                        step="0.0002"
                        value={config.zapWidth}
                        onChange={(val) => handleChange('zapWidth', parseFloat(val))}
                        style={{ width: '60%', accentColor: config.primaryColor, height: '4px' }}
                      />
                    </div>
                  </div>
                )}

                {/* Globe */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                     <label style={{ fontSize: '14px', fontWeight: '500' }}>Wireframe Globe</label>
                     <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Outer sphere</span>
                   </div>
                   <Switch
                     checked={config.showGlobe}
                     onChange={(val) => handleChange('showGlobe', val)}
                     color={config.primaryColor}
                   />
                </div>
                {config.showGlobe && (
                   <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                       <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{config.globeOpacity}</span>
                     </div>
                     <DebouncedControl
                      type="range"
                      min="0.0"
                      max="0.5"
                      step="0.01"
                      value={config.globeOpacity}
                      onChange={(val) => handleChange('globeOpacity', parseFloat(val))}
                      style={{ width: '100%', accentColor: config.primaryColor, height: '4px' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Color</span>
                        <DebouncedControl
                          type="color"
                          value={config.globeColor || config.primaryColor}
                          onChange={(val) => handleChange('globeColor', val)}
                          style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', padding: 0, overflow: 'hidden' }}
                        />
                    </div>
                  </div>
                )}

                 {/* Glow */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                     <label style={{ fontSize: '14px', fontWeight: '500' }}>Glow Effect</label>
                     <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Additive blending</span>
                   </div>
                   <Switch
                     checked={config.glowEffect}
                     onChange={(val) => handleChange('glowEffect', val)}
                     color={config.primaryColor}
                   />
                </div>

              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />

              {/* Advanced Settings */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Advanced</label>

                 {/* Particle Count */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '12px', color: '#ccc' }}>Particle Count</label>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{config.particleCount}</span>
                  </div>
                  <DebouncedControl
                    type="range"
                    min="5000"
                    max="50000"
                    step="1000"
                    value={config.particleCount}
                    onChange={(val) => handleChange('particleCount', parseInt(val))}
                    style={{ width: '100%', accentColor: config.primaryColor, height: '4px' }}
                  />
                </div>

                {/* Morph Duration */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '12px', color: '#ccc' }}>Morph Speed</label>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{config.morphDuration}s</span>
                  </div>
                  <DebouncedControl
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.1"
                    value={config.morphDuration}
                    onChange={(val) => handleChange('morphDuration', parseFloat(val))}
                    style={{ width: '100%', accentColor: config.primaryColor, height: '4px' }}
                  />
                </div>

                {/* Hover Intensity */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '12px', color: '#ccc' }}>Hover Response</label>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{config.hoverIntensity}</span>
                  </div>
                  <DebouncedControl
                    type="range"
                    min="0.0"
                    max="0.2"
                    step="0.01"
                    value={config.hoverIntensity}
                    onChange={(val) => handleChange('hoverIntensity', parseFloat(val))}
                    style={{ width: '100%', accentColor: config.primaryColor, height: '4px' }}
                  />
                </div>

                 {/* Camera Distance */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '12px', color: '#ccc' }}>Zoom</label>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{config.cameraDistance}</span>
                  </div>
                  <DebouncedControl
                    type="range"
                    min="3.0"
                    max="10.0"
                    step="0.1"
                    value={config.cameraDistance}
                    onChange={(val) => handleChange('cameraDistance', parseFloat(val))}
                    style={{ width: '100%', accentColor: config.primaryColor, height: '4px' }}
                  />
                </div>

                {/* Colors */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Colors</label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                       <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Primary</span>
                       <DebouncedControl type="color" value={config.primaryColor} onChange={(val) => handleChange('primaryColor', val)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', padding: 0, overflow: 'hidden' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                       <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Secondary</span>
                       <DebouncedControl type="color" value={config.secondaryColor} onChange={(val) => handleChange('secondaryColor', val)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', padding: 0, overflow: 'hidden' }} />
                    </div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                       <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Bg</span>
                       <div style={{ display: 'flex', gap: '4px' }}>
                          <DebouncedControl type="color" value={config.backgroundColor} onChange={(val) => handleChange('backgroundColor', val)} disabled={config.enableTransparentBg} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', padding: 0, overflow: 'hidden', opacity: config.enableTransparentBg ? 0.3 : 1 }} />
                          <div title="Transparent Background" onClick={() => handleChange('enableTransparentBg', !config.enableTransparentBg)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', background: config.enableTransparentBg ? 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 10px 10px' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             {config.enableTransparentBg && <span style={{fontSize: '10px', fontWeight: 'bold'}}>T</span>}
                             {!config.enableTransparentBg && <span style={{fontSize: '8px', color: '#888'}}>Tr</span>}
                          </div>
                       </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                       <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Zap</span>
                       <DebouncedControl type="color" value={config.lightningColor} onChange={(val) => handleChange('lightningColor', val)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', padding: 0, overflow: 'hidden' }} />
                    </div>
                  </div>
                </div>

               </div>
            </div>
          )}

      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, pointerEvents: 'none' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '24px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>3D Shape Particle Text Demo</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: '5px 0 0 0', fontSize: '14px' }}>Interactive Configuration Panel</p>
      </div>
    </div>
  )
}

export default App