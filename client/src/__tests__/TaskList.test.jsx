import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import TaskList from '../components/TaskList';

const mockTasks = [
  { id: 1, title: 'Task 1', description: 'Desc 1', status: 'pending' },
  { id: 2, title: 'Task 2', description: '', status: 'done' },
];

describe('TaskList', () => {
  test('renders empty message when no tasks', () => {
    render(<TaskList tasks={[]} onUpdate={() => {}} onDelete={() => {}} />);
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  test('renders all tasks', () => {
    render(<TaskList tasks={mockTasks} onUpdate={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  test('renders correct number of task items', () => {
    render(<TaskList tasks={mockTasks} onUpdate={() => {}} onDelete={() => {}} />);
    const deleteButtons = screen.getAllByLabelText('Delete task');
    expect(deleteButtons).toHaveLength(2);
  });
});
