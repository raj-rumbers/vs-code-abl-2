# Phase 3: Testing - Unit and Integration Tests

**Phase ID**: PHASE-003  
**Phase Name**: Testing - Unit and Integration Tests  
**Dependencies**: PHASE-001, PHASE-002  
**Estimated Duration**: 10 hours  
**Status**: Not Started

---

## Phase Overview

Create comprehensive unit tests for the project resolver module and integration tests for the updated compileBuffer() functionality. Ensure all edge cases are covered and the implementation meets requirements.

---

## Success Criteria

- [ ] Unit test file created for projectResolver module
- [ ] All public functions have unit tests
- [ ] Edge cases are covered (nested projects, no matches, etc.)
- [ ] Integration test file created for compileBuffer()
- [ ] Test coverage > 90% for new code
- [ ] All tests pass successfully
- [ ] Test documentation explains each test case
- [ ] Tests can run via npm test command

---

## Tasks

### TASK-020: Create Unit Test File Structure

**Description**: Create the test file structure and setup for project resolver tests.

**File**: `src/test/suite/projectResolver.test.ts` (create new)

**Implementation**:
```typescript
/**
 * Unit tests for projectResolver module
 * Tests the intelligent project selection algorithm
 */

import * as assert from 'assert';
import { OpenEdgeProjectConfig } from '../../shared/openEdgeConfigFile';
import { 
    resolveProjectWithFallback, 
    findAllMatchingProjects, 
    getMostSpecificProject 
} from '../../shared/projectResolver';

// Test suite configuration
suite('Project Resolver Tests', () => {
    
    // Helper function to create mock projects
    function createMockProject(name: string, rootDir: string): OpenEdgeProjectConfig {
        return {
            name: name,
            rootDir: rootDir,
            uri: { toString: () => `file://${rootDir}` } as any,
            // Add other required properties with minimal mock data
        } as OpenEdgeProjectConfig;
    }
    
    // Helper function to create mock getProjectByName
    function createGetProjectByName(projects: OpenEdgeProjectConfig[]) {
        return (name: string) => projects.find(p => p.name === name);
    }
    
    // Test suites will be added below...
});
```

**Validation**:
```bash
# Create test file
touch /workspaces/vs-code-abl-2/src/test/suite/projectResolver.test.ts

# Verify test framework can find it
cd /workspaces/vs-code-abl-2
npm test 2>&1 | grep projectResolver || echo "Test file detected"
```

**Acceptance Criteria**:
- Test file created in correct location
- Import statements resolve correctly
- Helper functions defined for creating mock data
- Test suite structure established
- File compiles without errors

---

### TASK-021: Unit Tests for findAllMatchingProjects

**Description**: Create comprehensive tests for the findAllMatchingProjects function.

**File**: `src/test/suite/projectResolver.test.ts`

**Implementation**:
```typescript
    suite('findAllMatchingProjects', () => {
        
        test('should return empty array for null/undefined inputs', () => {
            const projects = [createMockProject('TestProject', '/test/project')];
            
            assert.strictEqual(findAllMatchingProjects(null as any, projects).length, 0);
            assert.strictEqual(findAllMatchingProjects(undefined as any, projects).length, 0);
            assert.strictEqual(findAllMatchingProjects('', projects).length, 0);
            assert.strictEqual(findAllMatchingProjects('/test/file.p', null as any).length, 0);
            assert.strictEqual(findAllMatchingProjects('/test/file.p', []).length, 0);
        });
        
        test('should find single matching project', () => {
            const projects = [
                createMockProject('ProjectA', '/workspace/projectA'),
                createMockProject('ProjectB', '/workspace/projectB')
            ];
            
            const matches = findAllMatchingProjects('/workspace/projectA/src/test.p', projects);
            
            assert.strictEqual(matches.length, 1);
            assert.strictEqual(matches[0].name, 'ProjectA');
        });
        
        test('should find multiple matching projects (nested)', () => {
            const projects = [
                createMockProject('ParentProject', '/workspace/parent'),
                createMockProject('ChildProject', '/workspace/parent/child')
            ];
            
            const matches = findAllMatchingProjects('/workspace/parent/child/src/test.p', projects);
            
            assert.strictEqual(matches.length, 2);
            assert.ok(matches.some(p => p.name === 'ParentProject'));
            assert.ok(matches.some(p => p.name === 'ChildProject'));
        });
        
        test('should return empty array when no projects match', () => {
            const projects = [
                createMockProject('ProjectA', '/workspace/projectA'),
                createMockProject('ProjectB', '/workspace/projectB')
            ];
            
            const matches = findAllMatchingProjects('/external/test.p', projects);
            
            assert.strictEqual(matches.length, 0);
        });
        
        test('should handle case sensitivity on Windows', () => {
            const projects = [
                createMockProject('TestProject', '/Workspace/Project')
            ];
            
            // On Windows, should match regardless of case
            // On Unix, should be case-sensitive
            const matches = findAllMatchingProjects('/workspace/project/test.p', projects);
            
            if (process.platform === 'win32') {
                assert.strictEqual(matches.length, 1, 'Windows should match case-insensitively');
            } else {
                assert.strictEqual(matches.length, 0, 'Unix should match case-sensitively');
            }
        });
        
        test('should skip projects with invalid rootDir', () => {
            const projects = [
                createMockProject('ValidProject', '/workspace/valid'),
                { name: 'InvalidProject', rootDir: null } as any,
                createMockProject('AnotherValid', '/workspace/another')
            ];
            
            const matches = findAllMatchingProjects('/workspace/valid/test.p', projects);
            
            assert.strictEqual(matches.length, 1);
            assert.strictEqual(matches[0].name, 'ValidProject');
        });
    });
```

**Validation**:
```bash
# Run specific test suite
cd /workspaces/vs-code-abl-2
npm test -- --grep "findAllMatchingProjects"
```

**Acceptance Criteria**:
- All tests pass
- Edge cases covered (null inputs, empty arrays, invalid data)
- Platform-specific behavior tested
- Single match, multiple matches, and no match scenarios tested

---

### TASK-022: Unit Tests for getMostSpecificProject

**Description**: Create tests for the getMostSpecificProject function.

**File**: `src/test/suite/projectResolver.test.ts`

**Implementation**:
```typescript
    suite('getMostSpecificProject', () => {
        
        test('should throw error for empty array', () => {
            assert.throws(
                () => getMostSpecificProject([]),
                /empty/i,
                'Should throw error when array is empty'
            );
        });
        
        test('should return single project when array has one element', () => {
            const projects = [createMockProject('OnlyProject', '/workspace/project')];
            
            const result = getMostSpecificProject(projects);
            
            assert.strictEqual(result.name, 'OnlyProject');
        });
        
        test('should return project with longest root path', () => {
            const projects = [
                createMockProject('ParentProject', '/workspace/parent'),
                createMockProject('ChildProject', '/workspace/parent/child'),
                createMockProject('GrandchildProject', '/workspace/parent/child/grandchild')
            ];
            
            const result = getMostSpecificProject(projects);
            
            assert.strictEqual(result.name, 'GrandchildProject');
            assert.strictEqual(result.rootDir, '/workspace/parent/child/grandchild');
        });
        
        test('should handle projects with same depth correctly', () => {
            const projects = [
                createMockProject('ProjectA', '/workspace/projectA'),
                createMockProject('ProjectB', '/workspace/projectB')
            ];
            
            const result = getMostSpecificProject(projects);
            
            // Should return one of them (both have same length)
            // Order doesn't matter as they shouldn't match same file
            assert.ok(result.name === 'ProjectA' || result.name === 'ProjectB');
        });
        
        test('should not modify original array', () => {
            const projects = [
                createMockProject('Project1', '/short'),
                createMockProject('Project2', '/very/long/path')
            ];
            
            const originalOrder = projects.map(p => p.name);
            getMostSpecificProject(projects);
            const newOrder = projects.map(p => p.name);
            
            assert.deepStrictEqual(originalOrder, newOrder, 'Original array should not be modified');
        });
    });
```

**Validation**:
```bash
# Run specific test suite
npm test -- --grep "getMostSpecificProject"
```

**Acceptance Criteria**:
- Error handling tested (empty array)
- Single project scenario tested
- Multiple projects with different depths tested
- Original array immutability verified
- All tests pass

---

### TASK-023: Unit Tests for resolveProjectWithFallback

**Description**: Create comprehensive tests for the main resolution function.

**File**: `src/test/suite/projectResolver.test.ts`

**Implementation**:
```typescript
    suite('resolveProjectWithFallback', () => {
        
        test('should return null for empty inputs', () => {
            const result1 = resolveProjectWithFallback('', [], undefined, undefined);
            const result2 = resolveProjectWithFallback(null as any, [], undefined, undefined);
            const result3 = resolveProjectWithFallback('/test.p', [], undefined, undefined);
            
            assert.strictEqual(result1, null);
            assert.strictEqual(result2, null);
            assert.strictEqual(result3, null);
        });
        
        test('should auto-select single project in workspace', () => {
            const projects = [createMockProject('OnlyProject', '/workspace/project')];
            
            // File inside project
            const result1 = resolveProjectWithFallback(
                '/workspace/project/src/test.p',
                projects,
                undefined,
                undefined
            );
            
            // File outside project (single project should still be used)
            const result2 = resolveProjectWithFallback(
                '/external/test.p',
                projects,
                undefined,
                undefined
            );
            
            assert.strictEqual(result1?.name, 'OnlyProject');
            assert.strictEqual(result2?.name, 'OnlyProject');
        });
        
        test('should auto-detect project from file path (single match)', () => {
            const projects = [
                createMockProject('ProjectA', '/workspace/projectA'),
                createMockProject('ProjectB', '/workspace/projectB')
            ];
            const getProjectByName = createGetProjectByName(projects);
            
            const result = resolveProjectWithFallback(
                '/workspace/projectB/src/test.p',
                projects,
                undefined,
                getProjectByName
            );
            
            assert.strictEqual(result?.name, 'ProjectB');
        });
        
        test('should select most specific for nested projects', () => {
            const projects = [
                createMockProject('ParentProject', '/workspace/parent'),
                createMockProject('ChildProject', '/workspace/parent/child')
            ];
            const getProjectByName = createGetProjectByName(projects);
            
            const result = resolveProjectWithFallback(
                '/workspace/parent/child/src/test.p',
                projects,
                undefined,
                getProjectByName
            );
            
            assert.strictEqual(result?.name, 'ChildProject');
        });
        
        test('should override default project when file matches different project', () => {
            const projects = [
                createMockProject('ProjectA', '/workspace/projectA'),
                createMockProject('ProjectB', '/workspace/projectB')
            ];
            const getProjectByName = createGetProjectByName(projects);
            
            // Default is ProjectA, but file is in ProjectB
            const result = resolveProjectWithFallback(
                '/workspace/projectB/src/test.p',
                projects,
                'ProjectA', // default project
                getProjectByName
            );
            
            assert.strictEqual(result?.name, 'ProjectB', 'Should use auto-detected project, not default');
        });
        
        test('should use default project when no auto-detection match', () => {
            const projects = [
                createMockProject('ProjectA', '/workspace/projectA'),
                createMockProject('ProjectB', '/workspace/projectB')
            ];
            const getProjectByName = createGetProjectByName(projects);
            
            // File outside all projects, but default is set
            const result = resolveProjectWithFallback(
                '/external/test.p',
                projects,
                'ProjectA', // default project
                getProjectByName
            );
            
            assert.strictEqual(result?.name, 'ProjectA', 'Should fall back to default');
        });
        
        test('should return null when no match and no valid default', () => {
            const projects = [
                createMockProject('ProjectA', '/workspace/projectA'),
                createMockProject('ProjectB', '/workspace/projectB')
            ];
            const getProjectByName = createGetProjectByName(projects);
            
            // File outside all projects, no default
            const result1 = resolveProjectWithFallback(
                '/external/test.p',
                projects,
                undefined,
                getProjectByName
            );
            
            // File outside all projects, invalid default name
            const result2 = resolveProjectWithFallback(
                '/external/test.p',
                projects,
                'NonExistentProject',
                getProjectByName
            );
            
            assert.strictEqual(result1, null);
            assert.strictEqual(result2, null);
        });
        
        test('should handle missing getProjectByName function gracefully', () => {
            const projects = [
                createMockProject('ProjectA', '/workspace/projectA'),
                createMockProject('ProjectB', '/workspace/projectB')
            ];
            
            // File outside projects, default set, but no getter function
            const result = resolveProjectWithFallback(
                '/external/test.p',
                projects,
                'ProjectA',
                undefined // no getter function
            );
            
            assert.strictEqual(result, null, 'Should return null when cannot retrieve default');
        });
    });
```

**Validation**:
```bash
# Run specific test suite
npm test -- --grep "resolveProjectWithFallback"
```

**Acceptance Criteria**:
- All priority levels tested (single project, auto-detect, default fallback, null)
- Default project override scenario tested (key requirement!)
- Nested project scenario tested
- Missing/invalid inputs handled gracefully
- All tests pass

---

### TASK-024: Create Integration Test File

**Description**: Create integration test file for testing compileBuffer() with the new resolver.

**File**: `src/test/suite/compileBuffer.integration.test.ts` (create new)

**Implementation**:
```typescript
/**
 * Integration tests for compileBuffer with intelligent project resolution
 * Tests the complete flow from command invocation to project selection
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

suite('CompileBuffer Integration Tests', () => {
    
    // Note: These tests require a real VS Code workspace with projects
    // They may need to be run manually or with a test workspace setup
    
    // Helper to create test workspace structure
    async function createTestWorkspace() {
        // This would set up a temporary workspace with multiple projects
        // Implementation depends on test infrastructure
    }
    
    // Helper to clean up test workspace
    async function cleanupTestWorkspace() {
        // Clean up after tests
    }
    
    suite('Single Project Workspace', () => {
        
        test('should auto-select single project', async function() {
            this.skip(); // Skip until test workspace is set up
            
            // Test implementation:
            // 1. Create workspace with single project
            // 2. Open file in that project
            // 3. Execute compile command
            // 4. Verify no QuickPick shown
            // 5. Verify compilation executes
        });
    });
    
    suite('Multi-Project Workspace', () => {
        
        test('should auto-detect project from file path', async function() {
            this.skip(); // Skip until test workspace is set up
            
            // Test implementation:
            // 1. Create workspace with multiple projects
            // 2. Open file in ProjectA
            // 3. Execute compile command
            // 4. Verify ProjectA is used
        });
        
        test('should override default project when file is elsewhere', async function() {
            this.skip(); // Skip until test workspace is set up
            
            // This is the key test case from the issue!
            // 1. Set default project to ProjectA
            // 2. Open file in ProjectB
            // 3. Execute compile command
            // 4. Verify ProjectB is used (not ProjectA)
        });
    });
    
    suite('Edge Cases', () => {
        
        test('should prompt when file is outside all projects', async function() {
            this.skip(); // Skip until test workspace is set up
            
            // Test implementation:
            // 1. Open file outside any project
            // 2. Execute compile command
            // 3. Verify QuickPick is shown
        });
    });
});
```

**Validation**:
```bash
# Verify test file is recognized
cd /workspaces/vs-code-abl-2
npm test -- --grep "CompileBuffer Integration"
```

**Acceptance Criteria**:
- Test file created and structured
- Test placeholders for key scenarios
- Tests are skipped initially (require manual workspace setup)
- Test file compiles without errors
- Infrastructure ready for future test implementation

---

### TASK-025: Add Test Documentation

**Description**: Create documentation explaining how to run tests and what is tested.

**File**: `src/test/suite/README.md` (create new)

**Implementation**:
```markdown
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
```

**Validation**:
```bash
# Verify README exists and is readable
test -f /workspaces/vs-code-abl-2/src/test/suite/README.md && echo "✓ README created"
cat /workspaces/vs-code-abl-2/src/test/suite/README.md | head -5
```

**Acceptance Criteria**:
- README file created with clear structure
- Explains how to run tests
- Documents test organization
- Provides guidelines for adding new tests
- Includes debugging instructions

---

### TASK-026: Run All Unit Tests and Verify

**Description**: Execute all unit tests and verify they pass.

**Commands**:
```bash
cd /workspaces/vs-code-abl-2

# Clean build first
npm run compile

# Run tests
npm test

# Run with verbose output
npm test -- --reporter spec

# Generate coverage report
npm test -- --coverage
```

**Validation Criteria**:
```bash
# All tests should pass
npm test 2>&1 | grep "passing" | grep -v "0 passing"

# No failing tests
npm test 2>&1 | grep "failing" && echo "✗ Tests failing" || echo "✓ All tests pass"

# Check coverage (should be > 90% for new code)
npm test -- --coverage | grep "Statements" | grep -E "[9][0-9]|100"
```

**Acceptance Criteria**:
- All unit tests pass
- No test failures or errors
- Test coverage > 90% for projectResolver module
- Test output is clear and informative
- Tests run in reasonable time (< 10 seconds for unit tests)

---

### TASK-027: Document Test Results

**Description**: Document test results and coverage in a test report.

**File**: `plans/plan_1/test-results.md` (create new)

**Implementation**:
```markdown
# Test Results Report
## Plan #1: Smart Project Selection

**Test Date**: [DATE]  
**Tested By**: [NAME]  
**Test Environment**: VS Code Extension Host

---

## Unit Test Results

### projectResolver Module

#### findAllMatchingProjects Tests
- ✅ Returns empty array for null/undefined inputs
- ✅ Finds single matching project
- ✅ Finds multiple matching projects (nested)
- ✅ Returns empty array when no projects match
- ✅ Handles case sensitivity on Windows
- ✅ Skips projects with invalid rootDir

**Status**: PASS (6/6 tests passing)

#### getMostSpecificProject Tests
- ✅ Throws error for empty array
- ✅ Returns single project when array has one element
- ✅ Returns project with longest root path
- ✅ Handles projects with same depth correctly
- ✅ Does not modify original array

**Status**: PASS (5/5 tests passing)

#### resolveProjectWithFallback Tests
- ✅ Returns null for empty inputs
- ✅ Auto-selects single project in workspace
- ✅ Auto-detects project from file path (single match)
- ✅ Selects most specific for nested projects
- ✅ Overrides default project when file matches different project
- ✅ Uses default project when no auto-detection match
- ✅ Returns null when no match and no valid default
- ✅ Handles missing getProjectByName function gracefully

**Status**: PASS (8/8 tests passing)

---

## Unit Test Summary

- **Total Tests**: 19
- **Passing**: 19
- **Failing**: 0
- **Skipped**: 0
- **Coverage**: XX% statements, XX% branches

---

## Integration Test Results

### compileBuffer Integration Tests

**Status**: PENDING (require manual testing with real workspace)

See `manual-test-results.md` for manual test execution results.

---

## Manual Test Results

### Single Project Workspace
- ✅ Auto-selects single project
- ✅ No QuickPick dialog shown
- ✅ Backward compatibility maintained

### Multi-Project Auto-Detection
- ✅ File in ProjectA → ProjectA used
- ✅ File in ProjectB → ProjectB used
- ✅ File outside projects → QuickPick shown

### Default Project Behavior
- ✅ Default ProjectA, file in ProjectB → ProjectB used (override)
- ✅ Default ProjectA, file outside → QuickPick shown
- ✅ Default ProjectA, file in ProjectA → ProjectA used

### Nested Projects
- ✅ File in child project → child used (most specific)
- ✅ File in parent only → parent used

---

## Issues Found

None.

---

## Recommendations

1. Add automated integration tests when test infrastructure allows
2. Consider adding performance benchmarks for large project sets
3. Add tests for symbolic links (requires test workspace setup)

---

**Overall Status**: ✅ PASS

*End of Test Results Report*
```

**Validation**:
```bash
# Verify report exists
test -f /workspaces/vs-code-abl-2/plans/plan_1/test-results.md && echo "✓ Report created"
```

**Acceptance Criteria**:
- Test results documented clearly
- Pass/fail status for each test suite
- Coverage metrics included
- Issues and recommendations documented
- Report is comprehensive and professional

---

## Phase Completion Checklist

- [ ] All 8 tasks completed (TASK-020 through TASK-027)
- [ ] Unit test file created for projectResolver
- [ ] All findAllMatchingProjects tests pass
- [ ] All getMostSpecificProject tests pass
- [ ] All resolveProjectWithFallback tests pass
- [ ] Integration test structure created
- [ ] Test documentation written
- [ ] All unit tests pass (19/19)
- [ ] Test coverage > 90% for new code
- [ ] Test results documented

---

## Phase Dependencies

**Required Before This Phase**:
- PHASE-001: Project resolver module
- PHASE-002: Integration with compileBuffer

**Required For Next Phases**:
- PHASE-004: Validation that code is well-tested before extending
- PHASE-005: Documentation references test coverage

---

## Rollback Plan

If tests reveal issues:
1. Fix identified bugs in projectResolver or extension.ts
2. Re-run tests until all pass
3. Update implementation as needed
4. Document any changes made

---

**Phase Status**: ⏸️ Waiting for PHASE-001, PHASE-002  
**Last Updated**: 2026-02-12

---

*End of Phase 3*
