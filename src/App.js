import React, { useState } from 'react'
import './App.css';

import  useCollectionData  from './firebase_setup/useCollectionData';
import CRUDComponent from './components/crud'; 
const App = () => {
  const collectionUsuarios = "usuarios"; // Nombre de la colección deseada
  const collectionCiudades = "ciudades"; // Nombre de la colección deseada
  const usuariosData = useCollectionData(collectionUsuarios);
  const [showUsuarios, setShowUsuarios] = useState(false);

  const ciudadesData = useCollectionData(collectionCiudades);
  const [showCiudades, setShowCiudades] = useState(false);

  function mostrarUsuarios() {
    setShowUsuarios(!showUsuarios);
  }

  function mostrarCiudades () {
    setShowCiudades(!showCiudades);
  }

  
    console.log("usuarios",usuariosData)
    console.log("ciudads",ciudadesData)

    return (
      <div className="App">
        <header className="App-header">
          <h1>Portafolio de Título</h1>
        </header>
        <section className="seccionBotones">
          <div className="contenedorBotones">
            <button data-testid="mostrarUsuarios" className="mostrarUsuarios" id="mostrarUsuarios" onClick={mostrarUsuarios} >mostrar usuarios</button>
            <button data-testid="mostrarCiudades" className="mostrarCiudades" id="mostrarCiudades" onClick={mostrarCiudades} >mostrar ciudades</button>
          </div>
        </section>
        {showUsuarios && usuariosData && (
        <section className="seccionUsuarios">
          <h2>Lista de Usuarios</h2>
          <CRUDComponent collectionName="usuarios" />
        </section>
            )}
      {showCiudades && ciudadesData &&(
        <section className="seccionCiudades">
          <h2>Lista de Ciudades</h2>
        </section>
            )}
      </div>
    );
}

export default App;
