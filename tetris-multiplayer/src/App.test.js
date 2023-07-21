/** @jsxRuntime classic */
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import App from './App';

jest.mock('./App.css', () => ({}));

test('Renders App component', () => {
  render(<App />);
});

test('Renders UsernamePrompt when username is empty', () => {
	const { getByTestId } = render(<App />);
	const usernamePrompt = getByTestId('usernamePrompt');
	expect(usernamePrompt).toBeInTheDocument();
  });
  