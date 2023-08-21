import React from 'react'
import logo from './logo.svg';
import logo2 from './no.jpg';
import './App.css';

class App extends React.Component {

  
  cambioColor = () => {
    alert('asdadasdasdasdasdasd');
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
          <button onClick={cambioColor}>wea</button>
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
