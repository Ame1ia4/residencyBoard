
export const supabase = {
  from: vi.fn(() => supabase),
  select: vi.fn(() => supabase),
  eq: vi.fn(() => supabase),
  order: vi.fn(() => supabase),
  insert: vi.fn(() => supabase),
  delete: vi.fn(() => supabase),
  single: vi.fn(()=>supabase),
};