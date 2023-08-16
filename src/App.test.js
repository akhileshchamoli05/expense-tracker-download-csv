import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import axios from 'axios'; // You might want to mock axios
import {ExpenseForm} from './ExpenseForm';

// Mock axios to prevent actual API calls during testing
jest.mock('axios');

describe('ExpenseForm component', () => {
  // Mock axios post method
  axios.post.mockResolvedValue({ data: {} });

  it('renders correctly', () => {
    render(<ExpenseForm />);
    
    expect(screen.getByText('Expense Tracker')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Money Spent')).toBeInTheDocument();
    // Add more assertions as needed
  });

  it('handles adding an expense', async () => {
    render(<ExpenseForm />);
    
    // Mock user input
    fireEvent.change(screen.getByTestId('money-spent-input'), { target: { value: '50' } });
    // Simulate form submission
    fireEvent.click(screen.getByTestId('add-expense-button'));

    // Wait for API call to resolve
    await Promise.resolve();

    // Assert that the axios.post function was called
    expect(axios.post).toHaveBeenCalledTimes(1);
    // You can add more assertions here based on your UI changes after adding an expense
  });

  // Add more test cases for other interactions and features

});
