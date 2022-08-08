import logo from '../assets/logo.svg';
import '../stylesheets/App.css';
import Patient from '../components/Patient';
import SearchBar from '../components/SearchBar';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SearchBar placeholder="Enter your search input here..." />
        <Patient />

        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );
}

export default App;
