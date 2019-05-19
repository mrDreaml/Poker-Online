const addConnection = (connectedUser, newUser) => {
  if (connectedUser.length < connectedUser.maxSessionUser) {
    connectedUser.push({
      userName: newUser,
      id: connectedUser.length,
      money: 100,
      bet: { value: 0, status: 'none' }
    });
    return connectedUser.length - 1;
  }
  return -1;
};

module.exports = addConnection;
