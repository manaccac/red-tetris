import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import OpponentBoard from '../../../src/components/Game/OpponentBoard';

const mockStore = configureStore([]);

describe('OpponentBoard', () => {
    let store;
    const playerBoard = Array.from({ length: 20 }, () => Array(10).fill(1));

    beforeEach(() => {
        store = mockStore({
            opponents: {
                "Player1": { board: playerBoard },
                "Player2": { board: playerBoard }
            }
        });
    });

    it('should render the component correctly', () => {
        render(
            <Provider store={store}>
                <OpponentBoard />
            </Provider>
        );

        expect(screen.getByText('Player1')).toBeInTheDocument();
        expect(screen.getByText('Player2')).toBeInTheDocument();
    });

    it('should display opponent boards correctly', () => {
        render(
            <Provider store={store}>
                <OpponentBoard />
            </Provider>
        );

        const filledCells = screen.getAllByTestId('opponent-board-cell-filled');
        expect(filledCells.length).toBe(400);
    });

	it('should handle no opponents correctly', () => {
		store = mockStore({ opponents: {} });
	
		render(
			<Provider store={store}>
				<OpponentBoard />
			</Provider>
		);
	
		const containers = screen.queryAllByTestId('container');
		expect(containers.length).toBe(0);
	});
	
});
