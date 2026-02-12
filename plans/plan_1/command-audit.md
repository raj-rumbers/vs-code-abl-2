# Command Audit - Project Selection Enhancement

## Commands Using getProject()

| Line | Command Function | Current Behavior | Needs Update | Priority |
|------|------------------|------------------|--------------|----------|
| 458 | debugListingLine | Uses getProject(), shows error if null | No | Low |
| 472 | dumpFileStatus | Uses getProject(), shows error if null | No | Low |
| 484 | preprocessFile | Uses getProject(), shows error if null | Yes | High |
| 503 | generateListing | Uses getProject(), shows error if null | Yes | High |
| 522 | generateDebugListing | Uses getProject(), shows error if null | Yes | Medium |
| 541 | generateXref | Uses getProject(), shows error if null | Yes | Medium |
| 559 | generateXrefAndJumpToCurrentLine | Uses getProject(), shows error if null | Yes | Medium |

## Decision

**Commands to Update**: 
- preprocessFile (line 484)
- generateListing (line 503)
- generateDebugListing (line 522)
- generateXref (line 541)
- generateXrefAndJumpToCurrentLine (line 559)

**Commands to Keep As-Is**: 
- debugListingLine (line 458): Diagnostic command, requires file to be in a project (error is appropriate)
- dumpFileStatus (line 472): Diagnostic command, requires file to be in a project (error is appropriate)

**Rationale**: Commands that process/compile files should use intelligent resolution. Diagnostic commands can require file to be in a project and showing an error is appropriate behavior.

---

**Audit Date**: 2026-02-12
**Status**: ✅ Complete
