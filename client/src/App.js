import Navbar from './Navbar.js';
import Title from './Title.js';
import Table from './Table.js';
import Credits from './Credits.js';

function App() {

  return (
    <div className="App">
      <Navbar />
      <Title />
      <div className='main'>
        <Table />
        <Credits />
      </div>
    </div>
  );
}

export default App;
