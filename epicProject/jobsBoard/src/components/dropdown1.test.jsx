import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import DropdownMenu from './dropdown1'; 

describe('DropdownMenu', () => {

  test('renders residency links with correct hrefs', () => {
    render(<DropdownMenu />);

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
  });
});
