/**
 * Environment validation logic
 */

import type { ParseResult, ValidationResult } from './types.js';
import { EnvParser } from './parser.js';

export class EnvValidator {
  /**
   * Validate .env against .env.example
   */
  static validate(
    envResult: ParseResult,
    exampleResult: ParseResult
  ): ValidationResult {
    const envKeys = new Set(EnvParser.getKeys(envResult.variables));
    const exampleKeys = EnvParser.getKeys(exampleResult.variables);

    const missing: string[] = [];
    const empty: string[] = [];
    const present: string[] = [];

    // Check each key in example
    for (const key of exampleKeys) {
      if (!envKeys.has(key)) {
        missing.push(key);
      } else {
        const value = EnvParser.getValue(envResult.variables, key);
        if (value === '' || value === undefined) {
          empty.push(key);
        } else {
          present.push(key);
        }
      }
    }

    // Combine duplicates from both files
    const allDuplicates = new Set([
      ...envResult.duplicates,
      ...exampleResult.duplicates
    ]);

    const hasErrors = 
      missing.length > 0 || 
      empty.length > 0 || 
      allDuplicates.size > 0 ||
      envResult.errors.length > 0 ||
      exampleResult.errors.length > 0;

    return {
      missing,
      empty,
      duplicates: Array.from(allDuplicates),
      present,
      hasErrors
    };
  }
}
