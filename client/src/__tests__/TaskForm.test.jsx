import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import TaskForm from '../components/TaskForm';

describe('TaskForm', () => {
  test('renders input fields and submit button', () => {
    render(<TaskForm onSubmit={() => {}} />);
    expect(screen.getByLabelText('Task title')).toBeInTheDocument();
    expect(screen.getByLabelText('Task description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  test('calls onSubmit with form data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Task title'), 'New task');
    await user.type(screen.getByLabelText('Task description'), 'Some details');
    await user.click(screen.getByRole('button', { name: /add task/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'New task',
      description: 'Some details',
    });
  });

  test('clears inputs after submit', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={() => {}} />);

    await user.type(screen.getByLabelText('Task title'), 'Task');
    await user.click(screen.getByRole('button', { name: /add task/i }));

    expect(screen.getByLabelText('Task title')).toHaveValue('');
    expect(screen.getByLabelText('Task description')).toHaveValue('');
  });

  test('does not submit with empty title', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Task description'), 'No title');
    await user.click(screen.getByRole('button', { name: /add task/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
