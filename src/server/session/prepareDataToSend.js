/*
  Author: mrDreaml
  code review: 24.5.2019 mrDreaml v 1.0
*/

function prepareDataToSend(gameState, connectionId, maxSessionUser) {
  if (gameState) {
    // encapsulation players data

    const privatePlayersData = gameState.playersData.reduce((privatePlayersDataAccamulator, playerData, seatId) => {
      const currentPlayerData = { ...playerData };
      if (Number(connectionId) !== seatId) {
        delete currentPlayerData.hand;
      }
      return privatePlayersDataAccamulator.concat(currentPlayerData);
    }, []);


    // players data should be fulfilled even if players quantity
    // less then max capacity, emulate sequence of players seats

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
