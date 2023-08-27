import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { GameOverScreen ,WaitingScreen,VictoryScreen} from '../../../src/components/Game/Screens';

describe('GameOverScreen', () => {
    it('should render correctly and respond to button clicks GameOver', () => {
        const onGoHomeMock = jest.fn();
        const onRestartMock = jest.fn();

        const { getByText } = render(<GameOverScreen onGoHome={onGoHomeMock} onRestart={onRestartMock} playerWhoWon='John' score={100} opponents={[]} isLeader={'mana'} myName= {'mana'}/>);

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

        const { getByText } = render(<VictoryScreen onGoHome={onGoHomeMock} onRestart={onRestartMock} playerWhoWon='John' isLeader={'mana'} myName= {'mana'}/>);

        expect(getByText('Victoire !')).toBeInTheDocument();

        fireEvent.click(getByText('Retour à la page d\'accueil.'));
        expect(onGoHomeMock).toHaveBeenCalledTimes(1);

        fireEvent.click(getByText('Recommencer'));
        expect(onRestartMock).toHaveBeenCalledTimes(1);
    });
});


describe('WaitingScreen', () => {
	it('should render opponent names and respond to start game button click', () => {
	  const opponentNamesMock = { Alice: true, Bob: true };
	  const isLeaderMock = 'John';
	  const myNameMock = 'John';
	  const onStartGameMock = jest.fn();
  
	  const { getAllByRole, getByTestId } = render(<WaitingScreen opponentNames={opponentNamesMock} isLeader={isLeaderMock} onStartGame={onStartGameMock} myName={myNameMock} />);
  
	  const listItems = getAllByRole('listitem');
	  expect(listItems).toHaveLength(Object.keys(opponentNamesMock).length + 1); // +1 for myName
	  expect(listItems[0]).toHaveTextContent(myNameMock);
	  expect(listItems[1]).toHaveTextContent('Alice');
	  expect(listItems[2]).toHaveTextContent('Bob');
  
	  const startGameButton = getByTestId('start-game-btn');
	  fireEvent.click(startGameButton);
	  expect(onStartGameMock).toHaveBeenCalledTimes(1);
	});
  });