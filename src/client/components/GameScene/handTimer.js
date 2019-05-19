import React, { Component } from 'react';

const timerUpdateInterval = 1000;

class HandTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timerTick: props.time / 1000,
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState(oldState => (
        {
          timerTick: oldState.timerTick - 1
        }
      ));
    }, timerUpdateInterval);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { timerTick } = this.state;
    return (
      <span>
        {timerTick}
      </span>
    );
  }
}

export default HandTimer;
