import React, { useState } from 'react'
import './App.css';
import Loading from 'react-loading';

import  useCollectionData  from './firebase_setup/useCollectionData';
import UserCrud from './firebase_setup/crud';
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
          <h1 style={{color: 'red'}}>Portafolio de Título</h1>
        </header>
        <section className="seccionBotones">
          <div className="contenedorBotones">
            <button data-testid="mostrarUsuarios" className="mostrarUsuarios" id="mostrarUsuarios" onClick={mostrarUsuarios} >mostrar usuarios</button>
            <button data-testid="mostrarCiudades" className="mostrarCiudades" id="mostrarCiudades" onClick={mostrarCiudades} >mostrar ciudades</button>
          </div>
        </section>
        {showUsuarios && (
        <section className="seccionUsuarios">
        {usuariosData ? (
          <UserCrud />
        ) : (
          <Loading type="spin" color="#000000" height={50} width={50} />
        )}
      </section>
      )}
      {showCiudades && ciudadesData &&(
        <section className="seccionCiudades">
          <h2>Lista de Ciudades</h2>
          <ul>
            {ciudadesData.map((ciudad, index) => (
              <li key={index}>
                {ciudad.id} {ciudad.data.cod_postal}
              </li>
            ))}
          </ul>
        </section>
            )}
      </div>
    );
}

export default App;
