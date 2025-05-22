
import '@testing-library/jest-dom';

// Extend Vitest's expect method with jest-dom matchers
interface CustomMatchers<R = unknown> {
  toBeInTheDocument(): R;
  toBeVisible(): R;
  toHaveAttribute(attr: string, value?: string): R;
  toHaveTextContent(text: string | RegExp): R;
  toHaveValue(value: string | string[] | number | null): R;
  toBeDisabled(): R;
  toBeEnabled(): R;
  toBeChecked(): R;
  toBeInvalid(): R;
  toBeRequired(): R;
  toBeValid(): R;
  // Add other Jest DOM matchers as needed
}

declare global {
  namespace Vi {
    interface Assertion<T = any> extends CustomMatchers<T> {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}
