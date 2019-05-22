import React from 'react';

import Card from './Card';
import CardBackgrounds from '../../data/cards/index';

import HandTimer from './handTimer';

const Hand = ({
  myPlayer, handAction, stepTime
}) => {
  if (myPlayer && myPlayer.hand) {
    return (
      myPlayer !== undefined && myPlayer !== null
        ? (
          <section className="container--hand">
            <div className="container--myCards">
              {myPlayer.hand.map(
                cardName => <Card key={cardName} background={CardBackgrounds[cardName]} />
              )}
            </div>

            <div className="container--myControls">
              { handAction ? (
                <HandTimer time={stepTime} />
              ) : null}


              <div className="container--my-state">
                <span>{ `money: ${myPlayer.money}$` }</span>
                <span>{ `bet: ${myPlayer.bet.value}$` }</span>
              </div>

              <div className={`btns--controls ${handAction ? 'active' : ''}`}>
                <button onClick={handAction ? () => handAction.handHandlerAction('fold') : null} type="button">Fold</button>
                <button onClick={handAction ? () => handAction.handHandlerAction('call') : null} type="button">Call</button>
                <button onClick={handAction ? handAction.handHandlerRaise : null} type="button">Raise</button>
              </div>
            </div>
          </section>
        )
        : null
    );
  }
  return (<h2>Waiting for the session to begin..</h2>);
};

export default Hand;
