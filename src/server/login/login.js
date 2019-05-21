const addConnection = require('./addConnection');

const login = (app, connectedUser) => {
  app.ws('/login/', (ws) => {
    ws.on('message', (msg) => {
      const { userName } = JSON.parse(msg);
      if (userName) {
        const connectionId = addConnection(connectedUser, userName);
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
      }
    });
  });
};

module.exports = login;
