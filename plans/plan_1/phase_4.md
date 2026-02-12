# Phase 4: Extension - Apply to Other Commands

**Phase ID**: PHASE-004  
**Phase Name**: Extension - Apply to Other Commands  
**Dependencies**: PHASE-001, PHASE-002, PHASE-003  
**Estimated Duration**: 6 hours  
**Status**: Not Started

---

## Phase Overview

Extend the intelligent project resolution logic to other project-dependent commands in the extension. Currently, commands like `preprocessFile`, `generateListing`, `generateDebugListing`, and others use simple `getProject()` calls that only check if a file belongs to any project. Apply consistent project resolution logic across all commands.

---

## Success Criteria

- [ ] All project-dependent commands identified and documented
- [ ] Project resolution utility integrated into all applicable commands
- [ ] Consistent behavior across all commands
- [ ] No breaking changes to existing command functionality
- [ ] Code compiles without errors
- [ ] Manual testing confirms all commands work correctly
- [ ] Backward compatibility maintained

---

## Commands to Update

Based on codebase analysis (from research.md), the following commands use `getProject()` directly:

1. `goToDebugListingLine()` - line 407
2. `dumpFileStatus()` - line 421
3. `preprocessFile()` - line 433
4. `generateListing()` - line 452
5. `generateDebugListing()` - line 471
6. `generateXref()` - line 490
7. `generateXrefAndJumpToCurrentLine()` - line 508
8. Additional commands at lines: 581, 600, 611, 623, 715, 734, 753, 766, 779

---

## Tasks

### TASK-028: Audit All Commands Using getProject()

**Description**: Create a comprehensive list of all commands that need updating.

**Actions**:
1. Search for all usages of `getProject()` in extension.ts
2. Identify which commands need project selection enhancement
3. Document current behavior of each command
4. Prioritize commands by usage frequency

**Commands**:
```bash
cd /workspaces/vs-code-abl-2

# Find all getProject() usages
grep -n "getProject(" src/extension.ts

# Create audit document
cat > plans/plan_1/command-audit.md << 'EOF'
# Command Audit - Project Selection Enhancement

## Commands Using getProject()

| Line | Command Function | Current Behavior | Needs Update | Priority |
|------|------------------|------------------|--------------|----------|
| 407 | goToDebugListingLine | Uses getProject(), shows error if null | Maybe | Low |
| 421 | dumpFileStatus | Uses getProject(), shows error if null | Maybe | Low |
| 433 | preprocessFile | Uses getProject(), shows error if null | Yes | High |
| 452 | generateListing | Uses getProject(), shows error if null | Yes | High |
| 471 | generateDebugListing | Uses getProject(), shows error if null | Yes | Medium |
| 490 | generateXref | Uses getProject(), shows error if null | Yes | Medium |
| 508 | generateXrefAndJumpToCurrentLine | Uses getProject(), shows error if null | Yes | Medium |

## Decision

**Commands to Update**: preprocessFile, generateListing, generateDebugListing, generateXref, generateXrefAndJumpToCurrentLine

**Commands to Keep As-Is**: 
- goToDebugListingLine: Requires file to be in a project (error is appropriate)
- dumpFileStatus: Diagnostic command, error is appropriate

**Rationale**: Commands that process/compile files should use intelligent resolution. Diagnostic commands can require file to be in a project.
EOF
```

**Validation**:
```bash
# Verify audit document created
test -f /workspaces/vs-code-abl-2/plans/plan_1/command-audit.md && echo "✓ Audit complete"
cat plans/plan_1/command-audit.md
```

**Acceptance Criteria**:
- All commands identified and categorized
- Decision made on which commands to update
- Rationale documented for decisions
- Audit document created

---

### TASK-029: Create Helper Function for Project Selection

**Description**: Create a reusable helper function that encapsulates the project selection logic with QuickPick fallback.

**File**: `src/extension.ts`

**Location**: Add after `showProjectSelectionDialog()` function

**Implementation**:
```typescript
/**
 * Selects the appropriate project for the current file using intelligent resolution.
 * If project cannot be determined automatically, shows QuickPick dialog.
 * 
 * @param editor - The active text editor
 * @param callback - Function to call with the selected project
 * @returns void
 * 
 * @example
 * selectProjectForCurrentFile(editor, (project) => {
 *   // Do something with the selected project
 *   preprocessFileInProject(project, fileUri);
 * });
 */
function selectProjectForCurrentFile(
    editor: vscode.TextEditor,
    callback: (project: OpenEdgeProjectConfig) => void
): void {
    const filePath = editor.document.uri.fsPath;
    const fileUri = editor.document.uri.toString();
    
    // Attempt intelligent project resolution
    const selectedProject = resolveProjectWithFallback(
        filePath,
        projects,
        defaultProjectName,
        getProjectByName
    );
    
    if (selectedProject) {
        // Project resolved - invoke callback
        callback(selectedProject);
    } else {
        // Could not auto-resolve - show manual selection dialog
        showProjectSelectionDialogWithCallback(callback);
    }
}

/**
 * Shows project selection dialog and invokes callback with selected project.
 * 
 * @param callback - Function to call with the selected project
 */
function showProjectSelectionDialogWithCallback(
    callback: (project: OpenEdgeProjectConfig) => void
): void {
    const projectList = projects.map(project => ({ 
        label: project.name, 
        description: project.rootDir 
    }));
    projectList.sort((a, b) => a.label.localeCompare(b.label));

    const quickPick = vscode.window.createQuickPick();
    quickPick.canSelectMany = false;
    quickPick.title = "Choose project:";
    quickPick.placeholder = "Select a project (file location could not be determined automatically)";
    quickPick.items = projectList;
    
    quickPick.onDidChangeSelection(selectedItems => {
        if (selectedItems.length > 0) {
            quickPick.hide();
            const project = getProjectByName(selectedItems[0].label);
            if (project) {
                callback(project);
            }
        }
    });
    
    quickPick.onDidHide(() => {
        quickPick.dispose();
    });
    
    quickPick.show();
}
```

**Validation**:
```bash
# Verify functions exist
grep -A 20 "function selectProjectForCurrentFile" /workspaces/vs-code-abl-2/src/extension.ts

# Compile check
npm run compile
```

**Acceptance Criteria**:
- Helper function created with clear interface
- Callback pattern allows flexible command execution
- QuickPick dialog reusable across commands
- Functions compile without errors
- JSDoc documentation included

---

### TASK-030: Update preprocessFile Command

**Description**: Update the preprocessFile() command to use intelligent project resolution.

**File**: `src/extension.ts`

**Function**: `preprocessFile()` (lines 430-447)

**Current Code**:
```typescript
function preprocessFile() {
    if (vscode.window.activeTextEditor == undefined)
        return;
    const cfg = getProject(vscode.window.activeTextEditor.document.uri.fsPath);
    if (!cfg) {
        vscode.window.showInformationMessage("Current buffer doesn't belong to any OpenEdge project");
        return;
    }

    client.sendRequest("proparse/preprocess", { fileUri: vscode.window.activeTextEditor.document.uri.toString() }).then(result => {
      const anyValue = result as any;
      if (anyValue.fileName === "") {
        vscode.window.showErrorMessage("Error during preprocess: " + anyValue.message);
      } else {
        vscode.window.showTextDocument(vscode.Uri.file(anyValue.fileName));
      }
    })
}
```

**New Code**:
```typescript
function preprocessFile() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    
    const fileUri = editor.document.uri.toString();
    
    // Use intelligent project selection with fallback to manual selection
    selectProjectForCurrentFile(editor, (project) => {
        client.sendRequest("proparse/preprocess", { fileUri: fileUri }).then(result => {
            const anyValue = result as any;
            if (anyValue.fileName === "") {
                vscode.window.showErrorMessage("Error during preprocess: " + anyValue.message);
            } else {
                vscode.window.showTextDocument(vscode.Uri.file(anyValue.fileName));
            }
        });
    });
}
```

**Validation**:
```bash
# Verify function updated
grep -A 15 "^function preprocessFile" /workspaces/vs-code-abl-2/src/extension.ts

# Compile
npm run compile
```

**Acceptance Criteria**:
- Function uses new helper function
- Callback pattern implemented correctly
- No "doesn't belong to project" error shown (QuickPick handles this)
- Code is cleaner and more concise
- Compiles without errors

---

### TASK-031: Update generateListing Command

**Description**: Update the generateListing() command to use intelligent project resolution.

**File**: `src/extension.ts`

**Function**: `generateListing()` (lines 449-466)

**Current Code**:
```typescript
function generateListing() {
    if (vscode.window.activeTextEditor == undefined)
        return;
    const cfg = getProject(vscode.window.activeTextEditor.document.uri.fsPath);
    if (!cfg) {
        vscode.window.showInformationMessage("Current buffer doesn't belong to any OpenEdge project");
        return;
    }

    client.sendRequest("proparse/listing", { fileUri: vscode.window.activeTextEditor.document.uri.toString() }).then(result => {
      const anyValue = result as any;
      if (anyValue.fileName === "") {
        vscode.window.showErrorMessage("Error during listing generation: " + anyValue.message);
      } else {
        vscode.window.showTextDocument(vscode.Uri.file(anyValue.fileName));
      }
    })
}
```

**New Code**:
```typescript
function generateListing() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    
    const fileUri = editor.document.uri.toString();
    
    selectProjectForCurrentFile(editor, (project) => {
        client.sendRequest("proparse/listing", { fileUri: fileUri }).then(result => {
            const anyValue = result as any;
            if (anyValue.fileName === "") {
                vscode.window.showErrorMessage("Error during listing generation: " + anyValue.message);
            } else {
                vscode.window.showTextDocument(vscode.Uri.file(anyValue.fileName));
            }
        });
    });
}
```

**Validation**:
```bash
# Verify function updated
grep -A 12 "^function generateListing" /workspaces/vs-code-abl-2/src/extension.ts

# Compile
npm run compile
```

**Acceptance Criteria**:
- Function uses new helper function
- Consistent with preprocessFile pattern
- Compiles without errors

---

### TASK-032: Update generateDebugListing Command

**Description**: Update the generateDebugListing() command to use intelligent project resolution.

**File**: `src/extension.ts`

**Function**: `generateDebugListing()` (lines 468-485)

**Implementation**: Follow same pattern as TASK-030 and TASK-031

**New Code**:
```typescript
function generateDebugListing() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    
    const fileUri = editor.document.uri.toString();
    
    selectProjectForCurrentFile(editor, (project) => {
        client.sendRequest("proparse/debugListing", { fileUri: fileUri }).then(result => {
            const anyValue = result as any;
            if (anyValue.fileName === "") {
                vscode.window.showErrorMessage("Error during debug listing generation: " + anyValue.message);
            } else {
                vscode.window.showTextDocument(vscode.Uri.file(anyValue.fileName));
            }
        });
    });
}
```

**Validation**: Same as previous tasks

**Acceptance Criteria**:
- Function updated consistently
- Compiles without errors

---

### TASK-033: Update generateXref Command

**Description**: Update the generateXref() command to use intelligent project resolution.

**File**: `src/extension.ts`

**Function**: `generateXref()` (lines 487-503)

**Implementation**: Follow same pattern

**New Code**:
```typescript
function generateXref() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    
    const fileUri = editor.document.uri.toString();
    
    selectProjectForCurrentFile(editor, (project) => {
        client.sendRequest("proparse/xref", { fileUri: fileUri }).then(result => {
            const anyValue = result as any;
            if (anyValue.fileName === "") {
                vscode.window.showErrorMessage("Error during XREF generation: " + anyValue.message);
            } else {
                vscode.window.showTextDocument(vscode.Uri.file(anyValue.fileName));
            }
        });
    });
}
```

**Validation**: Same as previous tasks

**Acceptance Criteria**:
- Function updated consistently
- Compiles without errors

---

### TASK-034: Update generateXrefAndJumpToCurrentLine Command

**Description**: Update the generateXrefAndJumpToCurrentLine() command.

**File**: `src/extension.ts`

**Function**: `generateXrefAndJumpToCurrentLine()` (lines 505-530)

**Note**: This function is more complex as it has additional logic for line handling.

**Current Code** (simplified):
```typescript
function generateXrefAndJumpToCurrentLine() {
    if (vscode.window.activeTextEditor == undefined)
        return;
    const cfg = getProject(vscode.window.activeTextEditor.document.uri.fsPath);
    if (!cfg) {
        vscode.window.showInformationMessage("Current buffer doesn't belong to any OpenEdge project");
        return;
    }
    
    const currentLine = vscode.window.activeTextEditor.selection.active.line;
    // ... rest of function
}
```

**New Code**:
```typescript
function generateXrefAndJumpToCurrentLine() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    
    const fileUri = editor.document.uri.toString();
    const currentLine = editor.selection.active.line;
    
    selectProjectForCurrentFile(editor, (project) => {
        // ... rest of function implementation
        // (keep existing XREF generation and jump logic)
    });
}
```

**Validation**: Same as previous tasks

**Acceptance Criteria**:
- Function updated while preserving line jump logic
- Compiles without errors
- Functionality unchanged

---

### TASK-035: Review and Update compileBuffer Dialog

**Description**: Update the original showProjectSelectionDialog in compileBuffer to use the new reusable dialog.

**File**: `src/extension.ts`

**Function**: `compileBuffer()` and `showProjectSelectionDialog()`

**Actions**:
1. Update compileBuffer() to use selectProjectForCurrentFile helper
2. Remove or update showProjectSelectionDialog() if it's now redundant

**Revised compileBuffer()**:
```typescript
function compileBuffer() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    
    const fileUri = editor.document.uri.toString();
    const fileContent = editor.document.getText();
    
    // Use helper function for consistent project selection
    selectProjectForCurrentFile(editor, (project) => {
        compileBufferInProject(project, fileUri, fileContent);
    });
}
```

**Note**: This is a simplification of the Phase 2 implementation using the new helper.

**Validation**:
```bash
# Verify updated function
grep -A 10 "^function compileBuffer" /workspaces/vs-code-abl-2/src/extension.ts

# Compile
npm run compile
```

**Acceptance Criteria**:
- compileBuffer() uses same helper as other commands
- Consistent interface across all commands
- Code is DRY (Don't Repeat Yourself)
- Compiles without errors

---

### TASK-036: Compile and Test All Updated Commands

**Description**: Compile the extension and perform manual testing of all updated commands.

**Compile Commands**:
```bash
cd /workspaces/vs-code-abl-2

# Clean build
rm -rf out/
npm run compile

# Check for errors
npm run compile 2>&1 | grep -i error && echo "✗ Errors found" || echo "✓ Clean build"
```

**Manual Test Checklist**:
```yaml
commands_to_test:
  - command: "ABL: Check Syntax"
    test: "Open file in ProjectA, verify ProjectA used"
    result: [ ] PASS / [ ] FAIL
    
  - command: "ABL: Preprocess File"
    test: "Open file in ProjectB, verify ProjectB used"
    result: [ ] PASS / [ ] FAIL
    
  - command: "ABL: Generate Listing"
    test: "Open file in ProjectA, verify ProjectA used"
    result: [ ] PASS / [ ] FAIL
    
  - command: "ABL: Generate Debug Listing"
    test: "Open file outside projects, verify QuickPick shown"
    result: [ ] PASS / [ ] FAIL
    
  - command: "ABL: Generate XREF"
    test: "Default=ProjectA, file in ProjectB, verify ProjectB used"
    result: [ ] PASS / [ ] FAIL
    
  - command: "ABL: Generate XREF and Jump"
    test: "Nested projects, verify most specific used"
    result: [ ] PASS / [ ] FAIL
```

**Validation**:
```bash
# Run extension in debug mode
# Execute each command manually
# Document results in test log
```

**Acceptance Criteria**:
- All commands compile successfully
- Manual testing shows consistent behavior
- Project selection works correctly for all commands
- No regressions identified
- QuickPick dialogs appear appropriately

---

### TASK-037: Document Command Updates

**Description**: Document all changes made to commands in this phase.

**File**: `plans/plan_1/command-updates.md` (create new)

**Implementation**:
```markdown
# Command Updates Documentation
## Phase 4: Intelligent Project Selection

**Update Date**: [DATE]  
**Updated By**: [NAME]

---

## Summary

Extended intelligent project selection logic to all project-dependent commands. Commands now use `selectProjectForCurrentFile()` helper function for consistent behavior.

---

## Updated Commands

### 1. compileBuffer() - Check Syntax
**Status**: Updated  
**Changes**: Refactored to use selectProjectForCurrentFile() helper  
**Behavior**: Auto-detects project, falls back to QuickPick  
**Testing**: ✅ Verified

### 2. preprocessFile() - Preprocess File
**Status**: Updated  
**Changes**: Replaced getProject() check with selectProjectForCurrentFile()  
**Behavior**: Auto-detects project, shows QuickPick if needed  
**Testing**: ✅ Verified

### 3. generateListing() - Generate Listing
**Status**: Updated  
**Changes**: Replaced getProject() check with selectProjectForCurrentFile()  
**Behavior**: Auto-detects project, shows QuickPick if needed  
**Testing**: ✅ Verified

### 4. generateDebugListing() - Generate Debug Listing
**Status**: Updated  
**Changes**: Replaced getProject() check with selectProjectForCurrentFile()  
**Behavior**: Auto-detects project, shows QuickPick if needed  
**Testing**: ✅ Verified

### 5. generateXref() - Generate XREF
**Status**: Updated  
**Changes**: Replaced getProject() check with selectProjectForCurrentFile()  
**Behavior**: Auto-detects project, shows QuickPick if needed  
**Testing**: ✅ Verified

### 6. generateXrefAndJumpToCurrentLine() - Generate XREF and Jump
**Status**: Updated  
**Changes**: Replaced getProject() check with selectProjectForCurrentFile()  
**Behavior**: Auto-detects project, shows QuickPick if needed  
**Testing**: ✅ Verified

---

## Commands NOT Updated

### goToDebugListingLine()
**Reason**: Diagnostic command, requires file to be in a project  
**Behavior**: Still shows error if file not in project (appropriate)

### dumpFileStatus()
**Reason**: Diagnostic command, requires file to be in a project  
**Behavior**: Still shows error if file not in project (appropriate)

---

## Behavioral Changes

### Before
- Commands would show error "doesn't belong to any OpenEdge project" for files outside projects
- No QuickPick option for manual selection
- No auto-detection in multi-project workspaces

### After
- Commands auto-detect project based on file path
- QuickPick shown when auto-detection fails (instead of error)
- Consistent behavior across all compilation/generation commands
- Better user experience in multi-project workspaces

---

## Backward Compatibility

- ✅ Single-project workspaces work exactly as before
- ✅ Files within projects behave identically
- ✅ No breaking changes to command interface
- ⚠️ Files outside projects now show QuickPick instead of error (improvement)

---

## Testing Results

All commands tested manually with:
- Single project workspace: ✅ Works correctly
- Multi-project workspace: ✅ Auto-detection works
- File outside projects: ✅ QuickPick shown
- Nested projects: ✅ Most specific selected
- Default project override: ✅ Works correctly

---

**Update Status**: ✅ COMPLETE

*End of Command Updates Documentation*
```

**Validation**:
```bash
# Verify documentation exists
test -f /workspaces/vs-code-abl-2/plans/plan_1/command-updates.md && echo "✓ Documentation complete"
```

**Acceptance Criteria**:
- All updated commands documented
- Behavioral changes clearly explained
- Testing results recorded
- Backward compatibility addressed

---

## Phase Completion Checklist

- [ ] All 10 tasks completed (TASK-028 through TASK-037)
- [ ] Command audit completed
- [ ] Helper function created and reusable
- [ ] preprocessFile() command updated
- [ ] generateListing() command updated
- [ ] generateDebugListing() command updated
- [ ] generateXref() command updated
- [ ] generateXrefAndJumpToCurrentLine() command updated
- [ ] compileBuffer() refactored to use helper
- [ ] All commands compile successfully
- [ ] Manual testing completed for all commands
- [ ] Command updates documented

---

## Phase Dependencies

**Required Before This Phase**:
- PHASE-001: Project resolver module
- PHASE-002: compileBuffer integration (provides pattern to follow)
- PHASE-003: Testing (validates approach)

**Required For Next Phases**:
- PHASE-005: Documentation (references these command changes)

---

## Rollback Plan

If this phase needs to be rolled back:
1. Restore original command implementations from git history
2. Remove selectProjectForCurrentFile() helper function
3. Remove showProjectSelectionDialogWithCallback() helper
4. Recompile to ensure functionality restored

```bash
# Rollback commands
git diff HEAD src/extension.ts > phase4-changes.patch
git checkout HEAD -- src/extension.ts
npm run compile
```

---

**Phase Status**: ⏸️ Waiting for PHASE-001, PHASE-002, PHASE-003  
**Last Updated**: 2026-02-12

---

*End of Phase 4*
