import React from 'react';
import { connect } from 'react-redux';

function WaitingScreen({ opponentNames, isLeader, onStartGame, myName, leader }) {
    console.log('leader: ' + isLeader);
    console.log(opponentNames);
    return (
        <div className="overlay">
            <div className="message">
                <h1>En attente d'adversaires...</h1>
                <h2>Chef de salle {isLeader} </h2>
                <ul>
                    <li>{myName}</li>
                    {opponentNames && Object.keys(opponentNames).map((name, index) => (
                        <li key={index}>{name} + fail</li>
                    ))}
                </ul>
                <p>Nombre de joueurs : {opponentNames ? Object.keys(opponentNames).length + 1 : 0}</p>
                {isLeader === myName && (
                    <button onClick={onStartGame} data-testid="start-game-btn">Démarrer la partie</button>
                )}
                <div className="loading-animation"></div>
            </div>
        </div>
    );
}



const mapStateToProps = (state) => ({
    opponentNames: Object.keys(state.opponents),
});


export default connect(mapStateToProps)(WaitingScreen);


function CountdownScreen({ countdown }) {
    return (
        <div className="overlay">
            <div className="message">
                <h1>Le jeu commence dans...</h1>
                <div className="countdown">{countdown}</div>
            </div>
        </div>
    );
}

function GameOverScreen({ onGoHome, onRestart, playerWon, myName, isLeader, opponents }) {
    let canDisplayRestart = !opponents || playerWon ? true : false;
    return (
        <div className="overlay">
            <div className="message">
                <h1>Partie terminée</h1>
                <button onClick={onGoHome}>Retour à la page d'accueil.</button>
                {canDisplayRestart && myName === isLeader && (
                    <button onClick={onRestart}>Recommencer</button>
                )}
            </div>
        </div>
    );
}


function VictoryScreen({ onGoHome, onRestart, playerWon, myName, isLeader }) {
    return (
        <div className="overlay">
            <div className="message">
                <h1>Victoire !</h1>
                <button onClick={onGoHome}>Retour à la page d'accueil.</button>
                {myName === isLeader && (
                    <button onClick={onRestart}>Recommencer</button>
                )}
            </div>
        </div>
    );
}

export { WaitingScreen, CountdownScreen, GameOverScreen, VictoryScreen };
