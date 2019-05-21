function prepareDataToSend(gameState, connectionId, maxSessionUser) {
  if (gameState) {
    // encapsulation players data

    const privatePlayersData = gameState.playersData.map((playerData, seatId) => {
      if (playerData) {
        if (Number(connectionId) !== seatId) {
          const privatePlayerData = Object.assign({}, playerData);
          delete privatePlayerData.hand;
          return privatePlayerData;
        }
      }
      return playerData;
    });


    // players data should be fulfilled even if players quantity
    // less then max capacity

    while (privatePlayersData.length < maxSessionUser) {
      privatePlayersData.push(null);
    }

    return (
      Object.assign(
        gameState,
        {
          playersData: privatePlayersData,
        }
      )
    );
  }
  return 'waiting for a people..';
}

module.exports = prepareDataToSend;
