# Pull Request Fix Task

You are responsible for the following project:
- Project Name: ${input:projectName}
- Project Description: ${input:description}

The ${input:projectName} project uses the following languages, frameworks and tools:
- Primary Programming Language: ${input:language}
- Framework: ${input:framework}
- Testing Framework: ${input:testingFramework}
- Package Manager: ${input:packageManager}

Your task is to **fix issues** preventing Pull Request #${input:pr_id} from being merged, including merge conflicts, failing status checks, or review feedback.

## Context

This is a **fix operation** for an existing pull request that has issues preventing merge. Common issues include:
- Merge conflicts with base branch
- Failing CI/CD status checks (tests, linting, builds)
- Review feedback requiring changes
- Security vulnerabilities or code quality issues

## Fix Guidelines

You should:
1. Use GitHub CLI to examine the PR status: `gh pr view ${input:pr_id}`
2. Read the PR review documents in `pull_requests/pr_${input:pr_id}/reviews/`
  - `status_check_fixes.md` - fixes for failing status checks
  - `code_quality_improvements.md` - code quality improvement suggestions
  - `merge_conflicts_resolved.md` - details on resolved merge conflicts
  - `high_risk_merge_conflicts.md` - notes on high risk conflicts
3. Address each status check issue systematically
4. Resolve code quality issues as needed
5. Resolve simple merge conflicts if present
6. Resolve high risk conflicts **ONLY IF INSTRUCTED BELOW** in the detailed fix instructions
7. Re-run linting and tests locally
8. Address any Pull Request review feedback
9. Verify all status checks pass after fixes
10. Commit fixes with `[neo-FIX]` prefix

## Viewing Pull Request Review Feedback

If addressing review comments:
1. View review comments: `gh pr view ${input:pr_id} --json reviews`
2. Address each comment systematically
3. Make requested changes with clear commit messages
4. Reply to review comments noting changes made (optional)

## Status Check Failures

When CI/CD status checks fail:
1. View failing checks: `gh pr checks ${input:pr_id}`
2. Examine error logs for each failing check
3. Address test failures by fixing broken tests or implementation
4. Fix linting errors with appropriate formatters/linters
5. Resolve build failures by addressing compilation errors
6. Re-run checks locally before pushing: `make test`, `make lint`, `make ci`
7. Push fixes and verify status checks pass

## Merge Conflict Resolution
- First check and understand if this is a merge from a feature branch into main or a reverse merge to update a feature branch
- Pull the latest changes from the base branch into your local branch
- Identify files with merge conflicts
- For simple conflicts, resolve them directly in your local branch
- For simple branch divergence, use rebase or other simple merge strategies
- **ONLY** resolve high risk conflicts if explicitly instructed in the fix instructions below

## Commit Message Format

Use descriptive commit messages:
```
[neo-FIX] Resolve merge conflicts in <file>
[neo-FIX] Fix failing tests in <test_file>
[neo-FIX] Address review feedback: <specific change>
[neo-FIX] Fix linting errors in <file>
```

## Important Reminders

- Test all changes locally before pushing
- Verify status checks pass after fixes
- Don't force-push unless absolutely necessary
- Use `[neo-FIX]` prefix for all fix commits
- Check PR status after fixes: `gh pr view ${input:pr_id}`

---

**The fix instructions follow below:**
