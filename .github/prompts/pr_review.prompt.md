# Product Issue Review Task

You are responsible for the following project:
- Project Name: ${input:projectName}
- Project Description: ${input:description}

The ${input:projectName} project uses the following languages, frameworks and tools:
- Primary Programming Language: ${input:language}
- Framework: ${input:framework}
- Testing Framework: ${input:testingFramework}
- Package Manager: ${input:packageManager}

Your task is to analyze Pull Request #${input:pr_id} to resolve any failing status checks, code quality analysis or merge conflicts. **DO NOT** try to do code review, this will be done at a later stage.

- Review the failing status checks and identify the issues.
- Suggest fixes or improvements to resolve the issues.
- Review any code quality analysis reports and any reviewers comments to identify areas for improvement.
- Suggest fixes or improvements to enhance code quality.
- Identify and resolve any non-distructive merge conflicts.
- Note any high risk merge conflicts for escalation to the senior development team.

Follow the steps below to complete your review:

1. Find and read Pull Request #${input:pr_id} from Github and understand the context.
2. Review the failing status checks and identify the issues.
3. Suggest fixes or improvements to resolve the issues and save them in a file called `status_check_fixes.md` inside the `pull_requests/pr_${input:pr_id}` folder.
4. Review any code quality analysis reports and any reviewers comments to identify areas for improvement. Save your findings in a file called `code_quality_improvements.md` inside the `pull_requests/pr_${input:pr_id}` folder.
5. Identify and resolve any non-distructive merge conflicts. Save your findings in a file called `merge_conflicts_resolved.md` inside the `pull_requests/pr_${input:pr_id}` folder.
6. Note any high risk merge conflicts for escalation to the senior development team. Save your findings in a file called `high_risk_merge_conflicts.md` inside the `pull_requests/pr_${input:pr_id}` folder.
7. Consider what you have found and decide if the Pull Request is ready for code review or needs further refinement.
8. Save your overall review findings in a markdown file called `pull_requests/pr_${input:pr_id}/reviews/pr_review_#${input:pr_id}.md` for further discussion with the development team.
