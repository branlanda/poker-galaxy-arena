
# Contribution Guidelines

Thank you for considering contributing to our project! This document outlines the standards and processes we follow to maintain a clean, professional codebase.

## Code Style

We use ESLint and Prettier to enforce a consistent code style. Please ensure your code passes linting before submitting a PR.

```bash
# Run lint check
npm run lint

# Fix automatic linting issues
npm run lint:fix
```

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that don't affect code functionality (formatting, etc)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or correcting tests
- `chore`: Changes to build process, tools, etc

### Examples

```
feat(auth): add password reset functionality
fix(game): resolve bet amount calculation error
docs(readme): update installation instructions
refactor(chat): simplify message handling logic
```

## Pull Request Process

1. Create a branch from `main` with a descriptive name:
   - Feature: `feature/description`
   - Bug fix: `fix/description`
   - Docs: `docs/description`

2. Make your changes, following our code style guidelines

3. Update documentation as necessary

4. Write or update tests for your changes

5. Ensure all tests pass:
   ```bash
   npm run test
   ```

6. Submit a pull request with a clear title and description that explains:
   - What the change does
   - Why it's needed
   - How it was tested
   - Any relevant screenshots or output

7. Request a code review from at least one maintainer

## Development Workflow

1. Create an issue for new features or bugs
2. Assign the issue to yourself when you start working on it
3. Reference the issue number in your commit messages and PR
4. Keep PRs focused on a single task for easier review

## Testing Requirements

- All new features must include tests
- Bug fixes should include a test that reproduces the fixed bug
- Maintain or improve code coverage percentage

## Accessibility and Internationalization

- All user-facing components must be accessible (a11y compliant)
- All user-facing strings must be translatable (use the `t` function)
- Test with keyboard navigation and screen readers

## Version Control Best Practices

- Keep commits small and focused
- Write descriptive commit messages
- Rebase your branch before submitting a PR
- Squash trivial commits before merging

## Continuous Integration

Our CI pipeline will automatically:

- Run linting
- Run tests
- Check code coverage
- Build the application

All checks must pass before a PR can be merged.

## Code Review Guidelines

- Be respectful and constructive
- Focus on the code, not the person
- Explain the reasoning behind suggestions
- Approve only when you're satisfied with the solution

Thank you for helping make this project better!
