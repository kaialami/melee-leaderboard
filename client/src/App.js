import Dev from './Dev.js';
import Docs from './Docs.js';
import Home from './Home.js';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; 
import Player from './Player.js';

function App() {

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/dev">
            <Dev />
          </Route>
          <Route path="/docs">
            <Docs />
          </Route>
          <Route path="/player/:id">
            <Player />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
