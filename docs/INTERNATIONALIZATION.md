
# Internationalization and Accessibility Guide

This document outlines the internationalization (i18n) and accessibility (a11y) implementation in our poker application.

## Internationalization

The application uses [i18next](https://www.i18next.com/) for internationalization, which allows for easy translation of content into multiple languages.

### Available Languages

Our platform supports the following languages:

#### Americas
- English (en) 🇺🇸
- Spanish (Mexico) (es-mx) 🇲🇽
- Portuguese (Brazil) (pt-br) 🇧🇷

#### Europe
- Spanish (es) 🇪🇸
- French (fr) 🇫🇷
- German (de) 🇩🇪
- Italian (it) 🇮🇹
- Portuguese (pt) 🇵🇹
- Russian (ru) 🇷🇺

#### Asia
- Chinese (zh) 🇨🇳
- Japanese (ja) 🇯🇵
- Hindi (hi) 🇮🇳

#### Middle East
- Arabic (ar) 🇸🇦 (RTL support)

### How to Add a New Language

1. Create a new translation file in `src/i18n/locales/[language-code]/translation.json`
2. Add the language to the `languages` array in `src/stores/language.ts`
3. Import the new translation file in `src/i18n/index.ts`
4. Add it to the resources object in the i18next configuration

### RTL Language Support

For right-to-left (RTL) languages like Arabic, the application automatically:
1. Sets the appropriate `dir="rtl"` attribute on the document
2. Applies special RTL styling via the `rtl` class on the document element

### How to Use Translations in Components

Import the `useTranslation` hook and use the `t` function:

```tsx
import { useTranslation } from '@/hooks/useTranslation';

function MyComponent() {
  const { t, isRTL, language } = useTranslation();
  
  return (
    <div className={isRTL ? 'rtl-container' : ''}>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
      <span>Current language: {language.name}</span>
    </div>
  );
}
```

For complex translations with variables:

```tsx
// Using variables in translations
t('greeting', { name: user.name }); // "Hello, {name}!"

// Using pluralization
t('items', { count: items.length }); // "1 item" or "5 items"
```

### Translation File Structure

We recommend organizing translations with namespaces for better maintainability:

```json
{
  "common": {
    "welcome": "Welcome",
    "login": "Login"
  },
  "game": {
    "bet": "Bet",
    "fold": "Fold"
  }
}
```

### Mobile Language Detection

Our system automatically detects and sets the appropriate language based on the user's browser settings. This works by:

1. Checking for exact language match (e.g., "pt-BR")
2. Checking for base language match (e.g., "pt" from "pt-BR")
3. Defaulting to English if no match is found

## Responsive and Mobile Design

Our application uses a responsive design approach with multiple breakpoints:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

The `useDeviceInfo` hook provides detailed information about the user's device:

```tsx
import { useDeviceInfo } from '@/hooks/use-mobile';

function MyComponent() {
  const { isMobile, isTablet, isDesktop, orientation, deviceType } = useDeviceInfo();
  
  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
      
      <p>Your device is in {orientation} mode</p>
    </div>
  );
}
```

## Accessibility Best Practices

The application implements several accessibility best practices:

### Semantic HTML

- Use appropriate HTML elements (`<button>`, `<a>`, etc.)
- Use heading elements (`<h1>`, `<h2>`, etc.) in a logical structure
- Use landmarks (`<main>`, `<nav>`, `<header>`, etc.)

### Keyboard Navigation

- All interactive elements are focusable and have visible focus states
- Tab order follows a logical sequence
- Custom components implement appropriate keyboard interaction patterns

### Screen Readers

- Images have appropriate alt text
- Form inputs have associated labels
- ARIA attributes are used when necessary
- Dynamic content changes are announced

### Color Contrast

- Text has sufficient contrast with its background
- Interface elements are perceivable without relying on color alone
- Focus indicators have good visibility

### Test Your Components

Use these tools for accessibility testing:
- [axe DevTools](https://www.deque.com/axe/) browser extension
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Screen readers (NVDA, VoiceOver, JAWS)
- Keyboard-only navigation

## Accessibility Checklist

- [ ] All images have meaningful alt text
- [ ] Form inputs have associated labels
- [ ] Color contrast meets WCAG AA standards
- [ ] All functionality is accessible via keyboard
- [ ] Document landmarks are used appropriately
- [ ] ARIA attributes are used correctly
- [ ] Dynamic content changes are announced to screen readers
- [ ] Focus order is logical
- [ ] Focus styles are visible
- [ ] RTL language support is properly implemented
