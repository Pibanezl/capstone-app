import React, { useState } from 'react';
import '../styles/sass/DropdownMenu.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import menuHamburguesa from '../images/menu-hamburguesa-blanco.png';
import dashboardIcon from '../images/dashboard-icon.png';
import incidenciaIcon from '../images/icon-incidencia.png';
const DropdownMenuLeft = ({ user }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleUserNull = (text) => {
        const buttonElement = document.getElementById('buton-profile');

        if (text === "Dashboard") {
            toast.warn("Para visitar su Dashboard por favor inicie sesión", {
                theme: "colored"
            })
            buttonElement.click();
        } else if (text === "Incidencia") {
            toast.warn("Para crear una incidencia por favor inicie sesión", {
                theme: "colored"
            })
            buttonElement.click();
        } else {
        }

    };



    return (
        <div className="dropdown-container">
            <button className="round-button-menu" data-testid='mi-boton' onClick={toggleDropdown}>
                <img className="img-button-menu" src={menuHamburguesa} alt="menu"></img>
            </button>
            {isDropdownOpen && (
                <div className="dropdown-content-menu">
                    {user != null && isDropdownOpen ? (
                        <div className="container-menu">
                            <a href="/dashboard" className="option-button-menu" data-testid="dashboard-link">
                                <img className="img-button-menu" src={dashboardIcon} alt="icono-menu"></img>
                                <span className="option-button-menu-text">Dashboard</span>
                            </a>
                            <a href="/form-incidencia" className="option-button-menu">
                            <img className="img-button-menu-incidencia" src={incidenciaIcon} alt="icono-menu"></img>
                                <span className="option-button-menu-text">Crear incidencia</span>
                            </a>
                        </div>) :
                        (<div className="container-menu">
                            <div className="option-button-menu" onClick={() => handleUserNull("Dashboard")}>
                                <img className="img-button-menu" src={dashboardIcon} alt="icono-menu"></img>
                                <span className="option-button-menu-text">Dashboard</span>
                            </div>
                            <div className="option-button-menu" onClick={() => handleUserNull("Incidencia")}>
                            <img className="img-button-menu-incidencia" src={incidenciaIcon} alt="icono-menu"></img>
                                <span className="option-button-menu-text">Crear incidencia</span>
                            </div>
                        </div>)}
                </div>
            )}
        </div>
    );
};

export default DropdownMenuLeft;
