import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import firebase from "./../firebase";

import { Chart, Table } from "./../pages";

import Navbar from "./../components/NavBar";

const Dashboard = () => {
  let { path, url } = useRouteMatch();

  const logout = () => {
    firebase.auth().signOut();
  };
  return (
    <div>
      <Navbar />
      <Switch>
        <Route exact path={`${path}/table`}>
          <Table />
        </Route>
        <Route exact path={`${path}/chart`}>
          <Chart />
        </Route>
      </Switch>
    </div>
  );
};

export default Dashboard;
