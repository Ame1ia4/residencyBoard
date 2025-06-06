{/*import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AllocationPage from './allocation'; 
import { supabase } from '../SupabaseClient';

vi.mock('../SupabaseClient', () => {
  const mockSelect = vi.fn();
  const mockEq = vi.fn();
  const mockOrder = vi.fn();

 
  const mockChain = {
    select: mockSelect.mockReturnThis(), 
    eq: mockEq.mockReturnThis(),
    order: mockOrder, 
  };

  const from = vi.fn((tableName) => {
    mockSelect.mockClear();
    mockEq.mockClear();
    mockOrder.mockClear();

    return mockChain;
  });

  return {
    supabase: {
      from: from,
    },
  };
});


describe('AllocationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Displays interview allocations when data fetches!', async () => {
    const mockInterviewData = [
      { studentID: '58494', interviewID: 1, jobID: 'job1', JobDetails: { jobTitle: 'Software Engineer Interview' } },
      { studentID: '58494', interviewID: 2, jobID: 'job2', JobDetails: { jobTitle: 'Product Manager Interview' } },
    ];
    const mockJobData = []; 


    supabase.from.mockImplementation((tableName) => {
      if (tableName === 'InterviewAllocation') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValueOnce({ data: mockInterviewData, error: null }),
        };
      } else if (tableName === 'JobAllocation') {

        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValueOnce({ data: mockJobData, error: null }),
        };
      }
      return {}; 
    });

    render(<AllocationPage />);

    await waitFor(() => {
      expect(screen.getByText('58494 : Software Engineer Interview')).toBeInTheDocument();
      expect(screen.getByText('58494 : Product Manager Interview')).toBeInTheDocument();
    });

    expect(supabase.from).toHaveBeenCalledWith('InterviewAllocation');

  });

  it('displays job allocations when data fetches', async () => {
    const mockJobData = [
      { allocationID: 101, studentID: '58494', JobDetails: { jobID: 'jobA', jobTitle: 'Data Analyst' } },
      { allocationID: 102, studentID: '58494', JobDetails: { jobID: 'jobB', jobTitle: 'UX Designer' } },
    ];
    const mockInterviewData = []; 

    supabase.from.mockImplementation((tableName) => {
      if (tableName === 'InterviewAllocation') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValueOnce({ data: mockInterviewData, error: null }),
        };
      } else if (tableName === 'JobAllocation') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValueOnce({ data: mockJobData, error: null }),
        };
      }
      return {};
    });

    render(<AllocationPage />);

    await waitFor(() => {
      expect(screen.getByText('58494 : Data Analyst')).toBeInTheDocument();
      expect(screen.getByText('58494 : UX Designer')).toBeInTheDocument();
    });


    expect(supabase.from).toHaveBeenCalledWith('JobAllocation');
  });

  it('displays fetch error for interview allocation if fetch doesnt work', async () => {
    const interviewError = { message: 'Network error for interviews' };
    const mockJobData = [];

    supabase.from.mockImplementation((tableName) => {
      if (tableName === 'InterviewAllocation') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValueOnce({ data: null, error: interviewError }),
        };
      } else if (tableName === 'JobAllocation') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValueOnce({ data: mockJobData, error: null }),
        };
      }
      return {};
    });

    render(<AllocationPage />);

    await waitFor(() => {
      expect(screen.getByText('Could not fetch rankings data')).toBeInTheDocument();
    });
  });

  it('Displays fetch error for job allocation if fetch deosnt work', async () => {
    const jobError = { message: 'Database error for jobs' };
    const mockInterviewData = [];

    supabase.from.mockImplementation((tableName) => {
      if (tableName === 'InterviewAllocation') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValueOnce({ data: mockInterviewData, error: null }),
        };
      } else if (tableName === 'JobAllocation') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValueOnce({ data: null, error: jobError }),
        };
      }
      return {};
    });

    render(<AllocationPage />);

    await waitFor(() => {
      expect(screen.getByText('Could not fetch job allocation data. Data may currently be unavailable.')).toBeInTheDocument();
    });
  });
});*/}