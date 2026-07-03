import { useEffect, useRef } from 'react';

// Move focus to the step heading when the wizard step changes.
export function useStepFocus(step: number) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  return headingRef;
}
