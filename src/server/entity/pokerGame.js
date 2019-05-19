const hash = require('object-hash');

const PokerCards = ['2C', '2D', '2H', '2S', '3C', '3D', '3H', '3S', '4C', '4D', '4H', '4S', '5C', '5D', '5H', '5S', '6C', '6D', '6H', '6S', '7C', '7D', '7H', '7S', '8C', '8D', '8H', '8S', '9C', '9D', '9H', '9S', '10C', '10D', '10H', '10S', 'AC', 'AD', 'AH', 'AS', 'JC', 'JD', 'JH', 'JS', 'KC', 'KD', 'KH', 'KS', 'QC', 'QD', 'QH', 'QS'];
const PokerMaxTableCapacity = 6;

class PokerGame {
  constructor(playersInit) {
    this.players = playersInit;
    this.table = [];
    this.Deck = Object.assign([], PokerCards);
    this.step = 0;
    this.isFirstCircle = true;
    this.bank = 0;
    this.stepTime = 6000;
    this.stepTimer = null;
    this.gameStateHashSum = hash({
      table: this.table,
      players: this.players,
      step: this.step,
      stepTime: this.stepTime,
    }, { algorithm: 'md5', encoding: 'base64' });
  }


  startStepTimer() {
    this.stepTimer = setTimeout(() => {
      this.nextStep();
    }, this.stepTime);
  }


  cleanTable() {
    this.table.length = 0;
  }


  cleanBank() {
    this.bank = 0;
  }


  cleanPlayersHands() {
    this.players.map((player) => {
      const newPlayer = Object.assign({}, player);
      newPlayer.hand.length = 0;
      return newPlayer;
    });
  }


  updatePlayersBet() {
    this.players.map((player) => {
      const newPlayer = Object.assign({}, player);
      newPlayer.bet.status = 'none';
      newPlayer.bet.value = 0;
      return newPlayer;
    });
  }


  updateDeck() {
    this.Deck = Object.assign([], PokerCards);
  }


  checkSelfBetStatus(playerId) {
    if (this.players[playerId].bet.status === 'none' && !this.isFirstCircle && this.bank > 0) {
      this.players[playerId].bet.status = 'fold';
    }
  }


  calculateCurrentBet() {
    let maxBet = 0;
    this.players.forEach((player) => {
      if (player.bet.value > maxBet) {
        maxBet = player.bet.value;
      }
    });
    this.players.map((player) => {
      if (player.bet.status !== 'fold') {
        const { money } = player;
        if (money < maxBet) {
          player.bet.value = money;
        } else {
          player.bet.value = maxBet;
        }
      }
      return player;
    });
  }


  isEndGameByLastPlayer() {
    return this.players.reduce((sum, player) => {
      if (player.bet.status === 'call' || player.bet.status === 'none') {
        return sum + 1;
      }
      return sum;
    }, 0) === 1;
  }


  distribution() {
    this.players.map((player) => {
      const firstCard = this.Deck.splice(Math.floor(Math.random() * this.Deck.length), 1)[0];
      const nextCard = this.Deck.splice(Math.floor(Math.random() * this.Deck.length), 1)[0];
      return Object.assign(player, {
        hand: [firstCard, nextCard],
      });
    });
  }


  tableDistribution() {
    if (this.table.length < PokerMaxTableCapacity) {
      this.table.push(this.Deck.splice(Math.floor(Math.random() * this.Deck.length), 1)[0]);
    }
  }


  endGameCalculation(type) {
    // end game money calculation
    if (type === 'lastPlayer') {
      const lastPlayerId = this.players.findIndex(player => player.bet.status === 'call' || player.bet.status === 'none');
      const lastPlayer = this.players[lastPlayerId];
      lastPlayer.money += this.bank;
    }
    console.log('End Game');
    this.cleanTable();
    this.cleanPlayersHands();
    this.updateDeck();
    this.updatePlayersBet();
    this.distribution();
    this.cleanBank();
    this.isFirstCircle = true;
  }

  nextStep() {
    this.gameStateHashSum = hash(this.gameState, { algorithm: 'md5', encoding: 'base64' });
    clearTimeout(this.stepTimer);
    this.checkSelfBetStatus(this.step);
    if (this.isEndGameByLastPlayer() && !this.isFirstCircle) {
      this.endGameCalculation('lastPlayer');
    }
    if (this.step < this.players.length - 1) {
      this.step += 1;
      if (this.players[this.step].bet.status === 'fold') {
        this.nextStep();
      }
    } else {
      if (this.table.length < PokerMaxTableCapacity) {
        this.tableDistribution();
      } else {
        this.endGameCalculation('fullTable');
      }

      this.isFirstCircle = false;
      this.step = 0;
    }
    this.startStepTimer();
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
  }

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
