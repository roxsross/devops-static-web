import React, { useState } from 'react';

const PokeCard = ({ pokemon, onClick, showShiny }) => {
  const [imageError, setImageError] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const getTypeColor = (type) => {
    const typeColors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return typeColors[type.toLowerCase()] || '#68A090';
  };

  const frontSprite = showShiny && pokemon.sprites.front_shiny 
    ? pokemon.sprites.front_shiny 
    : pokemon.sprites.front_default;
    
  const backSprite = showShiny && pokemon.sprites.back_shiny 
    ? pokemon.sprites.back_shiny 
    : pokemon.sprites.back_default;

  return (
    <div className={`pokemon-card ${isFlipped ? 'flipped' : ''}`} onClick={onClick}>
      <div className="card-inner">
        {/* Lado frontal */}
        <div className="card-front">
          <div className="card-header">
            <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
            <h3 className="pokemon-name">{pokemon.name}</h3>
          </div>
          
          <div className="pokemon-image-container">
            {!imageError ? (
              <img 
                src={frontSprite} 
                alt={pokemon.name}
                className="pokemon-image"
                onError={handleImageError}
              />
            ) : (
              <div className="image-placeholder">
                <span>🔴</span>
                <p>Imagen no disponible</p>
              </div>
            )}
            
            {showShiny && pokemon.sprites.front_shiny && (
              <span className="shiny-indicator">✨</span>
            )}
          </div>

          <div className="pokemon-types">
            {pokemon.types.map((type, index) => (
              <span 
                key={index} 
                className="type-badge"
                style={{ backgroundColor: getTypeColor(type) }}
              >
                {type}
              </span>
            ))}
          </div>

          <div className="pokemon-stats-preview">
            <div className="stat-item">
              <span className="stat-label">Altura:</span>
              <span className="stat-value">{(pokemon.height / 10).toFixed(1)}m</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Peso:</span>
              <span className="stat-value">{(pokemon.weight / 10).toFixed(1)}kg</span>
            </div>
          </div>

          <button className="flip-button" onClick={handleCardFlip}>
            Voltear
          </button>
        </div>

        {/* Lado trasero */}
        <div className="card-back">
          <div className="card-header">
            <h3 className="pokemon-name">{pokemon.name}</h3>
          </div>

          <div className="pokemon-image-container">
            <img 
              src={backSprite} 
              alt={`${pokemon.name} back`}
              className="pokemon-image"
            />
          </div>

          <div className="pokemon-description">
            <p>{pokemon.description}</p>
          </div>

          {pokemon.abilities && (
            <div className="abilities-preview">
              <h4>Habilidades:</h4>
              <div className="abilities-list">
                {pokemon.abilities.slice(0, 2).map((ability, index) => (
                  <span key={index} className="ability-badge">
                    {ability}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button className="flip-button" onClick={handleCardFlip}>
            Voltear
          </button>
        </div>
      </div>

      <div className="card-footer">
        <button className="details-button" onClick={onClick}>
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

export default PokeCard;