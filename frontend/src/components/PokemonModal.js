import React, { useEffect } from 'react';

const PokemonModal = ({ pokemon, onClose, showShiny }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getTypeColor = (type) => {
    const typeColors = {
      normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
      grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
      ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
      rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
      steel: '#B8B8D0', fairy: '#EE99AC'
    };
    return typeColors[type.toLowerCase()] || '#68A090';
  };

  const getStatColor = (statValue) => {
    if (statValue >= 100) return '#10b981';
    if (statValue >= 70) return '#f59e0b';
    if (statValue >= 40) return '#ef4444';
    return '#6b7280';
  };

  const frontSprite = showShiny && pokemon.sprites?.front_shiny 
    ? pokemon.sprites.front_shiny 
    : pokemon.sprites?.front_default;

  const backSprite = showShiny && pokemon.sprites?.back_shiny 
    ? pokemon.sprites.back_shiny 
    : pokemon.sprites?.back_default;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h2>{pokemon.name}</h2>
            <span className="pokemon-id">#{pokemon.id?.toString().padStart(3, '0')}</span>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="pokemon-detail">
            <div className="pokemon-images">
              <div className="image-container">
                <img 
                  src={frontSprite} 
                  alt={`${pokemon.name} front`}
                  className="pokemon-image"
                />
                <span className="image-label">Frente</span>
              </div>
              <div className="image-container">
                <img 
                  src={backSprite} 
                  alt={`${pokemon.name} back`}
                  className="pokemon-image"
                />
                <span className="image-label">Espalda</span>
              </div>
            </div>

            {showShiny && pokemon.sprites?.front_shiny && (
              <div className="shiny-notice">
                <span>✨ Mostrando versión shiny</span>
              </div>
            )}

            <div className="pokemon-info">
              <div className="basic-info">
                <div className="info-item">
                  <span className="info-label">Altura:</span>
                  <span className="info-value">{(pokemon.height / 10).toFixed(1)}m</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Peso:</span>
                  <span className="info-value">{(pokemon.weight / 10).toFixed(1)}kg</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Movimientos:</span>
                  <span className="info-value">{pokemon.moves_count || 'N/A'}</span>
                </div>
              </div>

              <div className="types-section">
                <h3>Tipos</h3>
                <div className="pokemon-types">
                  {pokemon.types?.map((type, index) => (
                    <span 
                      key={index} 
                      className="type-badge"
                      style={{ backgroundColor: getTypeColor(type) }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {pokemon.abilities && (
                <div className="abilities-section">
                  <h3>Habilidades</h3>
                  <div className="abilities-grid">
                    {pokemon.abilities.map((ability, index) => (
                      <div key={index} className="ability-item">
                        <span className="ability-name">{ability}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pokemon.stats && (
                <div className="stats-section">
                  <h3>Estadísticas Base</h3>
                  <div className="stats-grid">
                    {Object.entries(pokemon.stats).map(([statName, statValue]) => (
                      <div key={statName} className="stat-card">
                        <div className="stat-name">
                          {statName.replace('-', ' ').replace('_', ' ')}
                        </div>
                        <div 
                          className="stat-value"
                          style={{ color: getStatColor(statValue) }}
                        >
                          {statValue}
                        </div>
                        <div className="stat-bar">
                          <div 
                            className="stat-fill"
                            style={{ 
                              width: `${Math.min(statValue, 150) / 1.5}%`,
                              backgroundColor: getStatColor(statValue)
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pokemon.description && (
                <div className="description-section">
                  <h3>Descripción</h3>
                  <p className="pokemon-description">{pokemon.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonModal;