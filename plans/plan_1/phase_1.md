# Phase 1: Foundation - Project Resolution Utility

**Phase ID**: PHASE-001  
**Phase Name**: Foundation - Project Resolution Utility  
**Dependencies**: None  
**Estimated Duration**: 8 hours  
**Status**: Not Started

---

## Phase Overview

Create a new, centralized project resolution utility module that implements the smart project selection algorithm. This module will contain all the core logic for auto-detecting projects based on file paths, handling nested projects, and providing fallback mechanisms.

---

## Success Criteria

- [ ] New utility module `src/shared/projectResolver.ts` created with all required functions
- [ ] All functions have TypeScript type definitions and JSDoc documentation
- [ ] Path matching logic is platform-aware (Windows vs Unix case sensitivity)
- [ ] Nested project resolution returns most specific match
- [ ] Module exports are properly defined and importable
- [ ] Code compiles without TypeScript errors
- [ ] No external dependencies added (uses only Node.js built-ins and existing imports)

---

## Tasks

### TASK-001: Create Project Resolver Module File

**Description**: Create the new utility module file with basic structure and imports.

**File**: `src/shared/projectResolver.ts`

**Actions**:
1. Create new file at path: `/workspaces/vs-code-abl-2/src/shared/projectResolver.ts`
2. Add file header comment explaining module purpose
3. Add required imports:
   - `OpenEdgeProjectConfig` from `./openEdgeConfigFile`
   - `outputChannel` from `../ablStatus`
4. Add module-level JSDoc comment describing project resolution strategy

**Implementation**:
```typescript
/**
 * Project Resolution Utility
 * 
 * Provides intelligent project selection for multi-project workspaces.
 * Implements priority-based resolution:
 *   1. Auto-detect from file path (single match)
 *   2. Most specific match (nested projects)
 *   3. Default project fallback (when no auto-detection)
 *   4. Return null for manual selection
 * 
 * @module projectResolver
 */

import { OpenEdgeProjectConfig } from './openEdgeConfigFile';
import { outputChannel } from '../ablStatus';

// Utility module implementation follows...
```

**Validation**:
```bash
# Verify file exists
test -f /workspaces/vs-code-abl-2/src/shared/projectResolver.ts && echo "✓ File created"

# Verify imports compile
cd /workspaces/vs-code-abl-2
npm run compile 2>&1 | grep -q "projectResolver" || echo "✓ No compile errors"
```

**Acceptance Criteria**:
- File exists at correct path
- File compiles without errors
- Imports are valid and resolve correctly

---

### TASK-002: Implement Path Normalization Function

**Description**: Create a utility function for platform-aware path normalization that handles case sensitivity and path separators correctly.

**File**: `src/shared/projectResolver.ts`

**Function Signature**:
```typescript
/**
 * Normalizes a file path for platform-aware comparison.
 * On Windows: converts to lowercase and ensures trailing backslash
 * On Unix/Linux/Mac: preserves case and ensures trailing forward slash
 * 
 * @param filePath - The file or directory path to normalize
 * @returns Normalized path suitable for prefix matching
 * 
 * @example
 * // Windows
 * normalizePath('C:\\Projects\\MyApp\\src\\file.p')
 * // Returns: 'c:\\projects\\myapp\\src\\'
 * 
 * // Unix
 * normalizePath('/home/user/projects/MyApp/src/file.p')
 * // Returns: '/home/user/projects/MyApp/src/'
 */
function normalizePath(filePath: string): string
```

**Implementation**:
```typescript
function normalizePath(filePath: string): string {
    if (!filePath) {
        return '';
    }
    
    // Determine platform-specific separator
    const separator = process.platform === 'win32' ? '\\' : '/';
    
    // Add trailing separator if not present (for directory matching)
    const withSeparator = filePath.endsWith(separator) ? filePath : filePath + separator;
    
    // Apply case transformation for Windows (case-insensitive filesystem)
    return process.platform === 'win32' ? withSeparator.toLowerCase() : withSeparator;
}
```

**Validation**:
```typescript
// Add to test file later - inline validation logic
assert(normalizePath('/test/path').endsWith('/'));
assert(normalizePath('/test/path/').endsWith('/'));
```

**Acceptance Criteria**:
- Function exists and is correctly typed
- Handles empty/null input gracefully
- Returns paths with trailing separator
- Applies lowercase transformation on Windows only
- Preserves case on Unix-like systems

---

### TASK-003: Implement Find All Matching Projects Function

**Description**: Create a function that finds all projects whose root directory is a prefix of the given file path.

**File**: `src/shared/projectResolver.ts`

**Function Signature**:
```typescript
/**
 * Finds all projects that contain the given file path.
 * A project "contains" a file if the file path starts with the project's root directory.
 * 
 * @param filePath - Absolute path to the file
 * @param projects - Array of all loaded OpenEdge projects
 * @returns Array of projects that contain the file (may be empty)
 * 
 * @example
 * const matches = findAllMatchingProjects('/workspace/projectA/src/test.p', projects);
 * // Returns [ProjectA] if file is in ProjectA
 * // Returns [ProjectA, ProjectB] if ProjectB is nested in ProjectA
 * // Returns [] if file is outside all projects
 */
function findAllMatchingProjects(
    filePath: string, 
    projects: OpenEdgeProjectConfig[]
): OpenEdgeProjectConfig[]
```

**Implementation**:
```typescript
function findAllMatchingProjects(
    filePath: string, 
    projects: OpenEdgeProjectConfig[]
): OpenEdgeProjectConfig[] {
    if (!filePath || !projects || projects.length === 0) {
        return [];
    }
    
    const normalizedFilePath = normalizePath(filePath);
    
    return projects.filter(project => {
        if (!project.rootDir) {
            outputChannel.warn(`Project '${project.name}' has no rootDir defined, skipping in file matching`);
            return false;
        }
        
        try {
            const normalizedRootDir = normalizePath(project.rootDir);
            return normalizedFilePath.startsWith(normalizedRootDir);
        } catch (error) {
            outputChannel.warn(`Error processing project '${project.name}' root directory: ${error.message}`);
            return false;
        }
    });
}
```

**Validation**:
```bash
# Manual testing after implementation
# Test case: file in project should return that project
# Test case: file outside all projects should return empty array
# Test case: nested projects should return both parent and child
```

**Acceptance Criteria**:
- Function correctly identifies projects containing the file
- Handles empty/invalid inputs gracefully
- Uses normalized paths for comparison
- Logs warnings for projects with invalid root directories
- Returns empty array (not null/undefined) when no matches

---

### TASK-004: Implement Get Most Specific Project Function

**Description**: Create a function that selects the most specific project from multiple matches (nested project scenario).

**File**: `src/shared/projectResolver.ts`

**Function Signature**:
```typescript
/**
 * Selects the most specific project from multiple matches.
 * "Most specific" means the project with the longest root directory path.
 * This handles nested project scenarios correctly.
 * 
 * @param projects - Array of projects that all match the file
 * @returns The project with the longest (most specific) root path
 * @throws Error if projects array is empty
 * 
 * @example
 * // Given: ProjectA at '/workspace/parent'
 * //        ProjectB at '/workspace/parent/submodule'
 * const specific = getMostSpecificProject([ProjectA, ProjectB]);
 * // Returns: ProjectB (longer root path)
 */
function getMostSpecificProject(projects: OpenEdgeProjectConfig[]): OpenEdgeProjectConfig
```

**Implementation**:
```typescript
function getMostSpecificProject(projects: OpenEdgeProjectConfig[]): OpenEdgeProjectConfig {
    if (!projects || projects.length === 0) {
        throw new Error('Cannot determine most specific project: projects array is empty');
    }
    
    if (projects.length === 1) {
        return projects[0];
    }
    
    // Sort by root directory length in descending order (longest first = most specific)
    const sorted = projects.sort((a, b) => {
        const lengthA = a.rootDir?.length || 0;
        const lengthB = b.rootDir?.length || 0;
        return lengthB - lengthA;
    });
    
    const selected = sorted[0];
    
    // Log selection for debugging
    outputChannel.info(`Selected most specific project '${selected.name}' from ${projects.length} matches`);
    
    return selected;
}
```

**Validation**:
```typescript
// Validation logic (to be added to tests)
// Test: single project array returns that project
// Test: two projects with different root lengths returns longer one
// Test: empty array throws error
```

**Acceptance Criteria**:
- Function returns project with longest root path
- Handles single-project array correctly (no sorting needed)
- Throws descriptive error for empty array
- Logs selection decision
- Does not modify original array (uses copy for sorting if needed)

---

### TASK-005: Implement Resolve Project With Fallback Function

**Description**: Create the main resolution function that implements the priority-based selection algorithm.

**File**: `src/shared/projectResolver.ts`

**Function Signature**:
```typescript
/**
 * Resolves the appropriate project for a given file using priority-based selection.
 * 
 * Selection priority:
 *   1. Auto-detect from file path (if single match found)
 *   2. Most specific match (if multiple nested projects match)
 *   3. Default project (only if no auto-detection match found)
 *   4. Return null (triggers manual selection prompt)
 * 
 * @param filePath - Absolute path to the file
 * @param projects - Array of all loaded OpenEdge projects
 * @param defaultProjectName - Optional name of the default project
 * @param getProjectByName - Function to retrieve project by name
 * @returns Selected project or null if manual selection needed
 * 
 * @example
 * const project = resolveProjectWithFallback(
 *   '/workspace/projectA/src/test.p',
 *   allProjects,
 *   'ProjectB', // default project (will be ignored since file is in ProjectA)
 *   getProjectByName
 * );
 * // Returns: ProjectA (auto-detected from file path)
 */
function resolveProjectWithFallback(
    filePath: string,
    projects: OpenEdgeProjectConfig[],
    defaultProjectName?: string,
    getProjectByName?: (name: string) => OpenEdgeProjectConfig | undefined
): OpenEdgeProjectConfig | null
```

**Implementation**:
```typescript
function resolveProjectWithFallback(
    filePath: string,
    projects: OpenEdgeProjectConfig[],
    defaultProjectName?: string,
    getProjectByName?: (name: string) => OpenEdgeProjectConfig | undefined
): OpenEdgeProjectConfig | null {
    if (!filePath || !projects || projects.length === 0) {
        return null;
    }
    
    // Single project workspace - always use that project (backward compatibility)
    if (projects.length === 1) {
        outputChannel.info(`Single project workspace: using '${projects[0].name}'`);
        return projects[0];
    }
    
    // PRIORITY 1 & 2: Auto-detect from file path
    const matchedProjects = findAllMatchingProjects(filePath, projects);
    
    if (matchedProjects.length === 1) {
        // Single match - perfect scenario
        outputChannel.info(`Auto-detected project '${matchedProjects[0].name}' for file: ${filePath}`);
        return matchedProjects[0];
    }
    
    if (matchedProjects.length > 1) {
        // Multiple matches - nested projects scenario
        const mostSpecific = getMostSpecificProject(matchedProjects);
        outputChannel.info(`Multiple project matches for file, selected most specific: '${mostSpecific.name}'`);
        return mostSpecific;
    }
    
    // PRIORITY 3: Fall back to default project (only when no auto-detection)
    if (defaultProjectName && getProjectByName) {
        const defaultProject = getProjectByName(defaultProjectName);
        if (defaultProject) {
            outputChannel.info(`No project auto-detected for file, using default project: '${defaultProject.name}'`);
            return defaultProject;
        } else {
            outputChannel.warn(`Default project '${defaultProjectName}' not found in loaded projects`);
        }
    }
    
    // PRIORITY 4: No match, no valid default - return null for manual selection
    outputChannel.info(`Could not determine project for file: ${filePath} - manual selection required`);
    return null;
}
```

**Validation**:
```bash
# Integration testing after implementation
# Test all priority levels:
# 1. Single match auto-detection
# 2. Nested project selection
# 3. Default fallback
# 4. Null return for prompt
```

**Acceptance Criteria**:
- Function implements all 4 priority levels correctly
- Single project workspace always returns that project
- Auto-detection takes precedence over default project
- Nested projects return most specific match
- Returns null only when all other options exhausted
- All decisions are logged to output channel
- Function handles missing/invalid parameters gracefully

---

### TASK-006: Add Module Exports

**Description**: Export all public functions from the module for use in other parts of the extension.

**File**: `src/shared/projectResolver.ts`

**Actions**:
Add export statements at the end of the file:

```typescript
// Public API exports
export {
    resolveProjectWithFallback,
    findAllMatchingProjects,
    getMostSpecificProject
};

// normalizePath is internal utility, not exported
```

**Validation**:
```typescript
// In another file, verify import works:
import { resolveProjectWithFallback } from './shared/projectResolver';
```

**Acceptance Criteria**:
- All public functions are exported
- Internal utilities (normalizePath) are not exported
- Exports are correctly typed
- Other modules can import successfully

---

### TASK-007: Add Type Guards and Error Handling

**Description**: Add defensive programming and error handling throughout the module.

**File**: `src/shared/projectResolver.ts`

**Actions**:
1. Add parameter validation to all public functions
2. Add try-catch blocks around file system operations
3. Add null checks for project properties (rootDir, name)
4. Ensure no function throws unhandled exceptions

**Example additions**:
```typescript
// At start of each function:
if (!filePath || typeof filePath !== 'string') {
    outputChannel.warn('Invalid file path provided to project resolver');
    return null; // or appropriate default
}

// Around risky operations:
try {
    const normalizedPath = normalizePath(filePath);
    // ... rest of logic
} catch (error) {
    outputChannel.error(`Error in project resolution: ${error.message}`);
    return null;
}
```

**Validation**:
```bash
# Try calling functions with invalid inputs
# Verify graceful failures with logging
```

**Acceptance Criteria**:
- No function throws unhandled exceptions
- All invalid inputs are handled gracefully
- Errors are logged to output channel
- Functions return appropriate defaults (null, empty array) on error

---

### TASK-008: Compile and Verify Module

**Description**: Ensure the new module compiles successfully and integrates with existing codebase.

**Actions**:
1. Run TypeScript compiler
2. Verify no compilation errors
3. Check that imports resolve correctly
4. Verify output channel is accessible

**Commands**:
```bash
cd /workspaces/vs-code-abl-2

# Compile TypeScript
npm run compile

# Check for errors specific to projectResolver
npm run compile 2>&1 | grep projectResolver

# Verify file structure
ls -la src/shared/projectResolver.ts
ls -la out/shared/projectResolver.js
```

**Validation**:
```bash
# Should compile successfully
npm run compile && echo "✓ Module compiles"

# Output file should exist
test -f out/shared/projectResolver.js && echo "✓ Output file generated"
```

**Acceptance Criteria**:
- No TypeScript compilation errors
- Output JavaScript file generated in `out/shared/`
- No import resolution errors
- Module can be imported by other parts of extension

---

## Phase Completion Checklist

- [ ] All 8 tasks completed
- [ ] Module file exists at `src/shared/projectResolver.ts`
- [ ] All functions implemented with correct signatures
- [ ] TypeScript compilation successful
- [ ] All functions have JSDoc documentation
- [ ] Error handling implemented throughout
- [ ] Logging integrated for all decision points
- [ ] Module exports defined correctly
- [ ] No external dependencies added
- [ ] Code follows project conventions (indentation, naming, etc.)

---

## Phase Dependencies

**Required Before This Phase**: None

**Required For Next Phases**:
- PHASE-002: Integration with compileBuffer() (requires this module)
- PHASE-003: Unit testing (requires this module)

---

## Rollback Plan

If this phase needs to be rolled back:
1. Delete file: `src/shared/projectResolver.ts`
2. Remove any imports of this module from other files
3. Recompile to ensure no broken references

---

**Phase Status**: ⏸️ Ready to Start  
**Last Updated**: 2026-02-12

---

*End of Phase 1*
