import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce para optimizar las búsquedas
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar Pokémon por nombre o tipo..."
          value={searchTerm}
          onChange={handleInputChange}
        />
        {searchTerm && (
          <button 
            className="clear-button" 
            onClick={handleClear}
            type="button"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;