import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { getRouteFromHash } from './appUtils'
import { SVG_PRESETS, THEMES } from './appData'
import { generateShapePoints } from './builderUtils'
import { AppNav } from './AppNav'
import { BetaRoute, HomeRoute, PlaygroundRoute } from './AppRoutes'

function App() {
  const themesByKey = useMemo(() => Object.fromEntries(THEMES.map((t) => [t.key, t])), [])
  const [themeKey, setThemeKey] = useState('default')
  const [themeDockOpen, setThemeDockOpen] = useState(false)
  const [route, setRoute] = useState(() => (typeof window === 'undefined' ? 'home' : getRouteFromHash()))
  const [playConfig, setPlayConfig] = useState(() => ({ ...THEMES[0].config }))
  const [betaConfig, setBetaConfig] = useState(() => ({ ...THEMES[0].config, shape: 'brain', shapePoints: null }))
  const [builderMode, setBuilderMode] = useState('templates')
  const [builderTemplate, setBuilderTemplate] = useState('knot')
  const [builderSeed, setBuilderSeed] = useState(1)
  const [builderParams, setBuilderParams] = useState({
    size: 1.75,
    targetRadius: 1.75,
    detail: 2,
    tube: 0.42,
    p: 2,
    q: 3,
    tubularSegments: 220,
    radialSegments: 18,
    radius: 0.75,
    length: 2.35,
    capSegments: 10,
    twist: 0.0,
    warp: 0.0,
    depth: 18,
    curveSegments: 14
  })
  const [builderSvgText, setBuilderSvgText] = useState(() => SVG_PRESETS[0].svg)
  const [builderSvgPreset, setBuilderSvgPreset] = useState('heart')
  const [importDraft, setImportDraft] = useState('')
  const [importApplied, setImportApplied] = useState('')
  const [builderStatus, setBuilderStatus] = useState({ points: 0, lastCopyOk: false })
  const [betaPanelOpen, setBetaPanelOpen] = useState(() => ({ text: true, builder: true }))
  const [playPanelOpen, setPlayPanelOpen] = useState(() => ({
    presets: false,
    text: true,
    shape: true,
    particles: true,
    animation: false,
    lightning: false,
    globe: false,
    camera: false,
    colors: false
  }))
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
    if (route === 'playground') setPlayConfig({ ...nextTheme.config, shapePoints: null })
    else if (route === 'beta') setBetaConfig((prev) => ({ ...nextTheme.config, shape: prev.shapePoints ? 'custom' : 'brain', shapePoints: prev.shapePoints || null }))
    else setPlayConfig({ ...nextTheme.config, shapePoints: null })
  }

  const activeConfig = useMemo(() => {
    if (route === 'playground') return playConfig
    if (route === 'beta') return betaConfig
    return config
  }, [route, playConfig, betaConfig, config])

  useEffect(() => {
    if (route !== 'beta') return

    let cancelled = false
    const timeout = setTimeout(() => {
      try {
        let importedPoints = null
        if (builderMode === 'import') {
          const parsed = JSON.parse(importApplied || '[]')
          if (parsed instanceof Float32Array) importedPoints = parsed
          else if (Array.isArray(parsed)) {
            if (parsed.length > 0 && typeof parsed[0] === 'number') importedPoints = new Float32Array(parsed)
            else if (parsed.length > 0 && typeof parsed[0] === 'object') {
              const flat = []
              for (const p of parsed) {
                if (!p) continue
                const x = typeof p.x === 'number' ? p.x : null
                const y = typeof p.y === 'number' ? p.y : null
                const z = typeof p.z === 'number' ? p.z : null
                if (x === null || y === null || z === null) continue
                flat.push(x, y, z)
              }
              importedPoints = new Float32Array(flat)
            }
          }
        }

        const shapePoints = generateShapePoints({
          mode: builderMode,
          template: builderTemplate,
          params: builderParams,
          svgText: builderSvgText,
          importedPoints,
          count: betaConfig.particleCount,
          seed: builderSeed
        })

        if (cancelled) return
        setBuilderStatus((prev) => ({ ...prev, points: shapePoints.length / 3 }))
        setBetaConfig((prev) => ({ ...prev, shape: 'custom', shapePoints }))
      } catch {
        if (cancelled) return
        setBuilderStatus((prev) => ({ ...prev, points: 0 }))
        setBetaConfig((prev) => ({ ...prev, shape: 'brain', shapePoints: null }))
      }
    }, 220)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [
    route,
    betaConfig.particleCount,
    builderMode,
    builderTemplate,
    builderParams,
    builderSvgText,
    importApplied,
    builderSeed
  ])

  const codeSample = useMemo(() => {
    const cfg = activeConfig
    const shape = cfg.shape || 'brain'
    const lines = [
      '<ShapeParticleText',
      `  text="${cfg.text}"`,
      `  shape="${shape}"`,
      ...(cfg.shapePoints ? ['  shapePoints={customShapePoints}'] : []),
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
      <AppNav route={route} />

      {route === 'playground' ? (
        <PlaygroundRoute
          playConfig={playConfig}
          setPlayConfig={setPlayConfig}
          playPanelOpen={playPanelOpen}
          setPlayPanelOpen={setPlayPanelOpen}
          selectedTheme={selectedTheme}
          themeKey={themeKey}
          applyTheme={applyTheme}
          codeSample={codeSample}
        />
      ) : route === 'beta' ? (
        <BetaRoute
          betaConfig={betaConfig}
          setBetaConfig={setBetaConfig}
          betaPanelOpen={betaPanelOpen}
          setBetaPanelOpen={setBetaPanelOpen}
          selectedTheme={selectedTheme}
          themeKey={themeKey}
          applyTheme={applyTheme}
          builderMode={builderMode}
          setBuilderMode={setBuilderMode}
          setBuilderSeed={setBuilderSeed}
          builderTemplate={builderTemplate}
          setBuilderTemplate={setBuilderTemplate}
          builderParams={builderParams}
          setBuilderParams={setBuilderParams}
          builderSvgText={builderSvgText}
          setBuilderSvgText={setBuilderSvgText}
          builderSvgPreset={builderSvgPreset}
          setBuilderSvgPreset={setBuilderSvgPreset}
          importDraft={importDraft}
          setImportDraft={setImportDraft}
          setImportApplied={setImportApplied}
          builderStatus={builderStatus}
          setBuilderStatus={setBuilderStatus}
          codeSample={codeSample}
        />
      ) : (
        <HomeRoute
          config={config}
          selectedTheme={selectedTheme}
          themeKey={themeKey}
          applyTheme={applyTheme}
          themeDockOpen={themeDockOpen}
          setThemeDockOpen={setThemeDockOpen}
          codeSample={codeSample}
        />
      )}
    </div>
  )
}

export default App
