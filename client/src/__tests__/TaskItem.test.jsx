import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import TaskItem from '../components/TaskItem';

const mockTask = {
  id: 1,
  title: 'Test task',
  description: 'A description',
  status: 'pending',
};

describe('TaskItem', () => {
  test('renders task title and description', () => {
    render(<TaskItem task={mockTask} onUpdate={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Test task')).toBeInTheDocument();
    expect(screen.getByText('A description')).toBeInTheDocument();
  });

  test('renders status button with correct label', () => {
    render(<TaskItem task={mockTask} onUpdate={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  test('calls onUpdate with next status when status button clicked', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<TaskItem task={mockTask} onUpdate={onUpdate} onDelete={() => {}} />);

    await user.click(screen.getByLabelText('Change status'));
    expect(onUpdate).toHaveBeenCalledWith(1, { status: 'in_progress' });
  });

  test('calls onDelete when delete button clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<TaskItem task={mockTask} onUpdate={() => {}} onDelete={onDelete} />);

    await user.click(screen.getByLabelText('Delete task'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  test('renders without description when not provided', () => {
    const task = { ...mockTask, description: '' };
    render(<TaskItem task={task} onUpdate={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Test task')).toBeInTheDocument();
    expect(screen.queryByRole('paragraph')).toBeNull();
  });
});
