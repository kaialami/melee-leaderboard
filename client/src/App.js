import Dev from './Dev.js';
import Docs from './Docs.js';
import Home from './Home.js';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; 

function App() {

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/dev">
            <Dev />
          </Route>
          <Route exact path="/docs">
            <Docs />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
