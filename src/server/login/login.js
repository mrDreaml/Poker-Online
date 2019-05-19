const login = (app, connect) => {
  app.ws('/login/', (ws, req) => {
    ws.on('message', (msg) => {
      const { userName } = JSON.parse(msg);
      if (userName) {
        const connectionId = connect(userName);
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
