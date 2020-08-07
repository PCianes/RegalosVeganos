import React from 'react'
import { Link } from 'gatsby'

const Layout = props => {
  const { title, children } = props
  return (
    <div className="site-wrapper">
      <header className="site-head">
        <div id="menu" className="site-head-container">
          <div className="site-head-center">
            <Link className="site-head-logo" to={`/`}>
              {title}
            </Link>
          </div>
        </div>
      </header>
      <main id="site-main" className="site-main">
        <div id="swup" className="transition-fade">
          {children}
        </div>
      </main>
      <footer className="site-foot">
        &copy; {new Date().getFullYear()} <Link to={`/`}>{title}</Link>
      </footer>
    </div>
  )
}

export default Layout
