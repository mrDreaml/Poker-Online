const range = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];


const getHightCardIndex = cards => cards.reduce((highCardId, card) => {
  const currentRange = range.findIndex(e => e === card.slice(0, -1));
  if (highCardId < currentRange) {
    return currentRange;
  }
  return highCardId;
}, 0);

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
      acc.highCardId = number;
      acc.len += 1;
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
    return straightFlush === range.length - 1;
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
      return range.findIndex(e => e === result[0][0]);
    }
  } if (mode === 2) {
    if (result.length === 2) {
      return range.findIndex(e => e === result[0][0]) + range.findIndex(e => e === result[1][0]);
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
    return pair + set * 10;
  }
  return undefined;
};

module.exports = {
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
};
