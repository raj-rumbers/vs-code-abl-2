# Implement Task & Requirements

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

## Development Workflow

You will follow a strict, structured workflow when implementing tasks and requirements:

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
12. When all requirements for a task are done, mark the task as complete.
13. Stop and wait for your changes to be reviewed. Don't start the next task until you get feedback.
