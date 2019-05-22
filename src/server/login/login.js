const addConnection = require('./addConnection');

const login = (app, connectedUser) => {
  app.ws('/login/', (ws) => {
    ws.on('message', (msg) => {
      const connectionData = JSON.parse(msg);
      const connectionId = addConnection(connectedUser, connectionData);
      if (connectionId !== -1) {
        ws.send(JSON.stringify({
          status: 'Connected',
          connectionId,
        }));
      } else {
        ws.send(JSON.stringify({
          status: 'Busy',
        }));
      }
    });
  });
};

module.exports = login;
