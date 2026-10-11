import React from 'react'

const Header = ({ title }) => (
  <header className="header">
    <h1 className="header-title">
      <a href="/">{title}</a>
    </h1>
    <p className="header-subtitle">
      using <a href="https://github.com/algolia/react-instantsearch">React InstantSearch Hooks</a>
    </p>
  </header>
)

export default Header
