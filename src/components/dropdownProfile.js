import React, { useState } from 'react';
import '../css/DropdownMenu.css';

const DropdownMenu = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="dropdown-container">
      <button className="round-button" onClick={toggleDropdown}>
        <img className="img-button-profile" src="https://cdn-icons-png.flaticon.com/512/1177/1177568.png"></img>
      </button>
      {isDropdownOpen && (
        <div className="dropdown-content">
          <a href="/">Iniciar Sesión</a>
          <a href="/">Mi Cuenta</a>
          <a href="/">Otra Opción</a>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
