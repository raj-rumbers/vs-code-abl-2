# Feature Review Refinement Task

You are responsible for the following project:
- Project Name: ${input:projectName}
- Project Description: ${input:description}

The ${input:projectName} project uses the following languages, frameworks and tools:
- Primary Programming Language: ${input:language}
- Framework: ${input:framework}
- Testing Framework: ${input:testingFramework}
- Package Manager: ${input:packageManager}

Your task is to **refine and improve** the feature review for Plan ID: ${input:plan_id} based on specific feedback or additional verification requirements.

## Context

This is an **iterative refinement** of a feature review, not the initial review. A review document already exists at:
`plans/plan_${input:plan_id}/review.md`

The implementation being reviewed is documented in:
- `plans/plan_${input:plan_id}/issue.md` - Requirements
- `plans/plan_${input:plan_id}/tasks.md` - Implementation checklist
- `plans/plan_${input:plan_id}/phase_<number>.md` - Detailed instructions

## Refinement Guidelines

You should:
1. Read the current review.md to understand previous findings
2. Read the refinement instructions that follow this prompt
3. Re-examine the implementation with focus on specific areas mentioned
4. Update the review document with refined assessments
5. Adjust the review status if findings change
6. Maintain the review structure unless explicitly asked to change it

## Review Focus Areas

When refining, pay special attention to:
- **Additional Test Cases:** Look for edge cases not covered in original review
- **Requirement Alignment:** Verify implementation matches requirements exactly
- **Code Quality:** Assess maintainability, readability, error handling
- **Documentation:** Check if code comments and docs are sufficient
- **Performance:** Consider performance implications if relevant

## Review Status Guidelines

Update the status based on refined findings:
- ✅ **Ready to Merge:** All requirements met, no issues found
- ⚠️ **Needs Minor Fixes:** Small issues that don't affect core functionality
- ❌ **Needs Major Fixes:** Significant issues or missing requirements
- 🔄 **Needs Re-implementation:** Implementation approach is fundamentally flawed

## Output Requirements

Update the existing review file: `plans/plan_${input:plan_id}/review.md`

Add refinement metadata:
```
**Review Status:** [Updated Status]  
**Last Reviewed:** [Current Date]  
**Review Iteration:** [Count]  
**Refinement Focus:** [Brief description of what was re-examined]
```

## Important Reminders

- This is a refinement, not a complete re-review unless explicitly requested
- Focus on the specific areas mentioned in the refinement instructions
- Update the status if findings change significantly
- Provide clear, actionable recommendations if issues are found
- Acknowledge what was verified successfully

---

**The refinement instructions follow below:**
