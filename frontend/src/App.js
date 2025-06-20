import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import PokeCard from './components/PokeCard';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import PokemonModal from './components/PokemonModal';
import Footer from './components/Footer';

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [showShiny, setShowShiny] = useState(false);
  const [sortBy, setSortBy] = useState('id');
  const [filterType, setFilterType] = useState('all');

  const API_BASE_URL = process.env.REACT_APP_URL_DEVELOPMENT || 'http://localhost:8000';

  // Función para obtener todos los Pokémon
  const fetchPokemons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/all_pokemons?limit=20&include_shiny=${showShiny}`
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.results) {
        setPokemons(data.results);
        setFilteredPokemons(data.results);
      } else {
        throw new Error(data.message || 'Error al obtener los datos');
      }
    } catch (err) {
      console.error('Error fetching pokemons:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, showShiny]);

  // Función para filtrar y ordenar Pokémon
  const filterAndSortPokemons = useCallback(() => {
    let filtered = [...pokemons];

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.types.some(type => 
          type.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Aplicar filtro por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(pokemon =>
        pokemon.types.some(type => 
          type.toLowerCase() === filterType.toLowerCase()
        )
      );
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'height':
          return b.height - a.height;
        case 'weight':
          return b.weight - a.weight;
        case 'id':
        default:
          return a.id - b.id;
      }
    });

    setFilteredPokemons(filtered);
  }, [pokemons, searchTerm, filterType, sortBy]);

  // Obtener tipos únicos para el filtro
  const getUniqueTypes = useCallback(() => {
    const types = new Set();
    pokemons.forEach(pokemon => {
      pokemon.types.forEach(type => types.add(type));
    });
    return Array.from(types).sort();
  }, [pokemons]);

  // Función para obtener detalles de un Pokémon
  const fetchPokemonDetails = async (pokemonName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/pokemon/${pokemonName}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener detalles del Pokémon');
      }
      
      const data = await response.json();
      
      if (data.success && data.results.length > 0) {
        setSelectedPokemon(data.results[0]);
      }
    } catch (err) {
      console.error('Error fetching pokemon details:', err);
      setError(err.message);
    }
  };

  // Efectos
  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  useEffect(() => {
    filterAndSortPokemons();
  }, [filterAndSortPokemons]);

  // Handlers
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handlePokemonClick = (pokemon) => {
    fetchPokemonDetails(pokemon.name.toLowerCase());
  };

  const handleCloseModal = () => {
    setSelectedPokemon(null);
  };

  const handleRetry = () => {
    fetchPokemons();
  };

  const handleToggleShiny = () => {
    setShowShiny(!showShiny);
  };

  if (loading) {
    return (
      <div className="app">
        <Header />
        <LoadingSpinner message="Cargando Pokémon..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <Header />
        <div className="error-container">
          <div className="error-card">
            <h3>¡Oops! Algo salió mal</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={handleRetry}>
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="app">
        <Header />
        
        <div className="controls-container">
          <SearchBar onSearch={handleSearch} />
          
          <div className="filters-controls">
            <div className="filter-group">
              <label htmlFor="sort-select">Ordenar por:</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="id">ID</option>
                <option value="name">Nombre</option>
                <option value="height">Altura</option>
                <option value="weight">Peso</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="type-filter">Filtrar por tipo:</label>
              <select 
                id="type-filter"
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">Todos</option>
                {getUniqueTypes().map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="shiny-toggle">
                <input
                  type="checkbox"
                  checked={showShiny}
                  onChange={handleToggleShiny}
                />
                Mostrar sprites shiny
              </label>
            </div>
          </div>
        </div>

        <div className="results-info">
          <p>Mostrando {filteredPokemons.length} de {pokemons.length} Pokémon</p>
        </div>

        <div className="container">
          {filteredPokemons.length > 0 ? (
            <div className="pokemon-grid">
              {filteredPokemons.map((pokemon) => (
                <PokeCard 
                  key={pokemon.id} 
                  pokemon={pokemon} 
                  onClick={() => handlePokemonClick(pokemon)}
                  showShiny={showShiny}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No se encontraron Pokémon</h3>
              <p>Intenta con otros términos de búsqueda o filtros.</p>
            </div>
          )}
        </div>

        {selectedPokemon && (
          <PokemonModal 
            pokemon={selectedPokemon} 
            onClose={handleCloseModal}
            showShiny={showShiny}
          />
        )}

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;