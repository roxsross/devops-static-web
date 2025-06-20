import React from 'react';

const LoadingSpinner = ({ message = "Cargando..." }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
      <div className="loading-pokeballs">
        <div className="pokeball pokeball-1">🔴</div>
        <div className="pokeball pokeball-2">🔴</div>
        <div className="pokeball pokeball-3">🔴</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;