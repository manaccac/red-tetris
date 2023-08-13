import React from 'react';

function WaitingScreen() {
    return (
        <div className="overlay">
            <div className="message">
                <h1>En attente d'un adversaire...</h1>
                <div className="loading-animation"></div>
            </div>
        </div>
    );
}

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
