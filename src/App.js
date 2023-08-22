import React, { useEffect, useState } from 'react'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import './App.css';

import {db} from './firebase_setup/firebase';
const App = () => {
  const [buttonColor, setButtonColor] = useState('blue')
  const [buttonFuente, setButtonFuente] = useState('roboto')
  let auxUsuarios = []
  const [usuarios, setUsuarios] = useState(auxUsuarios)

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await db.collection('usuarios').get();
      const auxUsuarios = [];
      querySnapshot.forEach(doc => {
        auxUsuarios.push(doc.data());
      });
      setUsuarios(auxUsuarios);
    };

    fetchData();
  }, []);

  function cambioColor() {
    const newColor = buttonColor === 'blue' ? 'red' : 'blue';
    setButtonColor(newColor);
  }

  function cambioFuente () {
    const newFuente = buttonFuente === 'roboto' ? 'arial' : 'roboto';
    setButtonFuente(newFuente);
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
