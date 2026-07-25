import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app', () => {
  render(<App />);
  // Add a simple assertion, e.g.:
  // expect(screen.getByText(/welcome/i)).toBeInTheDocument();
});