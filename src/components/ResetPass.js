import React, { useState } from 'react';
import 'firebase/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { firebaseApp } from '../firebase_setup/firebase';
function PasswordReset() {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    firebaseApp
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        toast.success('Se ha enviado un correo electrónico de restablecimiento de contraseña.');
      })
      .catch(() => {
        console.log()
        toast.error('Inicio de sesión fallido. Verifica tus credenciales.');
      });
  };

  return (
    <div className="Container-login-resetpass">
      <h1 className="title-resetpass">Restablecer Contraseña</h1>
      <input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="Input-login-resetpass"
      />
      <button onClick={handleResetPassword} className="btn-login-resetpass">Restablecer</button>
    </div>
  );
}

export default PasswordReset;
