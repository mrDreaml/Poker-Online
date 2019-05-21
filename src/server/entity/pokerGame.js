/*
  Main  Poker Game  Logic There
  At that class a lot of dependency
  And it is directly related to the
  session.
  I DO NOT RECOMMEND CHANGING ANYTHING
  HERE.
*/

const hash = require('object-hash');

//  features  of  that  game
const PokerCards = ['2C', '2D', '2H', '2S', '3C', '3D', '3H', '3S', '4C', '4D', '4H', '4S', '5C', '5D', '5H', '5S', '6C', '6D', '6H', '6S', '7C', '7D', '7H', '7S', '8C', '8D', '8H', '8S', '9C', '9D', '9H', '9S', '10C', '10D', '10H', '10S', 'AC', 'AD', 'AH', 'AS', 'JC', 'JD', 'JH', 'JS', 'KC', 'KD', 'KH', 'KS', 'QC', 'QD', 'QH', 'QS'];
const PokerMaxTableCapacity = 5;


class PokerGame {
  constructor(playersInit) {
    this.players = playersInit;
    this.table = [];
    this.Deck = Object.assign([], PokerCards);
    this.step = 0;
    this.bank = 0;
    this.stepTime = 6000;
    this.stepTimer = null;

    //  Getting Init  State Hash
    this.gameStateHashSum = hash({
      table: this.table,
      players: this.players,
      step: this.step,
      stepTime: this.stepTime,
    }, { algorithm: 'md5', encoding: 'base64' });
  }

  // ------------------
  // cleaning methods


  cleanTable() {
    this.table.length = 0;
  }

  cleanBank() {
    this.bank = 0;
  }

  cleanPlayersHands() {
    this.players.map((player) => {
      if (player) {
        if (player.hand) {
          const newPlayer = Object.assign({}, player);
          newPlayer.hand.length = 0;
          return newPlayer;
        }
      }
      return player;
    });
  }


  // ------------------
  // restore&init methods

  restoreDeck() {
    this.Deck = Object.assign([], PokerCards);
  }


  initPlayers() {
    const minBet = 10;
    this.players.forEach((player) => {
      if (player) {
        if (player.money > minBet) {
          player.money -= minBet;
          player.bet.status = 'call';
          player.bet.value = minBet;
        } else {
          player.bet.status = 'fold';
        }
      }
    });
  }

  // ------------------
  // other methods
  calculateMaxBet() {
    return this.players.reduce((maxBet, player) => {
      if (player) {
        if (player.bet.value > maxBet) {
          return player.bet.value;
        }
      }
      return maxBet;
    }, 0);
  }

  startStepTimer() {
    this.stepTimer = setTimeout(() => {
      const myPlayer = this.players[this.step];
      if (myPlayer) {
        if (myPlayer.bet.value === this.calculateMaxBet() && myPlayer.bet.status === 'call') {
          myPlayer.bet.status = 'check';
        } else {
          myPlayer.bet.status = 'fold';
        }
      }
      this.nextStep();
    }, this.stepTime);
  }

  calculateCurrentBet() {
    const maxBet = this.calculateMaxBet();
    this.players.map((player) => {
      if (player) {
        if (player.bet.status !== 'fold') {
          const { money } = player;
          if (money < maxBet) {
            player.bet.value = money;
          } else {
            player.bet.value = maxBet;
          }
        }
      }
      return player;
    });
  }

  isEndGameByLastPlayer() {
    return this.players.reduce((sum, player) => {
      if (player) {
        if (player.bet.status === 'call' || player.bet.status === 'check') {
          return sum + 1;
        }
      }
      return sum;
    }, 0) <= 1;
  }

  endGameCalculation(type) {
    // end game money calculation
    if (type === 'lastPlayer') {
      const lastPlayerId = this.players.findIndex((player) => {
        if (player) {
          return player.bet.status === 'call';
        } return false;
      });
      if (lastPlayerId !== -1) {
        const lastPlayer = this.players[lastPlayerId];
        lastPlayer.money += this.bank;
      }
    }

    this.initPlayers();
    this.cleanTable();
    this.cleanPlayersHands();
    this.restoreDeck();
    this.distribution();
    this.cleanBank();
  }

  nextStep() {
    this.gameStateHashSum = hash(this.gameState, { algorithm: 'md5', encoding: 'base64' });
    clearTimeout(this.stepTimer);
    this.startStepTimer();

    if (this.step < this.players.length) {
      this.step += 1;
      if (this.players[this.step]) {
        if (this.players[this.step].bet.status === 'fold' || this.players[this.step].bet.status === 'none') {
          this.nextStep();
        }
      } else {
        this.nextStep();
      }
    } else {
      if (this.table.length < PokerMaxTableCapacity) {
        this.tableDistribution();
      } else {
        this.endGameCalculation('fullTable');
      }

      // new circle
      if (this.isEndGameByLastPlayer()) {
        this.endGameCalculation('lastPlayer');
      }

      this.step = 0;
    }
    return this.step;
  }

  playerEvent(event, playerId) {
    if (event.type === 'call') {
      this.players[playerId].bet.value = event.value;
      this.players[playerId].money -= event.value;
      this.bank += event.value;
      this.calculateCurrentBet();
    }
    this.players[playerId].bet.status = event.type;
    this.nextStep();
  }

  start() {
    this.distribution();
    this.startStepTimer();
    this.initPlayers();
    this.gameStateHashSum = hash(this.gameState, { algorithm: 'md5', encoding: 'base64' });
  }


  // ------------------
  // distribution methods


  distribution() {
    this.players.map((player) => {
      if (player) {
        const firstCard = this.Deck.splice(Math.floor(Math.random() * this.Deck.length), 1)[0];
        const nextCard = this.Deck.splice(Math.floor(Math.random() * this.Deck.length), 1)[0];
        return Object.assign(player, {
          hand: [firstCard, nextCard],
        });
      } return player;
    });
  }


  tableDistribution() {
    if (this.table.length < PokerMaxTableCapacity) {
      this.table.push(this.Deck.splice(Math.floor(Math.random() * this.Deck.length), 1)[0]);
    }
  }


  // ------------------
  // Get methods


  get gameState() {
    return ({
      table: this.table,
      playersData: this.players,
      currentStep: this.step,
      stepTime: this.stepTime,
    });
  }

  get getHashSum() {
    return this.gameStateHashSum;
  }
}

module.exports = PokerGame;
