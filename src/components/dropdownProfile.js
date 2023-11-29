import React, { useState } from 'react';
import '../styles/sass/DropdownMenu.scss';
import { firebaseApp} from '../firebase_setup/firebase';
import { getAuth, signOut } from "firebase/auth";
import Login from '../screens/Login'
import perfil from '../images/perfil-blanco.png';
import Cerrar from '../images/cerrarSesion.png';
const DropdownMenu = ({ user }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const auth = getAuth(firebaseApp);
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };


  return (
    <div className="dropdown-container">
      <button className="round-button" data-testid='mi-boton-profile' onClick={toggleDropdown}>
        <img className="img-button-profile" src={perfil} alt="profile"></img>
      </button>
      {isDropdownOpen && (
        <div className="dropdown-content">
          {user != null && isDropdownOpen ? (
        <div className="dropdown-container-text">
          <img className="img-button-menu-incidencia" src={Cerrar} alt="icono-menu"></img>
          <span onClick={() => signOut(auth)} className="dropdown-text"> Cerrar sesión</span>
        </div>) :
        (<div>
          <Login user={user}/>
        </div>)}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
