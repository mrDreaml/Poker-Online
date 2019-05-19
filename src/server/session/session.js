const PokerGame = require('../entity/pokerGame');
const prepareDataToSend = require('./prepareDataToSend');

// Time constants
const awaitingConnectionInterval = 2000;
const ping = 60;

const session = (app, connectedUser) => {
  const awaitingConnection = new Promise((res) => {
    const timer = setInterval(() => {
      if (connectedUser.length > 1) {
        clearInterval(timer);
        res();
      }
    }, awaitingConnectionInterval);
  });

  let Game;

  awaitingConnection.then(() => {
    Game = new PokerGame(connectedUser);
    Game.start();
  });

  // app.ws('/session', (ws, req) => {
  //   if (GamePublic) { // it's mean session is started
  //     ws.send(JSON.stringify(
  //       {
  //         players: GamePublic.getPlayers().length,
  //         updateInterval: awaitingPlayerChoiceInterval,
  //       }
  //     ));
  //   }
  // });


  app.ws('/session/:connectionId', (ws, req) => {
    const { connectionId } = req.params;
    let prevHashSum = null;
    setInterval(() => {
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
    }, ping);

    ws.on('message', (event) => {
      if (Game) {
        Game.playerEvent(JSON.parse(event), connectionId);
      }
    });
  });
};

module.exports = session;
