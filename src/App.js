import React from 'react'
import './App.css';

class App extends React.Component {

  
  cambioColor = () => {
    alert('cambio color');
  }

  cambioFuente = () => {
    alert('cambio fuente');
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Portafolio de título</h1>
        </header>
        <section class="seccionBotones">
          <div class="contenedorBotones">
            <button class="cambioBoton" onClick={this.cambioColor}>cambiar color</button>
            <button class="cambioBoton" onClick={this.cambioFuente}>cambiar fuente</button>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
