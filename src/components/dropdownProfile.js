import React, { useState } from 'react';
import '../styles/sass/DropdownMenu.scss';
import { firebaseApp} from '../firebase_setup/firebase';
import { getAuth, signOut } from "firebase/auth";
import Login from '../screens/Login'
import perfil from '../images/perfil-blanco.png';
const DropdownMenu = ({ user }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const auth = getAuth(firebaseApp);
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };


  return (
    <div className="dropdown-container">
      <button className="round-button" id="buton-profile" onClick={toggleDropdown}>
        <img className="img-button-profile" src={perfil} alt="profile"></img>
      </button>
      {isDropdownOpen && (
        <div className="dropdown-content">
          {user != null && isDropdownOpen ? (
        <div>
          <a href="/">Mi Cuenta</a>
          <a href="/">Otra Opción</a>
          <span onClick={() => signOut(auth)}> Cerrar sesión</span>
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
