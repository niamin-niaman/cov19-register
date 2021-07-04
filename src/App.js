import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import firebase from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { Form, Chart, Table, SignIn, Dashboard } from "./pages";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [user, loading, error] = useAuthState(firebase.auth());
  console.log(user);
  return (
    <div className='container mx-auto'>
      <Router>
        <Switch>
          <Route exact path='/' component={Form} />
          <Route exact path='/login' component={SignIn} />
          <PrivateRoute exact path='/chart'>
            <Chart />
          </PrivateRoute>
          <PrivateRoute exact path='/table'>
            <Table />
          </PrivateRoute>
          <PrivateRoute path='/dashboard'>
            <Dashboard />
          </PrivateRoute>
        </Switch>
        {/* <Table/> */}
      </Router>
      {/* <SignIn /> */}
    </div>
  );
}

export default App;
