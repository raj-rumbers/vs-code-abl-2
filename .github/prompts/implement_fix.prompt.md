# Implementation Fix Task

You are responsible for the following project:
- Project Name: ${input:projectName}
- Project Description: ${input:description}

The ${input:projectName} project uses the following languages, frameworks and tools:
- Primary Programming Language: ${input:language}
- Framework: ${input:framework}
- Testing Framework: ${input:testingFramework}
- Package Manager: ${input:packageManager}

Your task is to **fix specific issues** in the implementation for Plan ID: ${input:plan_id} based on review feedback or identified problems.

## Context

This is a **fix operation**, not initial implementation. Code has already been implemented and potentially committed. You are addressing specific issues that were discovered during review or testing.

Implementation details are in: `plans/plan_${input:plan_id}/`

Key files:
- `issue.md` - Original issue description and requirements
- `tasks.md` - Task checklist (shows what was implemented)
- `review.md` - Review feedback (may contain fix requirements)
- `phase_<number>.md` - Implementation instructions

## Fix Guidelines

You should:
1. Review the existing implementation to understand what was done
2. Read the fix instructions that follow this prompt (and/or review.md)
3. Identify the specific code that needs fixing
4. Make **minimal, surgical changes** to fix the identified issues
5. Ensure fixes don't break existing functionality
6. Update or add tests to cover the fixes
7. Run linting and the tests using `make lint` and `make test` and fix any issues
8. Commit changes with `[neo-FIX]` prefix (not `[neo]`)

## Fix Workflow

1. **Understand the Issue:** Review error messages, test failures, or review feedback
2. **Locate the Code:** Find the specific files and functions that need fixing
3. **Make Minimal Changes:** Fix only what needs fixing, don't refactor unnecessarily
4. **Test the Fix:** Ensure the fix resolves the issue without breaking other things
5. **Validate Quality:** Run `make lint` and `make test`
6. **Commit Properly:** Use `[neo-FIX]` prefix with descriptive message

## Special Considerations

- **Preserve Working Code:** Don't modify code that isn't part of the fix
- **Test Coverage:** Maintain or improve test coverage
- **Backward Compatibility:** Ensure fixes don't break existing functionality
- **Error Handling:** Improve error handling if that was the issue
- **Documentation:** Update comments if fixing misunderstood requirements

## Commit Message Format

Use this format for fix commits:
```
[neo-FIX] Brief description of what was fixed

Detailed explanation of:
- What the issue was
- What was changed to fix it
- How the fix was validated
```

## Important Reminders

- Make minimal, targeted changes
- Test thoroughly before committing
- Use `[neo-FIX]` prefix, not `[neo]`
- Don't start new tasks, focus on fixing existing work
- Read review.md for context if it exists

---

**The fix instructions follow below:**
