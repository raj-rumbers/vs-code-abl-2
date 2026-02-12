# Test Suite Documentation

## Overview

This directory contains unit and integration tests for the OpenEdge ABL LSP extension.

## Test Organization

### Unit Tests

- **projectResolver.test.ts**: Tests for intelligent project resolution utility
  - Path matching logic
  - Nested project handling
  - Default project fallback
  - Platform-specific behavior

### Integration Tests

- **compileBuffer.integration.test.ts**: Tests for check syntax command integration
  - End-to-end project selection flow
  - User interaction scenarios
  - Backward compatibility checks

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Suite
```bash
npm test -- --grep "projectResolver"
npm test -- --grep "CompileBuffer Integration"
```

### Specific Test
```bash
npm test -- --grep "should auto-detect project from file path"
```

## Test Coverage

Run with coverage reporting:
```bash
npm test -- --coverage
```

## Manual Testing

Integration tests require a real VS Code workspace. See `manual-test-guide.md` for instructions.

## Adding New Tests

1. Create test file in `src/test/suite/` directory
2. Import required modules and utilities
3. Use `suite()` and `test()` from Mocha framework
4. Follow existing patterns for mock data and assertions
5. Document what is being tested

## Test Conventions

- Use descriptive test names: "should [expected behavior] when [condition]"
- Test both success and failure paths
- Test edge cases (null, empty, invalid inputs)
- Use helper functions for creating mock data
- Clean up after tests (if creating files/resources)

## Debugging Tests

Run tests in debug mode:
```bash
npm run test:debug
```

Then attach VS Code debugger to the test process.
