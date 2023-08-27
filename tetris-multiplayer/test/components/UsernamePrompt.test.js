/** @jsxRuntime classic */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UsernamePrompt from '../../src/components/UsernamePrompt';
import Cookies from 'js-cookie';
import { createStore } from 'redux';
import gameReducer from '../../src/redux/reducer';
import { Provider } from 'react-redux';
import ColorPicker from '../../src/components/ColorPicker';




jest.mock('js-cookie', () => ({
  set: jest.fn(),
  get: jest.fn(),
}));

const store = createStore(gameReducer);


describe('UsernamePrompt', () => {
  test('Renders the input field', () => {
    render(
		<Provider store={store}>
			<UsernamePrompt />
		</Provider>
	);
    const inputElement = screen.getByLabelText('Nom d\'utilisateur:');
    expect(inputElement).toBeInTheDocument();
  });

  test('Sets the username when user enters text', () => {
    render(
		<Provider store={store}>
			<UsernamePrompt />
		</Provider>
	);    const inputElement = screen.getByLabelText('Nom d\'utilisateur:');
    fireEvent.change(inputElement, { target: { value: 'TestUser' } });
    expect(inputElement.value).toBe('TestUser');
  });

  test('Calls Cookies.set() when form is submitted', () => {
    render(
		<Provider store={store}>
			<UsernamePrompt />
		</Provider>
	);    const inputElement = screen.getByLabelText('Nom d\'utilisateur:');
    const submitButton = screen.getByText('Envoyer');

    fireEvent.change(inputElement, { target: { value: 'TestUser' } });
    fireEvent.click(submitButton);

	expect(Cookies.set).toHaveBeenCalledTimes(7);

  });

  const mockReload = jest.fn();
  Object.defineProperty(window, 'location', {
	value: {
	  ...window.location,
	  reload: mockReload,
	},
	writable: true,
  });
  

});

// Mocking document.documentElement.style.setProperty
Object.defineProperty(document.documentElement.style, 'setProperty', {
  value: jest.fn(),
});

describe('ColorPicker Component', () => {
  it('should call setProperty when color is changed', () => {
    const { getByTestId } = render(<ColorPicker />);
    const colorInput = getByTestId('color-picker-1');

    fireEvent.change(colorInput, { target: { value: '#FF0010' } });

    expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--block-color-1', '#ff0010');
  });
});
