function connect(connectionData) {
  const { host } = window.location;
  const ws = new WebSocket(`ws://${host}/login/`);
  ws.onopen = () => {
    ws.send(JSON.stringify(connectionData));
    ws.onmessage = ({ data }) => {
      const message = JSON.parse(data);
      if (message.status === 'Connected') {
        this.setState({
          sessionAccess: {
            connectionId: message.connectionId,
            userName: connectionData.userName,
            money: connectionData.money,
          },
        });
      } else {
        console.log('There is no free place');
      }
    };
  };
}

export default connect;
