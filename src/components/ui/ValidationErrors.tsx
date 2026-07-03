interface ValidationErrorsProps {
  errors: string[];
}

// Announce validation errors to assistive technologies.
export function ValidationErrors({ errors }: ValidationErrorsProps) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <ul role="alert" aria-live="assertive" aria-atomic="true" className="error-list">
      {errors.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  );
}
