
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '@/stores/language';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

// Mock the language store
jest.mock('@/stores/language', () => ({
  useLanguage: jest.fn(),
  languages: [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ]
}));

describe('LanguageSelector', () => {
  const mockSetLanguage = jest.fn();
  
  beforeEach(() => {
    (useLanguage as jest.Mock).mockReturnValue({
      currentLanguage: { code: 'en', name: 'English', flag: '🇺🇸' },
      setLanguage: mockSetLanguage,
    });
  });

  it('renders the current language', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSelector />
      </I18nextProvider>
    );
    
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('🇺🇸')).toBeInTheDocument();
  });

  it('opens the dropdown menu when clicked', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSelector />
      </I18nextProvider>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Español')).toBeInTheDocument();
  });

  it('changes the language when a different language is selected', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSelector />
      </I18nextProvider>
    );
    
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Español'));
    
    expect(mockSetLanguage).toHaveBeenCalledWith({ code: 'es', name: 'Español', flag: '🇪🇸' });
  });
});
