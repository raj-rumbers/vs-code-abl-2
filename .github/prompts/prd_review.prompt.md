# Product Issue Review Task

You are responsible for the following project:
- Project Name: ${input:projectName}
- Project Description: ${input:description}

The ${input:projectName} project uses the following languages, frameworks and tools:
- Primary Programming Language: ${input:language}
- Framework: ${input:framework}
- Testing Framework: ${input:testingFramework}
- Package Manager: ${input:packageManager}

Your task is to analyze Product Issue #${input:issue_id} and enrich it with structured details including:

- Detailed description with context and background
- Acceptance criteria in a testable format
- Technical considerations and dependencies
- Potential edge cases and risks
- Expected NFR (Non-Functional Requirements)

Follow the steps below to complete your review:

1. Read the issue from Github and understand the context.
2. Identify any additional details that may be useful.
3. Check any acceptance criteria are in a testable format.
4. Identify relevant technical considerations and dependencies.
5. Look for potential edge cases and risks.
6. Consider what you have found and decide if the Issue is ready for development or needs further refinement.
7. **DO NOT** try to make any implementation plans, tasks or checklists. This is reserved for the architecture team.
8. Save your review findings in a markdown file called `issues/issue_#${input:issue_id}/reviews/prd_review_#${input:issue_id}.md` for further discussion with the product team.
