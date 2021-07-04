import React from "react";

import firebase from "./../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ children, ...rest }) => {
  const [user, loading, error] = useAuthState(firebase.auth());
  if (loading) {
    return (
      <>
        <p> Loading</p>
      </>
    );
  }
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
