# Contributing to EnvDoctor

Thank you for considering contributing to EnvDoctor! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/envdoctor.git
   cd envdoctor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

5. **Test the CLI locally:**
   ```bash
   npm run dev -- --help
   ```

## Project Structure

```
EnvDoctor/
├── src/              # Source TypeScript files
│   ├── cli.ts        # CLI entry point
│   ├── parser.ts     # .env file parser
│   ├── validator.ts  # Validation logic
│   ├── reporter.ts   # Report formatting
│   └── types.ts      # TypeScript types
├── tests/            # Test files
│   ├── parser.test.ts
│   ├── validator.test.ts
│   └── integration.test.ts
├── dist/             # Compiled JavaScript (generated)
└── package.json
```

## Development Workflow

### Making Changes

1. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the `src/` directory

3. Add tests for your changes in the `tests/` directory

4. Ensure all tests pass:
   ```bash
   npm test
   ```

5. Build the project:
   ```bash
   npm run build
   ```

6. Test the CLI:
   ```bash
   npm run dev -- [your-test-args]
   ```

### Code Style

- Use TypeScript strict mode
- Follow existing code conventions
- Keep functions focused and single-purpose
- Add JSDoc comments for public APIs
- Use meaningful variable and function names

### Testing

- Add unit tests for new functionality
- Ensure integration tests cover end-to-end workflows
- All tests must pass before submitting a PR
- Aim for high code coverage

### Commit Messages

Use clear, descriptive commit messages:

- `feat: add duplicate key detection`
- `fix: handle empty lines in parser`
- `docs: update README with new examples`
- `test: add integration tests for CLI`
- `refactor: simplify validator logic`

## Submitting Changes

1. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request with:
   - Clear description of the changes
   - Reference to any related issues
   - Test results
   - Any breaking changes

3. Wait for review and address feedback

## Reporting Issues

When reporting issues, please include:

- EnvDoctor version (`envdoctor --version`)
- Node.js version (`node --version`)
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Sample `.env` and `.env.example` files (without secrets!)

## Feature Requests

Feature requests are welcome! Please:

- Check existing issues first
- Clearly describe the use case
- Explain why it would benefit users
- Consider submitting a PR if you can implement it

## Security

Never include actual secrets in:
- Test files
- Example files
- Issue reports
- Pull requests
- Documentation

If you find a security vulnerability, please email [security contact] instead of opening a public issue.

## Questions?

Open an issue with the "question" label or reach out on [your communication channel].

Thank you for contributing to EnvDoctor! 🩺
