/**
 * Integration tests
 */

import { test } from 'node:test';
import assert from 'node:assert';
import { writeFileSync, unlinkSync } from 'fs';
import { EnvParser } from '../src/parser.js';
import { EnvValidator } from '../src/validator.js';
import { Reporter } from '../src/reporter.js';

const ENV_FILE = '.env.integration.test';
const EXAMPLE_FILE = '.env.example.integration.test';

function cleanup() {
  try {
    unlinkSync(ENV_FILE);
    unlinkSync(EXAMPLE_FILE);
  } catch {
    // Ignore if files don't exist
  }
}

test('Integration - complete validation workflow', () => {
  const exampleContent = `
DATABASE_URL=
API_KEY=
PORT=3000
`;

  const envContent = `
DATABASE_URL=postgres://localhost:5432/db
PORT=3000
`;

  writeFileSync(EXAMPLE_FILE, exampleContent);
  writeFileSync(ENV_FILE, envContent);

  // Parse
  const envResult = EnvParser.parse(ENV_FILE);
  const exampleResult = EnvParser.parse(EXAMPLE_FILE);

  // Validate
  const validation = EnvValidator.validate(envResult, exampleResult);

  // Assert
  assert.strictEqual(validation.missing.length, 1);
  assert.strictEqual(validation.missing[0], 'API_KEY');
  assert.strictEqual(validation.present.length, 2);
  assert.strictEqual(validation.hasErrors, true);

  // Generate report
  const report = Reporter.generateReport(validation, envResult, exampleResult);
  assert.ok(report.includes('EnvDoctor'));
  assert.ok(report.includes('API_KEY is missing'));
  assert.ok(report.includes('1 error found'));

  // Check exit code
  const exitCode = Reporter.getExitCode(validation);
  assert.strictEqual(exitCode, 1);

  cleanup();
});

test('Integration - all variables present', () => {
  const exampleContent = `
DATABASE_URL=
API_KEY=
PORT=3000
`;

  const envContent = `
DATABASE_URL=postgres://localhost:5432/db
API_KEY=secret123
PORT=3000
`;

  writeFileSync(EXAMPLE_FILE, exampleContent);
  writeFileSync(ENV_FILE, envContent);

  // Parse
  const envResult = EnvParser.parse(ENV_FILE);
  const exampleResult = EnvParser.parse(EXAMPLE_FILE);

  // Validate
  const validation = EnvValidator.validate(envResult, exampleResult);

  // Assert
  assert.strictEqual(validation.missing.length, 0);
  assert.strictEqual(validation.empty.length, 0);
  assert.strictEqual(validation.present.length, 3);
  assert.strictEqual(validation.hasErrors, false);

  // Generate report
  const report = Reporter.generateReport(validation, envResult, exampleResult);
  assert.ok(report.includes('All checks passed'));

  // Check exit code
  const exitCode = Reporter.getExitCode(validation);
  assert.strictEqual(exitCode, 0);

  cleanup();
});

test('Integration - duplicate variables detected', () => {
  const exampleContent = `
DATABASE_URL=
`;

  const envContent = `
DATABASE_URL=first
DATABASE_URL=second
`;

  writeFileSync(EXAMPLE_FILE, exampleContent);
  writeFileSync(ENV_FILE, envContent);

  // Parse
  const envResult = EnvParser.parse(ENV_FILE);
  const exampleResult = EnvParser.parse(EXAMPLE_FILE);

  // Validate
  const validation = EnvValidator.validate(envResult, exampleResult);

  // Assert
  assert.strictEqual(validation.duplicates.length, 1);
  assert.strictEqual(validation.duplicates[0], 'DATABASE_URL');
  assert.strictEqual(validation.hasErrors, true);

  // Generate report
  const report = Reporter.generateReport(validation, envResult, exampleResult);
  assert.ok(report.includes('Duplicate variables'));
  assert.ok(report.includes('DATABASE_URL'));

  cleanup();
});

test('Integration - empty values detected', () => {
  const exampleContent = `
DATABASE_URL=
API_KEY=
`;

  const envContent = `
DATABASE_URL=
API_KEY=secret
`;

  writeFileSync(EXAMPLE_FILE, exampleContent);
  writeFileSync(ENV_FILE, envContent);

  // Parse
  const envResult = EnvParser.parse(ENV_FILE);
  const exampleResult = EnvParser.parse(EXAMPLE_FILE);

  // Validate
  const validation = EnvValidator.validate(envResult, exampleResult);

  // Assert
  assert.strictEqual(validation.empty.length, 1);
  assert.strictEqual(validation.empty[0], 'DATABASE_URL');
  assert.strictEqual(validation.hasErrors, true);

  // Generate report
  const report = Reporter.generateReport(validation, envResult, exampleResult);
  assert.ok(report.includes('Empty variables'));
  assert.ok(report.includes('DATABASE_URL'));

  cleanup();
});
