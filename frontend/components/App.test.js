// Write your tests here
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AppClass from './AppClass';
import AppFunctional from './AppFunctional';
import userEvent from '@testing-library/user-event';

// test('sanity', () => {
//   expect(true).toBe(true);
// })

// test('Class App renders without errors',()=>{
//   render(<AppClass />);
// });

// test('Functional App renders without errors',()=>{
//   render(<AppFunctional />);
// });

test('Class app renders headers, buttons and links without errors',async ()=>{
  render(<AppClass />);
  const header = screen.getByTestId(/coordinates/i);
  const upButton = screen.getByTestId(/up/i);
  const downButton = screen.getByTestId(/down/i);
  const leftButton = screen.getByTestId(/left/i);
  const rightButton = screen.getByTestId(/right/i);
  const resetButton = screen.getByTestId(/reset/i);
  const input = screen.getByPlaceholderText(/type email/i);
  const submitButton = screen.getByTestId(/submit/i);

  await waitFor(()=>{
    expect(header).toBeInTheDocument();
    expect(upButton).toBeInTheDocument();
    expect(downButton).toBeInTheDocument();
    expect(leftButton).toBeInTheDocument();
    expect(rightButton).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  }) 
});

test('Class app allows user to type into the input field', async ()=>{
  render(<AppClass />);
  const input = screen.getByPlaceholderText(/type email/i);
  userEvent.type(input, 'someemail@something.com');
  await waitFor(()=>{
    expect(input).toHaveValue('someemail@something.com');
  });
});

test('Functional app renders headers, buttons and links without errors',async ()=>{
  render(<AppFunctional />);
  const header = screen.getByTestId(/coordinates/i);
  const upButton = screen.getByTestId(/up/i);
  const downButton = screen.getByTestId(/down/i);
  const leftButton = screen.getByTestId(/left/i);
  const rightButton = screen.getByTestId(/right/i);
  const resetButton = screen.getByTestId(/reset/i);
  const input = screen.getByPlaceholderText(/type email/i);
  const submitButton = screen.getByTestId(/submit/i);

  await waitFor(()=>{
    expect(header).toBeInTheDocument();
    expect(upButton).toBeInTheDocument();
    expect(downButton).toBeInTheDocument();
    expect(leftButton).toBeInTheDocument();
    expect(rightButton).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  }) 
});

test('Class app allows user to type into the input field', async ()=>{
  render(<AppFunctional />);
  const input = screen.getByPlaceholderText(/type email/i);
  userEvent.type(input, 'someemail@something.com');
  await waitFor(()=>{
    expect(input).toHaveValue('someemail@something.com');
  });
});