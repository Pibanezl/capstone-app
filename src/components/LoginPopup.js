import React, { useState } from 'react';
import Modal from 'react-modal';
const LoginPopup = ({ user, isOpen, onClose }) => {

  const handleLogin = () => {
    // Lógica de inicio de sesión aquí
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Login Popup"
      className="login-popup"
      overlayClassName="login-overlay"
    >
        {user === null ? (
        <div>
            
        </div>) :
        (<div>
          
        </div>)}
      <button className="Button-profile-close" onClick={onClose}>
        <img className="img-button-profile-close" src="https://cdn-icons-png.flaticon.com/512/7260/7260982.png">
            </img></button>
    </Modal>
  );
};

export default LoginPopup;
