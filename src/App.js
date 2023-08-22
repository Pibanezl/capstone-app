import React from 'react'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import './App.css';
import handleSubmit from './handles/handlesubmit';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonColor: 'blue',
      buttonFuente: 'roboto',
      dataRef: useRef()
    };
  }
  
  cambioColor = () => {
    const newColor = this.state.buttonColor === 'blue' ? 'red' : 'blue';
    this.setState({ buttonColor: newColor });
  }

  cambioFuente = () => {
    const newFuente = this.state.buttonFuente === 'roboto' ? 'arial' : 'roboto';
    this.setState({ buttonFuente: newFuente });
  }

  componentDidMount(e) {
    e.preventDefault()
    handleSubmit(dataRef.current.value)
    dataRef.current.value = ""
  }

  render() {
    const { usuarios } = this.state;
    console.log("LISTA",usuarios)
    return (
      <div className="App">
        <header className="App-header">
          <h1>Portafolio de Título</h1>
        </header>
        <section className="seccionBotones">
          <div className="contenedorBotones">
            <button data-testid="cambioColor" className="cambioBoton" id="cambioColor" onClick={this.cambioColor} style={{ backgroundColor: this.state.buttonColor }}>cambio color</button>
            <button data-testid="cambioFuente" className="cambioFuente" id="cambioFuente" onClick={this.cambioFuente} style={{ fontFamily: this.state.buttonFuente }}>cambio fuente</button>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
