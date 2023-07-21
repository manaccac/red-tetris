/** @jsxRuntime classic */
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import App from './App';
import UsernamePrompt from './components/UsernamePrompt';

jest.mock('./App.css', () => ({}));

test('Renders App component', () => {
  render(<App />);
});

jest.mock('js-cookie', () => ({
  get: jest.fn(),
}));

test('Renders UsernamePrompt when username is empty', () => {
  const { getByTestId } = render(<UsernamePrompt />);
  const usernamePrompt = getByTestId('usernamePrompt');
  expect(usernamePrompt).toBeInTheDocument();
});

jest.mock('js-cookie', () => ({
  get: jest.fn().mockReturnValue('TestUser'),
}));
