
# Contributing Guidelines

This document outlines the coding standards and workflow for contributing to the Poker P2P platform.

## Tech Stack

- **Frontend**: React with TypeScript and Vite
- **Styling**: TailwindCSS with Shadcn UI
- **State Management**: Zustand
- **Testing**: Vitest, React Testing Library
- **Documentation**: Storybook
- **Backend Integration**: Supabase

## Development Workflow

### Git Workflow

We use a feature branch workflow:

1. Create a new branch from `main` with a descriptive name:
   - `feature/add-wallet-integration`
   - `fix/game-room-disconnection`
   - `refactor/player-seat-component`

2. Make your changes, following the commit message conventions below.

3. Push your branch and create a Pull Request with a descriptive title and details.

4. Ensure all tests pass and code meets quality standards before requesting review.

### Commit Message Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>

<optional body>

<optional footer>
```

Where `type` is one of:
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code changes that neither fix bugs nor add features
- **test**: Adding or modifying tests
- **chore**: Changes to build process or auxiliary tools

Examples:
- `feat(wallet): add MetaMask integration`
- `fix(game): resolve disconnection during game phase changes`
- `test(auth): add authentication flow tests`

### Pull Request Guidelines

- PRs should be focused on a single concern (feature, bug fix, etc.)
- Include relevant tests for your changes
- Update documentation if necessary
- Link to related issues using GitHub's keywords (Fixes #123, etc.)
- Add screenshots or videos for UI changes

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Prefer explicit types over `any` or type inference when intent isn't clear
- Define interfaces for component props, state, and API responses
- Use enums for values with a fixed set of options

### React Components

- Use functional components with hooks
- Keep components small and focused on a single responsibility
- Extract reusable logic into custom hooks
- Follow the container/presentational pattern for complex views

### File Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/               # Base UI components (Button, Input, etc.)
│   ├── poker/            # Poker-specific components (Card, Chip, etc.)
│   └── wallet/           # Wallet-related components
├── hooks/                # Custom React hooks
├── pages/                # Page components
│   ├── Auth/             # Authentication pages
│   ├── Game/             # Game pages
│   ├── Funds/            # Wallet and funds pages
│   └── Lobby/            # Lobby pages
├── providers/            # Context providers (Auth, Web3, etc.)
├── stores/               # Zustand stores
├── test/                 # Test utilities
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

### Testing

- Write unit tests for all new components and critical logic
- Include integration tests for key user flows
- Use `data-testid` attributes for test selectors
- Mock external dependencies in tests

### Accessibility

- All interactive elements must be keyboard accessible
- Use appropriate ARIA roles and attributes
- Ensure proper focus management
- Maintain color contrast according to WCAG AA standards
- Test with screen readers when implementing complex UI components

### Zustand Store Guidelines

- Define TypeScript interfaces for all store state and actions
- Split large stores into multiple files if they grow too complex
- Use selectors to prevent unnecessary re-renders
- Keep actions atomic and focused on a single responsibility
- Document complex state transitions

## Documentation

### Component Documentation

Document components in Storybook with the following:

- Basic usage example
- Props documentation
- Variants and states
- Accessibility considerations
- Code examples

### API Documentation

For API integrations, document:

- Endpoint URL and method
- Request parameters
- Response format
- Error handling
- Authentication requirements

## Performance Considerations

- Memoize expensive calculations and component renders
- Lazy load components and routes when appropriate
- Optimize bundle size by watching imports
- Use proper key props in lists
- Virtualize long lists when necessary
