function handHandlerAction(eventName) {
  this.setState((oldState) => {
    const myPlayer = oldState.playersData[this.myPlayerSeatId];
    if (myPlayer.bet.status !== 'fold') {
      if (eventName === 'call' && myPlayer.bet.value > 0) {
        myPlayer.money -= myPlayer.bet.value;
      }
      oldState.currentStep = -1; // it's mean player can't do any more at that step
      const { host } = window.location;
      const socketSession = new WebSocket(`ws://${host}/session/${this.connectionId}`);
      socketSession.onopen = () => socketSession.send(JSON.stringify(
        {
          type: eventName,
          value: myPlayer.bet.value,
        }
      ));
    }
    return oldState;
  });
}

export default handHandlerAction;
