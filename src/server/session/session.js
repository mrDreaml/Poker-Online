const PokerGame = require('../entity/PokerGame');
const prepareDataToSend = require('./prepareDataToSend');

// Time constants
const awaitingConnectionInterval = 2000;
const ping = 60;

const session = (app, connectedUser) => {
  let Game;
  const timer = setInterval(() => {
    if (connectedUser.length > 1) {
      clearInterval(timer);
      Game = new PokerGame(connectedUser);
      Game.start();
    }
  }, awaitingConnectionInterval);

  const connectionBans = [];
  app.ws('/session/:connectionId', (ws, req) => {
    const { connectionId } = req.params;
    let prevHashSum = null;
    setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        if (Game) {
          const hashSum = Game.getHashSum;
          if (hashSum !== prevHashSum) {
            prevHashSum = hashSum;
            const { gameState } = Game;
            ws.send(
              JSON.stringify(
                prepareDataToSend({ ...gameState }, connectionId, connectedUser.maxSessionUser)
              )
            );
            const { winMsg, playersData } = gameState;
            if (winMsg !== null && playersData.length < connectedUser.length) {
              Game.joinPlayers(connectedUser);
            }
            if (playersData.length > connectedUser.length) {
              Game.removePlayers(connectedUser);
            }
            if (winMsg !== null) {
              Game.newGame();
            }
          }
        }
      } else if (ws.readyState === ws.CLOSED && !connectionBans.includes(connectionId)) {
        // if disconnect
        connectionBans.push(connectionId);
        connectedUser.splice(connectionId, 1);
      }
    }, ping);

    ws.on('message', (event) => {
      if (Game) {
        Game.playerEvent(JSON.parse(event), connectionId);
      }
    });
  });
};

module.exports = session;
