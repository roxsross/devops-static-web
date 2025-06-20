import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>🔴 PokeOps by Roxs</h1>
        <h3>Descubre y explora el mundo Pokémon</h3>
        <h3>90 días de DevOps con Roxs</h3>
        <div className="header-features">
          <span className="feature-badge">✨ Sprites Shiny</span>
          <span className="feature-badge">🔍 Búsqueda Avanzada</span>
          <span className="feature-badge">📊 Estadísticas Detalladas</span>
        </div>
      </div>
    </header>
  );
};

export default Header;