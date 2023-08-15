import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { GameOverScreen ,WaitingScreen,VictoryScreen} from '../../../src/components/Game/Screens';

describe('GameOverScreen', () => {
    it('should render correctly and respond to button clicks GameOver', () => {
        const onGoHomeMock = jest.fn();
        const onRestartMock = jest.fn();

        const { getByText } = render(<GameOverScreen onGoHome={onGoHomeMock} onRestart={onRestartMock} />);

        expect(getByText('Partie terminée')).toBeInTheDocument();

        fireEvent.click(getByText('Retour à la page d\'accueil.'));
        expect(onGoHomeMock).toHaveBeenCalledTimes(1);

        fireEvent.click(getByText('Recommencer'));
        expect(onRestartMock).toHaveBeenCalledTimes(1);
    });
});

describe('VictoryScreen', () => {
    it('should render correctly and respond to button clicks Victory', () => {
        const onGoHomeMock = jest.fn();
        const onRestartMock = jest.fn();

        const { getByText } = render(<VictoryScreen onGoHome={onGoHomeMock} onRestart={onRestartMock} />);

        expect(getByText('Victoire !')).toBeInTheDocument();

        fireEvent.click(getByText('Retour à la page d\'accueil.'));
        expect(onGoHomeMock).toHaveBeenCalledTimes(1);

        fireEvent.click(getByText('Recommencer'));
        expect(onRestartMock).toHaveBeenCalledTimes(1);
    });
});


describe('WaitingScreen', () => {
    it('should render opponent names and respond to start game button click', () => {
        const opponentNamesMock = ['Alice', 'Bob'];
        const onStartGameMock = jest.fn();

        const { getByText, getAllByRole } = render(<WaitingScreen opponentNames={opponentNamesMock} isLeader={true} onStartGame={onStartGameMock} />);

        expect(getByText('En attente d\'adversaires...')).toBeInTheDocument();

        const listItems = getAllByRole('listitem');
        expect(listItems).toHaveLength(opponentNamesMock.length);
        expect(listItems[0]).toHaveTextContent('Alice');
        expect(listItems[1]).toHaveTextContent('Bob');

        fireEvent.click(getByText('Démarrer la partie'));
        expect(onStartGameMock).toHaveBeenCalledTimes(1);
    });
});
