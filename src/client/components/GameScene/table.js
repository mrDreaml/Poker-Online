import React from 'react';

import Card from './Card';
import CardBackgrounds from '../../data/cards/index';

const Table = ({
  table, playersData, currentStep, myPlayerSeatId
}) => (
  <div className="table">
    <section className="container--table">
      {table.map(cardName => <Card key={cardName} background={CardBackgrounds[cardName]} />)}
    </section>
    <div className="container--personSeats">
      {playersData.map((pl, playerNumber) => {
        if (playerNumber !== myPlayerSeatId) {
          let player = playersData[playerNumber]; // swap for render
          let step = playerNumber;

          if (playerNumber === 2) {
            step = 4;
            player = playersData[step];
          } else if (playerNumber === 4) {
            step = 2;
            player = playersData[step];
          }

          if (player !== null && player !== undefined) {
            const key = `playerSeat:${playerNumber + player.userName}`;
            return (
              <div key={key} className="playerSeat">
                {step === currentStep ? <div className="step-icon" /> : null}
                <span className="text--name">{player.userName}</span>
                <span className="text--money">{`money ${player.money}$`}</span>
                <span>{`Bet: ${player.bet.value}$`}</span>
                <div className="checker--betStatus">{player.bet.status}</div>
              </div>
            );
          }
          const key = `playerSeat:${playerNumber}`;
          return <div key={key} className="playerSeat" />;
        }
        return null;
      })}
    </div>
  </div>
);

export default Table;
