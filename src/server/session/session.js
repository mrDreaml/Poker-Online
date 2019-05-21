const PokerGame = require('../entity/PokerGame');
const prepareDataToSend = require('./prepareDataToSend');

// Time constants
const awaitingConnectionInterval = 2000;
const ping = 60;

const session = (app, connectedUser) => {
  const Game = new PokerGame(connectedUser);
  const timer = setInterval(() => {
    if (connectedUser.length > 1) {
      clearInterval(timer);
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
            ws.send(
              JSON.stringify(
                prepareDataToSend(Game.gameState, connectionId, connectedUser.maxSessionUser)
              )
            );
          }
        }
      } else if (ws.readyState === ws.CLOSED && !connectionBans.includes(connectionId)) {
        connectionBans.push(connectionId);
        connectedUser[connectionId] = null;
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
