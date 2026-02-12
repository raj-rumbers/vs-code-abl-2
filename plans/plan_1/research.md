# Research & Analysis Document
## Plan #1: Smart Project Selection for 'Check Syntax' Command

---

## Document Information
- **Plan ID**: Plan #1
- **Research Date**: 2026-02-12
- **Status**: Completed
- **Analyst**: Software Architect

---

## 1. Problem Analysis

### 1.1 Core Issue
The current `compileBuffer()` function in `extension.ts` (lines 367-402) uses a simplistic project selection algorithm:

```
IF single project → auto-select
ELSE IF default project configured → use default (blindly)
ELSE → prompt user
```

**Problems identified**:
1. Default project is applied without validating file membership
2. No attempt to auto-detect project from file path in multi-project workspaces
3. Unnecessary user prompts when project can be determined automatically

### 1.2 Impact Assessment
- **Affected Commands**: 12+ commands use `getProject(filePath)` directly
- **User Friction**: High in multi-project development workflows
- **Error Risk**: Medium - incorrect project context causes false syntax errors
- **Frequency**: High - syntax checking is a frequent developer action

---

## 2. Codebase Analysis

### 2.1 Existing Project Detection Logic

#### Current `getProject()` Function
**Location**: `src/extension.ts`, lines 124-129

```typescript
export function getProject(path: string): OpenEdgeProjectConfig {
    const srchPath = (process.platform === 'win32' ? path.toLowerCase() + '\\' : path + '/');
    return projects.find(project => process.platform === 'win32' ? 
        srchPath.startsWith(project.rootDir.toLowerCase()) :
        srchPath.startsWith(project.rootDir) );
}
```

**Capabilities**:
- ✅ Platform-aware case sensitivity (Windows vs Unix)
- ✅ Prefix matching logic
- ✅ Returns first matching project
- ❌ No handling of multiple matches (nested projects)
- ❌ No longest-path matching for specificity

#### Duplicate Implementation
**Location**: `src/debugAdapter/ablDebugConfigurationProvider.ts`, lines 39-44

```typescript
public getProject(path: string): OpenEdgeProjectConfig {
  const srchPath = process.platform === 'win32' ? path.toLowerCase() : path;
  return this.projects.find(project => process.platform === 'win32' ? 
      srchPath.startsWith(project.rootDir.toLowerCase()) :
      srchPath.startsWith(project.rootDir) );
}
```

**Observation**: Slightly different implementation (no trailing slash addition)

### 2.2 Current Project Selection in compileBuffer()

**Location**: `src/extension.ts`, lines 367-392

**Current Logic Flow**:
```
1. Check if active editor exists
2. IF projects.length == 1
   → Auto-select single project
3. ELSE
   a. Get default project by name
   b. IF default project exists
      → Use default (NO validation)
   c. ELSE
      → Show QuickPick for manual selection
```

**Issue**: Step 3b applies default without checking file membership

### 2.3 Commands Affected by Project Selection

**Commands using direct `getProject(filePath)` pattern**:
1. `goToDebugListingLine()` - line 407
2. `dumpFileStatus()` - line 421
3. `preprocessFile()` - line 433
4. `generateListing()` - line 452
5. `generateDebugListing()` - line 471
6. `generateXref()` - line 490
7. `generateXrefAndJumpToCurrentLine()` - line 508
8. Additional commands at lines: 581, 600, 611, 623, 715, 734, 753, 766, 779

**Behavior**: These commands call `getProject()`, check for null, and show error if no project found.
**Impact**: These commands will benefit from improved project detection if we centralize the logic.

### 2.4 Configuration & Settings

#### Default Project Configuration
- **Setting**: `abl.defaultProject` (workspace-level)
- **Type**: String (project name)
- **Command**: `abl.setDefaultProject` (lines 312-329)
- **Storage**: Workspace configuration
- **Read**: Line 1096 - `defaultProjectName = vscode.workspace.getConfiguration('abl').get('defaultProject');`

#### Project Structure
- **Global Array**: `projects: Array<OpenEdgeProjectConfig>` (line 20)
- **Type**: Imported from `./shared/openEdgeConfigFile`
- **Properties**:
  - `name`: Project name
  - `uri`: Project URI
  - `rootDir`: Project root directory path
  - Profile and configuration data

---

## 3. Technical Requirements Analysis

### 3.1 Algorithm Design

**Proposed Selection Priority** (as per PRD FR-004):
```
1. Auto-detect from file path (single match)
2. Most specific match (if multiple nested projects)
3. Default project (only if auto-detection fails)
4. User prompt (only if all above fail)
```

**Implementation Strategy**:
```typescript
function selectProjectForFile(filePath: string): OpenEdgeProjectConfig | null {
  // Step 1: Attempt auto-detection
  const matchedProjects = findAllMatchingProjects(filePath);
  
  if (matchedProjects.length === 1) {
    return matchedProjects[0]; // Single match - use it
  }
  
  if (matchedProjects.length > 1) {
    return getMostSpecificProject(matchedProjects); // Nested projects - use most specific
  }
  
  // Step 2: No auto-detection match - check default
  if (defaultProjectName) {
    const defaultProject = getProjectByName(defaultProjectName);
    if (defaultProject) {
      // Log that we're using default as fallback
      return defaultProject;
    }
  }
  
  // Step 3: No match, no valid default - return null for prompt
  return null;
}
```

### 3.2 Nested Project Handling

**Scenario**: ProjectA at `/workspace/project`, ProjectB at `/workspace/project/submodule`
**File**: `/workspace/project/submodule/test.p`

**Logic**:
1. Find all projects where file path starts with project root
2. Sort by root path length (descending)
3. Return project with longest matching root

**Implementation**:
```typescript
function findAllMatchingProjects(filePath: string): OpenEdgeProjectConfig[] {
  const normalizedPath = normalizePath(filePath);
  
  return projects.filter(project => {
    const normalizedRoot = normalizePath(project.rootDir);
    return normalizedPath.startsWith(normalizedRoot);
  });
}

function getMostSpecificProject(matches: OpenEdgeProjectConfig[]): OpenEdgeProjectConfig {
  // Sort by root directory length (longest first = most specific)
  return matches.sort((a, b) => b.rootDir.length - a.rootDir.length)[0];
}
```

### 3.3 Platform Compatibility

**Cross-Platform Considerations**:
- **Windows**: Case-insensitive path comparison
- **Unix/Linux/Mac**: Case-sensitive path comparison
- **Path Separators**: Normalize to platform-specific separators

**Reuse existing pattern** from current `getProject()`:
```typescript
function normalizePath(path: string): string {
  const separator = process.platform === 'win32' ? '\\' : '/';
  const normalized = path.endsWith(separator) ? path : path + separator;
  return process.platform === 'win32' ? normalized.toLowerCase() : normalized;
}
```

### 3.4 Edge Case Handling

#### EC-1: Symbolic Links
**Decision**: Use absolute path resolution
```typescript
const realPath = fs.realpathSync(filePath);
```

#### EC-2: File Outside All Projects
**Decision**: Return null, trigger QuickPick dialog with clear message

#### EC-3: Invalid Project Roots
**Decision**: Gracefully skip projects with inaccessible roots, log warning

---

## 4. Architectural Decisions

### AD-001: Centralized Project Resolution Utility

**Decision**: Create a new utility module for project selection logic

**Rationale**:
- Single source of truth for project resolution
- Reusable across all commands
- Easier to test and maintain
- Consistent behavior across extension

**Proposed Structure**:
```
src/
  shared/
    projectResolver.ts (NEW)
      - findProjectForFile(filePath): Project | null
      - findAllMatchingProjects(filePath): Project[]
      - getMostSpecificProject(projects): Project
      - resolveProjectWithFallback(filePath, defaultProject): Project | null
```

### AD-002: Enhanced getProject() vs New Function

**Decision**: Keep existing `getProject()` unchanged, create new `resolveProjectForFile()`

**Rationale**:
- Backward compatibility
- Many existing call sites rely on simple prefix matching
- New function has different semantics (priority-based resolution)
- Gradual migration path

**Migration Strategy**:
1. Implement new `resolveProjectForFile()` function
2. Update `compileBuffer()` to use new function
3. Optionally migrate other commands in future iterations

### AD-003: Logging Strategy (Addresses PRD Q1)

**Decision**: Log to Output panel, no toast notifications

**Implementation**:
```typescript
outputChannel.info(`Auto-detected project '${project.name}' for file ${filePath}`);
outputChannel.info(`Using default project '${project.name}' (no file match found)`);
outputChannel.warn(`Could not determine project for ${filePath}, prompting user`);
```

**Rationale**:
- Non-intrusive
- Useful for debugging
- Aligns with existing extension logging patterns

### AD-004: Apply to Multiple Commands (Addresses PRD Q5)

**Decision**: Implement for all project-dependent commands

**Scope**:
- Phase 1: `compileBuffer()` - check syntax (primary requirement)
- Phase 2: All other commands using `getProject()` pattern

**Implementation**: Commands currently using `getProject()` directly should use new utility

---

## 5. Testing Strategy

### 5.1 Unit Test Requirements

**Test Suite**: `projectResolver.test.ts`

**Scenarios**:
1. Single project match → returns correct project
2. Multiple nested projects → returns most specific
3. No project match → returns null
4. Default project fallback → uses default when no match
5. Default project override → ignores default when file matches different project
6. Platform-specific case sensitivity
7. Invalid/inaccessible project roots

### 5.2 Integration Test Requirements

**Test Suite**: `compileBuffer.integration.test.ts`

**Scenarios**:
1. Multi-project workspace, file in ProjectA → auto-selects ProjectA
2. Default set to ProjectA, file in ProjectB → auto-selects ProjectB
3. File outside projects → shows QuickPick
4. Single project workspace → maintains current behavior
5. Nested projects → selects most specific

### 5.3 Manual Testing Checklist

**Test Workspace Setup**:
```
/test-workspace/
  projectA/
    openedge-project.json
    src/test1.p
  projectB/
    openedge-project.json
    classes/test2.cls
  external/
    standalone.p
```

**Test Cases**: See PRD Section 11.3

---

## 6. Implementation Complexity Assessment

### 6.1 Effort Estimation

| Task | Complexity | Estimated Time |
|------|------------|----------------|
| Create projectResolver utility | Medium | 4 hours |
| Implement selection algorithm | Medium | 4 hours |
| Update compileBuffer() | Low | 2 hours |
| Unit tests | Medium | 6 hours |
| Integration tests | Medium | 4 hours |
| Documentation updates | Low | 2 hours |
| Code review & refinement | Low | 2 hours |
| **Total** | **Medium** | **24 hours (3 days)** |

### 6.2 Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Breaking existing workflows | Low | High | Comprehensive testing, feature flag |
| Performance issues | Low | Medium | Optimize path operations, benchmark |
| Edge case bugs | Medium | Medium | Extensive test coverage |
| Platform-specific issues | Low | Medium | Reuse proven platform logic |

**Overall Risk**: **Low-Medium**

---

## 7. Dependencies & Constraints

### 7.1 Internal Dependencies
- ✅ Existing `projects` array and project loading infrastructure
- ✅ `OpenEdgeProjectConfig` type definitions
- ✅ `outputChannel` for logging
- ✅ VS Code QuickPick API

### 7.2 External Dependencies
- ✅ None - pure TypeScript/Node.js implementation
- ✅ No schema changes required
- ✅ No language server protocol changes

### 7.3 Constraints
- Must maintain backward compatibility
- No breaking changes to extension API
- Performance overhead < 50ms
- Works with existing workspace configurations

---

## 8. Assumptions & Validations

### 8.1 Key Assumptions

1. ✅ **Project root directories are unique**
   - Validated: Each project has distinct `rootDir` property
   
2. ✅ **File paths are accessible at command invocation**
   - Validated: `activeTextEditor.document.uri.fsPath` provides file path
   
3. ✅ **Project configurations loaded before command execution**
   - Validated: Extension loads projects during activation
   
4. ✅ **Users work with valid ABL files within project boundaries**
   - Valid: Edge case (external files) handled with QuickPick

5. ✅ **Platform-specific path handling is critical**
   - Validated: Existing implementation proves this works

### 8.2 Research Validations

**Code Review Findings**:
- ✅ `getProject()` function exists and works correctly
- ✅ Multiple commands already rely on path-based project detection
- ✅ Extension has robust project loading mechanism
- ✅ Output channel available for logging
- ✅ QuickPick UI pattern already in use

**No Blockers Identified**: All requirements can be implemented with existing infrastructure

---

## 9. Alternative Approaches Considered

### Option A: Modify Existing getProject()
**Pros**: Single function, no duplication
**Cons**: Breaking changes, affects 20+ call sites, risky
**Decision**: ❌ Rejected

### Option B: Add Optional Parameter to getProject()
**Pros**: Backward compatible, extends existing function
**Cons**: Complex function signature, unclear semantics
**Decision**: ❌ Rejected

### Option C: Create New Utility Module (SELECTED)
**Pros**: Clean separation, testable, reusable, safe
**Cons**: Slight code duplication (acceptable trade-off)
**Decision**: ✅ **Selected**

### Option D: Monkey-patch compileBuffer() Only
**Pros**: Minimal changes, isolated impact
**Cons**: Not reusable, inconsistent with other commands
**Decision**: ❌ Rejected

---

## 10. Open Questions & Resolutions

### Q1: Logging Strategy
**Answer**: Log to Output panel only (PRD Section 12, Q1 - Decided)

### Q2: Configuration Toggle
**Answer**: No configuration setting (PRD Section 12, Q2 - Decided)

### Q3: Nested Project Priority
**Answer**: Longest matching root wins (PRD Section 12, Q3 - Decided)

### Q4: Invalid Project Roots
**Answer**: Graceful degradation with logging (PRD Section 12, Q4 - Decided)

### Q5: Apply to Other Commands
**Answer**: Yes, apply consistently (PRD Section 12, Q5 - Decided)

**Status**: ✅ All questions resolved

---

## 11. External Research

### 11.1 VS Code Extension Best Practices

**Source**: VS Code Extension API Documentation
**Key Findings**:
- Use output channels for non-critical logging
- QuickPick is recommended for user selections
- File path handling should use VS Code URI API where possible
- Platform differences should be abstracted

### 11.2 Path Matching Algorithms

**Source**: Node.js path module documentation
**Relevant Functions**:
- `path.resolve()` - Absolute path resolution
- `path.normalize()` - Cross-platform normalization
- `fs.realpathSync()` - Symbolic link resolution

**Application**: Use these for robust path handling

### 11.3 TypeScript Best Practices

**Source**: TypeScript Handbook
**Patterns Applied**:
- Strong typing for project resolution functions
- Null safety with explicit returns
- Array methods for filtering and sorting

---

## 12. Documentation Needs

### 12.1 Code Documentation
- Inline comments for selection algorithm
- JSDoc for all new public functions
- Architecture Decision Record (ADR)

### 12.2 User Documentation
- Update README section on multi-project support
- Add FAQ entry about project selection
- Update CHANGELOG with feature description

### 12.3 Developer Documentation
- Update contributing guide with testing instructions
- Document project resolution algorithm
- Add examples for multi-project setup

---

## 13. Success Criteria Validation

### Functional Success Criteria
- ✅ Can implement auto-detection with existing infrastructure
- ✅ Can handle nested projects with sorting logic
- ✅ Can integrate with existing QuickPick UI
- ✅ Can maintain backward compatibility

### Non-Functional Success Criteria
- ✅ Performance: Path matching is O(n) where n = project count (acceptable)
- ✅ Maintainability: Modular design allows easy testing and updates
- ✅ Compatibility: No breaking changes to existing code
- ✅ Testability: All logic paths can be unit tested

**Overall Assessment**: ✅ **All criteria can be met**

---

## 14. Research Conclusions

### 14.1 Feasibility
**Status**: ✅ **FEASIBLE - Ready for Implementation**

**Confidence Level**: **High (9/10)**

**Rationale**:
1. Existing infrastructure supports all requirements
2. No external dependencies or API changes needed
3. Clear implementation path identified
4. All risks are manageable with appropriate testing
5. Backward compatibility is maintainable

### 14.2 Recommended Approach

**Primary Strategy**:
1. Create `src/shared/projectResolver.ts` utility module
2. Implement priority-based selection algorithm
3. Update `compileBuffer()` to use new resolver
4. Add comprehensive unit and integration tests
5. Update documentation
6. Apply to other commands (preprocess, listing, etc.)

**Phased Rollout**:
- **Phase 1**: Core implementation + check syntax command
- **Phase 2**: Apply to all project-dependent commands
- **Phase 3**: Documentation and final testing

### 14.3 Key Recommendations

1. **Reuse Existing Patterns**: Leverage proven platform-aware path handling
2. **Comprehensive Testing**: Cover all edge cases to prevent regressions
3. **Clear Logging**: Help users understand auto-detection behavior
4. **Modular Design**: Enable future enhancements and easy maintenance
5. **Gradual Migration**: Start with check syntax, expand to other commands

---

## 15. Next Steps

1. ✅ Research completed - proceed to planning phase
2. ⏭️ Create detailed phase breakdown with atomic tasks
3. ⏭️ Define validation criteria for each task
4. ⏭️ Prepare test data and fixtures
5. ⏭️ Begin implementation

---

**Research Status**: ✅ **COMPLETED**
**Ready for Planning**: ✅ **YES**
**Blocker Identified**: ❌ **NONE**

---

*End of Research & Analysis Document*
