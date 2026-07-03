import { render, screen } from '@testing-library/react';
import { ValidationErrors } from './ValidationErrors';

describe('ValidationErrors', () => {
  it('renders nothing when there are no errors', () => {
    const { container } = render(<ValidationErrors errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders errors with alert semantics', () => {
    render(<ValidationErrors errors={['Email is required.']} />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
    expect(alert).toHaveTextContent('Email is required.');
  });
});
