# Product Requirements Document Review
## Issue #1: Smart Project Selection for 'Check Syntax' Command

---

## Document Information
- **Issue Number**: #1
- **Issue Title**: Choose Project for 'check syntax'
- **Issue State**: Open
- **Review Date**: 2026-02-12
- **Reviewer**: Product Management Team
- **Project**: OpenEdge ABL LSP Extension for Visual Studio Code

---

## 1. Executive Summary

This issue addresses a user experience gap in the 'check syntax' command when working with multi-project workspaces. Currently, the extension requires manual project selection even when the file's project membership can be automatically determined, or incorrectly applies the default project setting to files from other projects.

### Current Behavior Problems:
1. **Manual Selection When Not Needed**: When no default project is set, users must manually select a project even though the system can automatically determine which project the file belongs to
2. **Incorrect Default Application**: When a default project (ProjectA) is set and a user opens a file from ProjectB, the check syntax command automatically uses ProjectA, resulting in incorrect syntax validation errors

### Desired Outcome:
The 'check syntax' command should intelligently auto-select the correct project based on file path analysis, eliminating unnecessary user prompts and preventing incorrect project application.

---

## 2. Business Context & Background

### 2.1 Problem Statement
The OpenEdge ABL LSP extension supports multi-project workspaces where developers can work with multiple OpenEdge projects simultaneously. Each project has its own configuration (propath, database connections, build settings) defined in `openedge-project.json`. The 'check syntax' command validates ABL code syntax using the project's specific configuration.

**The core issue**: The current project selection logic is overly simplistic and creates friction in daily workflows:
- Forces unnecessary manual selections
- Applies wrong project context, causing false syntax errors
- Reduces productivity in multi-project environments

### 2.2 User Impact
- **Target Users**: OpenEdge ABL developers working with multiple projects in a single workspace
- **Frequency**: High - syntax checking is a frequent developer action
- **Impact Severity**: Medium-High - causes workflow interruption and potential confusion with false error messages

### 2.3 Strategic Alignment
This enhancement aligns with:
- Improving developer productivity and user experience
- Reducing cognitive load in multi-project environments
- Making the extension smarter and more context-aware

---

## 3. Current System Analysis

### 3.1 Existing Project Selection Logic
Based on codebase analysis (`src/extension.ts`, lines 367-402):

**Current Flow**:
```
1. User invokes 'check syntax' command
2. IF single project → Auto-select that project
3. IF multiple projects:
   a. IF default project configured → Use default
   b. ELSE → Show quick-pick dialog for manual selection
4. Send compile request to language server
```

### 3.2 Project Membership Detection
The extension has existing capability to determine project membership:
- Function: `getProject(path: string)` in `AblDebugConfigurationProvider.ts` (lines 39-44)
- Logic: Matches file path against project root directories
- Returns: Project whose `rootDir` is a prefix of the file path
- Platform-aware: Case-insensitive on Windows, case-sensitive elsewhere

### 3.3 Default Project Configuration
- Setting: `abl.defaultProject` (workspace-level)
- Purpose: Pre-select a project for multi-project workspaces
- Command: `abl.setDefaultProject` allows user to configure
- **Current Problem**: Applied blindly without verifying if file belongs to that project

---

## 4. Detailed Requirements

### 4.1 Functional Requirements

#### FR-001: Auto-Detect Project from File Path
**Priority**: High  
**Description**: When 'check syntax' is invoked, the system shall automatically determine which project the active file belongs to by analyzing the file path against all configured project root directories.

**Acceptance Criteria**:
- AC-001.1: System SHALL analyze the active file's absolute path
- AC-001.2: System SHALL compare file path against all loaded project root directories
- AC-001.3: System SHALL match using the same logic as `getProject()` function (prefix matching, platform-aware case sensitivity)
- AC-001.4: If file path matches exactly one project, that project SHALL be automatically selected
- AC-001.5: Auto-detection SHALL occur before checking default project setting

**Test Scenarios**:
```
GIVEN: Multi-project workspace with ProjectA (/workspace/projectA) and ProjectB (/workspace/projectB)
WHEN: User opens file /workspace/projectA/src/main.p and invokes 'check syntax'
THEN: ProjectA is automatically selected without prompting user
```

#### FR-002: Handle Ambiguous Project Membership
**Priority**: High  
**Description**: When a file could belong to multiple projects (nested projects) or no project, the system shall fall back to appropriate selection logic.

**Acceptance Criteria**:
- AC-002.1: If file matches NO project root directories, system SHALL show quick-pick dialog with all projects
- AC-002.2: If file matches MULTIPLE project root directories (nested projects), system SHALL select the most specific match (longest matching root path)
- AC-002.3: Fallback logic SHALL provide clear user feedback about why manual selection is required

**Test Scenarios**:
```
SCENARIO 1 - No Match:
GIVEN: ProjectA at /workspace/projectA and ProjectB at /workspace/projectB
WHEN: User opens file /workspace/other/test.p (outside any project)
THEN: Quick-pick dialog is shown with all available projects

SCENARIO 2 - Nested Projects:
GIVEN: ProjectA at /workspace/project and ProjectB at /workspace/project/submodule
WHEN: User opens file /workspace/project/submodule/test.p
THEN: ProjectB (most specific match) is automatically selected
```

#### FR-003: Validate Default Project Against File Path
**Priority**: High  
**Description**: When a default project is configured, the system shall verify that the active file actually belongs to that project before applying it.

**Acceptance Criteria**:
- AC-003.1: If default project IS configured AND file belongs to that project, use default project
- AC-003.2: If default project IS configured BUT file belongs to DIFFERENT project, use the file's actual project instead
- AC-003.3: If default project IS configured BUT file matches NO project, show quick-pick dialog
- AC-003.4: System SHALL NOT blindly apply default project without path validation

**Test Scenarios**:
```
SCENARIO 1 - Valid Default:
GIVEN: Default project set to ProjectA, file is in ProjectA
WHEN: 'check syntax' invoked
THEN: ProjectA is used (default application is correct)

SCENARIO 2 - Invalid Default:
GIVEN: Default project set to ProjectA, file is in ProjectB
WHEN: 'check syntax' invoked  
THEN: ProjectB is used (auto-detected, overrides default)

SCENARIO 3 - Default with No Match:
GIVEN: Default project set to ProjectA, file is outside all projects
WHEN: 'check syntax' invoked
THEN: Quick-pick dialog is shown
```

#### FR-004: Revised Selection Priority Logic
**Priority**: High  
**Description**: Implement a new priority-based project selection algorithm.

**Acceptance Criteria**:
- AC-004.1: Selection priority SHALL be:
  1. Auto-detect from file path (if single match found)
  2. Most specific match if multiple nested projects match
  3. Default project (only if file path detection finds no match)
  4. User selection via quick-pick (only if all above fail)
- AC-004.2: Algorithm SHALL be deterministic and consistent
- AC-004.3: Logic SHALL be documented in code comments

**Test Scenarios**:
```
Decision Matrix:
| Scenario | File Matches | Default Set | Expected Result |
|----------|--------------|-------------|-----------------|
| 1 | ProjectA | No | Auto-select ProjectA |
| 2 | ProjectB | Yes (ProjectA) | Auto-select ProjectB (file wins) |
| 3 | None | Yes (ProjectA) | Quick-pick dialog |
| 4 | None | No | Quick-pick dialog |
| 5 | ProjectA & ProjectB (nested) | N/A | Auto-select most specific |
```

### 4.2 Non-Functional Requirements

#### NFR-001: Performance
- Project detection SHALL complete in < 50ms for workspaces with up to 10 projects
- File path comparison SHALL be optimized for large project structures
- No perceptible delay in command execution

#### NFR-002: Compatibility
- Solution SHALL maintain backward compatibility with existing workspace configurations
- Existing `abl.defaultProject` setting SHALL continue to function (with enhanced logic)
- No breaking changes to extension API or configuration schema

#### NFR-003: User Experience
- No unexpected behavior changes for single-project workspaces
- Clear, intuitive behavior that matches user mental model
- Reduced cognitive load and manual interactions

#### NFR-004: Maintainability
- Code changes SHALL be localized to project selection logic
- Existing project detection functions SHALL be reused
- Clear separation of concerns between detection, validation, and selection

#### NFR-005: Testability
- All selection paths SHALL be unit testable
- Edge cases (nested projects, no matches, etc.) SHALL have test coverage
- Integration tests SHALL verify end-to-end behavior

---

## 5. Technical Considerations

### 5.1 Implementation Areas
Based on codebase analysis, changes required in:

**Primary Location**: `src/extension.ts` - `compileBuffer()` function (lines 367-402)
- Refactor project selection logic
- Add auto-detection step before default project check
- Implement validation logic

**Reusable Components**:
- `getProject(path)` from `AblDebugConfigurationProvider.ts` - Can be extracted and reused for path-based detection

### 5.2 Dependencies
- **Internal**: Existing project management infrastructure, file path utilities
- **External**: None - pure logic enhancement
- **Configuration**: Existing `abl.defaultProject` setting (no schema changes)

### 5.3 Integration Points
- Language Server Protocol: `proparse/compileBuffer` request (no changes needed)
- Project loading and initialization logic (no changes needed)
- Quick-pick UI component (existing, may need adjusted messaging)

### 5.4 Cross-Platform Considerations
- **Path Handling**: Must respect case-sensitivity differences (Windows vs Unix)
- **Path Separators**: Handle both forward and backslashes appropriately
- **Existing Logic**: `getProject()` already handles platform differences correctly

### 5.5 Data Flow
```
[User Action] → [Get Active File Path] → [Auto-Detect Project]
                                                ↓
                                          [Project Found?]
                                          /              \
                                      YES                 NO
                                       ↓                   ↓
                               [Use Detected]    [Check Default Project]
                                                          ↓
                                                    [Use Default / Prompt]
                                                          ↓
                                              [Send to Language Server]
```

---

## 6. Edge Cases & Risk Analysis

### 6.1 Edge Cases

#### EC-001: Symbolic Links / Junctions
**Scenario**: Project paths or file paths contain symbolic links  
**Risk**: Path matching may fail if symlinks aren't resolved  
**Mitigation**: Resolve all paths to absolute real paths before comparison  
**Priority**: Medium

#### EC-002: Nested Projects (Parent-Child)
**Scenario**: ProjectB's root is inside ProjectA's root directory  
**Risk**: File could match both projects  
**Mitigation**: Use longest matching path (most specific project)  
**Priority**: High - Covered in FR-002

#### EC-003: File Outside All Projects
**Scenario**: User opens standalone file not in any configured project  
**Risk**: No auto-detection possible  
**Mitigation**: Fall back to manual selection (existing behavior)  
**Priority**: Low - Rare scenario

#### EC-004: Project Renamed/Moved
**Scenario**: Project root directory renamed after workspace is loaded  
**Risk**: Path matching may fail until extension restart  
**Mitigation**: Document as known limitation; require extension reload  
**Priority**: Low - Rare scenario

#### EC-005: Case-Sensitivity Edge Cases
**Scenario**: Mixed-case project paths on case-insensitive filesystem  
**Risk**: Inconsistent behavior if not handled properly  
**Mitigation**: Reuse existing platform-aware comparison logic from `getProject()`  
**Priority**: Medium - Covered by existing implementation

#### EC-006: Multiple Workspaces with Same File Path
**Scenario**: VS Code multi-root workspace with overlapping paths  
**Risk**: Ambiguous project detection  
**Mitigation**: Each workspace folder should have separate project configs  
**Priority**: Low - Edge case

### 6.2 Risk Assessment

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| Breaking existing workflows | Low | High | Comprehensive testing; feature flag if needed |
| Performance degradation | Low | Medium | Optimize path comparison; benchmark with large workspaces |
| Confusion with nested projects | Medium | Medium | Clear documentation; use most-specific match |
| Platform-specific bugs | Medium | Medium | Reuse proven platform-aware logic; cross-platform testing |
| Default project behavior change | Medium | Low | Maintain backward compatibility; enhance rather than replace |

### 6.3 Assumptions
1. Project root directories are unique (no two projects share the same root)
2. File paths are available and accessible at command invocation time
3. Active editor has a valid file URI (not untitled/virtual documents)
4. Project configurations are loaded before 'check syntax' is invoked
5. Users understand project boundaries (where their files should live)

---

## 7. User Stories with Acceptance Criteria

### US-001: Auto-Select Project for File in Known Project
**As a** developer working with multiple ABL projects  
**I want** the 'check syntax' command to automatically use the correct project for my current file  
**So that** I don't have to manually select the project every time

**Acceptance Criteria**:
- Given I have ProjectA at `/workspace/projectA` and ProjectB at `/workspace/projectB` loaded
- And I have no default project configured
- When I open file `/workspace/projectA/src/procedures/test.p`
- And I invoke 'check syntax' command
- Then ProjectA is automatically selected
- And syntax validation runs against ProjectA's configuration
- And no project selection dialog is shown

**Test Validation**: Automated unit test + manual verification

---

### US-002: Override Default Project When File Belongs to Different Project
**As a** developer with a default project configured  
**I want** the system to use the file's actual project instead of my default  
**So that** I get correct syntax validation regardless of my default setting

**Acceptance Criteria**:
- Given I have ProjectA (default) and ProjectB configured
- And my workspace setting `abl.defaultProject` is set to "ProjectA"
- When I open file `/workspace/projectB/classes/BusinessEntity.cls`
- And I invoke 'check syntax' command
- Then ProjectB is automatically selected (overriding the default)
- And syntax validation runs against ProjectB's configuration
- And no incorrect syntax errors related to ProjectA appear

**Test Validation**: Automated integration test

---

### US-003: Prompt for Selection When File is Outside Projects
**As a** developer opening a standalone ABL file  
**I want** to be prompted to select which project to validate against  
**So that** I can still check syntax even for files outside my project directories

**Acceptance Criteria**:
- Given I have ProjectA and ProjectB configured
- When I open file `/workspace/external/utilities/helper.p` (outside any project)
- And I invoke 'check syntax' command
- Then a quick-pick dialog is displayed with ProjectA and ProjectB options
- And the dialog message clearly indicates why selection is needed
- And after selection, syntax validation runs against the chosen project

**Test Validation**: Manual verification + UI test

---

### US-004: Handle Nested Projects Correctly
**As a** developer with nested project structures  
**I want** the most specific (deepest) project to be selected  
**So that** validation uses the most relevant project configuration

**Acceptance Criteria**:
- Given I have ProjectParent at `/workspace/parent`
- And ProjectChild at `/workspace/parent/submodule`
- When I open file `/workspace/parent/submodule/src/test.p`
- And I invoke 'check syntax' command
- Then ProjectChild is automatically selected (more specific match)
- And syntax validation runs against ProjectChild's configuration
- And ProjectParent is NOT used despite also matching the path

**Test Validation**: Automated unit test

---

### US-005: Maintain Single-Project Behavior
**As a** developer with only one project in my workspace  
**I want** the current behavior to remain unchanged  
**So that** my existing workflow is not disrupted

**Acceptance Criteria**:
- Given I have only ProjectA loaded in my workspace
- When I open any ABL file (inside or outside ProjectA directory)
- And I invoke 'check syntax' command
- Then ProjectA is automatically used
- And no project selection dialog is shown
- And behavior is identical to previous extension version

**Test Validation**: Regression testing

---

## 8. Out of Scope

The following items are explicitly **NOT** part of this enhancement:

1. **Project Auto-Detection for Unknown Files**: Automatically creating or suggesting project configurations for files without associated projects
2. **Project Switching UI**: Adding new UI for switching between projects or managing project associations
3. **Configuration File Changes**: Modifying `openedge-project.json` schema or adding new configuration options
4. **Command Palette Enhancements**: Changing other ABL commands beyond 'check syntax' (note: same logic should be considered for other project-dependent commands in future)
5. **Multi-File Operations**: Batch syntax checking across multiple projects simultaneously
6. **Project Dependency Resolution**: Handling inter-project dependencies or references
7. **Auto-Correction of Configuration**: Automatically fixing misconfigured projects or paths
8. **Performance Optimization Beyond File Detection**: General performance improvements unrelated to project selection

---

## 9. Success Metrics

### Quantitative Metrics
- **Reduction in Manual Selections**: Target 80%+ decrease in quick-pick dialog appearances for multi-project users
- **Error Rate**: Zero increase in incorrect syntax validation errors
- **Performance**: No measurable delay in command execution (< 50ms overhead)
- **User Complaints**: No new issues related to project selection confusion

### Qualitative Metrics
- **User Satisfaction**: Positive feedback on reduced friction in multi-project workflows
- **Support Tickets**: Decrease in questions about "wrong project" or "syntax errors in correct code"
- **Adoption**: No user requests to revert behavior

---

## 10. Documentation Requirements

### User-Facing Documentation
- Update extension README section on multi-project support
- Add explanation of new automatic project selection logic
- Document edge cases (files outside projects, nested projects)
- Update FAQ with "How does check syntax choose my project?"

### Developer Documentation
- Code comments explaining selection algorithm
- Architecture decision record (ADR) for priority-based selection
- Update CHANGELOG with feature description
- Add inline documentation for modified functions

---

## 11. Testing Strategy

### 11.1 Unit Tests Required
- `detectProjectFromFilePath()` with various file/project combinations
- Nested project path matching (longest prefix wins)
- Platform-specific path comparisons (Windows vs Unix)
- Edge cases: no match, multiple matches, invalid paths

### 11.2 Integration Tests Required
- End-to-end flow: file open → command invoke → correct project used
- Default project override scenario
- Quick-pick fallback when no match found
- Single project workspace (regression)

### 11.3 Manual Test Scenarios
| Scenario | File Location | Default Set | Expected Behavior | Verification |
|----------|---------------|-------------|-------------------|--------------|
| Basic auto-detect | ProjectA/src/test.p | No | Auto-select ProjectA | Check compiler output |
| Default override | ProjectB/src/test.p | Yes (ProjectA) | Auto-select ProjectB | Verify ProjectB config used |
| Outside projects | /external/test.p | No | Show quick-pick | User prompted |
| Nested projects | ProjectB nested in ProjectA | No | Select most specific | Check which config used |
| Single project | Any location | N/A | Auto-select only project | No prompt |

### 11.4 Regression Testing
- All existing 'check syntax' functionality remains working
- Other project-dependent commands not affected
- Extension activation and project loading unchanged
- Existing workspace configurations remain compatible

---

## 12. Open Questions for Product Team

Before development begins, the following questions should be clarified:

### Q1: Messaging and User Communication
**Question**: When auto-detection overrides a default project setting, should we notify the user?  
**Options**:
- A) Silent override (no notification)
- B) Information message in Output panel (log only)
- C) Transient notification toast (may be disruptive)

**Recommendation**: Option B - Log to Output panel for transparency without disrupting workflow

---

### Q2: User Control and Configuration
**Question**: Should users have an option to disable auto-detection and always use default/manual selection?  
**Options**:
- A) No - auto-detection is always active (simpler)
- B) Yes - add `abl.autoDetectProject` boolean setting (more control)

**Recommendation**: Option A for initial implementation; add Option B only if users request it

---

### Q3: Nested Project Priority
**Question**: For nested projects, should "most specific match" always win, or should user preference be considered?  
**Options**:
- A) Always use longest matching path (deterministic)
- B) Prefer default project if it's one of the matches (preserve user intent)
- C) Add priority/ranking system to project configuration

**Recommendation**: Option A - Deterministic, predictable, easier to understand

---

### Q4: Error Handling and Edge Cases
**Question**: What should happen if project root paths cannot be resolved (permissions, deleted directory)?  
**Options**:
- A) Skip that project in matching logic
- B) Show error and abort command
- C) Show warning but continue with available projects

**Recommendation**: Option C - Graceful degradation with user awareness

---

### Q5: Future Command Consistency
**Question**: Should this logic be applied to other project-dependent commands (preprocess, generate listing, etc.)?  
**Options**:
- A) Yes - apply consistently to all commands (unified experience)
- B) No - only 'check syntax' for now (limited scope)
- C) Evaluate command-by-command (case-by-case)

**Recommendation**: Option A - Extract common project selection logic for reuse across commands

---

## 13. Development Readiness Assessment

### ✅ Ready for Development
The issue is **READY FOR DEVELOPMENT** with the following confidence level:

**Readiness Score: 8.5/10**

### Strengths:
- ✅ Clear problem statement with specific user pain points
- ✅ Detailed functional requirements with testable acceptance criteria
- ✅ Well-understood technical implementation area (existing code identified)
- ✅ Reusable components available (`getProject()` function)
- ✅ Comprehensive edge case analysis
- ✅ No external dependencies or API changes required
- ✅ Backward compatibility maintained
- ✅ Clear success metrics defined

### Areas Requiring Clarification:
- ⚠️ **Product Team Input Needed**: Resolve open questions Q1-Q5 (especially Q1 and Q5)
- ⚠️ **Testing Scope**: Define specific test coverage requirements (% or critical paths)
- ⚠️ **Documentation Priority**: Confirm if docs update is part of same iteration

### Recommended Next Steps:
1. **Product Team**: Review and answer open questions (Section 12)
2. **Development Team**: Review technical approach and provide effort estimate
3. **Architecture Team**: Create implementation plan and task breakdown
4. **QA Team**: Prepare test scenarios based on Section 11
5. **Documentation Team**: Prepare documentation updates based on Section 10

### Timeline Considerations:
- **Estimated Complexity**: Medium (2-5 days development + testing)
- **Risk Level**: Low-Medium (well-scoped, no breaking changes)
- **Dependencies**: None blocking
- **Recommended Sprint Planning**: Include in next sprint after open questions resolved

---

## 14. Additional Notes

### Related Issues
- Check if similar logic exists in other commands that could benefit from this enhancement
- Consider creating follow-up issues for applying consistent project selection across all project-dependent commands

### Future Enhancements (Post-MVP)
- Machine learning based on user selection patterns to improve auto-detection
- Visual indicator in status bar showing which project is active for current file
- Project-switching command with keyboard shortcut for manual overrides
- Workspace-level project affinity settings (file pattern → project mappings)

### Community Feedback
- Engage with extension users to validate assumptions about multi-project workflows
- Consider beta testing with users who have complex multi-project setups
- Gather telemetry (if applicable) on project selection frequency and patterns

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Check Syntax** | VSCode command that validates ABL code syntax using OpenEdge compiler |
| **Multi-Project Workspace** | VS Code workspace containing multiple OpenEdge projects (multiple `openedge-project.json` files) |
| **Default Project** | User-configured preferred project for ambiguous scenarios (`abl.defaultProject` setting) |
| **Project Root Directory** | Base directory of an OpenEdge project containing `openedge-project.json` |
| **Auto-Detection** | Automatic determination of project membership based on file path analysis |
| **Quick-Pick Dialog** | VS Code UI component for selecting from a list of options |
| **Language Server** | Backend process handling ABL code analysis and compilation |

---

## Appendix B: Reference Code Locations

| Component | File Path | Line Numbers | Purpose |
|-----------|-----------|--------------|---------|
| Check Syntax Command | `src/extension.ts` | 367-402 | Main command implementation |
| Project Detection | `src/AblDebugConfigurationProvider.ts` | 39-44 | `getProject()` function |
| Project Configuration | `openedge-project.json` | N/A | Project metadata and settings |
| Default Project Setting | `package.json` | 464-467 | Configuration schema |
| Set Default Command | `src/extension.ts` | 312-329 | User command to configure default |

---

## Appendix C: Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-02-12 | Use path-based auto-detection as primary selection method | Most accurate way to determine file-project association |
| 2026-02-12 | Override default project when file clearly belongs elsewhere | Prevents incorrect validation errors; file context wins |
| 2026-02-12 | Use longest matching path for nested projects | Most specific match provides most relevant context |
| 2026-02-12 | Maintain backward compatibility with existing settings | Avoid breaking existing user workflows and configurations |
| 2026-02-12 | Reuse existing `getProject()` logic | Proven implementation, reduces code duplication, consistent platform handling |

---

## Document Approval

This PRD Review requires approval from:

- [ ] Product Manager
- [ ] Engineering Lead  
- [ ] QA Lead
- [ ] Documentation Team

**Status**: ✅ **Ready for Architecture & Implementation Planning**

---

*End of Product Requirements Document Review*
