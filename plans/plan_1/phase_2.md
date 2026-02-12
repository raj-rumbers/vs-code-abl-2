# Phase 2: Integration - Update compileBuffer Function

**Phase ID**: PHASE-002  
**Phase Name**: Integration - Update compileBuffer Function  
**Dependencies**: PHASE-001 (Project Resolution Utility must be complete)  
**Estimated Duration**: 4 hours  
**Status**: Not Started

---

## Phase Overview

Integrate the new project resolution utility into the `compileBuffer()` function (check syntax command). This phase replaces the current simplistic selection logic with the intelligent, priority-based resolution algorithm.

---

## Success Criteria

- [ ] `compileBuffer()` function uses new project resolution utility
- [ ] Single-project workspace behavior unchanged (backward compatibility)
- [ ] Multi-project workspace auto-detects project from file path
- [ ] Default project is used only as fallback (not blindly applied)
- [ ] QuickPick dialog appears only when auto-detection fails
- [ ] All logging integrated with output channel
- [ ] Function compiles without errors
- [ ] No breaking changes to function signature or behavior

---

## Tasks

### TASK-009: Import Project Resolver Module

**Description**: Add import statement for the new project resolution utility in extension.ts.

**File**: `src/extension.ts`

**Location**: Add near other imports at top of file (after line 16)

**Implementation**:
```typescript
// Existing imports...
import { loadConfigFile, OpenEdgeConfig, OpenEdgeMainConfig, OpenEdgeProjectConfig, ProfileConfig } from './shared/openEdgeConfigFile';
import { resolveProjectWithFallback } from './shared/projectResolver'; // ADD THIS LINE
```

**Validation**:
```bash
# Check import is added correctly
grep -n "import.*projectResolver" /workspaces/vs-code-abl-2/src/extension.ts

# Compile to verify import resolves
cd /workspaces/vs-code-abl-2
npm run compile 2>&1 | grep -i error || echo "✓ No errors"
```

**Acceptance Criteria**:
- Import statement added in imports section
- Import resolves successfully
- No compilation errors
- TypeScript recognizes exported function

---

### TASK-010: Refactor compileBuffer Function - Extract File Path

**Description**: Extract and validate the active file path at the start of compileBuffer().

**File**: `src/extension.ts`

**Function**: `compileBuffer()` (lines 367-392)

**Current Code**:
```typescript
function compileBuffer() {
    if (vscode.window.activeTextEditor == undefined)
        return;

    if (projects.length == 1) {
        compileBufferInProject(projects[0], vscode.window.activeTextEditor.document.uri.toString(), vscode.window.activeTextEditor.document.getText());
    } else {
        // ... existing multi-project logic
    }
}
```

**New Code** (Step 1 - Add file path extraction):
```typescript
function compileBuffer() {
    // Validate active editor exists
    if (vscode.window.activeTextEditor == undefined) {
        return;
    }

    // Extract file path and document info for clarity
    const editor = vscode.window.activeTextEditor;
    const filePath = editor.document.uri.fsPath;
    const fileUri = editor.document.uri.toString();
    const fileContent = editor.document.getText();

    // Continue with project selection...
    if (projects.length == 1) {
        compileBufferInProject(projects[0], fileUri, fileContent);
    } else {
        // ... multi-project logic to be refactored next
    }
}
```

**Validation**:
```bash
# Verify function still works
# No functional change yet, just refactoring for clarity
npm run compile
```

**Acceptance Criteria**:
- File path extracted to dedicated variable
- Editor reference stored to avoid repeated access
- Code more readable and maintainable
- No functional behavior changed
- Compiles without errors

---

### TASK-011: Replace Project Selection Logic with Resolver

**Description**: Replace the existing multi-project selection logic with a call to the new resolution utility.

**File**: `src/extension.ts`

**Function**: `compileBuffer()` (lines 367-392)

**Remove** (lines 373-391):
```typescript
    } else {
        const defPrj = getProjectByName(defaultProjectName);
        if (defPrj) {
            compileBufferInProject(defPrj, vscode.window.activeTextEditor.document.uri.toString(), vscode.window.activeTextEditor.document.getText());
        } else {
            const list = projects.map(project => ({ label: project.name, description: project.rootDir }));
            list.sort((a, b) => a.label.localeCompare(b.label));

            const quickPick = vscode.window.createQuickPick();
            quickPick.canSelectMany = false;
            quickPick.title = "Choose project to compile buffer:";
            quickPick.items = list;
            quickPick.onDidChangeSelection(args => {
                quickPick.hide();
                compileBufferInProject(getProjectByName(args[0].label), vscode.window.activeTextEditor.document.uri.toString(), vscode.window.activeTextEditor.document.getText());
            });
            quickPick.show();
        }
    }
```

**Replace With**:
```typescript
    }
    
    // Use intelligent project resolution (auto-detect with fallback)
    const selectedProject = resolveProjectWithFallback(
        filePath,
        projects,
        defaultProjectName,
        getProjectByName
    );
    
    if (selectedProject) {
        // Project resolved - compile with selected project
        compileBufferInProject(selectedProject, fileUri, fileContent);
    } else {
        // Could not auto-resolve - show manual selection dialog
        showProjectSelectionDialog(fileUri, fileContent);
    }
}
```

**Validation**:
```bash
# Compile to check syntax
npm run compile

# Verify function signature unchanged
grep -A 30 "^function compileBuffer" /workspaces/vs-code-abl-2/src/extension.ts
```

**Acceptance Criteria**:
- Old selection logic completely removed
- New resolver function called with correct parameters
- Single-project case still handled correctly (by resolver)
- Function compiles without errors
- Code is cleaner and more maintainable

---

### TASK-012: Extract QuickPick Dialog to Separate Function

**Description**: Create a reusable function for showing the project selection dialog.

**File**: `src/extension.ts`

**Location**: Add new function after `compileBuffer()` (around line 393)

**Implementation**:
```typescript
/**
 * Shows a quick-pick dialog for manual project selection.
 * Called when automatic project detection cannot determine the appropriate project.
 * 
 * @param fileUri - URI of the file to compile
 * @param fileContent - Content of the file to compile
 */
function showProjectSelectionDialog(fileUri: string, fileContent: string) {
    // Create sorted list of projects for display
    const projectList = projects.map(project => ({ 
        label: project.name, 
        description: project.rootDir 
    }));
    projectList.sort((a, b) => a.label.localeCompare(b.label));

    // Create and configure QuickPick UI
    const quickPick = vscode.window.createQuickPick();
    quickPick.canSelectMany = false;
    quickPick.title = "Choose project to compile buffer:";
    quickPick.placeholder = "Select a project (file location could not be determined automatically)";
    quickPick.items = projectList;
    
    // Handle selection
    quickPick.onDidChangeSelection(selectedItems => {
        if (selectedItems.length > 0) {
            quickPick.hide();
            const project = getProjectByName(selectedItems[0].label);
            if (project) {
                compileBufferInProject(project, fileUri, fileContent);
            }
        }
    });
    
    // Handle dismissal
    quickPick.onDidHide(() => {
        quickPick.dispose();
    });
    
    quickPick.show();
}
```

**Validation**:
```bash
# Verify function exists and compiles
grep -A 25 "function showProjectSelectionDialog" /workspaces/vs-code-abl-2/src/extension.ts

# Compile check
npm run compile
```

**Acceptance Criteria**:
- Function created with clear name and purpose
- JSDoc comment explains when it's called
- QuickPick properly configured with title and placeholder
- Selection handler calls compileBufferInProject
- Dialog properly disposed on hide
- Function compiles without errors

---

### TASK-013: Update compileBuffer to Call Dialog Function

**Description**: Update the compileBuffer() function to call the new dialog function.

**File**: `src/extension.ts`

**Function**: `compileBuffer()` 

**Current Code** (from TASK-011):
```typescript
    if (selectedProject) {
        // Project resolved - compile with selected project
        compileBufferInProject(selectedProject, fileUri, fileContent);
    } else {
        // Could not auto-resolve - show manual selection dialog
        showProjectSelectionDialog(fileUri, fileContent);
    }
}
```

**Verify**: This should already be in place from TASK-011. If not, add it.

**Validation**:
```bash
# Verify the call is in place
grep -B 5 "showProjectSelectionDialog" /workspaces/vs-code-abl-2/src/extension.ts | grep -A 1 "else"
```

**Acceptance Criteria**:
- Dialog function is called when selectedProject is null
- Correct parameters passed to dialog function
- Code flow is clear and logical

---

### TASK-014: Add Inline Comments for Clarity

**Description**: Add comments to the refactored compileBuffer() function explaining the new logic flow.

**File**: `src/extension.ts`

**Function**: `compileBuffer()`

**Complete Updated Function**:
```typescript
/**
 * Compiles (checks syntax of) the current buffer.
 * Uses intelligent project resolution to automatically select the appropriate project.
 */
function compileBuffer() {
    // Validate active editor exists
    if (vscode.window.activeTextEditor == undefined) {
        return;
    }

    // Extract file information for project resolution
    const editor = vscode.window.activeTextEditor;
    const filePath = editor.document.uri.fsPath;
    const fileUri = editor.document.uri.toString();
    const fileContent = editor.document.getText();

    // Resolve project using priority-based algorithm:
    // 1. Auto-detect from file path (single match or most specific nested project)
    // 2. Fall back to default project (if configured and no auto-detection)
    // 3. Return null if manual selection needed
    const selectedProject = resolveProjectWithFallback(
        filePath,
        projects,
        defaultProjectName,
        getProjectByName
    );
    
    if (selectedProject) {
        // Project successfully resolved (auto or default) - proceed with compilation
        compileBufferInProject(selectedProject, fileUri, fileContent);
    } else {
        // Could not auto-resolve - prompt user to manually select project
        showProjectSelectionDialog(fileUri, fileContent);
    }
}
```

**Validation**:
```bash
# Verify comments added
grep -A 35 "^function compileBuffer" /workspaces/vs-code-abl-2/src/extension.ts | grep "//"
```

**Acceptance Criteria**:
- JSDoc comment added to function
- Inline comments explain key decision points
- Comments reference the priority-based algorithm
- Code is self-documenting and clear

---

### TASK-015: Compile and Verify Integration

**Description**: Compile the updated code and verify no errors or warnings.

**Actions**:
```bash
cd /workspaces/vs-code-abl-2

# Clean build
rm -rf out/
npm run compile

# Check for errors
npm run compile 2>&1 | tee compile-output.log

# Verify specific files compiled
test -f out/extension.js && echo "✓ extension.js compiled"
test -f out/shared/projectResolver.js && echo "✓ projectResolver.js compiled"

# Check for TypeScript errors
grep -i error compile-output.log && echo "✗ Errors found" || echo "✓ No errors"
```

**Validation**:
```bash
# Should compile successfully
npm run compile && echo "✓ Compilation successful"

# No errors in output
npm run compile 2>&1 | grep -i "error" && echo "✗ Has errors" || echo "✓ Clean build"
```

**Acceptance Criteria**:
- TypeScript compiles without errors
- All changed files compile successfully
- Output files generated in `out/` directory
- No import resolution errors
- No type checking errors

---

### TASK-016: Test Single Project Workspace (Regression)

**Description**: Manually verify that single-project workspace behavior is unchanged.

**Test Setup**:
1. Create test workspace with single project
2. Open ABL file in that project
3. Invoke "ABL: Check Syntax" command

**Expected Behavior**:
- No project selection dialog appears
- Syntax check executes immediately
- Same behavior as before refactoring

**Test Commands**:
```bash
# This requires manual testing in VS Code
# Document test results in test log
```

**Test Cases**:
```yaml
test_case_1:
  scenario: Single project workspace
  setup:
    - workspace: /test/workspace
    - projects: [ProjectA]
    - file: /test/workspace/ProjectA/src/test.p
  steps:
    - Open file in editor
    - Execute "ABL: Check Syntax" command
  expected:
    - No QuickPick dialog shown
    - Compilation executes immediately
    - Uses ProjectA automatically
  
test_case_2:
  scenario: Single project, file outside project
  setup:
    - workspace: /test/workspace
    - projects: [ProjectA]
    - file: /test/workspace/external/test.p
  steps:
    - Open file in editor
    - Execute "ABL: Check Syntax" command
  expected:
    - No QuickPick dialog shown
    - Compilation executes using ProjectA (only option)
    - Log message indicates single project workspace
```

**Acceptance Criteria**:
- Single project workspace behavior unchanged
- No regression in user experience
- Backward compatibility maintained
- All test cases pass

---

### TASK-017: Test Multi-Project Auto-Detection

**Description**: Manually verify that multi-project auto-detection works correctly.

**Test Setup**:
1. Create test workspace with multiple projects
2. Open files in different projects
3. Verify auto-detection selects correct project

**Test Cases**:
```yaml
test_case_1:
  scenario: File in ProjectA
  setup:
    - workspace: /test/workspace
    - projects: [ProjectA, ProjectB]
    - default_project: null
    - file: /test/workspace/ProjectA/src/test.p
  steps:
    - Open file in editor
    - Execute "ABL: Check Syntax" command
  expected:
    - No QuickPick dialog shown
    - ProjectA auto-detected and used
    - Log: "Auto-detected project 'ProjectA'"
  
test_case_2:
  scenario: File in ProjectB
  setup:
    - workspace: /test/workspace
    - projects: [ProjectA, ProjectB]
    - default_project: null
    - file: /test/workspace/ProjectB/classes/Test.cls
  steps:
    - Open file in editor
    - Execute "ABL: Check Syntax" command
  expected:
    - No QuickPick dialog shown
    - ProjectB auto-detected and used
    - Log: "Auto-detected project 'ProjectB'"

test_case_3:
  scenario: File outside all projects
  setup:
    - workspace: /test/workspace
    - projects: [ProjectA, ProjectB]
    - default_project: null
    - file: /test/workspace/external/test.p
  steps:
    - Open file in editor
    - Execute "ABL: Check Syntax" command
  expected:
    - QuickPick dialog shown
    - Both projects listed
    - User must select manually
    - Log: "Could not determine project... manual selection required"
```

**Validation**:
- Check output channel for log messages
- Verify correct project used for compilation
- Verify QuickPick only appears when necessary

**Acceptance Criteria**:
- Auto-detection works for files within projects
- Correct project selected based on file path
- QuickPick dialog appears only when auto-detection fails
- Logging provides visibility into selection process

---

### TASK-018: Test Default Project Fallback

**Description**: Verify that default project is used as fallback (not blindly applied).

**Test Cases**:
```yaml
test_case_1:
  scenario: Default project set, file in different project
  setup:
    - workspace: /test/workspace
    - projects: [ProjectA, ProjectB]
    - default_project: ProjectA
    - file: /test/workspace/ProjectB/src/test.p
  steps:
    - Open file in editor
    - Execute "ABL: Check Syntax" command
  expected:
    - ProjectB used (NOT default ProjectA)
    - Auto-detection overrides default
    - Log: "Auto-detected project 'ProjectB'"
  result: ✅ PASS / ❌ FAIL

test_case_2:
  scenario: Default project set, file outside all projects
  setup:
    - workspace: /test/workspace
    - projects: [ProjectA, ProjectB]
    - default_project: ProjectA
    - file: /test/workspace/external/test.p
  steps:
    - Open file in editor
    - Execute "ABL: Check Syntax" command
  expected:
    - QuickPick dialog shown (NOT automatic use of default)
    - User must select manually
    - Log: "Could not determine project... manual selection required"
  result: ✅ PASS / ❌ FAIL

test_case_3:
  scenario: Default project set, file in default project
  setup:
    - workspace: /test/workspace
    - projects: [ProjectA, ProjectB]
    - default_project: ProjectA
    - file: /test/workspace/ProjectA/src/test.p
  steps:
    - Open file in editor
    - Execute "ABL: Check Syntax" command
  expected:
    - ProjectA used (auto-detected, happens to be default)
    - Log: "Auto-detected project 'ProjectA'"
  result: ✅ PASS / ❌ FAIL
```

**Critical Test**: Test case 1 - This was the main bug reported in the issue!

**Acceptance Criteria**:
- Default project does NOT override auto-detection
- Default used only as fallback when auto-detection fails
- All three test cases pass
- Original issue is resolved

---

### TASK-019: Test Nested Projects

**Description**: Verify that nested project scenarios are handled correctly.

**Test Cases**:
```yaml
test_case_1:
  scenario: Nested projects - file in child
  setup:
    - workspace: /test/workspace
    - projects:
        - name: ParentProject
          root: /test/workspace/parent
        - name: ChildProject
          root: /test/workspace/parent/submodule
    - file: /test/workspace/parent/submodule/src/test.p
  steps:
    - Open file in editor
    - Execute "ABL: Check Syntax" command
  expected:
    - ChildProject used (most specific match)
    - NOT ParentProject
    - Log: "Multiple project matches... selected most specific: 'ChildProject'"
  
test_case_2:
  scenario: Nested projects - file in parent only
  setup:
    - workspace: /test/workspace
    - projects:
        - name: ParentProject
          root: /test/workspace/parent
        - name: ChildProject
          root: /test/workspace/parent/submodule
    - file: /test/workspace/parent/src/test.p
  steps:
    - Open file in editor
    - Execute "ABL: Check Syntax" command
  expected:
    - ParentProject used (only match)
    - Log: "Auto-detected project 'ParentProject'"
```

**Acceptance Criteria**:
- Nested project scenarios work correctly
- Most specific (deepest) project is selected
- Files in parent (but not child) use parent project
- Logging indicates nested project detection

---

## Phase Completion Checklist

- [ ] All 11 tasks completed (TASK-009 through TASK-019)
- [ ] compileBuffer() function refactored successfully
- [ ] New project resolver integrated
- [ ] QuickPick dialog extracted to separate function
- [ ] Code compiles without errors
- [ ] Single-project workspace regression tests pass
- [ ] Multi-project auto-detection tests pass
- [ ] Default project fallback tests pass
- [ ] Nested project tests pass
- [ ] All changes documented with comments
- [ ] Output channel logging integrated

---

## Phase Dependencies

**Required Before This Phase**:
- PHASE-001: Project resolver module must be complete

**Required For Next Phases**:
- PHASE-003: Unit testing (tests the integrated solution)
- PHASE-004: Extend to other commands (follows same pattern)

---

## Rollback Plan

If this phase needs to be rolled back:
1. Restore original compileBuffer() function (lines 367-392 from git history)
2. Remove import of projectResolver module
3. Delete showProjectSelectionDialog() function
4. Recompile to ensure functionality restored

```bash
# Rollback commands
git checkout HEAD -- src/extension.ts
npm run compile
```

---

## Known Limitations

- Manual testing required (VS Code extension integration tests are complex)
- Requires active VS Code instance with test workspace
- Test results should be documented in test log file

---

**Phase Status**: ⏸️ Waiting for PHASE-001  
**Last Updated**: 2026-02-12

---

*End of Phase 2*
