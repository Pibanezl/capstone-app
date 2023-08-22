import React, { useEffect, useState } from 'react'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import './App.css';

import {db} from './firebase_setup/firebase';
const App = () => {
  const [buttonColor, setButtonColor] = useState('blue')
  const [buttonFuente, setButtonFuente] = useState('roboto')
  const [usuarios, setUsuarios] = useState([])
  useEffect(() => {
    db.collection('usuarios')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          setUsuarios(doc.data());
        });
      });
  }, []);

  function cambioColor() {
    const newColor = buttonColor === 'blue' ? 'red' : 'blue';
    setButtonColor({ buttonColor: newColor });
  }

  function cambioFuente () {
    const newFuente = buttonFuente === 'roboto' ? 'arial' : 'roboto';
    setButtonFuente({ buttonFuente: newFuente });
  }
 
  console.log("USUARIOS",usuarios)
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
