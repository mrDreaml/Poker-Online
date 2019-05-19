import React from 'react';
import {
  Route, BrowserRouter, Switch, Redirect,
} from 'react-router-dom';
import {
  GameScene, Login
} from './components/index';

const Main = () => (
  <BrowserRouter>
    <Switch>
      <Route
        exact
        path="/game"
        component={GameScene}
      />
      <Route
        exact
        path="/login"
        component={Login}
      />
      {/* <Route
          exact
          path="/"
          render={() => (<Redirect from="/" to="/im" />)}
        /> */}
    </Switch>
  </BrowserRouter>
);

export default Main;
