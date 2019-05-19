function handHandlerRaise() {
  this.setState((oldState) => {
    const myPlayer = oldState.playersData[this.myPlayerSeatId];
    const minBet = 10;
    if (myPlayer.bet.status !== 'fold' && myPlayer.money >= myPlayer.bet.value + minBet) {
      myPlayer.bet.value += minBet;
    }
    return oldState;
  });
}

export default handHandlerRaise;
