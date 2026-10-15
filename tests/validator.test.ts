/**
 * Validator tests
 */

import { test } from 'node:test';
import assert from 'node:assert';
import { EnvValidator } from '../src/validator.js';
import type { ParseResult } from '../src/types.js';

test('EnvValidator - detects missing variables', () => {
  const envResult: ParseResult = {
    variables: [
      { key: 'DATABASE_URL', value: 'postgres://localhost', lineNumber: 1 }
    ],
    duplicates: [],
    errors: []
  };

  const exampleResult: ParseResult = {
    variables: [
      { key: 'DATABASE_URL', value: '', lineNumber: 1 },
      { key: 'API_KEY', value: '', lineNumber: 2 }
    ],
    duplicates: [],
    errors: []
  };

  const validation = EnvValidator.validate(envResult, exampleResult);

  assert.strictEqual(validation.missing.length, 1);
  assert.strictEqual(validation.missing[0], 'API_KEY');
  assert.strictEqual(validation.hasErrors, true);
});

test('EnvValidator - detects empty variables', () => {
  const envResult: ParseResult = {
    variables: [
      { key: 'DATABASE_URL', value: '', lineNumber: 1 },
      { key: 'API_KEY', value: 'secret', lineNumber: 2 }
    ],
    duplicates: [],
    errors: []
  };

  const exampleResult: ParseResult = {
    variables: [
      { key: 'DATABASE_URL', value: '', lineNumber: 1 },
      { key: 'API_KEY', value: '', lineNumber: 2 }
    ],
    duplicates: [],
    errors: []
  };

  const validation = EnvValidator.validate(envResult, exampleResult);

  assert.strictEqual(validation.empty.length, 1);
  assert.strictEqual(validation.empty[0], 'DATABASE_URL');
  assert.strictEqual(validation.hasErrors, true);
});

test('EnvValidator - tracks present variables', () => {
  const envResult: ParseResult = {
    variables: [
      { key: 'DATABASE_URL', value: 'postgres://localhost', lineNumber: 1 },
      { key: 'API_KEY', value: 'secret', lineNumber: 2 }
    ],
    duplicates: [],
    errors: []
  };

  const exampleResult: ParseResult = {
    variables: [
      { key: 'DATABASE_URL', value: '', lineNumber: 1 },
      { key: 'API_KEY', value: '', lineNumber: 2 }
    ],
    duplicates: [],
    errors: []
  };

  const validation = EnvValidator.validate(envResult, exampleResult);

  assert.strictEqual(validation.present.length, 2);
  assert.ok(validation.present.includes('DATABASE_URL'));
  assert.ok(validation.present.includes('API_KEY'));
  assert.strictEqual(validation.hasErrors, false);
});

test('EnvValidator - combines duplicates from both files', () => {
  const envResult: ParseResult = {
    variables: [
      { key: 'DATABASE_URL', value: 'first', lineNumber: 1 },
      { key: 'DATABASE_URL', value: 'second', lineNumber: 2 }
    ],
    duplicates: ['DATABASE_URL'],
    errors: []
  };

  const exampleResult: ParseResult = {
    variables: [
      { key: 'API_KEY', value: '', lineNumber: 1 },
      { key: 'API_KEY', value: '', lineNumber: 2 }
    ],
    duplicates: ['API_KEY'],
    errors: []
  };

  const validation = EnvValidator.validate(envResult, exampleResult);

  assert.strictEqual(validation.duplicates.length, 2);
  assert.ok(validation.duplicates.includes('DATABASE_URL'));
  assert.ok(validation.duplicates.includes('API_KEY'));
  assert.strictEqual(validation.hasErrors, true);
});

test('EnvValidator - no errors when everything is valid', () => {
  const envResult: ParseResult = {
    variables: [
      { key: 'DATABASE_URL', value: 'postgres://localhost', lineNumber: 1 },
      { key: 'API_KEY', value: 'secret', lineNumber: 2 }
    ],
    duplicates: [],
    errors: []
  };

  const exampleResult: ParseResult = {
    variables: [
      { key: 'DATABASE_URL', value: '', lineNumber: 1 },
      { key: 'API_KEY', value: '', lineNumber: 2 }
    ],
    duplicates: [],
    errors: []
  };

  const validation = EnvValidator.validate(envResult, exampleResult);

  assert.strictEqual(validation.missing.length, 0);
  assert.strictEqual(validation.empty.length, 0);
  assert.strictEqual(validation.duplicates.length, 0);
  assert.strictEqual(validation.hasErrors, false);
});

test('EnvValidator - hasErrors true when parse errors exist', () => {
  const envResult: ParseResult = {
    variables: [
      { key: 'DATABASE_URL', value: 'postgres://localhost', lineNumber: 1 }
    ],
    duplicates: [],
    errors: [
      { lineNumber: 2, message: 'Invalid syntax' }
    ]
  };

  const exampleResult: ParseResult = {
    variables: [
      { key: 'DATABASE_URL', value: '', lineNumber: 1 }
    ],
    duplicates: [],
    errors: []
  };

  const validation = EnvValidator.validate(envResult, exampleResult);

  assert.strictEqual(validation.hasErrors, true);
});
