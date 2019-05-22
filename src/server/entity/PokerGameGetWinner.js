const {
  isRoyalFlush,
  isStraightFlush,
  isFourofAKind,
  fullHouse,
  isFlush,
  isStraight,
  threeOfAKind,
  isTwoPair,
  isOnePair,
  getHightCardIndex
} = require('./PokerGameCombos');


isStraightFlush.comboName = 'Straight Flush';
isFourofAKind.comboName = 'Four af a Kind';
fullHouse.comboName = 'Full House';
isFlush.comboName = 'Flush';
isStraight.comboName = 'Straight';
threeOfAKind.comboName = 'Three of a Kind';
isTwoPair.comboName = 'Two Pair';
isOnePair.comboName = 'One Pair';
getHightCardIndex.comboName = 'High Card';

const PokerGameGetWinner = (table, hands) => {
  let winComboName = '';
  const playersInitiative = hands.reduce((summary, hand) => {
    const cards = table.concat(hand);
    if (isRoyalFlush(cards)) {
      winComboName = 'Royal Flush';
      return summary.concat(10);
    }
    const combinations = [isStraightFlush, isFourofAKind, fullHouse, isFlush, isStraight, threeOfAKind, isTwoPair, isOnePair, getHightCardIndex];
    const maxInitiative = 9;
    return summary.concat(combinations.reduce((acc, combination, i) => {
      if (acc === 0) {
        const currentCombo = combination(cards);
        if (currentCombo !== undefined) {
          winComboName = combination.comboName;
          let initiative = maxInitiative - i;
          initiative += currentCombo / 100;
          return initiative;
        }
      }
      return acc;
    }, 0));
  }, []);

  const playerWinner = playersInitiative.reduce((winner, initiaitve, playerId) => {
    if (winner.playerId === null || winner.initiaitve < initiaitve) {
      winner.playerId = playerId;
      winner.initiaitve = initiaitve;
      return winner;
    }
    if (winner.initiaitve === initiaitve) {
      return winner; // may have new condition
    }
    return winner;
  }, {
    playerId: null,
    initiative: null,
  });
  return playerWinner ? {
    winerId: playerWinner.playerId,
    comboName: winComboName,
  } : undefined;
};


module.exports = PokerGameGetWinner;
