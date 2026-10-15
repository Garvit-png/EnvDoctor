/**
 * Parser tests
 */

import { test } from 'node:test';
import assert from 'node:assert';
import { writeFileSync, unlinkSync } from 'fs';
import { EnvParser } from '../src/parser.js';

const TEST_FILE = '.env.test.tmp';

function cleanup() {
  try {
    unlinkSync(TEST_FILE);
  } catch {
    // Ignore if file doesn't exist
  }
}

test('EnvParser - parses simple key-value pairs', () => {
  const content = `
DATABASE_URL=postgres://localhost:5432/db
API_KEY=secret123
PORT=3000
`;
  writeFileSync(TEST_FILE, content);

  const result = EnvParser.parse(TEST_FILE);
  
  assert.strictEqual(result.variables.length, 3);
  assert.strictEqual(result.variables[0].key, 'DATABASE_URL');
  assert.strictEqual(result.variables[0].value, 'postgres://localhost:5432/db');
  assert.strictEqual(result.errors.length, 0);
  
  cleanup();
});

test('EnvParser - handles empty values', () => {
  const content = `
DATABASE_URL=
API_KEY=secret
EMPTY_VAR=
`;
  writeFileSync(TEST_FILE, content);

  const result = EnvParser.parse(TEST_FILE);
  
  assert.strictEqual(result.variables.length, 3);
  assert.strictEqual(result.variables[0].value, '');
  assert.strictEqual(result.variables[2].value, '');
  
  cleanup();
});

test('EnvParser - skips comments and empty lines', () => {
  const content = `
# This is a comment
DATABASE_URL=postgres://localhost:5432/db

# Another comment
API_KEY=secret
`;
  writeFileSync(TEST_FILE, content);

  const result = EnvParser.parse(TEST_FILE);
  
  assert.strictEqual(result.variables.length, 2);
  
  cleanup();
});

test('EnvParser - detects duplicate keys', () => {
  const content = `
DATABASE_URL=first
DATABASE_URL=second
API_KEY=secret
`;
  writeFileSync(TEST_FILE, content);

  const result = EnvParser.parse(TEST_FILE);
  
  assert.strictEqual(result.variables.length, 3);
  assert.strictEqual(result.duplicates.length, 1);
  assert.strictEqual(result.duplicates[0], 'DATABASE_URL');
  
  cleanup();
});

test('EnvParser - handles quoted values', () => {
  const content = `
MESSAGE="Hello World"
PATH='/usr/local/bin'
EMPTY=""
`;
  writeFileSync(TEST_FILE, content);

  const result = EnvParser.parse(TEST_FILE);
  
  assert.strictEqual(result.variables.length, 3);
  assert.strictEqual(result.variables[0].value, 'Hello World');
  assert.strictEqual(result.variables[1].value, '/usr/local/bin');
  assert.strictEqual(result.variables[2].value, '');
  
  cleanup();
});

test('EnvParser - handles inline comments', () => {
  const content = `
DATABASE_URL=postgres://localhost:5432/db # Production database
API_KEY=secret # API key for external service
`;
  writeFileSync(TEST_FILE, content);

  const result = EnvParser.parse(TEST_FILE);
  
  assert.strictEqual(result.variables.length, 2);
  assert.strictEqual(result.variables[0].value, 'postgres://localhost:5432/db');
  assert.strictEqual(result.variables[1].value, 'secret');
  
  cleanup();
});

test('EnvParser - getKeys returns unique keys', () => {
  const content = `
DATABASE_URL=first
API_KEY=second
DATABASE_URL=duplicate
`;
  writeFileSync(TEST_FILE, content);

  const result = EnvParser.parse(TEST_FILE);
  const keys = EnvParser.getKeys(result.variables);
  
  assert.strictEqual(keys.length, 2);
  assert.ok(keys.includes('DATABASE_URL'));
  assert.ok(keys.includes('API_KEY'));
  
  cleanup();
});

test('EnvParser - getValue returns first occurrence', () => {
  const content = `
DATABASE_URL=first
API_KEY=second
DATABASE_URL=duplicate
`;
  writeFileSync(TEST_FILE, content);

  const result = EnvParser.parse(TEST_FILE);
  const value = EnvParser.getValue(result.variables, 'DATABASE_URL');
  
  assert.strictEqual(value, 'first');
  
  cleanup();
});

test('EnvParser - handles malformed lines', () => {
  const content = `
VALID_KEY=value
this is not valid
ANOTHER_KEY=value2
`;
  writeFileSync(TEST_FILE, content);

  const result = EnvParser.parse(TEST_FILE);
  
  assert.strictEqual(result.variables.length, 2);
  assert.strictEqual(result.errors.length, 1);
  assert.ok(result.errors[0].message.includes('Invalid syntax'));
  
  cleanup();
});
