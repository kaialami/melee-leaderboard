import Docs from './Docs.js';
import Home from './Home.js';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; 
import Player from './Player.js';
import DevLogin from './DevLogin.js';
import Dev from './Dev.js';
import NotFound from './NotFound.js';

function App() {

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/dev-login">
            <DevLogin />
          </Route>
          <Route exact path="/dev">
            <Dev />
          </Route>
          <Route exact path="/docs">
            <Docs />
          </Route>
          <Route exact path="/player/:id">
            <Player />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
