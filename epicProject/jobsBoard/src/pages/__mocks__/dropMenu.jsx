import { vi } from 'vitest';

const MockDropdown = vi.fn(({ onSelectCompany, selectedJobID }) => {
  return (
    <div data-testid="mock-dropdown">
 
      <button onClick={() => onSelectCompany('mock-job-id-1', 'Mock Company A')}>Select A</button>
      <button onClick={() => onSelectCompany('mock-job-id-2', 'Mock Company B')}>Select B</button>
   
      <span data-testid="dropdown-selected-job-id">{selectedJobID}</span>
    </div>
  );
});

export default MockDropdown;