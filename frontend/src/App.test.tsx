import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the habits dashboard', () => {
  render(<App />);
  expect(screen.getByText(/my habits/i)).toBeInTheDocument();
});
