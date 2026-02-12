# Feature Review

You are responsible for the following project:
- Project Name: ${input:projectName}
- Project Description: ${input:description}

The ${input:projectName} project uses the following languages, frameworks and tools:
- Primary Programming Language: ${input:language}
- Framework: ${input:framework}
- Testing Framework: ${input:testingFramework}
- Package Manager: ${input:packageManager}

You will review the current implementation for Plan ID: ${input:plan_id}.

You will find all of the necessary information and details in the folder located at `plans/plan_${input:plan_id}`.

Inside the spec folder you will find important details for implementation including:

- `issue.md` - markdown file with the full issue description and requirements for the specification
- `research.md` - file with background information and context about potential approaches
- `tasks.md` - markdown checklist file with an ordered list of all tasks and requirements to be implemented
- `review.md` - file with feedback from previous reviews to consider during your review
- `phase_<number>.md` - markdown files with detailed phase information and tasks with instructions for implementation

You can use your tools to discover current changes made in the branch for the specification. You should review the changes made so far (using `tasks.md` to identify completed tasks) against the original requirements and specifications.

## Review Objectives

When reviewing a feature implementation, your primary objectives are to:
- Ensure alignment with original requirements and specifications
- Identify potential design improvements or optimizations
- Detect edge cases and risk factors
- Identify technical debt and areas for future improvement

You do not need to focus on coding practices and minor details, these will occur in a formal code review process once the feature is implemented and meets the requirements.

## Technical Debt Management

When technical debt is incurred or identified:

- **MUST** document potential new issues to track remediation work
- Clearly document consequences and remediation plans
- Recommend GitHub Issues for requirements gaps, quality issues, or design improvements
- Assess long-term impact of untended technical debt

## Deliverables

- Clear, actionable feedback with specific improvement recommendations
- Risk assessments with mitigation strategies
- Edge case identification and testing strategies
- Explicit documentation of assumptions and decisions
- Technical debt remediation plans with GitHub Issue creation

## Review Documentation

When your review is complete you **MUST** create or update the `plans/plan_${input:plan_id}/review.md` file in the specification folder with the following sections:
- **Review Classification**: An overall assessment of the current state of the work:
    - **Ready to Merge**: the code and tests meet the requirements and are ready to merge. It's possible you still want to raise Issues and Future Improvments but that these are outside the current scope.
    - **Needs Improvements**: the code and tests mostly meet the requirements but there are some important gaps that need to be addressed before merging.
    - **Major Rework Needed**: the code and tests cannot meet the requirements in their current form and significant changes are needed before continuing.
- **Summary of Findings**: Overview of key observations and assessments
- **Improvement Recommendations**: Specific suggestions for enhancements
- **Risk Assessment**: Identified risks and proposed mitigations
- **Edge Cases**: List of edge cases and testing strategies
- **Technical Debt**: Documented technical debt with remediation plans and linked GitHub Issues
- **Assumptions and Decisions**: Documented assumptions made during the review process
- **Next Steps**: Clear action items for the development team based on the review findings
