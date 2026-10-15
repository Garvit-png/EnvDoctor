/**
 * Safe .env file parser
 * Handles key-value pairs, comments, and multiline values
 */

import { readFileSync } from 'fs';
import type { ParseResult, EnvVariable, ParseError } from './types.js';

export class EnvParser {
  /**
   * Parse a .env file and return variables, duplicates, and errors
   */
  static parse(filePath: string): ParseResult {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    const variables: EnvVariable[] = [];
    const errors: ParseError[] = [];
    const keysSeen = new Map<string, number>();
    const duplicates: string[] = [];

    let currentKey = '';
    let currentValue = '';
    let currentLineNumber = 0;
    let inMultiline = false;

    for (let i = 0; i < lines.length; i++) {
      const lineNumber = i + 1;
      let line = lines[i];

      // Skip empty lines and comments (unless in multiline)
      if (!inMultiline) {
        const trimmed = line.trim();
        if (trimmed === '' || trimmed.startsWith('#')) {
          continue;
        }
      }

      // Handle multiline values (quoted values)
      if (inMultiline) {
        currentValue += '\n' + line;
        
        // Check if multiline ends
        if (line.includes('"') && !line.endsWith('\\"')) {
          inMultiline = false;
          
          // Clean up the multiline value
          currentValue = currentValue.replace(/^"/, '').replace(/"$/, '');
          
          variables.push({
            key: currentKey,
            value: currentValue,
            lineNumber: currentLineNumber
          });
          
          currentKey = '';
          currentValue = '';
        }
        continue;
      }

      // Parse key-value pair
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      
      if (!match) {
        // If line has content but doesn't match pattern, it's an error
        if (line.trim() !== '') {
          errors.push({
            lineNumber,
            message: `Invalid syntax: "${line.trim()}"`
          });
        }
        continue;
      }

      const key = match[1];
      let value = match[2].trim();

      // Handle quoted values
      if (value.startsWith('"')) {
        if (value.endsWith('"') && value.length > 1 && !value.endsWith('\\"')) {
          // Single-line quoted value
          value = value.slice(1, -1);
        } else {
          // Start of multiline value
          inMultiline = true;
          currentKey = key;
          currentValue = value;
          currentLineNumber = lineNumber;
          continue;
        }
      } else if (value.startsWith("'")) {
        if (value.endsWith("'") && value.length > 1) {
          value = value.slice(1, -1);
        }
      }

      // Remove inline comments (only if not in quotes)
      const commentIndex = value.indexOf('#');
      if (commentIndex !== -1) {
        value = value.substring(0, commentIndex).trim();
      }

      // Check for duplicates
      if (keysSeen.has(key)) {
        if (!duplicates.includes(key)) {
          duplicates.push(key);
        }
      } else {
        keysSeen.set(key, lineNumber);
      }

      variables.push({
        key,
        value,
        lineNumber
      });
    }

    // Handle unclosed multiline
    if (inMultiline) {
      errors.push({
        lineNumber: currentLineNumber,
        message: `Unclosed quoted value for key: ${currentKey}`
      });
    }

    return {
      variables,
      duplicates,
      errors
    };
  }

  /**
   * Get all unique keys from parsed variables
   */
  static getKeys(variables: EnvVariable[]): string[] {
    return Array.from(new Set(variables.map(v => v.key)));
  }

  /**
   * Get value for a specific key (returns first occurrence)
   */
  static getValue(variables: EnvVariable[], key: string): string | undefined {
    const variable = variables.find(v => v.key === key);
    return variable?.value;
  }
}
