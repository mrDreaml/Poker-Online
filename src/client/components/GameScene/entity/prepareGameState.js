/*
    It's make true turn for client side
    do not change that code!
*/
function prepareGameState(gameState) {
  const { playersData } = gameState;
  const { connectionId, myPlayerSeatId } = this;

  const playerSeatsQuantity = playersData.length;
  const newStartPos = myPlayerSeatId - connectionId;
  const newTurn = new Array(playerSeatsQuantity);

  playersData.forEach((player, i) => {
    let newSeatId = i + newStartPos;
    if (newSeatId >= playerSeatsQuantity) {
      newSeatId -= playerSeatsQuantity;
    }
    newTurn[newSeatId] = player;
  });

  let newCurrentStep = gameState.currentStep + newStartPos;
  if (newCurrentStep >= playerSeatsQuantity) {
    newCurrentStep -= playerSeatsQuantity;
  }

  return Object.assign(gameState, {
    playersData: newTurn,
    currentStep: newCurrentStep
  });
}

export default prepareGameState;
