import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./screens/Home";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import firebaseApp from './firebase_setup/firebase'; 
import { firebaseApp } from './firebase_setup/firebase';
import Header from './components/header'
import IncidenciaForm from "./components/create-incident"
import Dashboard from './screens/Dashboard';
import Incidencia from './screens/Incidencia';
import "./styles/sass/header.scss"
const App = () => {
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  const [user, setUser] = useState(null);

  const setUserWithFirebaseAndRol = useCallback((usuarioFirebase) => {
    let infoFinal;
    console.log("USUARIO FIREBBASE",usuarioFirebase)
    const getRol = async (uid) => {
      const docuRef = doc(firestore, `usuarios/${uid}`);
      const docuCifrada = await getDoc(docuRef);
      console.log("DOCUUUUU",docuCifrada.data())
      if(docuCifrada.data() === undefined){
        console.log("ENTRO ROLL ESTUDIANTE")
        const docuRef1 = doc(firestore, `estudiantes/${uid}`);
      const docuCifrada1 = await getDoc(docuRef1);
      infoFinal = docuCifrada1.data();
      console.log("ENTRO ROLL ESTUDIANTE",docuCifrada1.data()) 
      }  else{
        console.log("ENTRO ROLL USUARIO",docuCifrada.data()) 
        infoFinal = docuCifrada.data();
      }
      
       return infoFinal;
    };

    getRol(usuarioFirebase.uid).then((info) => {
      const userData = {
        uid: usuarioFirebase.uid,
        email: usuarioFirebase.email,
        infoUsuario: info,
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
    <Router basename="/">
      <div className="App">
        <Header user={user} />
        <Routes>
          <Route path="/incidencia/:incidenciaId" element={<Incidencia user={user}/>} />
          <Route path="/" element={<Home user={user} />} />
          <Route path="form-incidencia" element={<IncidenciaForm user={user} />} />
          <Route path="dashboard" element={<Dashboard user={user}/>} />
          {/* Otras rutas */}
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </div>
    </Router>
  );
}

export default App;
