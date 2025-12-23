import { ShapeParticleText } from '3d-shape-particle-text'
import { copyText } from './appUtils'
import { BUILDER_TEMPLATES, SHAPES_PLAYGROUND, SVG_PRESETS, THEMES } from './appData'
import { formatShapePointsForExport } from './builderUtils'
import { DebouncedControl, Switch } from './uiControls'

export const PlaygroundRoute = ({ playConfig, setPlayConfig, playPanelOpen, setPlayPanelOpen, selectedTheme, themeKey, applyTheme, codeSample }) => {
  return (
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
              shapePoints={playConfig.shapePoints}
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

          <details className="themesCode themesCodeCollapsible">
            <summary className="codeHeader codeHeaderSummary">
              <span className="codeHeaderMeta">
                <span className="codeTitle">Current config</span>
                <span className="codeHint">Copy/paste into your app</span>
              </span>
              <span className="codeChevron" aria-hidden="true" />
            </summary>
            <pre className="codeBlock">
              <code>{codeSample}</code>
            </pre>
          </details>
        </div>

        <aside className="playgroundPanel" aria-label="Controls">
          <div className="pgPanelHeader">
            <div className="pgPanelTitle">Controls</div>
            <div className="pgPanelHint">Presets + live tuning</div>
          </div>

          <details
            className="pgSection pgCollapsible"
            open={playPanelOpen.presets}
            onToggle={(e) => {
              const nextOpen = e.currentTarget ? e.currentTarget.open : false
              setPlayPanelOpen((prev) => ({ ...prev, presets: nextOpen }))
            }}
          >
            <summary className="pgCollapsibleSummary">
              <span className="pgCollapsibleTitle">Presets</span>
              <span className="pgCollapsibleMeta">{selectedTheme.name}</span>
              <span className="pgCollapsibleChevron" aria-hidden="true" />
            </summary>
            <div className="pgCollapsibleBody">
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
          </details>

          <details
            className="pgSection pgCollapsible"
            open={playPanelOpen.text}
            onToggle={(e) => {
              const nextOpen = e.currentTarget ? e.currentTarget.open : false
              setPlayPanelOpen((prev) => ({ ...prev, text: nextOpen }))
            }}
          >
            <summary className="pgCollapsibleSummary">
              <span className="pgCollapsibleTitle">Text</span>
              <span className="pgCollapsibleMeta">{playConfig.text || '—'}</span>
              <span className="pgCollapsibleChevron" aria-hidden="true" />
            </summary>
            <div className="pgCollapsibleBody">
              <DebouncedControl
                type="text"
                className="pgInput"
                value={playConfig.text}
                onChange={(val) => setPlayConfig((prev) => ({ ...prev, text: val }))}
                maxLength={10}
                placeholder="AI"
              />
            </div>
          </details>

          <details
            className="pgSection pgCollapsible"
            open={playPanelOpen.shape}
            onToggle={(e) => {
              const nextOpen = e.currentTarget ? e.currentTarget.open : false
              setPlayPanelOpen((prev) => ({ ...prev, shape: nextOpen }))
            }}
          >
            <summary className="pgCollapsibleSummary">
              <span className="pgCollapsibleTitle">Shape</span>
              <span className="pgCollapsibleMeta">{playConfig.shape || 'brain'}</span>
              <span className="pgCollapsibleChevron" aria-hidden="true" />
            </summary>
            <div className="pgCollapsibleBody">
              <select
                className="pgInput"
                value={playConfig.shape || 'brain'}
                onChange={(e) => setPlayConfig((prev) => ({ ...prev, shape: e.target.value, shapePoints: null }))}
              >
                {SHAPES_PLAYGROUND.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.name}
                  </option>
                ))}
              </select>
              <div className="pgInlineHint">
                Want custom shapes?{' '}
                <a href="#beta">
                  Open Builder <span className="pgHintPill">Beta</span>
                </a>
              </div>
            </div>
          </details>

          <details
            className="pgSection pgCollapsible"
            open={playPanelOpen.particles}
            onToggle={(e) => {
              const nextOpen = e.currentTarget ? e.currentTarget.open : false
              setPlayPanelOpen((prev) => ({ ...prev, particles: nextOpen }))
            }}
          >
            <summary className="pgCollapsibleSummary">
              <span className="pgCollapsibleTitle">Particles</span>
              <span className="pgCollapsibleMeta">{playConfig.particleCount}</span>
              <span className="pgCollapsibleChevron" aria-hidden="true" />
            </summary>
            <div className="pgCollapsibleBody">
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
          </details>

          <details
            className="pgSection pgCollapsible"
            open={playPanelOpen.animation}
            onToggle={(e) => {
              const nextOpen = e.currentTarget ? e.currentTarget.open : false
              setPlayPanelOpen((prev) => ({ ...prev, animation: nextOpen }))
            }}
          >
            <summary className="pgCollapsibleSummary">
              <span className="pgCollapsibleTitle">Animation</span>
              <span className="pgCollapsibleMeta">{playConfig.morphDuration}s</span>
              <span className="pgCollapsibleChevron" aria-hidden="true" />
            </summary>
            <div className="pgCollapsibleBody">
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
          </details>

          <details
            className="pgSection pgCollapsible"
            open={playPanelOpen.lightning}
            onToggle={(e) => {
              const nextOpen = e.currentTarget ? e.currentTarget.open : false
              setPlayPanelOpen((prev) => ({ ...prev, lightning: nextOpen }))
            }}
          >
            <summary className="pgCollapsibleSummary">
              <span className="pgCollapsibleTitle">Lightning</span>
              <span className="pgCollapsibleMeta">{playConfig.enableLightning ? 'On' : 'Off'}</span>
              <span className="pgCollapsibleChevron" aria-hidden="true" />
            </summary>
            <div className="pgCollapsibleBody">
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
          </details>

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
  )
}

export const BetaRoute = ({
  betaConfig,
  setBetaConfig,
  betaPanelOpen,
  setBetaPanelOpen,
  selectedTheme,
  themeKey,
  applyTheme,
  builderMode,
  setBuilderMode,
  setBuilderSeed,
  builderTemplate,
  setBuilderTemplate,
  builderParams,
  setBuilderParams,
  builderSvgText,
  setBuilderSvgText,
  builderSvgPreset,
  setBuilderSvgPreset,
  importDraft,
  setImportDraft,
  setImportApplied,
  builderStatus,
  setBuilderStatus,
  codeSample
}) => {
  return (
    <main className="playground beta" role="main">
      <div className="playgroundInner">
        <div className="playgroundPreview">
          <div className="playgroundHeader">
            <div className="betaTitleRow">
              <h1 className="playgroundTitle">Builder</h1>
              <span className="betaPill">Beta</span>
            </div>
            <p className="playgroundSubtitle">Create custom shapes from templates, SVG, or imported points.</p>
          </div>

          <div className="visualFrame playgroundFrame" aria-label="3D particle preview">
            <div className="visualGlow" aria-hidden="true" />
            <ShapeParticleText
              text={betaConfig.text}
              shape={betaConfig.shape}
              shapePoints={betaConfig.shapePoints}
              particleCount={betaConfig.particleCount}
              particleSize={betaConfig.particleSize}
              primaryColor={betaConfig.primaryColor}
              secondaryColor={betaConfig.secondaryColor}
              backgroundColor={betaConfig.backgroundColor}
              transparent={betaConfig.enableTransparentBg}
              morphDuration={betaConfig.morphDuration}
              rotationSpeed={betaConfig.enableRotation ? betaConfig.rotationSpeed : 0}
              hoverIntensity={betaConfig.hoverIntensity}
              lightningIntensity={betaConfig.enableLightning ? betaConfig.lightningIntensity : 0}
              lightningColor={betaConfig.lightningColor}
              cameraDistance={betaConfig.cameraDistance}
              globeOpacity={betaConfig.globeOpacity}
              globeColor={betaConfig.globeColor}
              showGlobe={betaConfig.showGlobe}
              glowEffect={betaConfig.glowEffect}
              zapSpread={betaConfig.zapSpread}
              zapWidth={betaConfig.zapWidth}
            />
            <div className="visualOverlay" aria-hidden="true" />
          </div>

          <details className="themesCode themesCodeCollapsible">
            <summary className="codeHeader codeHeaderSummary">
              <span className="codeHeaderMeta">
                <span className="codeTitle">Current config</span>
                <span className="codeHint">Copy/paste into your app</span>
              </span>
              <span className="codeChevron" aria-hidden="true" />
            </summary>
            <pre className="codeBlock">
              <code>{codeSample}</code>
            </pre>
          </details>
        </div>

        <aside className="playgroundPanel" aria-label="Builder controls">
          <div className="pgPanelHeader">
            <div className="pgPanelTitle">Builder</div>
            <div className="pgPanelHint">Beta: generate `shapePoints`</div>
          </div>

          <details className="pgSection pgCollapsible">
            <summary className="pgCollapsibleSummary">
              <span className="pgCollapsibleTitle">Presets</span>
              <span className="pgCollapsibleMeta">{selectedTheme.name}</span>
              <span className="pgCollapsibleChevron" aria-hidden="true" />
            </summary>
            <div className="pgCollapsibleBody">
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
          </details>

          <details
            className="pgSection pgCollapsible"
            open={betaPanelOpen.text}
            onToggle={(e) => {
              const nextOpen = e.currentTarget ? e.currentTarget.open : false
              setBetaPanelOpen((prev) => ({ ...prev, text: nextOpen }))
            }}
          >
            <summary className="pgCollapsibleSummary">
              <span className="pgCollapsibleTitle">Text</span>
              <span className="pgCollapsibleMeta">{betaConfig.text || '—'}</span>
              <span className="pgCollapsibleChevron" aria-hidden="true" />
            </summary>
            <div className="pgCollapsibleBody">
              <DebouncedControl
                type="text"
                className="pgInput"
                value={betaConfig.text}
                onChange={(val) => setBetaConfig((prev) => ({ ...prev, text: val }))}
                maxLength={10}
                placeholder="AI"
              />
            </div>
          </details>

          <details
            className="pgSection pgCollapsible"
            open={betaPanelOpen.builder}
            onToggle={(e) => {
              const nextOpen = e.currentTarget ? e.currentTarget.open : false
              setBetaPanelOpen((prev) => ({ ...prev, builder: nextOpen }))
            }}
          >
            <summary className="pgCollapsibleSummary">
              <span className="pgCollapsibleTitle">Shape Builder</span>
              <span className="pgCollapsibleMeta">
                {(builderMode === 'templates' ? 'Templates' : builderMode === 'svg' ? 'SVG' : 'Import') + ` · ${builderStatus.points} pts`}
              </span>
              <span className="pgCollapsibleChevron" aria-hidden="true" />
            </summary>
            <div className="pgCollapsibleBody">
              <div className="pgToggleRow">
                <div>
                  <div className="pgToggleTitle">Generator</div>
                  <div className="pgToggleHint">Templates, SVG, or imports</div>
                </div>
                <button type="button" className="pgMiniButton" onClick={() => setBuilderSeed((s) => s + 1)}>
                  Shuffle
                </button>
              </div>

              <div className="pgTabs" role="tablist" aria-label="Custom shape mode">
                <button
                  type="button"
                  className={`pgTab ${builderMode === 'templates' ? 'active' : ''}`}
                  role="tab"
                  aria-selected={builderMode === 'templates'}
                  onClick={() => setBuilderMode('templates')}
                >
                  Templates
                </button>
                <button
                  type="button"
                  className={`pgTab ${builderMode === 'svg' ? 'active' : ''}`}
                  role="tab"
                  aria-selected={builderMode === 'svg'}
                  onClick={() => setBuilderMode('svg')}
                >
                  SVG
                </button>
                <button
                  type="button"
                  className={`pgTab ${builderMode === 'import' ? 'active' : ''}`}
                  role="tab"
                  aria-selected={builderMode === 'import'}
                  onClick={() => setBuilderMode('import')}
                >
                  Import
                </button>
              </div>

              {builderMode === 'templates' ? (
                <>
                  <div className="pgField">
                    <div className="pgFieldHeader">
                      <span>Template</span>
                    </div>
                    <select className="pgInput" value={builderTemplate} onChange={(e) => setBuilderTemplate(e.target.value)}>
                      {BUILDER_TEMPLATES.map((t) => (
                        <option key={t.key} value={t.key}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pgField">
                    <div className="pgFieldHeader">
                      <span>Size</span>
                      <span className="pgValue">{builderParams.targetRadius}</span>
                    </div>
                    <DebouncedControl
                      type="range"
                      className="pgRange"
                      min="0.6"
                      max="3.0"
                      step="0.05"
                      value={builderParams.targetRadius}
                      onChange={(val) => setBuilderParams((p) => ({ ...p, targetRadius: parseFloat(val) }))}
                    />
                  </div>

                  <div className="pgField">
                    <div className="pgFieldHeader">
                      <span>Twist</span>
                      <span className="pgValue">{builderParams.twist}</span>
                    </div>
                    <DebouncedControl
                      type="range"
                      className="pgRange"
                      min="-4.0"
                      max="4.0"
                      step="0.05"
                      value={builderParams.twist}
                      onChange={(val) => setBuilderParams((p) => ({ ...p, twist: parseFloat(val) }))}
                    />
                  </div>

                  <div className="pgField">
                    <div className="pgFieldHeader">
                      <span>Warp</span>
                      <span className="pgValue">{builderParams.warp}</span>
                    </div>
                    <DebouncedControl
                      type="range"
                      className="pgRange"
                      min="-0.5"
                      max="0.5"
                      step="0.01"
                      value={builderParams.warp}
                      onChange={(val) => setBuilderParams((p) => ({ ...p, warp: parseFloat(val) }))}
                    />
                  </div>

                  {builderTemplate === 'knot' || builderTemplate === 'ring' ? (
                    <div className="pgField">
                      <div className="pgFieldHeader">
                        <span>Tube</span>
                        <span className="pgValue">{builderParams.tube}</span>
                      </div>
                      <DebouncedControl
                        type="range"
                        className="pgRange"
                        min="0.08"
                        max="1.0"
                        step="0.01"
                        value={builderParams.tube}
                        onChange={(val) => setBuilderParams((p) => ({ ...p, tube: parseFloat(val) }))}
                      />
                    </div>
                  ) : null}

                  {builderTemplate === 'knot' ? (
                    <div className="pgGrid2">
                      <div className="pgField">
                        <div className="pgFieldHeader">
                          <span>p</span>
                          <span className="pgValue">{builderParams.p}</span>
                        </div>
                        <DebouncedControl
                          type="range"
                          className="pgRange"
                          min="1"
                          max="8"
                          step="1"
                          value={builderParams.p}
                          onChange={(val) => setBuilderParams((p) => ({ ...p, p: parseInt(val, 10) }))}
                        />
                      </div>
                      <div className="pgField">
                        <div className="pgFieldHeader">
                          <span>q</span>
                          <span className="pgValue">{builderParams.q}</span>
                        </div>
                        <DebouncedControl
                          type="range"
                          className="pgRange"
                          min="1"
                          max="10"
                          step="1"
                          value={builderParams.q}
                          onChange={(val) => setBuilderParams((p) => ({ ...p, q: parseInt(val, 10) }))}
                        />
                      </div>
                    </div>
                  ) : null}

                  {builderTemplate === 'capsule' ? (
                    <>
                      <div className="pgField">
                        <div className="pgFieldHeader">
                          <span>Radius</span>
                          <span className="pgValue">{builderParams.radius}</span>
                        </div>
                        <DebouncedControl
                          type="range"
                          className="pgRange"
                          min="0.12"
                          max="1.6"
                          step="0.01"
                          value={builderParams.radius}
                          onChange={(val) => setBuilderParams((p) => ({ ...p, radius: parseFloat(val) }))}
                        />
                      </div>
                      <div className="pgField">
                        <div className="pgFieldHeader">
                          <span>Length</span>
                          <span className="pgValue">{builderParams.length}</span>
                        </div>
                        <DebouncedControl
                          type="range"
                          className="pgRange"
                          min="0.3"
                          max="4.0"
                          step="0.05"
                          value={builderParams.length}
                          onChange={(val) => setBuilderParams((p) => ({ ...p, length: parseFloat(val) }))}
                        />
                      </div>
                    </>
                  ) : null}
                </>
              ) : null}

              {builderMode === 'svg' ? (
                <>
                  <div className="pgSvgPresets">
                    {SVG_PRESETS.map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        className={`pgChip ${builderSvgPreset === p.key ? 'active' : ''}`}
                        onClick={() => {
                          setBuilderSvgPreset(p.key)
                          setBuilderSvgText(p.svg)
                        }}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>

                  <textarea
                    className="pgTextarea"
                    value={builderSvgText}
                    onChange={(e) => setBuilderSvgText(e.target.value)}
                    rows={6}
                    spellCheck="false"
                  />

                  <div className="pgGrid2">
                    <div className="pgField">
                      <div className="pgFieldHeader">
                        <span>Depth</span>
                        <span className="pgValue">{builderParams.depth}</span>
                      </div>
                      <DebouncedControl
                        type="range"
                        className="pgRange"
                        min="2"
                        max="60"
                        step="1"
                        value={builderParams.depth}
                        onChange={(val) => setBuilderParams((p) => ({ ...p, depth: parseFloat(val) }))}
                      />
                    </div>
                    <div className="pgField">
                      <div className="pgFieldHeader">
                        <span>Curve</span>
                        <span className="pgValue">{builderParams.curveSegments}</span>
                      </div>
                      <DebouncedControl
                        type="range"
                        className="pgRange"
                        min="4"
                        max="40"
                        step="1"
                        value={builderParams.curveSegments}
                        onChange={(val) => setBuilderParams((p) => ({ ...p, curveSegments: parseInt(val, 10) }))}
                      />
                    </div>
                  </div>

                  <div className="pgField">
                    <div className="pgFieldHeader">
                      <span>Twist</span>
                      <span className="pgValue">{builderParams.twist}</span>
                    </div>
                    <DebouncedControl
                      type="range"
                      className="pgRange"
                      min="-4.0"
                      max="4.0"
                      step="0.05"
                      value={builderParams.twist}
                      onChange={(val) => setBuilderParams((p) => ({ ...p, twist: parseFloat(val) }))}
                    />
                  </div>

                  <div className="pgField">
                    <div className="pgFieldHeader">
                      <span>Warp</span>
                      <span className="pgValue">{builderParams.warp}</span>
                    </div>
                    <DebouncedControl
                      type="range"
                      className="pgRange"
                      min="-0.5"
                      max="0.5"
                      step="0.01"
                      value={builderParams.warp}
                      onChange={(val) => setBuilderParams((p) => ({ ...p, warp: parseFloat(val) }))}
                    />
                  </div>
                </>
              ) : null}

              {builderMode === 'import' ? (
                <>
                  <textarea
                    className="pgTextarea"
                    value={importDraft}
                    onChange={(e) => setImportDraft(e.target.value)}
                    rows={6}
                    spellCheck="false"
                    placeholder='Paste JSON: [x1,y1,z1,...] or [{"x":0,"y":0,"z":0},...]'
                  />
                  <div className="pgButtonRow">
                    <button
                      type="button"
                      className="pgMiniButton"
                      onClick={() => {
                        setImportApplied(importDraft)
                        setBuilderSeed((s) => s + 1)
                      }}
                    >
                      Apply
                    </button>
                    <button type="button" className="pgMiniButton ghost" onClick={() => setImportDraft('')}>
                      Clear
                    </button>
                  </div>
                </>
              ) : null}

              <div className="pgButtonRow">
                <button
                  type="button"
                  className="pgMiniButton ghost"
                  onClick={async () => {
                    const ok = await copyText(formatShapePointsForExport(betaConfig.shapePoints))
                    setBuilderStatus((s) => ({ ...s, lastCopyOk: ok }))
                    if (ok) setTimeout(() => setBuilderStatus((s) => ({ ...s, lastCopyOk: false })), 900)
                  }}
                >
                  {builderStatus.lastCopyOk ? 'Copied' : 'Copy `shapePoints`'}
                </button>
                <div className="pgInlineMeta">
                  <span className="pgInlineLabel">Points</span>
                  <span className="pgValue">{builderStatus.points}</span>
                </div>
              </div>
            </div>
          </details>

          <details className="pgSection pgCollapsible">
            <summary className="pgCollapsibleSummary">
              <span className="pgCollapsibleTitle">Particles</span>
              <span className="pgCollapsibleMeta">{betaConfig.particleCount}</span>
              <span className="pgCollapsibleChevron" aria-hidden="true" />
            </summary>
            <div className="pgCollapsibleBody">
              <div className="pgField">
                <div className="pgFieldHeader">
                  <span>Particle Count</span>
                  <span className="pgValue">{betaConfig.particleCount}</span>
                </div>
                <DebouncedControl
                  type="range"
                  className="pgRange"
                  min="5000"
                  max="50000"
                  step="1000"
                  value={betaConfig.particleCount}
                  onChange={(val) => setBetaConfig((prev) => ({ ...prev, particleCount: parseInt(val, 10) }))}
                />
              </div>

              <div className="pgField">
                <div className="pgFieldHeader">
                  <span>Particle Size</span>
                  <span className="pgValue">{betaConfig.particleSize}</span>
                </div>
                <DebouncedControl
                  type="range"
                  className="pgRange"
                  min="0.005"
                  max="0.05"
                  step="0.001"
                  value={betaConfig.particleSize}
                  onChange={(val) => setBetaConfig((prev) => ({ ...prev, particleSize: parseFloat(val) }))}
                />
              </div>
            </div>
          </details>

          <details className="pgSection pgCollapsible">
            <summary className="pgCollapsibleSummary">
              <span className="pgCollapsibleTitle">Animation</span>
              <span className="pgCollapsibleMeta">{betaConfig.morphDuration}s</span>
              <span className="pgCollapsibleChevron" aria-hidden="true" />
            </summary>
            <div className="pgCollapsibleBody">
              <div className="pgField">
                <div className="pgFieldHeader">
                  <span>Morph Duration</span>
                  <span className="pgValue">{betaConfig.morphDuration}s</span>
                </div>
                <DebouncedControl
                  type="range"
                  className="pgRange"
                  min="0.5"
                  max="6.0"
                  step="0.1"
                  value={betaConfig.morphDuration}
                  onChange={(val) => setBetaConfig((prev) => ({ ...prev, morphDuration: parseFloat(val) }))}
                />
              </div>

              <div className="pgField">
                <div className="pgFieldHeader">
                  <span>Hover Intensity</span>
                  <span className="pgValue">{betaConfig.hoverIntensity}</span>
                </div>
                <DebouncedControl
                  type="range"
                  className="pgRange"
                  min="0.0"
                  max="0.2"
                  step="0.01"
                  value={betaConfig.hoverIntensity}
                  onChange={(val) => setBetaConfig((prev) => ({ ...prev, hoverIntensity: parseFloat(val) }))}
                />
              </div>

              <div className="pgToggleRow">
                <div>
                  <div className="pgToggleTitle">Auto Rotation</div>
                  <div className="pgToggleHint">Idle spin</div>
                </div>
                <Switch checked={betaConfig.enableRotation} onChange={(val) => setBetaConfig((prev) => ({ ...prev, enableRotation: val }))} />
              </div>

              {betaConfig.enableRotation ? (
                <div className="pgField">
                  <div className="pgFieldHeader">
                    <span>Rotation Speed</span>
                    <span className="pgValue">{betaConfig.rotationSpeed}</span>
                  </div>
                  <DebouncedControl
                    type="range"
                    className="pgRange"
                    min="0"
                    max="1.0"
                    step="0.05"
                    value={betaConfig.rotationSpeed}
                    onChange={(val) => setBetaConfig((prev) => ({ ...prev, rotationSpeed: parseFloat(val) }))}
                  />
                </div>
              ) : null}
            </div>
          </details>

          <details className="pgSection pgCollapsible">
            <summary className="pgCollapsibleSummary">
              <span className="pgCollapsibleTitle">Lightning</span>
              <span className="pgCollapsibleMeta">{betaConfig.enableLightning ? 'On' : 'Off'}</span>
              <span className="pgCollapsibleChevron" aria-hidden="true" />
            </summary>
            <div className="pgCollapsibleBody">
              <div className="pgToggleRow">
                <div>
                  <div className="pgToggleTitle">Neural Activity</div>
                  <div className="pgToggleHint">Electric accents</div>
                </div>
                <Switch checked={betaConfig.enableLightning} onChange={(val) => setBetaConfig((prev) => ({ ...prev, enableLightning: val }))} />
              </div>

              {betaConfig.enableLightning ? (
                <>
                  <div className="pgField">
                    <div className="pgFieldHeader">
                      <span>Intensity</span>
                      <span className="pgValue">{betaConfig.lightningIntensity}</span>
                    </div>
                    <DebouncedControl
                      type="range"
                      className="pgRange"
                      min="0"
                      max="5.0"
                      step="0.1"
                      value={betaConfig.lightningIntensity}
                      onChange={(val) => setBetaConfig((prev) => ({ ...prev, lightningIntensity: parseFloat(val) }))}
                    />
                  </div>

                  <div className="pgField">
                    <div className="pgFieldHeader">
                      <span>Zap Spread</span>
                      <span className="pgValue">{betaConfig.zapSpread}</span>
                    </div>
                    <DebouncedControl
                      type="range"
                      className="pgRange"
                      min="0"
                      max="2.0"
                      step="0.1"
                      value={betaConfig.zapSpread}
                      onChange={(val) => setBetaConfig((prev) => ({ ...prev, zapSpread: parseFloat(val) }))}
                    />
                  </div>

                  <div className="pgField">
                    <div className="pgFieldHeader">
                      <span>Zap Width</span>
                      <span className="pgValue">{betaConfig.zapWidth}</span>
                    </div>
                    <DebouncedControl
                      type="range"
                      className="pgRange"
                      min="0.001"
                      max="0.02"
                      step="0.0005"
                      value={betaConfig.zapWidth}
                      onChange={(val) => setBetaConfig((prev) => ({ ...prev, zapWidth: parseFloat(val) }))}
                    />
                  </div>
                </>
              ) : null}
            </div>
          </details>

          <details className="pgSection pgCollapsible">
            <summary className="pgCollapsibleSummary">
              <span className="pgCollapsibleTitle">Globe</span>
              <span className="pgCollapsibleMeta">{betaConfig.showGlobe ? 'On' : 'Off'}</span>
              <span className="pgCollapsibleChevron" aria-hidden="true" />
            </summary>
            <div className="pgCollapsibleBody">
              <div className="pgToggleRow">
                <div>
                  <div className="pgToggleTitle">Wireframe Globe</div>
                  <div className="pgToggleHint">Outer sphere</div>
                </div>
                <Switch checked={betaConfig.showGlobe} onChange={(val) => setBetaConfig((prev) => ({ ...prev, showGlobe: val }))} />
              </div>

              {betaConfig.showGlobe ? (
                <div className="pgField">
                  <div className="pgFieldHeader">
                    <span>Opacity</span>
                    <span className="pgValue">{betaConfig.globeOpacity}</span>
                  </div>
                  <DebouncedControl
                    type="range"
                    className="pgRange"
                    min="0.0"
                    max="0.5"
                    step="0.01"
                    value={betaConfig.globeOpacity}
                    onChange={(val) => setBetaConfig((prev) => ({ ...prev, globeOpacity: parseFloat(val) }))}
                  />
                </div>
              ) : null}
            </div>
          </details>

          <details className="pgSection pgCollapsible">
            <summary className="pgCollapsibleSummary">
              <span className="pgCollapsibleTitle">Camera</span>
              <span className="pgCollapsibleMeta">{betaConfig.cameraDistance}</span>
              <span className="pgCollapsibleChevron" aria-hidden="true" />
            </summary>
            <div className="pgCollapsibleBody">
              <div className="pgField">
                <div className="pgFieldHeader">
                  <span>Distance</span>
                  <span className="pgValue">{betaConfig.cameraDistance}</span>
                </div>
                <DebouncedControl
                  type="range"
                  className="pgRange"
                  min="3.0"
                  max="10.0"
                  step="0.1"
                  value={betaConfig.cameraDistance}
                  onChange={(val) => setBetaConfig((prev) => ({ ...prev, cameraDistance: parseFloat(val) }))}
                />
              </div>
            </div>
          </details>

          <details className="pgSection pgCollapsible">
            <summary className="pgCollapsibleSummary">
              <span className="pgCollapsibleTitle">Colors</span>
              <span className="pgCollapsibleMeta">Theme</span>
              <span className="pgCollapsibleChevron" aria-hidden="true" />
            </summary>
            <div className="pgCollapsibleBody">
              <div className="pgColors">
                <label className="pgColorField">
                  <span>Primary</span>
                  <DebouncedControl type="color" value={betaConfig.primaryColor} onChange={(val) => setBetaConfig((prev) => ({ ...prev, primaryColor: val }))} />
                </label>
                <label className="pgColorField">
                  <span>Secondary</span>
                  <DebouncedControl type="color" value={betaConfig.secondaryColor} onChange={(val) => setBetaConfig((prev) => ({ ...prev, secondaryColor: val }))} />
                </label>
                <label className="pgColorField">
                  <span>Background</span>
                  <DebouncedControl
                    type="color"
                    value={betaConfig.backgroundColor}
                    onChange={(val) => setBetaConfig((prev) => ({ ...prev, backgroundColor: val }))}
                    disabled={betaConfig.enableTransparentBg}
                  />
                </label>
                <label className="pgColorField">
                  <span>Lightning</span>
                  <DebouncedControl type="color" value={betaConfig.lightningColor} onChange={(val) => setBetaConfig((prev) => ({ ...prev, lightningColor: val }))} />
                </label>
                <label className="pgColorField">
                  <span>Globe</span>
                  <DebouncedControl type="color" value={betaConfig.globeColor} onChange={(val) => setBetaConfig((prev) => ({ ...prev, globeColor: val }))} />
                </label>
              </div>

              <div className="pgToggleRow">
                <div>
                  <div className="pgToggleTitle">Transparent Background</div>
                  <div className="pgToggleHint">Use page background</div>
                </div>
                <Switch checked={betaConfig.enableTransparentBg} onChange={(val) => setBetaConfig((prev) => ({ ...prev, enableTransparentBg: val }))} />
              </div>

              <div className="pgToggleRow">
                <div>
                  <div className="pgToggleTitle">Glow Effect</div>
                  <div className="pgToggleHint">Additive blending</div>
                </div>
                <Switch checked={betaConfig.glowEffect} onChange={(val) => setBetaConfig((prev) => ({ ...prev, glowEffect: val }))} />
              </div>
            </div>
          </details>
        </aside>
      </div>
    </main>
  )
}

export const HomeRoute = ({ config, selectedTheme, themeKey, applyTheme, themeDockOpen, setThemeDockOpen, codeSample }) => {
  return (
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
              Drop-in component for modern landing pages: a 3D particle system that transitions between a 3D preset shape and your text, with
              optional lightning and glow.
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
              <h2>Landing templates</h2>
              <p>Pick a template to preview it in the hero and copy its starter config.</p>
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
  )
}

