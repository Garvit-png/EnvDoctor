# Development Guide

This guide provides detailed information for developers working on EnvDoctor.

## Architecture Overview

EnvDoctor follows a modular architecture with clear separation of concerns:

```
┌─────────────┐
│   CLI       │ ← Entry point, argument parsing
└──────┬──────┘
       │
       ├──────► ┌─────────────┐
       │        │   Parser    │ ← .env file parsing
       │        └─────────────┘
       │
       ├──────► ┌─────────────┐
       │        │  Validator  │ ← Validation logic
       │        └─────────────┘
       │
       └──────► ┌─────────────┐
                │  Reporter   │ ← Output formatting
                └─────────────┘
```

## Core Modules

### `cli.ts` - Command Line Interface

**Responsibilities:**
- Parse command line arguments
- Validate file paths
- Orchestrate the validation workflow
- Handle errors and exit codes

**Key Functions:**
- `parseArgs()` - Parse CLI arguments
- `showHelp()` - Display help text
- `showVersion()` - Display version
- `run()` - Main entry point

### `parser.ts` - Environment File Parser

**Responsibilities:**
- Read and parse .env files safely
- Handle comments, empty lines, quoted values
- Detect duplicate keys
- Report parsing errors

**Key Functions:**
- `parse(filePath)` - Parse a .env file
- `getKeys(variables)` - Extract unique keys
- `getValue(variables, key)` - Get value for a key

**Parsing Rules:**
- Lines starting with `#` are comments
- Format: `KEY=value`
- Quoted values preserve spaces
- Inline comments after values are stripped
- Duplicate keys are tracked

### `validator.ts` - Validation Logic

**Responsibilities:**
- Compare .env against .env.example
- Detect missing variables
- Detect empty values
- Aggregate duplicate errors

**Key Functions:**
- `validate(envResult, exampleResult)` - Perform validation

**Validation Rules:**
- Variables in .env.example must exist in .env
- Variables must have non-empty values
- Duplicate keys are errors
- Parse errors are propagated

### `reporter.ts` - Report Generation

**Responsibilities:**
- Format validation results for terminal output
- Generate human-readable reports
- Determine appropriate exit codes
- Never expose secret values

**Key Functions:**
- `generateReport()` - Create formatted report
- `print()` - Output to console
- `getExitCode()` - Determine exit code

**Report Format:**
- Header with tool name
- Present/missing/empty variable status
- Error summary
- Actionable suggestions

### `types.ts` - TypeScript Types

Defines all interfaces and types used across modules:
- `EnvVariable` - A single environment variable
- `ParseResult` - Result of parsing a file
- `ValidationResult` - Result of validation
- `CliOptions` - CLI configuration
- `ReportOptions` - Report formatting options

## Testing Strategy

### Unit Tests

Located in `tests/`, each module has dedicated unit tests:

- `parser.test.ts` - Parser functionality
  - Simple key-value pairs
  - Empty values
  - Comments and empty lines
  - Duplicate detection
  - Quoted values
  - Malformed input

- `validator.test.ts` - Validation logic
  - Missing variable detection
  - Empty value detection
  - Duplicate aggregation
  - Error propagation

### Integration Tests

`integration.test.ts` tests the complete workflow:
- End-to-end validation
- Report generation
- Exit code behavior

### Running Tests

```bash
# Run all tests
npm test

# Run tests with Node's built-in runner
node --test tests/**/*.test.ts
```

## Building and Distribution

### Development Build

```bash
npm run build
```

Compiles TypeScript to JavaScript in `dist/`.

### Local Testing

```bash
# Run from source
npm run dev -- --help

# Run from compiled output
node dist/cli.js --help
```

### Package Distribution

Files included in npm package (see `package.json` `files` field):
- `dist/` - Compiled JavaScript
- `README.md` - Documentation
- `LICENSE` - License file

Files excluded (see `.npmignore`):
- Source TypeScript files
- Tests
- Development configuration
- Environment files

## Code Quality Standards

### TypeScript Configuration

- Strict mode enabled
- No unused variables or parameters
- All functions return values explicitly
- ES2022 target with Node resolution

### Security Considerations

1. **Never log secret values**
   - Reporter only shows key names, not values
   - Error messages don't include values

2. **Safe file reading**
   - Parser handles malformed input gracefully
   - No code execution from .env files

3. **Input validation**
   - File paths are validated before use
   - Invalid arguments produce clear errors

4. **No network access**
   - Tool is completely local
   - No data transmission

## Common Development Tasks

### Adding a New Validation Rule

1. Update `validator.ts` with new logic
2. Add types to `types.ts` if needed
3. Update reporter in `reporter.ts` for new error format
4. Add tests in `validator.test.ts`
5. Update integration tests
6. Document in README.md

### Adding a CLI Flag

1. Update `CliOptions` type in `types.ts`
2. Add parsing logic in `cli.ts` `parseArgs()`
3. Update help text in `showHelp()`
4. Add test cases
5. Document in README.md

### Debugging

Enable detailed output:

```bash
# Run with tsx for stack traces
npm run dev -- --env .env.local

# Run tests with verbose output
node --test --test-reporter=spec tests/**/*.test.ts
```

## Performance Considerations

- Parser reads files once and caches results
- Validation is O(n) where n is number of variables
- No external dependencies for core functionality
- Memory efficient for large .env files

## Future Enhancements

See README.md roadmap for planned features:
- Type validation (ports, URLs, booleans)
- Unused variable detection
- GitHub Actions integration
- JSON/Markdown report formats
- Interactive setup mode

## Getting Help

- Check existing tests for usage examples
- Review this guide and CONTRIBUTING.md
- Open an issue for questions
- Refer to TypeScript documentation for types

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md (when added)
3. Run tests: `npm test`
4. Build: `npm run build`
5. Test installation: `npm pack` and test tarball
6. Publish: `npm publish`
7. Tag release: `git tag v0.x.x`
8. Push: `git push --tags`

---

Happy coding! 🩺
