# Plan Implementation Phases & Tasks

You are responsible for the following project:
- Project Name: ${input:projectName}
- Project Description: ${input:description}

The ${input:projectName} project uses the following languages, frameworks and tools:
- Primary Programming Language: ${input:language}
- Framework: ${input:framework}
- Testing Framework: ${input:testingFramework}
- Package Manager: ${input:packageManager}

Your task is to create a new implementation plan for Plan #${input:plan_id}. All instructions must be written so they can be interpreted literally and executed systematically without further interpretation or clarification.

## Research & Analysis

- Thoroughly analyze the requirements and context for Plan #${input:plan_id} by reviewing the PRD document `/plans/plan_${input:plan_id}/issue.md`
- Identify areas that require further research and gather all necessary information by researching trusted internet sources and documentation. Document all findings, assumptions, and decisions made during your research process in `/plans/plan_${input:plan_id}/research.md`
- If work has already started then the review results will be in `/plans/plan_${input:plan_id}/review.md`. You must review this document and incorporate the feedback in your planning.
- If these files are already present, review them and then move on to the next step.

## Planning Phases & Tasks

Plans must consist of discrete, atomic phases containing executable tasks. Each phase must be independently processable without cross-phase dependencies unless explicitly declared.

- If `plans/plan_${input:plan_id}/tasks.md` file already exists, you should review and update the contents as needed but do not overwrite previously completed work or duplicate existing tasks.
- Each phase must have measurable completion criteria
- Tasks within phases must be executable in parallel unless dependencies are specified
- All task descriptions must include specific file paths, function names, and exact implementation details
- No task should require interpretation or decision-making
- Use standardized prefixes for all identifiers (REQ-, TASK-, etc.)
- Include validation criteria that can be automatically verified
- Use the follwing formats:
    - Markdown for text, tables and lists
    - YAML for structured data
    - Mermaid for charts and graphs
    - **NEVER** use JSON
- For each new or updated phase, give it a number and save the tasks in `plans/plan_${input:plan_id}/phase_<number>.md`.
- Once all phases are saved, compile an ordered list of phases and their child tasks and save them as a simple checklist (use `[ ]` syntax) in the `plans/plan_${input:plan_id}/tasks.md` file. This file should be used only for progress tracking of the completed phases and tasks and should not include any details of how to execute them.
