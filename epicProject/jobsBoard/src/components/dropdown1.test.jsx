// If you set `globals: true` in vite.config.js, you might not need to import describe, test, expect
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
// The import for '@testing-library/jest-dom' is usually handled in vitest.setup.js if configured

// Import the component you want to test
import DropdownMenu from './dropdown1'; // Adjust the path as per your project structure

describe('DropdownMenu', () => {
  // Test case 1: Checks if the component renders without crashing and displays all expected links
  test('renders all residency links with correct hrefs', () => {
    // Render the DropdownMenu component into the JSDOM environment
    render(<DropdownMenu />);

    // Use screen queries to find elements by their text content or role

    // Test for each link individually
    const r1Link = screen.getByText('R1');
    expect(r1Link).toBeInTheDocument();
    expect(r1Link).toHaveAttribute('href', '/r1');

    const r12Link = screen.getByText('R1+2');
    expect(r12Link).toBeInTheDocument();
    expect(r12Link).toHaveAttribute('href', '/r1-2');

    const r2Link = screen.getByText('R2');
    expect(r2Link).toBeInTheDocument();
    expect(r2Link).toHaveAttribute('href', '/r2');

    const r3Link = screen.getByText('R3');
    expect(r3Link).toBeInTheDocument();
    expect(r3Link).toHaveAttribute('href', '/r3');

    const r4Link = screen.getByText('R4');
    expect(r4Link).toBeInTheDocument();
    expect(r4Link).toHaveAttribute('href', '/r4');

    const r5Link = screen.getByText('R5');
    expect(r5Link).toBeInTheDocument();
    expect(r5Link).toHaveAttribute('href', '/r5');

    // Additionally, you can check the total number of links to ensure no unexpected elements
    const allLinks = screen.getAllByRole('link');
    expect(allLinks).toHaveLength(6); // Expecting 6 <a> elements (links)
  });

  // Test case 2: Verifies the presence of the main dropdown-menu div and its class
  test('renders the main dropdown container with correct class', () => {
    render(<DropdownMenu />);

    // Find the <ul> element first, then get its parent <div>
    // Using .closest() is a robust way to find an ancestor
    const dropdownContainer = screen.getByRole('list').closest('div');

    expect(dropdownContainer).toBeInTheDocument();
    expect(dropdownContainer).toHaveClass('dropdown-menu');
  });
});
