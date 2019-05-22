import React, { Component } from 'react';

import { UncontrolledAlert as Alert } from 'reactstrap';
import Hand from './hand';
import Table from './table';

import prepareGameState from './entity/prepareGameState';
import handHandlerRaise from './entity/handHandlerRaise';
import handHandlerAction from './entity/handHandlerAction';

import './styles/gameScene.scss';
import './styles/alert.scss';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/bouncyflip.css';

class GameScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table: [],
      currentStep: null,
      playersData: [],
      stepTime: null,
      winMsg: null,
    };

    const inputState = props.location.state;
    if (inputState) {
      this.connectionId = inputState.connectionId;
    } else {
      window.location.replace('login');
    }

    this.myPlayerSeatId = 3;
    const { host } = window.location;
    this.sessionGameState = new WebSocket(`ws://${host}/session/${this.connectionId}`);

    this.handHandlerRaise = handHandlerRaise.bind(this);
    this.handHandlerAction = handHandlerAction.bind(this);
  }

  componentWillMount() {
    this.sessionGameState.addEventListener('message', (event) => {
      const gameState = JSON.parse(event.data);
      if (gameState) {
        this.setState(prepareGameState.call(this, gameState));
      }
    });
  }

  componentDidMount() {
    window.onbeforeunload = () => {
      this.sessionGameState.close();
      return false;
    };
  }

  render() {
    const {
      playersData, currentStep, stepTime, winMsg
    } = this.state;
    const myPlayer = playersData[this.myPlayerSeatId];
    const isMyStep = this.myPlayerSeatId === currentStep && myPlayer.bet.status !== 'fold';
    const handAction = isMyStep ? {
      handHandlerRaise: this.handHandlerRaise,
      handHandlerAction: this.handHandlerAction,
    } : false;

    return (
      <section className="container--main">
        {winMsg !== null ? (
          <Alert color="info">
            <span>{`${winMsg.winnerName} win: ${winMsg.value}`}</span>
          </Alert>
        ) : null }
        <Table {...this.state} myPlayerSeatId={this.myPlayerSeatId} />
        <Hand myPlayer={myPlayer} handAction={handAction} stepTime={stepTime} />
      </section>

    );
  }
}

export default GameScene;
