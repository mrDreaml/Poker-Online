const PokerCards = ['2C', '2D', '2H', '2S', '3C', '3D', '3H', '3S', '4C', '4D', '4H', '4S', '5C', '5D', '5H', '5S', '6C', '6D', '6H', '6S', '7C', '7D', '7H', '7S', '8C', '8D', '8H', '8S', '9C', '9D', '9H', '9S', '10C', '10D', '10H', '10S', 'AC', 'AD', 'AH', 'AS', 'JC', 'JD', 'JH', 'JS', 'KC', 'KD', 'KH', 'KS', 'QC', 'QD', 'QH', 'QS'];
const range = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];


const getHightCardIndex = cards => cards.reduce((highCardId, card) => {
  const currentRange = range.findIndex(e => e === card.slice(0, -1));
  if (highCardId > currentRange) {
    return currentRange;
  }
  return highCardId;
}, range.length);

const checkFlush = (cards) => {
  const suits = {
    C: 0,
    D: 0,
    H: 0,
    S: 0,
  };
  cards.reduce((acc, card) => {
    acc[card.slice(-1)] += 1;
    return suits;
  }, suits);

  const mostPopular = Object.entries(suits).reduce((acc, suit) => {
    if (acc === null) {
      return suit;
    }
    if (suit[1] > acc[1]) {
      return suit;
    }
    return acc;
  }, null);

  const isFlush = mostPopular[1] >= 5;

  return {
    mostPopular,
    isFlush,
  };
};

const isFlush = (cards) => {
  const flush = checkFlush(cards);
  if (flush.isFlush) {
    const mostPopularSuit = flush.mostPopular[0];
    const cardsWithMostPopularSuit = cards.filter(card => card.slice(-1) === mostPopularSuit);
    return getHightCardIndex(cardsWithMostPopularSuit);
  }
  return undefined;
};

const isStraight = (cards) => {
  const checkSequence = cards.reduce((acc, card) => {
    acc.push(range.findIndex(e => e === card.slice(0, -1)));
    return acc;
  }, []);

  let result = checkSequence.sort((a, b) => (a > b ? 1 : -1));
  result = result.reduce((acc, number) => {
    if (acc.prevValue === null) {
      acc.prevValue = number;
      return acc;
    }
    if (number - acc.prevValue === 1) {
      acc.len += 1;
      if (acc.len === 1) {
        acc.highCardId = number - 1;
      }
      if (acc.len === 4) {
        acc.isSequence = true;
      }
    } else {
      acc.len = 0;
    }
    acc.prevValue = number;
    return acc;
  }, {
    highCardId: null,
    prevValue: null,
    isSequence: false,
    len: 0,
  });
  return result.isSequence ? result.highCardId : undefined;
};


const isStraightFlush = (cards) => {
  const flush = checkFlush(cards);
  if (flush.isFlush) {
    const mostPopularSuit = flush.mostPopular[0];
    const cardsWithMostPopularSuit = cards.filter(card => card.slice(-1) === mostPopularSuit);
    return isStraight(cardsWithMostPopularSuit);
  }
  return undefined;
};

const isRoyalFlush = (cards) => {
  const straightFlush = isStraightFlush(cards);
  if (straightFlush !== undefined) {
    return straightFlush === 0;
  }
  return null;
};

const isSimmilaryQ = (cards, q, mode = 1) => {
  const pairs = cards.reduce((accCardRanges, card) => {
    const cardRange = card.slice(0, -1);
    if (accCardRanges.hasOwnProperty(cardRange)) {
      accCardRanges[cardRange] += 1;
    } else {
      accCardRanges[cardRange] = 1;
    }
    return accCardRanges;
  }, {});

  const result = Object.entries(pairs).filter(pair => pair[1] === q);
  if (mode === 1) {
    if (result[0]) {
      return result[0][0];
    }
  } if (mode === 2) {
    if (result.length === 2) {
      return [result[0][0]].concat(result[1][0]);
    }
  }
  return undefined;
};

const isFourofAKind = cards => isSimmilaryQ(cards, 4);
const threeOfAKind = cards => isSimmilaryQ(cards, 3);
const isTwoPair = cards => isSimmilaryQ(cards, 2, 2);
const isOnePair = cards => isSimmilaryQ(cards, 2);
const fullHouse = (cards) => {
  const pair = isOnePair(cards);
  const set = threeOfAKind(cards);
  if (pair && set) {
    return {
      pair,
      set
    };
  }
  return undefined;
};

// console.log(isRoyalFlush(['QD', 'JD', '10D', '9S', '10H', 'KD', 'AD']));
// console.log(isStraightFlush(['QH', 'JH', '8H', '9H', '10H', 'KH', 'AH']));
// console.log(isFourofAKind(['4D', '4H', '4S', '4C', '10H', 'KH', 'AD']));
// console.log(fullHouse(['4D', '4H', '4S', '10C', '10H', 'KH', 'AD']));
// console.log(isFlush(['QH', 'JH', '8H', '9H', '10H', 'KH', 'AH']));
// console.log(isStraight(['JD', '10H', '9S', '8C', '7H', 'KH', 'AD']));
// console.log(threeOfAKind(['5D', '5H', '5S', '2C', '10H', 'AH', 'KD']));
// console.log(isTwoPair(['5D', '5H', '2S', '2C', '10H', 'AH', 'KD']));
// console.log(isOnePair(['5D', '5H', '2S', '3C', '10H', 'AH', 'KD']));
// console.log(getHightCardIndex(['QH', 'JH', '8H', '9H', '10H', 'KH', '2H']));
