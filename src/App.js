import React, { useState, useEffect } from 'react';
import './App.css';
import Home from "./screens/Home";
import Login from "./screens/Login";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import firebaseApp from './firebase_setup/firebase'; 

const App = () => {
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  async function getRol(uid) {
    const docuRef = doc(firestore, `usuarios/${uid}`);
    const docuCifrada = await getDoc(docuRef);
    const infoFinal = docuCifrada.data().rol;
    return infoFinal;
  }

  function setUserWithFirebaseAndRol(usuarioFirebase) {
    getRol(usuarioFirebase.uid).then((rol) => {
      const userData = {
        uid: usuarioFirebase.uid,
        email: usuarioFirebase.email,
        rol: rol,
      };
      setUser(userData);
      setAuthLoaded(true);
      console.log("userData:", userData);
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        if (!user) {
          setUserWithFirebaseAndRol(usuarioFirebase);
        }
      } else {
        setUser(null);
        setAuthLoaded(true);
      }
      console.log("Usuario Firebase:", usuarioFirebase);
    });

    return () => unsubscribe();
  }, [auth, user]);

  if (!authLoaded) {
    // Mientras se verifica la autenticación, muestra "Cargando..."
    return (
      <div className="App">
        <header className="App-header">
          <h1>Portafolio de Título</h1>
        </header>
        <p>Cargando...</p>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </div>
    );
  }

  if (user === null) {
    // Muestra el componente de Login cuando user es null
    return (
      <div className="App">
        <header className="App-header">
          <h1>Portafolio de Título</h1>
        </header>
        <Login setUser={setUser} />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </div>
    );
  }

  // Cuando user no es null y la autenticación ha cargado, se muestra el componente Home
  return (
    <div className="App">
      <header className="App-header">
        <h1>Portafolio de Título</h1>
      </header>
      <Home user={user} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default App;
