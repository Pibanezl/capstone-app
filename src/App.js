import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./screens/Home";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import firebaseApp from './firebase_setup/firebase'; 
import Header from './components/header'
import IncidenciaForm from "./components/create-incident"
const App = () => {
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  const [user, setUser] = useState(null);

  const setUserWithFirebaseAndRol = useCallback((usuarioFirebase) => {
    const getRol = async (uid) => {
      const docuRef = doc(firestore, `usuarios/${uid}`);
      const docuCifrada = await getDoc(docuRef);
      const infoFinal = docuCifrada.data().rol;
      return infoFinal;
    };

    getRol(usuarioFirebase.uid).then((rol) => {
      const userData = {
        uid: usuarioFirebase.uid,
        email: usuarioFirebase.email,
        rol: rol,
      };
      setUser(userData);
      console.log("userData:", userData);
    });
  }, [firestore, setUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        if (!user) {
          setUserWithFirebaseAndRol(usuarioFirebase);
        }
      } else {
        setUser(null);
      }
      console.log("Usuario Firebase:", usuarioFirebase);
    }, [auth, user, setUserWithFirebaseAndRol]);

    return () => unsubscribe();
  }, [auth, user, setUserWithFirebaseAndRol]);

  return (
    <Router>
      <div className="App">
        <Header user={user}/>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/form-incidencia" element={<IncidenciaForm />} />
          {/* Otras rutas */}
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </div>
    </Router>
  );
}

export default App;
