# Implementation Plan Refinement Task

You are responsible for the following project:
- Project Name: ${input:projectName}
- Project Description: ${input:description}

The ${input:projectName} project uses the following languages, frameworks and tools:
- Primary Programming Language: ${input:language}
- Framework: ${input:framework}
- Testing Framework: ${input:testingFramework}
- Package Manager: ${input:packageManager}

Your task is to **refine and improve** the existing implementation plan for Plan ID: ${input:issue_id} based on specific feedback and refinement instructions.

## Context

This is an **iterative refinement** task, not initial planning. Implementation plan files already exist in:
`plans/plan_${input:issue_id}/`

Existing files include:
- `issue.md` - Full issue description and requirements
- `research.md` - Background information and context
- `tasks.md` - Checklist of tasks and requirements
- `phase_<number>.md` - Detailed phase information with implementation instructions

## Refinement Guidelines

You should:
1. Review the current plan files to understand the existing structure
2. Read the refinement instructions that follow this prompt
3. Update the relevant files to address the specific feedback provided
4. Ensure changes maintain consistency with the original requirements
5. Update the `tasks.md` checklist to reflect any task changes
6. Modify or create `phase_<number>.md` files as needed
7. **Do not mark completed tasks as incomplete** unless explicitly instructed

## Special Considerations

- **Completed Work:** Respect tasks marked as complete (✓ or [x]) in tasks.md
- **Dependencies:** Ensure phase dependencies remain valid after changes
- **Atomicity:** Keep tasks atomic and independently executable
- **File Paths:** All task descriptions must include specific file paths
- **Validation:** Include clear validation criteria for each task

## Output Requirements

Update existing files in `plans/plan_${input:issue_id}/`:
- Modify `tasks.md` to reflect task changes (preserve completed checkboxes)
- Update or create `phase_<number>.md` files as needed
- Add refinement note at top of tasks.md:
  ```
  **Plan Status:** Refined  
  **Last Updated:** [Current Date]  
  **Refinement Iteration:** [Count]
  ```

## Important Reminders

- Preserve completed tasks unless explicitly asked to modify them
- Maintain phase numbering consistency
- Keep task descriptions detailed and literal (no interpretation needed)
- Update dependencies if phases are added, removed, or reordered
- Use standardized prefixes (TASK-, PHASE-, etc.)

---

**The refinement instructions follow below:**
