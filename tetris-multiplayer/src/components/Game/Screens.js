import React from 'react';
import { connect } from 'react-redux';

function WaitingScreen({ opponentNames, isLeader, onStartGame }) {
	console.log("opponentNames =", opponentNames);
	console.log("isLeader =", isLeader);
    return (
        <div className="overlay">
            <div className="message">
                <h1>En attente d'adversaires...</h1>
                <ul>
                    {opponentNames && opponentNames.map((name, index) => (
                        <li key={index}>{name}</li>
                    ))}
                </ul>
                <p>Nombre d'adversaires : {opponentNames ? opponentNames.length : 0}</p>
                {isLeader && (
                    <button onClick={onStartGame}>Démarrer la partie</button>
                )}
                <div className="loading-animation"></div>
            </div>
        </div>
    );
}


const mapStateToProps = (props) => ({
    opponentNames: props.opponentNames // Assuming the state has an array of opponent names
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
