import { useMemo, useState } from 'react'
import './App.css'
import { ShapeParticleText } from '3d-shape-particle-text'

const THEMES = [
  {
    key: 'default',
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
  {
    key: 'cyberpunk',
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
  {
    key: 'matrix',
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
  {
    key: 'fire',
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
  {
    key: 'ice',
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
]

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  }
}

const FALLBACK_PRIMARY_RGB = { r: 0.396, g: 0.239, b: 0.82 }
const FALLBACK_SECONDARY_RGB = { r: 0.537, g: 0.239, b: 0.82 }

function App() {
  const themesByKey = useMemo(() => Object.fromEntries(THEMES.map((t) => [t.key, t])), [])
  const [themeKey, setThemeKey] = useState('default')
  const [themeDockOpen, setThemeDockOpen] = useState(false)
  const selectedTheme = themesByKey[themeKey] || THEMES[0]
  const config = selectedTheme.config

  const { primaryRgb, secondaryRgb } = useMemo(() => {
    return {
      primaryRgb: hexToRgb(config.primaryColor) || FALLBACK_PRIMARY_RGB,
      secondaryRgb: hexToRgb(config.secondaryColor) || FALLBACK_SECONDARY_RGB
    }
  }, [config.primaryColor, config.secondaryColor])

  const codeSample = useMemo(() => {
    const lines = [
      '<ShapeParticleText',
      `  text="${config.text}"`,
      `  particleCount={${config.particleCount}}`,
      `  particleSize={${config.particleSize}}`,
      `  primaryColor={{ r: ${primaryRgb.r.toFixed(3)}, g: ${primaryRgb.g.toFixed(3)}, b: ${primaryRgb.b.toFixed(3)} }}`,
      `  secondaryColor={{ r: ${secondaryRgb.r.toFixed(3)}, g: ${secondaryRgb.g.toFixed(3)}, b: ${secondaryRgb.b.toFixed(3)} }}`,
      `  backgroundColor="${config.backgroundColor}"`,
      `  transparent={${config.enableTransparentBg}}`,
      `  morphDuration={${config.morphDuration}}`,
      `  rotationSpeed={${config.enableRotation ? config.rotationSpeed : 0}}`,
      `  hoverIntensity={${config.hoverIntensity}}`,
      `  lightningIntensity={${config.enableLightning ? config.lightningIntensity : 0}}`,
      `  lightningColor="${config.lightningColor}"`,
      `  zapSpread={${config.zapSpread}}`,
      `  zapWidth={${config.zapWidth}}`,
      `  cameraDistance={${config.cameraDistance}}`,
      `  globeOpacity={${config.globeOpacity}}`,
      `  globeColor="${config.globeColor}"`,
      `  showGlobe={${config.showGlobe}}`,
      `  glowEffect={${config.glowEffect}}`,
      '/>'
    ]
    return lines.join('\n')
  }, [config, primaryRgb, secondaryRgb])

  return (
    <div
      className="page"
      style={{
        '--pageBase': config.backgroundColor,
        '--accent1': config.primaryColor,
        '--accent2': config.secondaryColor
      }}
    >
      <header className="nav">
        <div className="navInner">
          <a className="brand" href="https://www.npmjs.com/package/3d-shape-particle-text" target="_blank" rel="noreferrer">
            <span className="brandMark" aria-hidden="true" />
            <span className="brandText">3d-shape-particle-text</span>
          </a>
          <nav className="navLinks">
            <a href="https://www.npmjs.com/package/3d-shape-particle-text" target="_blank" rel="noreferrer">
              NPM
            </a>
            <a href="https://github.com/mukes555/3d-shape-particle-text" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </nav>
        </div>
      </header>

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
              from brain to text.
            </h1>
            <p>
              Drop-in component for modern landing pages: a 3D particle system that transitions between a brain-like form and
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
                <div className="featureDesc">Smooth brain ↔ text transitions with tuned easing.</div>
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
                particleCount={config.particleCount}
                particleSize={config.particleSize}
                primaryColor={primaryRgb}
                secondaryColor={secondaryRgb}
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
                onClick={() => setThemeKey(t.key)}
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
                  setThemeKey(t.key)
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
    </div>
  )
}

export default App
