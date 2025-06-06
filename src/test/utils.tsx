import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock Web3Provider since we can't import from @/providers/Web3Provider
const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Create a custom wrapper component that includes all providers
const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <Web3Provider>
        {children}
      </Web3Provider>
    </BrowserRouter>
  );
};

// Create a custom renderer that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { route = '/', ...renderOptions } = options;
  
  // Set up the router with the specified route
  window.history.pushState({}, 'Test page', route);
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders>{children}</AllProviders>
    ),
    ...renderOptions,
  });
}

// Re-export everything from RTL
export * from '@testing-library/react';

// Export our custom render as the default render
export { renderWithProviders as render };

// Explicitly export commonly used utilities
export { screen, fireEvent, waitFor };
