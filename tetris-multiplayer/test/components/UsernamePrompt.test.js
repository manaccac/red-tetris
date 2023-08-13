/** @jsxRuntime classic */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UsernamePrompt from '../../src/components/UsernamePrompt';
import Cookies from 'js-cookie';

jest.mock('js-cookie', () => ({
  set: jest.fn(),
}));

describe('UsernamePrompt', () => {
  test('Renders the input field', () => {
    render(<UsernamePrompt />);
    const inputElement = screen.getByLabelText('Nom d\'utilisateur:');
    expect(inputElement).toBeInTheDocument();
  });

  test('Sets the username when user enters text', () => {
    render(<UsernamePrompt />);
    const inputElement = screen.getByLabelText('Nom d\'utilisateur:');
    fireEvent.change(inputElement, { target: { value: 'TestUser' } });
    expect(inputElement.value).toBe('TestUser');
  });

  test('Calls Cookies.set() when form is submitted', () => {
    render(<UsernamePrompt />);
    const inputElement = screen.getByLabelText('Nom d\'utilisateur:');
    const submitButton = screen.getByText('Envoyer');

    fireEvent.change(inputElement, { target: { value: 'TestUser' } });
    fireEvent.click(submitButton);

    expect(Cookies.set).toHaveBeenCalledWith('username', 'TestUser');
  });

  const mockReload = jest.fn();
  Object.defineProperty(window, 'location', {
	value: {
	  ...window.location,
	  reload: mockReload,
	},
	writable: true,
  });
  
  test('Reloads the window when form is submitted', async () => {
	render(<UsernamePrompt />);
	const inputElement = screen.getByLabelText('Nom d\'utilisateur:');
	const submitButton = screen.getByText('Envoyer');
  
	fireEvent.change(inputElement, { target: { value: 'TestUser' } });
	fireEvent.click(submitButton);
  
	await Promise.resolve();
  
	expect(mockReload).toHaveBeenCalledTimes(2);
  });
});
