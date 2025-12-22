import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { ShapeParticleText } from '3d-shape-particle-text'

const THEMES = [
  {
    key: 'default',
    name: 'Default Purple',
    config: {
      text: 'AI',
      shape: 'brain',
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
  {
    key: 'cyberpunk',
    name: 'Cyberpunk Neon',
    config: {
      text: 'CYBER',
      shape: 'brain',
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
  {
    key: 'matrix',
    name: 'The Matrix',
    config: {
      text: 'MATRIX',
      shape: 'brain',
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
  {
    key: 'fire',
    name: 'Inferno',
    config: {
      text: 'HOT',
      shape: 'brain',
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
  {
    key: 'ice',
    name: 'Deep Freeze',
    config: {
      text: 'ICE',
      shape: 'brain',
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
  },
  {
    key: 'aurora',
    name: 'Aurora Crystal',
    config: {
      text: 'AURORA',
      shape: 'crystal',
      particleCount: 28000,
      particleSize: 0.01,
      morphDuration: 2.6,
      rotationSpeed: 0.14,
      hoverIntensity: 0.05,
      lightningIntensity: 1.3,
      lightningColor: '#e7ffff',
      cameraDistance: 5.4,
      globeOpacity: 0.12,
      glowEffect: true,
      backgroundColor: '#040712',
      primaryColor: '#39ffcc',
      secondaryColor: '#7a5cff',
      enableRotation: true,
      enableLightning: true,
      zapSpread: 0.85,
      zapWidth: 0.003,
      globeColor: '#39ffcc',
      showGlobe: true,
      enableTransparentBg: false
    }
  },
  {
    key: 'sunset',
    name: 'Sunset Spiral',
    config: {
      text: 'SUN',
      shape: 'spiral',
      particleCount: 26000,
      particleSize: 0.01,
      morphDuration: 2.4,
      rotationSpeed: 0.18,
      hoverIntensity: 0.06,
      lightningIntensity: 1.2,
      lightningColor: '#fff2f8',
      cameraDistance: 5.6,
      globeOpacity: 0.1,
      glowEffect: true,
      backgroundColor: '#120407',
      primaryColor: '#ff6a00',
      secondaryColor: '#ff2d95',
      enableRotation: true,
      enableLightning: true,
      zapSpread: 0.9,
      zapWidth: 0.003,
      globeColor: '#ff6a00',
      showGlobe: true,
      enableTransparentBg: false
    }
  },
  {
    key: 'midnight',
    name: 'Midnight Knot',
    config: {
      text: 'NIGHT',
      shape: 'torusKnot',
      particleCount: 26000,
      particleSize: 0.01,
      morphDuration: 2.8,
      rotationSpeed: 0.2,
      hoverIntensity: 0.05,
      lightningIntensity: 1.4,
      lightningColor: '#c8d6ff',
      cameraDistance: 5.7,
      globeOpacity: 0.08,
      glowEffect: true,
      backgroundColor: '#050815',
      primaryColor: '#6ea8ff',
      secondaryColor: '#b06cff',
      enableRotation: true,
      enableLightning: true,
      zapSpread: 0.75,
      zapWidth: 0.003,
      globeColor: '#6ea8ff',
      showGlobe: true,
      enableTransparentBg: false
    }
  },
  {
    key: 'mint',
    name: 'Mint Helix',
    config: {
      text: 'DNA',
      shape: 'helix',
      particleCount: 24000,
      particleSize: 0.01,
      morphDuration: 2.4,
      rotationSpeed: 0.12,
      hoverIntensity: 0.05,
      lightningIntensity: 1.5,
      lightningColor: '#b7ffe1',
      cameraDistance: 5.4,
      globeOpacity: 0.12,
      glowEffect: true,
      backgroundColor: '#00140e',
      primaryColor: '#00ffa2',
      secondaryColor: '#c6fff0',
      enableRotation: true,
      enableLightning: true,
      zapSpread: 0.75,
      zapWidth: 0.003,
      globeColor: '#00ffa2',
      showGlobe: true,
      enableTransparentBg: false
    }
  },
  {
    key: 'valentine',
    name: 'Valentine Heart',
    config: {
      text: 'LOVE',
      shape: 'heart',
      particleCount: 22000,
      particleSize: 0.011,
      morphDuration: 2.6,
      rotationSpeed: 0.16,
      hoverIntensity: 0.05,
      lightningIntensity: 0.9,
      lightningColor: '#ffd1dc',
      cameraDistance: 5.8,
      globeOpacity: 0.1,
      glowEffect: true,
      backgroundColor: '#14050a',
      primaryColor: '#ff2d55',
      secondaryColor: '#ff7aa2',
      enableRotation: true,
      enableLightning: true,
      zapSpread: 0.55,
      zapWidth: 0.003,
      globeColor: '#ff2d55',
      showGlobe: true,
      enableTransparentBg: false
    }
  },
  {
    key: 'noir',
    name: 'Noir Blob',
    config: {
      text: 'NOIR',
      shape: 'blob',
      particleCount: 26000,
      particleSize: 0.01,
      morphDuration: 2.5,
      rotationSpeed: 0.1,
      hoverIntensity: 0.05,
      lightningIntensity: 1.1,
      lightningColor: '#eaeaea',
      cameraDistance: 5.6,
      globeOpacity: 0.08,
      glowEffect: true,
      backgroundColor: '#050505',
      primaryColor: '#f2f2f2',
      secondaryColor: '#9c9c9c',
      enableRotation: true,
      enableLightning: true,
      zapSpread: 0.6,
      zapWidth: 0.003,
      globeColor: '#9c9c9c',
      showGlobe: true,
      enableTransparentBg: false
    }
  },
  {
    key: 'hologram',
    name: 'Hologram Ring',
    config: {
      text: 'HOLO',
      shape: 'torus',
      particleCount: 26000,
      particleSize: 0.01,
      morphDuration: 2.4,
      rotationSpeed: 0.14,
      hoverIntensity: 0.06,
      lightningIntensity: 1.6,
      lightningColor: '#8fffff',
      cameraDistance: 5.6,
      globeOpacity: 0.12,
      glowEffect: true,
      backgroundColor: '#030615',
      primaryColor: '#00f0ff',
      secondaryColor: '#ff3df5',
      enableRotation: true,
      enableLightning: true,
      zapSpread: 0.85,
      zapWidth: 0.003,
      globeColor: '#00f0ff',
      showGlobe: true,
      enableTransparentBg: false
    }
  },
  {
    key: 'deepOcean',
    name: 'Deep Ocean',
    config: {
      text: 'OCEAN',
      shape: 'sphere',
      particleCount: 24000,
      particleSize: 0.01,
      morphDuration: 2.6,
      rotationSpeed: 0.1,
      hoverIntensity: 0.05,
      lightningIntensity: 1.2,
      lightningColor: '#b9fbff',
      cameraDistance: 5.5,
      globeOpacity: 0.1,
      glowEffect: true,
      backgroundColor: '#001018',
      primaryColor: '#00c2ff',
      secondaryColor: '#00ffb8',
      enableRotation: true,
      enableLightning: true,
      zapSpread: 0.75,
      zapWidth: 0.003,
      globeColor: '#00c2ff',
      showGlobe: true,
      enableTransparentBg: false
    }
  },
  {
    key: 'goldenHour',
    name: 'Golden Hour Cube',
    config: {
      text: 'GOLD',
      shape: 'cube',
      particleCount: 24000,
      particleSize: 0.011,
      morphDuration: 2.6,
      rotationSpeed: 0.12,
      hoverIntensity: 0.05,
      lightningIntensity: 1.0,
      lightningColor: '#fff1c9',
      cameraDistance: 5.7,
      globeOpacity: 0.12,
      glowEffect: true,
      backgroundColor: '#120a00',
      primaryColor: '#ffb000',
      secondaryColor: '#ff5a1f',
      enableRotation: true,
      enableLightning: true,
      zapSpread: 0.65,
      zapWidth: 0.003,
      globeColor: '#ffb000',
      showGlobe: true,
      enableTransparentBg: false
    }
  },
  {
    key: 'sakura',
    name: 'Sakura Bloom',
    config: {
      text: 'SAKURA',
      shape: 'blob',
      particleCount: 26000,
      particleSize: 0.01,
      morphDuration: 2.5,
      rotationSpeed: 0.11,
      hoverIntensity: 0.05,
      lightningIntensity: 1.1,
      lightningColor: '#ffe3f2',
      cameraDistance: 5.6,
      globeOpacity: 0.1,
      glowEffect: true,
      backgroundColor: '#120511',
      primaryColor: '#ff5aa5',
      secondaryColor: '#b38bff',
      enableRotation: true,
      enableLightning: true,
      zapSpread: 0.7,
      zapWidth: 0.003,
      globeColor: '#ff5aa5',
      showGlobe: true,
      enableTransparentBg: false
    }
  },
  {
    key: 'quantum',
    name: 'Quantum Knot',
    config: {
      text: 'QBIT',
      shape: 'torusKnot',
      particleCount: 28000,
      particleSize: 0.01,
      morphDuration: 2.7,
      rotationSpeed: 0.16,
      hoverIntensity: 0.05,
      lightningIntensity: 1.5,
      lightningColor: '#d5ff7a',
      cameraDistance: 5.7,
      globeOpacity: 0.09,
      glowEffect: true,
      backgroundColor: '#020a07',
      primaryColor: '#a6ff00',
      secondaryColor: '#00ffd5',
      enableRotation: true,
      enableLightning: true,
      zapSpread: 0.85,
      zapWidth: 0.003,
      globeColor: '#00ffd5',
      showGlobe: true,
      enableTransparentBg: false
    }
  }
]

const SHAPES = [
  { key: 'brain', name: 'Brain' },
  { key: 'sphere', name: 'Sphere' },
  { key: 'torus', name: 'Torus' },
  { key: 'torusKnot', name: 'Knot' },
  { key: 'helix', name: 'Helix' },
  { key: 'heart', name: 'Heart' },
  { key: 'blob', name: 'Blob' },
  { key: 'crystal', name: 'Crystal' },
  { key: 'spiral', name: 'Spiral' },
  { key: 'cube', name: 'Cube' },
  { key: 'orbit', name: 'Orbit' }
]

const DebouncedControl = ({ type = 'range', value, onChange, delay = 250, ...props }) => {
  const [localValue, setLocalValue] = useState(value)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    const handler = setTimeout(() => {
      onChangeRef.current(localValue)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [localValue, delay])

  const handleChange = (e) => {
    const next = type === 'checkbox' ? e.target.checked : e.target.value
    setLocalValue(next)
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

const Switch = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      className={`pgSwitch ${checked ? 'on' : ''}`}
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
    >
      <span className="pgSwitchThumb" />
    </button>
  )
}

const getRouteFromHash = () => {
  const route = window.location.hash.replace('#', '').trim()
  if (route === 'playground') return 'playground'
  return 'home'
}

function App() {
  const themesByKey = useMemo(() => Object.fromEntries(THEMES.map((t) => [t.key, t])), [])
  const [themeKey, setThemeKey] = useState('default')
  const [themeDockOpen, setThemeDockOpen] = useState(false)
  const [route, setRoute] = useState(() => (typeof window === 'undefined' ? 'home' : getRouteFromHash()))
  const [playConfig, setPlayConfig] = useState(() => ({ ...THEMES[0].config }))
  const selectedTheme = themesByKey[themeKey] || THEMES[0]
  const config = selectedTheme.config

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const applyTheme = (key) => {
    const nextTheme = themesByKey[key] || THEMES[0]
    setThemeKey(nextTheme.key)
    setPlayConfig({ ...nextTheme.config })
  }

  const activeConfig = useMemo(() => {
    if (route === 'playground') return playConfig
    return config
  }, [route, playConfig, config])

  const codeSample = useMemo(() => {
    const cfg = activeConfig
    const shape = cfg.shape || 'brain'
    const lines = [
      '<ShapeParticleText',
      `  text="${cfg.text}"`,
      `  shape="${shape}"`,
      `  particleCount={${cfg.particleCount}}`,
      `  particleSize={${cfg.particleSize}}`,
      `  primaryColor="${cfg.primaryColor}"`,
      `  secondaryColor="${cfg.secondaryColor}"`,
      `  backgroundColor="${cfg.backgroundColor}"`,
      `  transparent={${cfg.enableTransparentBg}}`,
      `  morphDuration={${cfg.morphDuration}}`,
      `  rotationSpeed={${cfg.enableRotation ? cfg.rotationSpeed : 0}}`,
      `  hoverIntensity={${cfg.hoverIntensity}}`,
      `  lightningIntensity={${cfg.enableLightning ? cfg.lightningIntensity : 0}}`,
      `  lightningColor="${cfg.lightningColor}"`,
      `  zapSpread={${cfg.zapSpread}}`,
      `  zapWidth={${cfg.zapWidth}}`,
      `  cameraDistance={${cfg.cameraDistance}}`,
      `  globeOpacity={${cfg.globeOpacity}}`,
      `  globeColor="${cfg.globeColor}"`,
      `  showGlobe={${cfg.showGlobe}}`,
      `  glowEffect={${cfg.glowEffect}}`,
      '/>'
    ]
    return lines.join('\n')
  }, [activeConfig])

  return (
    <div
      className="page"
      style={{
        '--pageBase': activeConfig.backgroundColor,
        '--accent1': activeConfig.primaryColor,
        '--accent2': activeConfig.secondaryColor
      }}
    >
      <header className="nav">
        <div className="navInner">
          <a className="brand" href="https://www.npmjs.com/package/3d-shape-particle-text" target="_blank" rel="noreferrer">
            <span className="brandMark" aria-hidden="true" />
            <span className="brandText">3d-shape-particle-text</span>
          </a>
          <nav className="navLinks">
            <a href="#home" aria-current={route === 'home' ? 'page' : undefined}>
              Home
            </a>
            <a href="#playground" aria-current={route === 'playground' ? 'page' : undefined}>
              Playground
            </a>
            <a href="https://www.npmjs.com/package/3d-shape-particle-text" target="_blank" rel="noreferrer">
              NPM
            </a>
            <a href="https://github.com/mukes555/3d-shape-particle-text" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {route === 'playground' ? (
        <main className="playground" role="main">
          <div className="playgroundInner">
            <div className="playgroundPreview">
              <div className="playgroundHeader">
                <h1 className="playgroundTitle">Playground</h1>
                <p className="playgroundSubtitle">Tune props, preview instantly, copy the config.</p>
              </div>

              <div className="visualFrame playgroundFrame" aria-label="3D particle preview">
                <div className="visualGlow" aria-hidden="true" />
                <ShapeParticleText
                  text={playConfig.text}
                  shape={playConfig.shape}
                  particleCount={playConfig.particleCount}
                  particleSize={playConfig.particleSize}
                  primaryColor={playConfig.primaryColor}
                  secondaryColor={playConfig.secondaryColor}
                  backgroundColor={playConfig.backgroundColor}
                  transparent={playConfig.enableTransparentBg}
                  morphDuration={playConfig.morphDuration}
                  rotationSpeed={playConfig.enableRotation ? playConfig.rotationSpeed : 0}
                  hoverIntensity={playConfig.hoverIntensity}
                  lightningIntensity={playConfig.enableLightning ? playConfig.lightningIntensity : 0}
                  lightningColor={playConfig.lightningColor}
                  cameraDistance={playConfig.cameraDistance}
                  globeOpacity={playConfig.globeOpacity}
                  globeColor={playConfig.globeColor}
                  showGlobe={playConfig.showGlobe}
                  glowEffect={playConfig.glowEffect}
                  zapSpread={playConfig.zapSpread}
                  zapWidth={playConfig.zapWidth}
                />
                <div className="visualOverlay" aria-hidden="true" />
              </div>

              <div className="themesCode">
                <div className="codeHeader">
                  <div className="codeTitle">Current config</div>
                  <div className="codeHint">Copy/paste into your app</div>
                </div>
                <pre className="codeBlock">
                  <code>{codeSample}</code>
                </pre>
              </div>
            </div>

            <aside className="playgroundPanel" aria-label="Controls">
              <div className="pgPanelHeader">
                <div className="pgPanelTitle">Controls</div>
                <div className="pgPanelHint">Presets + live tuning</div>
              </div>

              <div className="pgSection">
                <div className="pgSectionTitle">Presets</div>
                <div className="pgPresets">
                  {THEMES.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      className={`themeCard pgPreset ${t.key === themeKey ? 'active' : ''}`}
                      onClick={() => applyTheme(t.key)}
                    >
                      <div className="themeSwatches" aria-hidden="true">
                        <span className="swatch" style={{ background: t.config.primaryColor }} />
                        <span className="swatch" style={{ background: t.config.secondaryColor }} />
                        <span className="swatch muted" style={{ background: t.config.backgroundColor }} />
                      </div>
                      <div className="themeMeta">
                        <div className="themeName">{t.name}</div>
                        <div className="themeText">Text: {t.config.text}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pgSection">
                <div className="pgSectionTitle">Text</div>
                <DebouncedControl
                  type="text"
                  className="pgInput"
                  value={playConfig.text}
                  onChange={(val) => setPlayConfig((prev) => ({ ...prev, text: val }))}
                  maxLength={10}
                  placeholder="AI"
                />
              </div>

              <div className="pgSection">
                <div className="pgSectionTitle">Shape</div>
                <select
                  className="pgInput"
                  value={playConfig.shape || 'brain'}
                  onChange={(e) => setPlayConfig((prev) => ({ ...prev, shape: e.target.value }))}
                >
                  {SHAPES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pgSection">
                <div className="pgSectionTitle">Particles</div>
                <div className="pgField">
                  <div className="pgFieldHeader">
                    <span>Particle Count</span>
                    <span className="pgValue">{playConfig.particleCount}</span>
                  </div>
                  <DebouncedControl
                    type="range"
                    className="pgRange"
                    min="5000"
                    max="50000"
                    step="1000"
                    value={playConfig.particleCount}
                    onChange={(val) => setPlayConfig((prev) => ({ ...prev, particleCount: parseInt(val, 10) }))}
                  />
                </div>

                <div className="pgField">
                  <div className="pgFieldHeader">
                    <span>Particle Size</span>
                    <span className="pgValue">{playConfig.particleSize}</span>
                  </div>
                  <DebouncedControl
                    type="range"
                    className="pgRange"
                    min="0.005"
                    max="0.05"
                    step="0.001"
                    value={playConfig.particleSize}
                    onChange={(val) => setPlayConfig((prev) => ({ ...prev, particleSize: parseFloat(val) }))}
                  />
                </div>
              </div>

              <div className="pgSection">
                <div className="pgSectionTitle">Animation</div>
                <div className="pgField">
                  <div className="pgFieldHeader">
                    <span>Morph Duration</span>
                    <span className="pgValue">{playConfig.morphDuration}s</span>
                  </div>
                  <DebouncedControl
                    type="range"
                    className="pgRange"
                    min="0.5"
                    max="6.0"
                    step="0.1"
                    value={playConfig.morphDuration}
                    onChange={(val) => setPlayConfig((prev) => ({ ...prev, morphDuration: parseFloat(val) }))}
                  />
                </div>

                <div className="pgField">
                  <div className="pgFieldHeader">
                    <span>Hover Intensity</span>
                    <span className="pgValue">{playConfig.hoverIntensity}</span>
                  </div>
                  <DebouncedControl
                    type="range"
                    className="pgRange"
                    min="0.0"
                    max="0.2"
                    step="0.01"
                    value={playConfig.hoverIntensity}
                    onChange={(val) => setPlayConfig((prev) => ({ ...prev, hoverIntensity: parseFloat(val) }))}
                  />
                </div>

                <div className="pgToggleRow">
                  <div>
                    <div className="pgToggleTitle">Auto Rotation</div>
                    <div className="pgToggleHint">Idle spin</div>
                  </div>
                  <Switch checked={playConfig.enableRotation} onChange={(val) => setPlayConfig((prev) => ({ ...prev, enableRotation: val }))} />
                </div>

                {playConfig.enableRotation ? (
                  <div className="pgField">
                    <div className="pgFieldHeader">
                      <span>Rotation Speed</span>
                      <span className="pgValue">{playConfig.rotationSpeed}</span>
                    </div>
                    <DebouncedControl
                      type="range"
                      className="pgRange"
                      min="0"
                      max="1.0"
                      step="0.05"
                      value={playConfig.rotationSpeed}
                      onChange={(val) => setPlayConfig((prev) => ({ ...prev, rotationSpeed: parseFloat(val) }))}
                    />
                  </div>
                ) : null}
              </div>

              <div className="pgSection">
                <div className="pgSectionTitle">Lightning</div>
                <div className="pgToggleRow">
                  <div>
                    <div className="pgToggleTitle">Neural Activity</div>
                    <div className="pgToggleHint">Electric accents</div>
                  </div>
                  <Switch checked={playConfig.enableLightning} onChange={(val) => setPlayConfig((prev) => ({ ...prev, enableLightning: val }))} />
                </div>

                {playConfig.enableLightning ? (
                  <>
                    <div className="pgField">
                      <div className="pgFieldHeader">
                        <span>Intensity</span>
                        <span className="pgValue">{playConfig.lightningIntensity}</span>
                      </div>
                      <DebouncedControl
                        type="range"
                        className="pgRange"
                        min="0"
                        max="5.0"
                        step="0.1"
                        value={playConfig.lightningIntensity}
                        onChange={(val) => setPlayConfig((prev) => ({ ...prev, lightningIntensity: parseFloat(val) }))}
                      />
                    </div>

                    <div className="pgField">
                      <div className="pgFieldHeader">
                        <span>Zap Spread</span>
                        <span className="pgValue">{playConfig.zapSpread}</span>
                      </div>
                      <DebouncedControl
                        type="range"
                        className="pgRange"
                        min="0"
                        max="2.0"
                        step="0.1"
                        value={playConfig.zapSpread}
                        onChange={(val) => setPlayConfig((prev) => ({ ...prev, zapSpread: parseFloat(val) }))}
                      />
                    </div>

                    <div className="pgField">
                      <div className="pgFieldHeader">
                        <span>Zap Width</span>
                        <span className="pgValue">{playConfig.zapWidth}</span>
                      </div>
                      <DebouncedControl
                        type="range"
                        className="pgRange"
                        min="0.001"
                        max="0.02"
                        step="0.0005"
                        value={playConfig.zapWidth}
                        onChange={(val) => setPlayConfig((prev) => ({ ...prev, zapWidth: parseFloat(val) }))}
                      />
                    </div>
                  </>
                ) : null}
              </div>

              <div className="pgSection">
                <div className="pgSectionTitle">Globe</div>
                <div className="pgToggleRow">
                  <div>
                    <div className="pgToggleTitle">Wireframe Globe</div>
                    <div className="pgToggleHint">Outer sphere</div>
                  </div>
                  <Switch checked={playConfig.showGlobe} onChange={(val) => setPlayConfig((prev) => ({ ...prev, showGlobe: val }))} />
                </div>

                {playConfig.showGlobe ? (
                  <div className="pgField">
                    <div className="pgFieldHeader">
                      <span>Opacity</span>
                      <span className="pgValue">{playConfig.globeOpacity}</span>
                    </div>
                    <DebouncedControl
                      type="range"
                      className="pgRange"
                      min="0.0"
                      max="0.5"
                      step="0.01"
                      value={playConfig.globeOpacity}
                      onChange={(val) => setPlayConfig((prev) => ({ ...prev, globeOpacity: parseFloat(val) }))}
                    />
                  </div>
                ) : null}
              </div>

              <div className="pgSection">
                <div className="pgSectionTitle">Camera</div>
                <div className="pgField">
                  <div className="pgFieldHeader">
                    <span>Distance</span>
                    <span className="pgValue">{playConfig.cameraDistance}</span>
                  </div>
                  <DebouncedControl
                    type="range"
                    className="pgRange"
                    min="3.0"
                    max="10.0"
                    step="0.1"
                    value={playConfig.cameraDistance}
                    onChange={(val) => setPlayConfig((prev) => ({ ...prev, cameraDistance: parseFloat(val) }))}
                  />
                </div>
              </div>

              <div className="pgSection">
                <div className="pgSectionTitle">Colors</div>
                <div className="pgColors">
                  <label className="pgColorField">
                    <span>Primary</span>
                    <DebouncedControl type="color" value={playConfig.primaryColor} onChange={(val) => setPlayConfig((prev) => ({ ...prev, primaryColor: val }))} />
                  </label>
                  <label className="pgColorField">
                    <span>Secondary</span>
                    <DebouncedControl type="color" value={playConfig.secondaryColor} onChange={(val) => setPlayConfig((prev) => ({ ...prev, secondaryColor: val }))} />
                  </label>
                  <label className="pgColorField">
                    <span>Background</span>
                    <DebouncedControl
                      type="color"
                      value={playConfig.backgroundColor}
                      onChange={(val) => setPlayConfig((prev) => ({ ...prev, backgroundColor: val }))}
                      disabled={playConfig.enableTransparentBg}
                    />
                  </label>
                  <label className="pgColorField">
                    <span>Lightning</span>
                    <DebouncedControl type="color" value={playConfig.lightningColor} onChange={(val) => setPlayConfig((prev) => ({ ...prev, lightningColor: val }))} />
                  </label>
                  <label className="pgColorField">
                    <span>Globe</span>
                    <DebouncedControl type="color" value={playConfig.globeColor} onChange={(val) => setPlayConfig((prev) => ({ ...prev, globeColor: val }))} />
                  </label>
                </div>

                <div className="pgToggleRow">
                  <div>
                    <div className="pgToggleTitle">Transparent Background</div>
                    <div className="pgToggleHint">Use page background</div>
                  </div>
                  <Switch checked={playConfig.enableTransparentBg} onChange={(val) => setPlayConfig((prev) => ({ ...prev, enableTransparentBg: val }))} />
                </div>

                <div className="pgToggleRow">
                  <div>
                    <div className="pgToggleTitle">Glow Effect</div>
                    <div className="pgToggleHint">Additive blending</div>
                  </div>
                  <Switch checked={playConfig.glowEffect} onChange={(val) => setPlayConfig((prev) => ({ ...prev, glowEffect: val }))} />
                </div>
              </div>
            </aside>
          </div>
        </main>
      ) : (
        <>
          <main className="hero" role="main">
            <div className="heroInner">
              <div className="heroContent">
                <div className="kicker">
                  <span className="badge">React</span>
                  <span className="badge">Three.js</span>
                  <span className="badge">WebGL</span>
                </div>
                <h1>
                  Particle hero that
                  <span className="titleAccent"> morphs</span>
                  <br />
                  from shape to text.
                </h1>
                <p>
                  Drop-in component for modern landing pages: a 3D particle system that transitions between a 3D preset shape and
                  your text, with optional lightning and glow.
                </p>

                <div className="actions">
                  <a className="primary" href="https://www.npmjs.com/package/3d-shape-particle-text" target="_blank" rel="noreferrer">
                    Install
                  </a>
                  <a className="secondary" href="https://github.com/mukes555/3d-shape-particle-text" target="_blank" rel="noreferrer">
                    View source
                  </a>
                </div>

                <div className="install">
                  <span className="installLabel">npm</span>
                  <code>npm i 3d-shape-particle-text three</code>
                </div>

                <div className="features">
                  <div className="feature">
                    <div className="featureTitle">Morph animation</div>
                    <div className="featureDesc">Smooth shape ↔ text transitions with tuned easing.</div>
                  </div>
                  <div className="feature">
                    <div className="featureTitle">Lightning + glow</div>
                    <div className="featureDesc">Optional electric accents and additive blending.</div>
                  </div>
                  <div className="feature">
                    <div className="featureTitle">Themeable</div>
                    <div className="featureDesc">Colors, density, camera distance, opacity, speed.</div>
                  </div>
                </div>
              </div>

              <div className="heroVisual" aria-label="3D particle preview">
                <div className="visualFrame">
                  <div className="visualGlow" aria-hidden="true" />
                  <ShapeParticleText
                    text={config.text}
                    shape={config.shape}
                    particleCount={config.particleCount}
                    particleSize={config.particleSize}
                    primaryColor={config.primaryColor}
                    secondaryColor={config.secondaryColor}
                    backgroundColor={config.backgroundColor}
                    transparent={config.enableTransparentBg}
                    morphDuration={config.morphDuration}
                    rotationSpeed={config.enableRotation ? config.rotationSpeed : 0}
                    hoverIntensity={config.hoverIntensity}
                    lightningIntensity={config.enableLightning ? config.lightningIntensity : 0}
                    lightningColor={config.lightningColor}
                    cameraDistance={config.cameraDistance}
                    globeOpacity={config.globeOpacity}
                    globeColor={config.globeColor}
                    showGlobe={config.showGlobe}
                    glowEffect={config.glowEffect}
                    zapSpread={config.zapSpread}
                    zapWidth={config.zapWidth}
                  />
                  <div className="visualOverlay" aria-hidden="true" />
                </div>
              </div>
            </div>
          </main>

          <section className="themes" aria-label="Theme gallery">
            <div className="themesInner">
              <div className="themesHeader">
                <div>
                  <h2>Default themes</h2>
                  <p>Pick a theme to preview it in the hero and copy its starter config.</p>
                </div>
                <div className="themesCurrent">
                  <span className="themesCurrentLabel">Selected</span>
                  <span className="themesCurrentValue">{selectedTheme.name}</span>
                </div>
              </div>

              <div className="themesGrid">
                {THEMES.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    className={`themeCard ${t.key === themeKey ? 'active' : ''}`}
                    onClick={() => applyTheme(t.key)}
                  >
                    <div className="themeSwatches" aria-hidden="true">
                      <span className="swatch" style={{ background: t.config.primaryColor }} />
                      <span className="swatch" style={{ background: t.config.secondaryColor }} />
                      <span className="swatch muted" style={{ background: t.config.backgroundColor }} />
                    </div>
                    <div className="themeMeta">
                      <div className="themeName">{t.name}</div>
                      <div className="themeText">Text: {t.config.text}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="themesCode">
                <div className="codeHeader">
                  <div className="codeTitle">Starter config</div>
                  <div className="codeHint">Copy/paste into your hero section</div>
                </div>
                <pre className="codeBlock">
                  <code>{codeSample}</code>
                </pre>
              </div>
            </div>
          </section>

          <div className={`themeDock ${themeDockOpen ? 'open' : ''}`}>
            <button
              type="button"
              className="themeDockButton"
              aria-expanded={themeDockOpen}
              aria-controls="themeDockPanel"
              onClick={() => setThemeDockOpen((v) => !v)}
            >
              <span className="themeDockSwatches" aria-hidden="true">
                <span className="dockSwatch" style={{ background: config.primaryColor }} />
                <span className="dockSwatch" style={{ background: config.secondaryColor }} />
              </span>
              <span className="themeDockLabel">Themes</span>
              <span className="themeDockValue">{selectedTheme.name}</span>
            </button>

            <div id="themeDockPanel" className="themeDockPanel" role="dialog" aria-label="Select theme">
              <div className="themeDockPanelHeader">
                <div className="themeDockPanelTitle">Themes</div>
                <button type="button" className="themeDockClose" onClick={() => setThemeDockOpen(false)}>
                  Close
                </button>
              </div>
              <div className="themeDockList">
                {THEMES.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    className={`themeDockItem ${t.key === themeKey ? 'active' : ''}`}
                    onClick={() => {
                      applyTheme(t.key)
                      setThemeDockOpen(false)
                    }}
                  >
                    <span className="themeDockItemSwatches" aria-hidden="true">
                      <span className="dockSwatch" style={{ background: t.config.primaryColor }} />
                      <span className="dockSwatch" style={{ background: t.config.secondaryColor }} />
                      <span className="dockSwatch muted" style={{ background: t.config.backgroundColor }} />
                    </span>
                    <span className="themeDockItemMeta">
                      <span className="themeDockItemName">{t.name}</span>
                      <span className="themeDockItemText">{t.config.text}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App
