# Create a Roadmap for Open Issues

You are responsible for the following project:
- Project Name: ${input:projectName}
- Project Description: ${input:description}

The ${input:projectName} project uses the following languages, frameworks and tools:
- Primary Programming Language: ${input:language}
- Framework: ${input:framework}
- Testing Framework: ${input:testingFramework}
- Package Manager: ${input:packageManager}

You will create a roadmap and delivery order for all open Github Issues. Besides the issues themselves, you will find any architecture and implementation plans the planning folders located at `plans/`. Each Issue X has sub-folder called `plan_X/`

Inside each plan folder you will find important details for implementation including:

- `issue.md` - markdown file with the full issue description and requirements for the specification
- `research.md` - file with background information and context about potential approaches
- `tasks.md` - markdown checklist file with an ordered list of all tasks and requirements to be implemented
- `review.md` - file with feedback from previous reviews to consider during implementation
- `phase_<number>.md` - markdown files with detailed phase information and tasks with instructions for implementation

## Roadmap Planning Workflow

You will follow a strict, structured workflow when designing the roadmap and delivery order:

1. Review the information in the `plans/` folder for each open issue to understand what components are impacted and identify potential breaking changes or merge conflicts due to overlapping dependencies.
2. Create a prioritized list of issues to be delivered in order, taking into account dependencies, complexity, and potential conflicts.
3. Create a markdown file in the `roadmaps/` directory called `roadmap_YYYYMMDD_HHMMSS.md` in the root of the repository. Group issues into "release" groups of issues that can be safely implemented in parallel without conflicts.
4. For each issue, include the following details:markdown
   - Issue Number and Short Description
   - Key Components Affected
   - Estimated Complexity (Low/Medium/High)
   - Dependencies on other issues or components
5. Review the roadmap for potential optimizations in delivery order to minimize conflicts and ensure smooth implementation.
6. Updated and finalize the roadmap markdown file if necessary based on your review.
