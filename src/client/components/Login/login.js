import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import Connect from './connect';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionAccess: null,
    };

    this.connect = Connect.bind(this);
    this.renderRedirect = this.renderRedirect.bind(this);
  }

  renderRedirect() {
    const { sessionAccess } = this.state;
    if (sessionAccess) {
      return (
        <Redirect to={{
          pathname: '/game',
          state: sessionAccess,
        }}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <Fragment>
        {this.renderRedirect()}
        <button type="button" onClick={this.connect}>Connect</button>
      </Fragment>
    );
  }
}

export default Login;
