function handHandlerAction(eventName) {
  const myPlayer = this.state.playersData[this.myPlayerSeatId];
  if (myPlayer.bet.status !== 'fold' && this.sessionGameState) {
    if ((eventName === 'call' && myPlayer.bet.value > 0) || eventName === 'fold') {
      this.sessionGameState.send(JSON.stringify(
        {
          type: eventName,
          value: myPlayer.bet.value,
        }
      ));
    }
  }
}

export default handHandlerAction;
