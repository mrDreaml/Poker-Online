function connect() {
  const { host } = window.location;
  const ws = new WebSocket(`ws://${host}/login/`);
  const connectionData = {
    userName: 'Dima',
  };
  ws.onopen = () => {
    ws.send(JSON.stringify(connectionData));
    ws.onmessage = ({ data }) => {
      const message = JSON.parse(data);
      if (message.status === 'Connected') {
        this.setState({
          sessionAccess: {
            connectionId: message.connectionId,
            userName: connectionData.userName,
          },
        });
      } else {
        console.log('There is no free place');
      }
    };
  };
}

export default connect;
