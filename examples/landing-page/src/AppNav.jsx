export const AppNav = ({ route }) => {
  return (
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
          <a href="#beta" aria-current={route === 'beta' ? 'page' : undefined} className="navBeta">
            Builder <span className="navBetaPill">Beta</span>
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
  )
}

