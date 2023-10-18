import React, { useState } from 'react';
import firebase from "../firebase_setup/firebase"
import 'firebase/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PasswordReset() {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    firebase
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
    <div>
      <h2>Restablecer Contraseña</h2>
      <input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleResetPassword}>Enviar Correo de Restablecimiento</button>
    </div>
  );
}

export default PasswordReset;
