#!/usr/bin/env node

/**
 * EnvDoctor CLI entry point
 */

import { existsSync } from 'fs';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import type { CliOptions } from './types.js';
import { EnvParser } from './parser.js';
import { EnvValidator } from './validator.js';
import { Reporter } from './reporter.js';

class CLI {
  private options: CliOptions = {
    env: '.env',
    example: '.env.example'
  };

  /**
   * Parse command line arguments
   */
  parseArgs(args: string[]): void {
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      switch (arg) {
        case '--help':
        case '-h':
          this.options.help = true;
          break;

        case '--version':
        case '-v':
          this.options.version = true;
          break;

        case '--env':
          if (i + 1 < args.length) {
            this.options.env = args[++i];
          } else {
            this.error('--env requires a file path');
          }
          break;

        case '--example':
          if (i + 1 < args.length) {
            this.options.example = args[++i];
          } else {
            this.error('--example requires a file path');
          }
          break;

        default:
          if (arg.startsWith('-')) {
            this.error(`Unknown option: ${arg}`);
          }
      }
    }
  }

  /**
   * Display help message
   */
  showHelp(): void {
    const help = `
EnvDoctor 🩺
Catch environment configuration errors before they break your application.

USAGE:
  dotenv-doctor [options]

OPTIONS:
  --env <path>       Path to .env file (default: .env)
  --example <path>   Path to .env.example file (default: .env.example)
  --help, -h         Show this help message
  --version, -v      Show version number

EXAMPLES:
  dotenv-doctor
  dotenv-doctor --env .env.local --example .env.example
  dotenv-doctor --help

EXIT CODES:
  0  All checks passed
  1  Validation errors found

For more information, visit: https://github.com/Garvit-png/EnvDoctor
`;
    console.log(help);
  }

  /**
   * Display version
   */
  showVersion(): void {
    try {
      const packagePath = resolve(__dirname, '../package.json');
      const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
      console.log(`dotenv-doctor v${packageJson.version}`);
    } catch {
      console.log('envdoctor (version unknown)');
    }
  }

  /**
   * Print error and exit
   */
  error(message: string): never {
    console.error(`Error: ${message}`);
    process.exit(1);
  }

  /**
   * Run the validation
   */
  run(): void {
    const args = process.argv.slice(2);
    this.parseArgs(args);

    // Handle help and version
    if (this.options.help) {
      this.showHelp();
      process.exit(0);
    }

    if (this.options.version) {
      this.showVersion();
      process.exit(0);
    }

    // Resolve file paths
    const envPath = resolve(process.cwd(), this.options.env);
    const examplePath = resolve(process.cwd(), this.options.example);

    // Check if files exist
    if (!existsSync(examplePath)) {
      this.error(`Example file not found: ${this.options.example}`);
    }

    if (!existsSync(envPath)) {
      this.error(`Environment file not found: ${this.options.env}`);
    }

    try {
      // Parse both files
      const envResult = EnvParser.parse(envPath);
      const exampleResult = EnvParser.parse(examplePath);

      // Validate
      const validation = EnvValidator.validate(envResult, exampleResult);

      // Generate and print report
      const report = Reporter.generateReport(
        validation,
        envResult,
        exampleResult,
        { showPresent: true }
      );
      Reporter.print(report);

      // Exit with appropriate code
      const exitCode = Reporter.getExitCode(validation);
      process.exit(exitCode);
    } catch (error) {
      if (error instanceof Error) {
        this.error(error.message);
      } else {
        this.error('An unexpected error occurred');
      }
    }
  }
}

// Run CLI
const cli = new CLI();
cli.run();
