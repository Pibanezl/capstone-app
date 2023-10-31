import React, { useEffect, useState } from 'react';
import DropdownProfile from './dropdownProfile';
import DropdownMenu from './dropdownMenu';
import { Link } from 'react-router-dom';
import logo from '../images/header.png';

const Header = ({ user }) => {
  const [headerHeight, setHeaderHeight] = useState(84); // Altura inicial del header
  const maxHeight = 92; // Altura máxima del header

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 1) { // Cambia 10 a un valor más bajo si deseas que sea más sensible
        const newHeight = headerHeight + (scrollY - 1);
        if (newHeight <= maxHeight) {
          setHeaderHeight(newHeight);
        } else {
          setHeaderHeight(maxHeight);
        }
      } else {
        setHeaderHeight(84); // Restaura la altura inicial
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headerHeight]);

  return (
    <div className="App-header" style={{ height: headerHeight + 'px' }}>
      <DropdownMenu user={user} />
      <Link className="App-header-title" to="/">
        <img className="App-header-title-logo" src={logo} alt="Logo" />
      </Link>
      <DropdownProfile user={user} />
    </div>
  );
};

export default Header;
