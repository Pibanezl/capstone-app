import React, { useState } from 'react'
import './App.css';

import  useCollectionData  from './firebase_setup/useCollectionData';

const App = () => {
  const [buttonColor, setButtonColor] = useState('blue')
  const [buttonFuente, setButtonFuente] = useState('roboto')
  const collectionName = "usuarios"; // Nombre de la colección deseada
  const usuariosData = useCollectionData(collectionName);

  function cambioColor() {
    const newColor = buttonColor === 'blue' ? 'red' : 'blue';
    setButtonColor(newColor);
  }

  function cambioFuente () {
    const newFuente = buttonFuente === 'roboto' ? 'arial' : 'roboto';
    setButtonFuente(newFuente);
  }

  
    console.log("usuarios",usuariosData)


    return (
      <div className="App">
        <header className="App-header">
          <h1>Portafolio de Título</h1>
        </header>
        <section className="seccionBotones">
          <div className="contenedorBotones">
            <button data-testid="cambioColor" className="cambioBoton" id="cambioColor" onClick={cambioColor} style={{ backgroundColor: buttonColor }}>cambio color</button>
            <button data-testid="cambioFuente" className="cambioFuente" id="cambioFuente" onClick={cambioFuente} style={{ fontFamily: buttonFuente }}>cambio fuente</button>
          </div>
        </section>
      </div>
    );
}

export default App;
