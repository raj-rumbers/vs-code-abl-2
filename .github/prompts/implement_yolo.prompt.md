# Implement Task & Requirements (YOLO Mode)

You are responsible for the following project:
- Project Name: ${input:projectName}
- Project Description: ${input:description}

The ${input:projectName} project uses the following languages, frameworks and tools:
- Primary Programming Language: ${input:language}
- Framework: ${input:framework}
- Testing Framework: ${input:testingFramework}
- Package Manager: ${input:packageManager}

You will implement the tasks and requirements detailed for Plan ID: ${input:plan_id}. You will find all of the necessary information and details in the folder located at `plans/plan_${input:plan_id}`

Inside the plan folder you will find important details for implementation including:

- `issue.md` - markdown file with the full issue description and requirements for the specification
- `research.md` - file with background information and context about potential approaches
- `tasks.md` - markdown checklist file with an ordered list of all tasks and requirements to be implemented
- `review.md` - file with feedback from previous reviews to consider during implementation
- `phase_<number>.md` - markdown files with detailed phase information and tasks with instructions for implementation

## YOLO Mode Instructions

⚠️ **YOLO MODE ENABLED:** You are operating in continuous implementation mode. Unlike standard mode, you will process ALL tasks without stopping for manual review between tasks. However, you MUST stop if you encounter major blockers (defined below).

## Development Workflow

You will follow this structured workflow when implementing tasks and requirements:

1. Review the information in the `plans/plan_${input:plan_id}/` folder and use the checklist in `tasks.md` to track your progress.
2. Select the next incomplete phase and child task on the list and implement a requirement for that task using the details in the corresponding `phase_<number>.md` file.
3. Commit your changes locally with a descriptive message that starts with the prefix [neo] so the user knows it was you. Do not push yet.
4. Implement tests for that requirement
5. Commit the tests locally with a descriptive message that starts with the prefix [neo] so the user knows it was you. Do not push yet.
6. Run linting and the tests using `make lint` and `make test`
7. Resolve any issues
8. Re-run linting and tests until all issues are resolved.
9. Commit any final changes locally with a descriptive message that starts with the prefix [neo] so the user knows it was you. Do not push yet.
10. Mark the requirement as done and select the next requirement for the task.
11. Repeat steps 2-10 until all requirements for the task are done.
12. When all requirements for a task are done, mark the task as complete in `tasks.md`
13. **IMPORTANT:** Update the `tasks.md` file immediately after completing each task (check the checkbox). Do NOT defer updates until the end.
14. Continue to the next task WITHOUT stopping for review.
15. Repeat steps 2-14 until all tasks in ALL phases are complete OR until you encounter a major blocker.

## When to STOP (Major Blockers)

You MUST stop execution and report the issue if you encounter any of these major blockers:

### 1. Persistent Test Failures
- **Condition:** The same test fails 3 times in a row despite your attempts to fix it
- **Note:** It's acceptable if different tests fail across attempts (shows progress), but the SAME test failing repeatedly indicates a fundamental issue
- **Action:** Stop, document which test is failing and why, summarize what you've tried

### 2. Unresolvable Linting Errors
- **Condition:** Linting errors that cannot be auto-fixed by the linter AND you cannot manually fix them
- **Examples:** Syntax errors from tool limitations, conflicting rules, external file issues
- **Action:** Stop, document the specific linting errors and why they cannot be resolved

### 3. Missing Dependencies or Files
- **Condition:** Required files, packages, or dependencies do not exist and cannot be created/installed
- **Examples:** External services not available, system libraries missing, broken package references
- **Action:** Stop, document what is missing and what needs to be provided

### 4. Ambiguous or Contradictory Requirements
- **Condition:** Task requirements are unclear, contradictory, or require additional information to avoid technical errors or risks
- **Examples:** Conflicting specifications, undefined behavior, missing critical details
- **Action:** Stop, document the ambiguity and what clarification is needed

### 5. Build or Compilation Failures
- **Condition:** Code cannot be built or compiled due to fundamental errors (not simple syntax errors)
- **Action:** Stop, document the build error and context

## Retry Logic

For test failures and linting issues:
- **Maximum Retry Attempts:** 3 per issue
- **Tracking:** Keep track of retry counts mentally/in context
- **Failure Criteria:** If attempt 3 fails for the SAME issue, stop (see "When to STOP")
- **Reset Count:** If you successfully fix one test but another test starts failing, that's a new issue (reset count)

**Example Retry Scenario:**
- Attempt 1: test_user_login() fails → fix code → commit
- Attempt 2: test_user_login() still fails → different fix → commit  
- Attempt 3: test_user_login() STILL fails → STOP (major blocker)

**Example Different Issue (NOT a blocker):**
- Attempt 1: test_user_login() fails → fix code → commit
- Attempt 2: test_user_login() passes, but test_user_logout() fails → fix code → commit
- Attempt 3: test_user_logout() passes → continue (different tests, shows progress)

## Progress Tracking

**CRITICAL:** Update `tasks.md` after completing each task:

1. Open `plans/plan_${input:plan_id}/tasks.md`
2. Find the completed task
3. Change `[ ]` to `[x]` for that specific task
4. Save the file
5. Commit the update with message: `[neo] Mark task X.Y complete`

**Do NOT:**
- Defer all updates until the end
- Update multiple tasks at once unless actually completed
- Skip task tracking updates

This enables real-time progress monitoring.

## Commit Strategy

Maintain the per-task commit strategy:
- Commit after implementing code
- Commit after implementing tests
- Commit after fixing lint/test issues
- Commit after marking task complete in tasks.md

**All commits MUST use `[neo]` prefix** (NOT `[neo-YOLO]` or any variation)

## Stopping Gracefully

When you stop (either due to blocker or completion):

1. **Summarize Status:**
   - How many tasks completed
   - Which task you stopped on (if blocker)
   - What blocker was encountered (if applicable)

2. **Document Blocker:**
   - Specific error message or issue
   - What you attempted to fix it
   - What information or action is needed from the user

3. **Verify Progress Tracking:**
   - Confirm all completed tasks are marked in tasks.md
   - Ensure all changes are committed

## Success Completion

If you complete ALL tasks in ALL phases without blockers:

1. Verify all tasks in `tasks.md` are marked complete `[x]`
2. Verify all tests pass: `make test`
3. Verify linting passes: `make lint`
4. Provide completion summary:
   - Total tasks completed
   - Total commits made
   - Confirm all phases done

**Congratulations! The plan is fully implemented! 🎉**
