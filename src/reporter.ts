/**
 * Report formatting and output
 */

import type { ValidationResult, ParseResult, ReportOptions } from './types.js';

export class Reporter {
  /**
   * Generate a readable terminal report
   */
  static generateReport(
    validation: ValidationResult,
    envResult: ParseResult,
    exampleResult: ParseResult,
    options: ReportOptions = {}
  ): string {
    const lines: string[] = [];
    
    lines.push('EnvDoctor 🩺\n');
    lines.push('Scanning environment configuration...\n');

    // Show present variables
    if (options.showPresent && validation.present.length > 0) {
      for (const key of validation.present) {
        lines.push(`✓ ${key} is present`);
      }
    }

    // Show missing variables
    if (validation.missing.length > 0) {
      for (const key of validation.missing) {
        lines.push(`✗ ${key} is missing`);
      }
    }

    // Show empty variables
    if (validation.empty.length > 0) {
      for (const key of validation.empty) {
        lines.push(`⚠ ${key} is empty`);
      }
    }

    // Show parsing errors
    const allErrors = [...envResult.errors, ...exampleResult.errors];
    if (allErrors.length > 0) {
      lines.push('');
      lines.push('Parse errors:');
      for (const error of allErrors) {
        lines.push(`  Line ${error.lineNumber}: ${error.message}`);
      }
    }

    // Summary section
    lines.push('\n' + '─'.repeat(32));
    
    const errorCount = validation.missing.length + validation.empty.length + allErrors.length;
    const warningCount = validation.duplicates.length;

    if (errorCount === 0 && warningCount === 0) {
      lines.push('✓ All checks passed!\n');
    } else {
      if (errorCount > 0) {
        const plural = errorCount === 1 ? 'error' : 'errors';
        lines.push(`${errorCount} ${plural} found.\n`);
      }
      
      if (warningCount > 0) {
        const plural = warningCount === 1 ? 'warning' : 'warnings';
        lines.push(`${warningCount} ${plural} found.\n`);
      }

      // Details
      if (validation.missing.length > 0) {
        lines.push('Missing variables:');
        for (const key of validation.missing) {
          lines.push(`  - ${key}`);
        }
        lines.push('');
        lines.push('Add these variables to your .env file.\n');
      }

      if (validation.empty.length > 0) {
        lines.push('Empty variables:');
        for (const key of validation.empty) {
          lines.push(`  - ${key}`);
        }
        lines.push('');
        lines.push('These variables exist but have no value.\n');
      }

      if (validation.duplicates.length > 0) {
        lines.push('Duplicate variables:');
        for (const key of validation.duplicates) {
          lines.push(`  - ${key}`);
        }
        lines.push('');
        lines.push('Remove duplicate declarations.\n');
      }
    }

    return lines.join('\n');
  }

  /**
   * Print report to console
   */
  static print(report: string): void {
    console.log(report);
  }

  /**
   * Get appropriate exit code based on validation result
   */
  static getExitCode(validation: ValidationResult): number {
    return validation.hasErrors ? 1 : 0;
  }
}
