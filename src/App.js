import React from 'react'
import logo2 from './no.jpg';
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
          <img src={logo2} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <p>acsmdh</p>
          <button class="cambioBoton" onClick={this.cambioColor}>cambiar color</button>
          <button class="cambioBoton" onClick={this.cambioFuente}>cambiar fuente</button>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            aprenda React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
