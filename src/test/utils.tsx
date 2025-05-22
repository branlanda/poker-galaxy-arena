
import React, { ReactElement } from 'react';
import { render, RenderOptions, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Create a custom wrapper component that includes all providers
const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
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
export { renderWithProviders as render };
