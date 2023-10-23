import React, { useState } from 'react';
import '../styles/sass/DropdownMenu.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
            <button className="round-button-menu" onClick={toggleDropdown}>
                <img className="img-button-menu" src="https://cdn-icons-png.flaticon.com/512/8695/8695151.png" alt="menu"></img>
            </button>
            {isDropdownOpen && (
                <div className="dropdown-content">
                    {user != null && isDropdownOpen ? (
                        <div className="container-menu">
                            <a href="/" className="option-button-menu">
                                <span className="option-button-menu-text">Dashboard</span>
                            </a>
                            <a href="/form-incidencia" className="option-button-menu">
                                <span className="option-button-menu-text">Crear incidencia</span>
                            </a>
                        </div>) :
                        (<div className="container-menu">
                            <div className="option-button-menu" onClick={() => handleUserNull("Dashboard")}>
                                <span className="option-button-menu-text">Dashboard</span>
                            </div>
                            <div className="option-button-menu" onClick={() => handleUserNull("Incidencia")}>
                                <span className="option-button-menu-text">Crear incidencia</span>
                            </div>
                        </div>)}
                </div>
            )}
        </div>
    );
};

export default DropdownMenuLeft;
