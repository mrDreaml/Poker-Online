/*
  Author: mrDreaml
  code review: 24.5.2019 mrDreaml v 1.0
  remarks: need more comments
*/

const hash = require('object-hash');
const getWinner = require('./PokerGameGetWinner');

//  features  of  that  game
const PokerCards = ['2C', '2D', '2H', '2S', '3C', '3D', '3H', '3S', '4C', '4D', '4H', '4S', '5C', '5D', '5H', '5S', '6C', '6D', '6H', '6S', '7C', '7D', '7H', '7S', '8C', '8D', '8H', '8S', '9C', '9D', '9H', '9S', '10C', '10D', '10H', '10S', 'AC', 'AD', 'AH', 'AS', 'JC', 'JD', 'JH', 'JS', 'KC', 'KD', 'KH', 'KS', 'QC', 'QD', 'QH', 'QS'];
const PokerMaxTableCapacity = 5;
const winMsgShowTime = 3000;

class PokerGame {
  constructor(playersInit) {
    this.players = [...playersInit];
    this.table = [];
    this.Deck = [...PokerCards];
    this.step = 0;
    this.bank = 0;
    this.maxBet = 0;
    this.stepTime = 15000;
    this.stepTimer = null;
    this.winMsg = null;

    //  Getting Init  State Hash
    this.gameStateHashSum = hash({
      table: this.table,
      playersData: this.players,
      step: this.step,
      stepTime: this.stepTime,
      winMsg: this.winMsg,
    }, { algorithm: 'md5', encoding: 'base64' });
  }


  newGame() {
    const minBet = 10;
    this.table.length = 0;
    this.Deck = [...PokerCards];
    this.bank = 0;
    this.players = this.players.reduce((updatedPlayers, player) => {
      const newPlayer = { ...player };
      const getRandomCardFromDeck = () => this.Deck.splice(Math.floor(Math.random() * this.Deck.length), 1)[0];
      newPlayer.hand = [getRandomCardFromDeck(), getRandomCardFromDeck()];
      if (player.money > minBet) {
        newPlayer.bet.status = 'call';
        newPlayer.bet.value = minBet;
      } else {
        newPlayer.bet.status = 'fold';
      }
      return updatedPlayers.concat(newPlayer);
    }, []);
  }


  joinPlayers(connectedPlayers) {
    this.players = this.players.concat(connectedPlayers.filter(player => this.players.findIndex(p => player.id === p.id) === -1));
  }


  removePlayers(connectedPlayers) {
    this.players = this.players.filter(player => connectedPlayers.findIndex(cP => player.id === cP.id) !== -1);
  }


  startStepTimer() {
    this.stepTimer = setTimeout(() => {
      const myPlayer = this.players[this.step];
      if (myPlayer.bet.value === this.maxBet && myPlayer.bet.status === 'call') {
        myPlayer.bet.status = 'check';
      } else {
        myPlayer.bet.status = 'fold';
      }
      this.nextStep();
    }, this.stepTime);
  }


  endGameCalculation(type) {
    if (type === 'lastPlayer') {
      const lastPlayerId = this.players.findIndex(player => player.bet.status === 'call');
      if (lastPlayerId !== -1) {
        const lastPlayer = this.players[lastPlayerId];
        lastPlayer.money += this.bank;
      }
    }

    const playerHands = this.players.reduce((accHands, player) => accHands.concat([player.hand]), []);
    const winner = getWinner(this.table, playerHands);
    if (winner !== undefined) {
      const winPlayer = this.players[winner.winerId];
      if (winPlayer) {
        winPlayer.money += this.bank;
        this.winMsg = {
          value: winner.comboName,
          winnerName: winPlayer.userName,
        };
        setTimeout(() => {
          this.winMsg = null;
        }, winMsgShowTime);
      }
    }
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

      if (this.players.reduce((sum, player) => {
        if (player.bet.status === 'call' || player.bet.status === 'check') {
          return sum + 1;
        }
        return sum;
      }, 0) <= 1) {
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
      this.maxBet = this.players.reduce((maxBet, player) => {
        if (player.bet.value > maxBet) {
          return player.bet.value;
        }
        return maxBet;
      }, 0);
      this.players = this.players.reduce((updatedPlayers, player) => {
        const newPlayer = { ...player };
        if (player.bet.status !== 'fold') {
          const { money } = player;
          if (money < this.maxBet) {
            newPlayer.bet.value = money;
          } else {
            newPlayer.bet.value = this.maxBet;
          }
        }
        return updatedPlayers.concat(newPlayer);
      }, []);
    }
    this.players[playerId].bet.status = event.type;
    this.nextStep();
  }


  start() {
    this.newGame();
    this.startStepTimer();
    this.gameStateHashSum = hash(this.gameState, { algorithm: 'md5', encoding: 'base64' });
  }


  tableDistribution() {
    if (this.table.length < PokerMaxTableCapacity) {
      this.table.push(this.Deck.splice(Math.floor(Math.random() * this.Deck.length), 1)[0]);
    }
  }


  get gameState() {
    return ({
      table: this.table,
      playersData: this.players,
      currentStep: this.step,
      stepTime: this.stepTime,
      winMsg: this.winMsg,
    });
  }

  get getHashSum() {
    return this.gameStateHashSum;
  }
}

module.exports = PokerGame;
