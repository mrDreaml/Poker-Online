import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import Connect from './connect';

import './login.scss';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionAccess: null,
      userName: {
        error: true,
      },
      money: {
        error: true,
      },
    };

    this.connect = Connect.bind(this);
    this.renderRedirect = this.renderRedirect.bind(this);
  }

  handleInputChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    if (name === 'userName') {
      let error;
      if (value.length > 8 || value.length < 3) {
        error = 'Length must be from 3 to 8 length';
      }
      this.setState({
        userName: {
          error,
          value,
        },
      });
    } if (name === 'money') {
      let error;
      if (value <= 0 || isNaN(value)) {
        error = 'money is not correct value';
      }
      this.setState({
        money: {
          error,
          value,
        },
      });
    }
  };

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
    const { userName, money } = this.state;
    let connectionData;
    if (userName && money) {
      connectionData = {
        userName: userName.value,
        money: money.value,
      };
    }
    return (
      <Fragment>
        {this.renderRedirect()}
        <div className="shape">
          <h2>Login</h2>
          <div className="user-data">
            <input className={userName.error ? 'error' : ''} name="userName" onChange={this.handleInputChange} placeholder="Your name" title={userName.error ? userName.error : ''} />
            <input className={money.error ? 'error' : ''} name="money" onChange={this.handleInputChange} placeholder="Money" title={money.error ? money.error : ''} />
          </div>
          <button className="submit" type="button" onClick={() => ((!userName.error && !money.error) ? this.connect(connectionData) : null)}>Connect</button>
        </div>
      </Fragment>
    );
  }
}

export default Login;
