import React from 'react';
import { connect } from 'react-redux';

function WaitingScreen({ opponentNames, isLeader, onStartGame, myName, leader }) {
    console.log("opponentNames =", opponentNames);
    console.log("isLeader =", isLeader);
    console.log(opponentNames);
    console.log(Object.keys(opponentNames).length);
    return (
        <div className="overlay">
            <div className="message">
                <h1>En attente d'adversaires...</h1>
                <h2>Chef de salle {isLeader} </h2>
                <ul>
                    <li>{myName}</li>
                    {opponentNames && Object.keys(opponentNames).map((name, index) => (
                        <li key={index}>{name}</li>
                    ))}
                </ul>
                <p>Nombre de joueurs : {opponentNames ? Object.keys(opponentNames).length + 1 : 0}</p>
                {isLeader && (
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

function GameOverScreen({ onGoHome, onRestart }) {
    return (
        <div className="overlay">
            <div className="message">
                <h1>Partie terminée</h1>
                <button onClick={onGoHome}>Retour à la page d'accueil.</button>
                <button onClick={onRestart}>Recommencer</button>
            </div>
        </div>
    );
}

function VictoryScreen({ onGoHome, onRestart }) {
    return (
        <div className="overlay">
            <div className="message">
                <h1>Victoire !</h1>
                <button onClick={onGoHome}>Retour à la page d'accueil.</button>
                <button onClick={onRestart}>Recommencer</button>
            </div>
        </div>
    );
}

export { WaitingScreen, CountdownScreen, GameOverScreen, VictoryScreen };
