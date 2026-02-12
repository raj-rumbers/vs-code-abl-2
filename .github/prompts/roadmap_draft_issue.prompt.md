# GitHub Issue Drafting Task

You are responsible for the following project:
- Project Name: ${input:projectName}
- Project Description: ${input:description}

The ${input:projectName} project uses the following languages, frameworks and tools:
- Primary Programming Language: ${input:language}
- Framework: ${input:framework}
- Testing Framework: ${input:testingFramework}
- Package Manager: ${input:packageManager}

## Task Overview

Your task is to draft a comprehensive, well-structured GitHub issue from a discovered improvement item. The issue should follow the same quality standards as PRD reviews and be immediately actionable for developers.

## Discovered Item Details

**Item ID:** ${input:item_id}  
**Source Plan:** #${input:plan_id}  
**Category:** ${input:category}  
**Priority:** ${input:priority}  
**Effort Estimate:** ${input:effort_estimate}

**Original Title:** ${input:title}

**Original Description:**
${input:description}

**Context from Review:**
${input:original_text}

## Instructions

Follow these steps to create a professional GitHub issue:

### Step 1: Craft a Clear, Descriptive Title

Create a title that:
- Is concise (5-10 words)
- Clearly states what needs to be done
- Uses imperative voice ("Add", "Improve", "Fix", "Refactor")
- Is specific enough to be immediately understandable
- Includes location context if relevant (e.g., "in verify.sh")

**Format:** `[Action] [What] [Where/Context]`

**Examples:**
- ✅ "Add input validation to verify.sh script"
- ✅ "Improve error messages in roadmap.sh"
- ✅ "Refactor duplicate detection logic"
- ❌ "Better code" (too vague)
- ❌ "Fix stuff" (not specific)

### Step 2: Write Comprehensive Description

Structure the description with these sections:

#### 2.1 Executive Summary
- One paragraph overview of the issue
- Explain WHAT needs to be done and WHY it matters
- Connect to broader project goals when relevant

#### 2.2 Context and Background
- Explain the current state
- Describe how the issue was identified (reference source plan)
- Provide relevant history or previous discussions
- Include code snippets or file paths if applicable

#### 2.3 Detailed Requirements
- Break down exactly what needs to be implemented
- Be specific about files, functions, or components affected
- Include any constraints or considerations
- Specify what should NOT be changed

### Step 3: Define Testable Acceptance Criteria

Create acceptance criteria that:
- Are specific and measurable
- Can be verified through testing or inspection
- Cover both functional and non-functional aspects
- Include edge cases and error scenarios

**Format:**
```
**AC-[ISSUE_NUM]-001:** [Criterion Name]
- GIVEN [initial state]
- WHEN [action or condition]
- THEN [expected outcome]
- AND [additional expectations]
```

**Example:**
```
**AC-NEW-001:** Input Validation
- GIVEN a user runs verify.sh with missing config file
- WHEN the script checks for configuration
- THEN it should display clear error message indicating which file is missing
- AND it should exit with non-zero status code
- AND it should suggest how to create the required file
```

### Step 4: Identify Technical Considerations

Include sections for:

#### 4.1 Dependencies
- Required tools, libraries, or components
- Files that will be modified
- Other issues that must be completed first

#### 4.2 Integration Points
- How this change interacts with other parts of the system
- APIs or interfaces that will be affected
- Backward compatibility considerations

#### 4.3 Potential Edge Cases
- Unusual scenarios to consider
- Error conditions to handle
- Performance implications

### Step 5: Non-Functional Requirements (NFR)

Define quality standards:

**Performance:**
- Execution time requirements
- Resource usage constraints

**Reliability:**
- Error handling expectations
- Recovery procedures

**Maintainability:**
- Code quality standards
- Documentation requirements
- Testing requirements

**Security:**
- Input validation needs
- Credential handling
- Access control considerations

### Step 6: Add Metadata and Labels

Suggest appropriate GitHub labels:
- Category: `technical-debt`, `enhancement`, `improvement`, `documentation`
- Priority: `high-priority`, `medium-priority`, `low-priority`
- Type: `bug`, `feature`, `refactor`, `chore`
- Source: `from-review`, `plan-${input:plan_id}`
- Additional: `good-first-issue`, `help-wanted` (if appropriate)

## Quality Standards

Your issue should:
1. **Be Self-Contained:** Someone unfamiliar with the original review should fully understand the task
2. **Be Actionable:** Clear enough for a developer to start work immediately
3. **Be Specific:** Avoid vague statements like "improve quality" or "make better"
4. **Be Realistic:** Scope should match the effort estimate
5. **Be Traceable:** Reference the source plan and review for context
6. **Follow Standards:** Adhere to project's coding and documentation standards

## Output Format

Provide the complete issue draft in Markdown format with this structure:

```markdown
# [Issue Title]

## Executive Summary

[One paragraph overview]

---

## Context and Background

[Detailed explanation of current state and why this is needed]

### Source

This issue was identified during the verification review of Plan #${input:plan_id}.

**Original Context:**
> ${input:original_text}

---

## Detailed Requirements

[Specific requirements with file paths, function names, etc.]

---

## Acceptance Criteria

**AC-NEW-001:** [First Criterion]
- GIVEN [initial state]
- WHEN [action]
- THEN [outcome]

**AC-NEW-002:** [Second Criterion]
- GIVEN [initial state]
- WHEN [action]
- THEN [outcome]

[Additional criteria as needed...]

---

## Technical Considerations

### Dependencies
- [List dependencies]

### Integration Points
- [List integration considerations]

### Potential Edge Cases
- [List edge cases to handle]

---

## Non-Functional Requirements (NFR)

**NFR-NEW-001: Performance**
- Requirement: [Specific performance expectation]
- Rationale: [Why this matters]
- Measurement: [How to verify]

**NFR-NEW-002: [Other NFR]**
- Requirement: [Specific requirement]
- Rationale: [Why this matters]
- Measurement: [How to verify]

---

## Implementation Notes

[Any additional guidance for developers]

---

## Metadata

**Category:** ${input:category}  
**Priority:** ${input:priority}  
**Effort Estimate:** ${input:effort_estimate}  
**Source Plan:** #${input:plan_id}  
**Discovered Item:** ${input:item_id}

**Suggested Labels:**
```
technical-debt, from-review, plan-${input:plan_id}, ${input:category}
```

---

## References

- Source Plan: #${input:plan_id}
- Plan Review: `plans/plan_${input:plan_id}/review.md`
- Discovery Item: `roadmaps/discovered/items/${input:item_id}.md`
```

## Important Guidelines

1. **Expand on Vague Items:** If the original description is brief, add reasonable details based on project context
2. **Stay Factual:** Don't invent requirements not implied by the source
3. **Be Professional:** Use clear, professional language throughout
4. **Include Examples:** Where helpful, provide code snippets or command examples
5. **Consider Audience:** Write for developers who may not have full context

---

**Now draft the complete GitHub issue following this template and quality standards.**
