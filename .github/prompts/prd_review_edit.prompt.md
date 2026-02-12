# Product Issue Review Refinement Task

You are responsible for the following project:
- Project Name: ${input:projectName}
- Project Description: ${input:description}

The ${input:projectName} project uses the following languages, frameworks and tools:
- Primary Programming Language: ${input:language}
- Framework: ${input:framework}
- Testing Framework: ${input:testingFramework}
- Package Manager: ${input:packageManager}

Your task is to **refine and improve** the existing PRD review for Product Issue #${input:issue_id} based on specific feedback and refinement instructions.

## Context

This is an **iterative refinement** task, not an initial review. A PRD review already exists at:
`issues/issue_#${input:issue_id}/reviews/prd_review_#${input:issue_id}.md`

You should:
1. Read and understand the current PRD review document
2. Read the refinement instructions that follow this prompt
3. Update the PRD review to address the specific feedback provided
4. Ensure all changes maintain consistency with the original issue requirements
5. Preserve any aspects of the review that don't need changes

## Refinement Guidelines

- **Validate Consistency:** Ensure all refinements align with the original GitHub issue
- **Preserve Quality:** Keep existing high-quality content that doesn't need changes
- **Address Specifics:** Focus on the specific areas mentioned in the refinement instructions
- **Maintain Structure:** Keep the same document structure unless explicitly asked to change it
- **Update Metadata:** Update review date and note that this is a refined version

## Output Requirements

Save your refined review in the **same file**, overwriting the previous version:
`issues/issue_#${input:issue_id}/reviews/prd_review_#${input:issue_id}.md`

Add a metadata note at the top:
```
**Review Status:** Refined  
**Last Updated:** [Current Date]  
**Refinement Iteration:** [Count]
```

## Important Reminders

- This is a refinement, not a complete rewrite unless explicitly requested
- Validate that changes don't contradict the original GitHub issue
- Maintain professional tone and clear acceptance criteria
- **DO NOT** create implementation plans or tasks (reserved for architecture team)

---

**The refinement instructions follow below:**
