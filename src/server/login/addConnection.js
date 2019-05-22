const addConnection = (connectedUser, { userName, money }) => {
  const playerData = {
    userName,
    id: connectedUser.length,
    money,
    bet: { value: 0, status: 'none' }
  };
  if (connectedUser.length < connectedUser.maxSessionUser) {
    connectedUser.push(playerData);
    return connectedUser.length - 1;
  } if (connectedUser.includes(null)) {
    const seatId = connectedUser.findIndex(playerSeat => playerSeat === null);
    connectedUser[seatId] = playerData;
    return seatId;
  }
  return -1;
};

module.exports = addConnection;
