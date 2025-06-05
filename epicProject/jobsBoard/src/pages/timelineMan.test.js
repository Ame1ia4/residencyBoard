// TimePage.test.jsx
// This file contains a comprehensive suite of unit tests for the TimePage React component
// using Vitest and React Testing Library.

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TimePage from './timelineMan'; // Adjust the path to your TimePage component

// --- MOCKING EXTERNAL DEPENDENCIES ---

// 1. Mock window.alert:
//    The component uses `alert()` for user feedback. We mock it to prevent
//    browser alert pop-ups during tests and to assert if it was called.
const mockAlert = vi.fn();
window.alert = mockAlert;

// 2. Mock supabase client:
//    The component interacts with `supabase`. We mock the entire `supabase` module
//    to prevent actual database calls and control its return values (success/error).
vi.mock('../SupabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => Promise.resolve({ data: [], error: null })), // Default success response
        })),
      })),
    })),
  },
}));

// 3. Helper functions for mocking global fetch:
//    The component makes `fetch` requests in `useEffect` hooks. We create helpers
//    to simulate successful and erroneous fetch responses.
const mockFetchSuccess = (data) =>
  Promise.resolve({
    ok: true, // Simulate a successful HTTP response
    json: () => Promise.resolve(data), // Return the mock data as JSON
  });

const mockFetchError = () =>
  Promise.resolve({
    ok: false, // Simulate a failed HTTP response
    status: 500,
    statusText: 'Internal Server Error',
  });

// --- TEST SUITE FOR TimePage COMPONENT ---

describe('TimePage Component Functionality', () => {
  // `beforeEach` hook:
  // This runs before every single test (`it` block) in this `describe` block.
  // It's crucial for ensuring tests are isolated and don't affect each other.
  beforeEach(() => {
    vi.clearAllMocks(); // Clears all mock calls, implementations, and return values.
    // Reset the default supabase mock behavior for a clean slate.
    // This ensures `updateRankingView` tests start with a predictable supabase response.
    supabase.from.mockClear();
    supabase.from.mockReturnValue({
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => Promise.resolve({ data: [{ rankViewNo: '1' }], error: null })),
        })),
      })),
    });
  });

  // --- Tests for Algorithm Control Switches (handleSwitch, handleSwitch2) ---

  it('toggles the Interview Allocation Algorithm switch correctly', () => {
    // Render the TimePage component into the Vitest DOM environment.
    render(<TimePage />);

    // Find the checkbox associated with the "Interview Allocation Algorithm".
    // We use `getByText` to find the heading, then traverse to its parent div,
    // and then query for the checkbox input within that specific div.
    const interviewAllocationSwitch = screen.getByText('Interview Allocation Algorithm')
                                           .closest('div')
                                           .querySelector('input[type="checkbox"]');

    // Assert initial state: The switch should be unchecked as `algorithmEnabled` is false by default.
    expect(interviewAllocationSwitch).not.toBeChecked();

    // Simulate user clicking the switch to enable it.
    fireEvent.click(interviewAllocationSwitch);
    // Assert new state: The switch should now be checked.
    expect(interviewAllocationSwitch).toBeChecked();

    // Simulate user clicking the switch again to disable it.
    fireEvent.click(interviewAllocationSwitch);
    // Assert new state: The switch should now be unchecked again.
    expect(interviewAllocationSwitch).not.toBeChecked();
  });

  it('toggles the Job Allocation Algorithm switch correctly', () => {
    render(<TimePage />);
    // Similar to the above, find the specific checkbox for the Job Allocation Algorithm.
    const jobAllocationSwitch = screen.getByText('Job Allocation Algorithm')
                                     .closest('div')
                                     .querySelector('input[type="checkbox"]');

    expect(jobAllocationSwitch).not.toBeChecked(); // Initial state is false

    fireEvent.click(jobAllocationSwitch); // Turn on
    expect(jobAllocationSwitch).toBeChecked();

    fireEvent.click(jobAllocationSwitch); // Turn off
    expect(jobAllocationSwitch).not.toBeChecked();
  });

  // --- Tests for Ranking Control Switches (handleSwitch4, handleSwitch5, handleSwitch6) ---

  it('handles Round 0 switch (handleSwitch4) correctly: updates ranking view to "1" and shows alert on check', async () => {
    render(<TimePage />);
    // Find the checkbox for "Round 0". Using `getByRole` with `name` is robust.
    const round0Switch = screen.getByRole('checkbox', { name: /Round 0: Let students rank all companies/i });

    // Initial state: `switch1` is true, so Round 0 is checked.
    expect(round0Switch).toBeChecked();
    // Click to uncheck it first (to test toggling it ON from a known OFF state).
    fireEvent.click(round0Switch);
    expect(round0Switch).not.toBeChecked();

    // Click to check it again. This should trigger `updateRankingView` and the `alert`.
    fireEvent.click(round0Switch);
    expect(round0Switch).toBeChecked();

    // `updateRankingView` is asynchronous, so we `await waitFor` its effects.
    await waitFor(() => {
      // Assert that `supabase.from().update` was called with the correct view number.
      expect(supabase.from().update).toHaveBeenCalledWith({ rankViewNo: '1' });
      // Assert that `window.alert` was called with the expected success message.
      expect(mockAlert).toHaveBeenCalledWith('Student can now see and rank all companies in round 0.');
    });

    // Also verify that other ranking switches are turned off as per the component's logic.
    expect(screen.getByRole('checkbox', { name: /Round 1:/i })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: /Round 2:/i })).not.toBeChecked();
  });

  it('handles Round 1 switch (handleSwitch5) correctly: updates ranking view to "2" and shows alert on check', async () => {
    render(<TimePage />);
    const round1Switch = screen.getByRole('checkbox', { name: /Round 1: Let students rank companies they have interviewed with./i });

    // Initial state: `switch2` is false, so Round 1 is unchecked.
    expect(round1Switch).not.toBeChecked();

    // Click to check it, triggering `updateRankingView` and `alert`.
    fireEvent.click(round1Switch);
    expect(round1Switch).toBeChecked();

    await waitFor(() => {
      expect(supabase.from().update).toHaveBeenCalledWith({ rankViewNo: '2' });
      expect(mockAlert).toHaveBeenCalledWith('Student can now see and rank all companies in round 1.');
    });

    // Verify other switches are turned off.
    expect(screen.getByRole('checkbox', { name: /Round 0:/i })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: /Round 2:/i })).not.toBeChecked();
  });

  it('handles Round 2 switch (handleSwitch6) correctly: updates ranking view to "3" and shows alert on check', async () => {
    render(<TimePage />);
    const round2Switch = screen.getByRole('checkbox', { name: /Round 2: Let students rank remaining companies/i });

    // Initial state: `switch3` is false, so Round 2 is unchecked.
    expect(round2Switch).not.toBeChecked();

    // Click to check it, triggering `updateRankingView` and `alert`.
    fireEvent.click(round2Switch);
    expect(round2Switch).toBeChecked();

    await waitFor(() => {
      expect(supabase.from().update).toHaveBeenCalledWith({ rankViewNo: '3' });
      expect(mockAlert).toHaveBeenCalledWith('Student can now see and rank all companies in round 2.');
    });

    // Verify other switches are turned off.
    expect(screen.getByRole('checkbox', { name: /Round 0:/i })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: /Round 1:/i })).not.toBeChecked();
  });

  it('displays an error message when updateRankingView fails', async () => {
    render(<TimePage />);
    const errorMessage = "Failed to connect to database.";
    // For this specific test, we configure `supabase` mock to return an error.
    supabase.from.mockReturnValue({
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => Promise.resolve({ data: null, error: { message: errorMessage } })),
        })),
      })),
    });

    const round0Switch = screen.getByRole('checkbox', { name: /Round 0: Let students rank all companies/i });

    // Toggle off (from default true) then on again to trigger the update call.
    fireEvent.click(round0Switch); // off
    fireEvent.click(round0Switch); // on

    // Wait for the error message to appear in the DOM.
    await waitFor(() => {
      expect(screen.getByText(`Failed to set ranking view: ${errorMessage}`)).toBeInTheDocument();
    });
    // Ensure no success alert was shown in case of error.
    expect(mockAlert).not.toHaveBeenCalled();
  });

  // --- Tests for First useEffect (Interview Allocation Algorithm - `runAlgorithm`) ---

  it('runs the Interview Allocation Algorithm when enabled and year group is set', async () => {
    // Spy on `global.fetch` and mock its implementation to return a successful response.
    const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(() => mockFetchSuccess({ data: 'algorithm data' }));

    render(<TimePage />);

    // Simulate user entering a year group into the input field.
    const yearGroupInput = screen.getByPlaceholderText('Year group');
    fireEvent.change(yearGroupInput, { target: { value: '2025' } });

    // Find and click the switch to enable the Interview Allocation Algorithm.
    const interviewAllocationSwitch = screen.getByText('Interview Allocation Algorithm')
                                           .closest('div')
                                           .querySelector('input[type="checkbox"]');
    fireEvent.click(interviewAllocationSwitch);

    // Wait for the asynchronous `fetch` call to occur and the alert to be displayed.
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('http://127.0.0.1:5000/timelineMan/2025');
      expect(mockAlert).toHaveBeenCalledWith('Algorithm ran successfully.');
    });

    fetchSpy.mockRestore(); // Restore original `fetch` to avoid interfering with other tests.
  });

  it('alerts and disables Interview Allocation Algorithm if no year group is set', async () => {
    // Spy on `global.fetch` but don't provide an implementation, ensuring it's never called.
    const fetchSpy = vi.spyOn(global, 'fetch');

    render(<TimePage />);

    // Do NOT set a year group here.

    // Attempt to enable the algorithm switch.
    const interviewAllocationSwitch = screen.getByText('Interview Allocation Algorithm')
                                           .closest('div')
                                           .querySelector('input[type="checkbox"]');
    fireEvent.click(interviewAllocationSwitch);

    // Wait for the alert indicating no year group.
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('No year group set.');
    });
    // Assert that `fetch` was NOT called.
    expect(fetchSpy).not.toHaveBeenCalled();
    // Assert that the switch was automatically turned off by the component.
    expect(interviewAllocationSwitch).not.toBeChecked();

    fetchSpy.mockRestore();
  });

  it('handles fetch error for Interview Allocation Algorithm gracefully', async () => {
    // Mock `fetch` to return an error response.
    const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(() => mockFetchError());

    render(<TimePage />);
    // Set a year group so the fetch is attempted.
    const yearGroupInput = screen.getByPlaceholderText('Year group');
    fireEvent.change(yearGroupInput, { target: { value: '2024' } });

    // Enable the algorithm switch.
    const interviewAllocationSwitch = screen.getByText('Interview Allocation Algorithm')
                                           .closest('div')
                                           .querySelector('input[type="checkbox"]');
    fireEvent.click(interviewAllocationSwitch);

    // Wait for the fetch call to complete (with error).
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('http://127.0.0.1:5000/timelineMan/2024');
    });
    // Ensure the success alert is NOT shown.
    expect(mockAlert).not.toHaveBeenCalledWith('Algorithm ran successfully.');
    // Note: The original component calls `console.error` and sets `fetchError`
    // but doesn't display `fetchError` to the user. If it did, we'd assert its presence here.

    fetchSpy.mockRestore();
  });

  // --- Tests for Second useEffect (Job Allocation Algorithm - `runAlgorithm2`) ---

  it('runs the Job Allocation Algorithm when enabled and year group is set', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(() => mockFetchSuccess({ data: 'rp allocation data' }));

    render(<TimePage />);

    // Set the year group.
    const yearGroupInput = screen.getByPlaceholderText('Year group');
    fireEvent.change(yearGroupInput, { target: { value: '2026' } });

    // Enable the switch for the Job Allocation Algorithm.
    const jobAllocationSwitch = screen.getByText('Job Allocation Algorithm')
                                     .closest('div')
                                     .querySelector('input[type="checkbox"]');
    fireEvent.click(jobAllocationSwitch);

    // Wait for the fetch call and alert.
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('http://127.0.0.1:5000/rpAllocation/2026');
      expect(mockAlert).toHaveBeenCalledWith('Algorithm ran successfully');
    });

    fetchSpy.mockRestore();
  });

  it('handles fetch error for Job Allocation Algorithm gracefully', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(() => mockFetchError());

    render(<TimePage />);
    const yearGroupInput = screen.getByPlaceholderText('Year group');
    fireEvent.change(yearGroupInput, { target: { value: '2027' } });

    const jobAllocationSwitch = screen.getByText('Job Allocation Algorithm')
                                     .closest('div')
                                     .querySelector('input[type="checkbox"]');
    fireEvent.click(jobAllocationSwitch);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('http://127.0.0.1:5000/rpAllocation/2027');
    });
    expect(mockAlert).not.toHaveBeenCalledWith('Algorithm ran successfully');

    fetchSpy.mockRestore();
  });
});
