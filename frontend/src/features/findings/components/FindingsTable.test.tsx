import { render, screen } from '@testing-library/react';
import { FindingsTable } from './FindingsTable';
import type { Finding } from '@/schemas/domain';
import { describe, it, expect } from 'vitest';

const mockFindings: Finding[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    file_path: "test.py",
    line_start: 1,
    line_end: 1,
    category: "security",
    severity: "critical",
    confidence: 0.9,
    title: "Test Finding",
    description: "This is a test description",
    engine_id: "test",
    metadata: {}
  }
];

describe('FindingsTable', () => {
  it('renders findings correctly', () => {
    render(<FindingsTable findings={mockFindings} />);
    expect(screen.getByText('Test Finding')).toBeInTheDocument();
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<FindingsTable findings={[]} />);
    expect(screen.getByText('No findings detected in this session.')).toBeInTheDocument();
  });
});
