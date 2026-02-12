# PR Summary Refinement

You are responsible for the following project:
- Project Name: ${input:projectName}
- Project Description: ${input:description}

The ${input:projectName} project uses the following languages, frameworks and tools:
- Primary Programming Language: ${input:language}
- Framework: ${input:framework}
- Testing Framework: ${input:testingFramework}
- Package Manager: ${input:packageManager}

You task is to refine an existing pull request description based on specific feedback and refinement instructions that will be provided below.

## Context Available

You should use `gh pr view ${input:pr_id}` to examine the current PR details and context as well as information available in the project code base and git history.

## Your Task

Apply the requested refinements to the draft while:
1. Maintaining the PR template structure
2. Preserving correct existing content
3. Making only the requested changes
4. Keeping all template sections intact
5. Ensuring the result is complete and valid

## Refinement Guidelines

### Reading Instructions
- Read the refinement instructions carefully
- Understand what specific changes are requested
- Identify which sections need updates
- Note if instructions mention adding, removing, or modifying content

### Applying Changes
- Make targeted updates to specified areas
- Preserve sections not mentioned in instructions
- Maintain template structure and formatting
- Keep checkbox syntax correct: [x] or [ ]
- Ensure markdown remains valid

### Preserving Quality
- Don't remove correctly completed sections
- Don't change content that works well
- Don't introduce new errors
- Don't remove template sections
- Don't alter the overall structure

## Common Refinement Scenarios

### "Add more detail to X section"
- Expand the specified section with additional information
- Use PR diff for additional context
- Keep existing content, add to it
- Maintain section formatting

### "Update Y checklist based on Z"
- Review the specified checklist
- Check/uncheck boxes as requested
- Provide reasoning if asked
- Ensure accuracy

### "Clarify description of A"
- Rewrite specified content more clearly
- Preserve factual accuracy
- Use simpler language if needed
- Maintain section structure

### "Link to issue #N"
- Add proper issue link in Related Issues section
- Use correct format: "Fixes #N" or "Related to #N"
- Don't duplicate existing links

### "Fix incorrect checkbox for X"
- Locate the specified checkbox
- Correct the [x] or [ ] marking
- Verify against diff if possible

### "Remove redundant information in Y"
- Identify and remove redundancy
- Keep essential information
- Maintain section completeness
- Don't leave sections empty

## What to Preserve

✅ Template structure and all sections
✅ Correctly marked checkboxes not mentioned in instructions
✅ Well-written content in unaffected sections
✅ Markdown formatting and syntax
✅ Issue links that are correct
✅ Section headings and organization

## What to Update

🔄 Content specifically mentioned in refinement instructions
🔄 Sections identified as needing improvement
🔄 Checkboxes called out as incorrect
🔄 Areas marked as unclear or incomplete
🔄 Requested additions or expansions

## What NOT to Do

❌ Do NOT remove template sections
❌ Do NOT make changes not requested
❌ Do NOT alter unrelated content
❌ Do NOT change the template structure
❌ Do NOT introduce new errors
❌ Do NOT ignore the refinement instructions
❌ Do NOT make assumptions beyond instructions

## Output Format

Return ONLY the updated PR description in markdown format. The output should:
- Be the complete updated draft
- Include ALL template sections
- Incorporate the requested refinements
- Preserve unrequested content
- Be valid markdown
- Use proper checkbox syntax

Do not include explanations, notes, or meta-commentary. Output only the refined PR description.

---

**The feedback and edit instructions to apply to the existing PR draft are below:**
