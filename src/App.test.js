import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Wrap with Router for routing tests
import App from './App';

describe('App Component', () => {
  test('renders Navbar', () => {
    render(
      <Router>
        <App />
      </Router>
    );
    const navbarElement = screen.getByRole('navigation'); // Adjust based on your Navbar's structure
    expect(navbarElement).toBeInTheDocument();
  });

  test('renders Footer', () => {
    render(
      <Router>
        <App />
      </Router>
    );
    const footerElement = screen.getByText(/your footer text/i); // Adjust based on your footer content
    expect(footerElement).toBeInTheDocument();
  });
});
