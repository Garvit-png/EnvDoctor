# EnvDoctor Examples

This directory contains example `.env` and `.env.example` files to demonstrate EnvDoctor's capabilities.

## Basic Example

The `basic/` directory contains a simple, valid configuration:

```bash
cd examples/basic
npx envdoctor
```

Expected output: ✓ All checks passed!

## Error Example

The `errors/` directory demonstrates various validation errors:

```bash
cd examples/errors
npx envdoctor
```

This will show:
- Missing variables (API_KEY, JWT_SECRET, SMTP_USER, SMTP_PASS)
- Empty variables (REDIS_URL, SMTP_PORT)

## Testing Custom Paths

You can test EnvDoctor with custom file paths:

```bash
npx envdoctor --env examples/basic/.env --example examples/basic/.env.example
```

## Creating Your Own Examples

1. Create a `.env.example` file with required variables
2. Create a `.env` file with your actual values
3. Run `envdoctor` to validate

Remember: Never commit actual secrets or sensitive values to version control!
