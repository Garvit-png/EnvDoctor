/**
 * Core types for EnvDoctor
 */

export interface EnvVariable {
  key: string;
  value: string;
  lineNumber: number;
}

export interface ParseResult {
  variables: EnvVariable[];
  duplicates: string[];
  errors: ParseError[];
}

export interface ParseError {
  lineNumber: number;
  message: string;
}

export interface ValidationResult {
  missing: string[];
  empty: string[];
  duplicates: string[];
  present: string[];
  hasErrors: boolean;
}

export interface CliOptions {
  env: string;
  example: string;
  help?: boolean;
  version?: boolean;
}

export interface ReportOptions {
  showPresent?: boolean;
}
