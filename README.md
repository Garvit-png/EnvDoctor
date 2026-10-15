# dotenv-doctor 🩺

**Catch environment configuration errors before they break your application.**

A lightweight CLI tool that validates your `.env` files against `.env.example`, helping you identify missing, empty, or duplicate environment variables before deploying.

[![npm version](https://img.shields.io/npm/v/@garvitgandhi/dotenv-doctor.svg)](https://www.npmjs.com/package/@garvitgandhi/dotenv-doctor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Why dotenv-doctor?

Every developer has experienced this:

- An application works locally but fails in production
- A required API key is missing
- A teammate doesn't know which environment variables to configure
- `.env.example` and `.env` have different variables
- A configuration mistake takes 20 minutes to debug when it should have taken 20 seconds

**dotenv-doctor catches these problems early.**

## 🚀 Features

- ✅ **Missing variable detection** - Find variables declared in `.env.example` but missing from `.env`
- ✅ **Empty value detection** - Identify required variables that exist but have no value
- ✅ **Duplicate key detection** - Detect duplicate environment variable declarations
- ✅ **Clear terminal reports** - Beautiful output with actionable suggestions
- ✅ **Secret protection** - Never prints actual environment variable values
- ✅ **Exit codes** - Returns non-zero exit code when validation fails (perfect for CI/CD)
- ✅ **Configurable paths** - Support custom environment and example file paths
- ✅ **Zero dependencies** - Lightweight with no runtime dependencies

## 📦 Installation

```bash
npm install --save-dev @garvitgandhi/dotenv-doctor
```

Or run it without installation:

```bash
npx @garvitgandhi/dotenv-doctor
```

## ⚡ Quick Start

Create a `.env.example` file in your project root:

```env
DATABASE_URL=
API_KEY=
PORT=3000
```

Create your local `.env` file:

```env
DATABASE_URL=postgres://localhost:5432/mydb
PORT=3000
```

Run dotenv-doctor:

```bash
npx @garvitgandhi/dotenv-doctor
```

**Example output:**

```
EnvDoctor 🩺

Scanning environment configuration...

✓ DATABASE_URL is present
✗ API_KEY is missing
✓ PORT is present

────────────────────────────────
1 error found.

Missing variables:
  - API_KEY

Add these variables to your .env file.
```

## 🛠️ CLI Usage

```bash
# Validate the default .env and .env.example files
dotenv-doctor

# Specify custom files
dotenv-doctor --env .env.local --example .env.example

# Display available options
dotenv-doctor --help

# Display package version
dotenv-doctor --version
```

**Both commands work:**
- `dotenv-doctor` (primary command)
- `envdoctor` (alias)

## 📋 Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `--env <path>` | Path to environment file | `.env` |
| `--example <path>` | Path to example file | `.env.example` |
| `--help, -h` | Show help message | |
| `--version, -v` | Show version number | |

## 🔄 CI/CD Integration

dotenv-doctor returns proper exit codes, making it perfect for CI/CD pipelines:

- **Exit 0**: All checks passed ✅
- **Exit 1**: Validation errors found ❌

### GitHub Actions Example

```yaml
name: Validate Environment

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npx @garvitgandhi/dotenv-doctor
```

### npm Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "env:check": "dotenv-doctor",
    "env:check:prod": "dotenv-doctor --env .env.production --example .env.example"
  }
}
```

## ⚙️ How It Works

1. Locates the requested environment files
2. Parses their key-value declarations safely
3. Compares variables in `.env.example` against those in `.env`
4. Detects missing keys, empty required values, and duplicate declarations
5. Prints a readable report without exposing secrets
6. Exits successfully when validation passes, or returns exit code 1 when errors are found

## 🔒 Security

Environment files frequently contain sensitive information. dotenv-doctor follows these rules:

- ✅ Never prints actual secret values
- ✅ Never uploads or transmits data
- ✅ Never modifies or deletes environment files
- ✅ All validation happens locally
- ✅ Safe parsing of malformed input

## 📊 What Gets Validated

| Check | Description |
|-------|-------------|
| **Missing variables** | Variables in `.env.example` but not in `.env` |
| **Empty values** | Variables that exist but have no value |
| **Duplicates** | Keys declared multiple times in the same file |
| **Parse errors** | Malformed lines or syntax issues |

## 🧰 Tech Stack

- **Runtime:** Node.js >=18.0.0
- **Language:** TypeScript (strict mode)
- **Interface:** Command-line interface (CLI)
- **Distribution:** npm
- **Testing:** Node.js test runner (19 tests)
- **Dependencies:** Zero runtime dependencies

## 💡 Examples

### Basic Validation

```bash
$ dotenv-doctor
EnvDoctor 🩺

Scanning environment configuration...

✓ DATABASE_URL is present
✓ API_KEY is present
✓ PORT is present
✓ NODE_ENV is present

────────────────────────────────
✓ All checks passed!
```

### With Errors

```bash
$ dotenv-doctor
EnvDoctor 🩺

Scanning environment configuration...

✓ DATABASE_URL is present
✗ API_KEY is missing
✗ JWT_SECRET is missing
⚠ REDIS_URL is empty

────────────────────────────────
3 errors found.

Missing variables:
  - API_KEY
  - JWT_SECRET

Add these variables to your .env file.

Empty variables:
  - REDIS_URL

These variables exist but have no value.
```

### Custom Paths

```bash
$ dotenv-doctor --env .env.production --example .env.example
```

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are welcome!

1. Open an issue describing the problem or proposed feature
2. Fork the repository
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Submit a pull request

## 📄 License

MIT License - see the [LICENSE](https://github.com/Garvit-png/EnvDoctor/blob/main/LICENSE) file for details.

## 🔗 Links

- **npm:** https://www.npmjs.com/package/@garvitgandhi/dotenv-doctor
- **GitHub:** https://github.com/Garvit-png/EnvDoctor
- **Issues:** https://github.com/Garvit-png/EnvDoctor/issues

## 📈 Package Stats

- **Size:** 8.8 kB (unpacked: 33.4 kB)
- **Files:** 22
- **Runtime Dependencies:** 0
- **TypeScript:** Strict mode enabled
- **Tests:** 19 comprehensive tests
- **License:** MIT

---

**dotenv-doctor: Catch configuration problems before they become production problems.** 🩺

Made with ❤️ by [Garvit](https://github.com/Garvit-png)
