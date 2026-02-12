# Roadmap Discovery Task

You are responsible for the following project:
- Project Name: ${input:projectName}
- Project Description: ${input:description}

The ${input:projectName} project uses the following languages, frameworks and tools:
- Primary Programming Language: ${input:language}
- Framework: ${input:framework}
- Testing Framework: ${input:testingFramework}
- Package Manager: ${input:packageManager}

## Task Overview

Your task is to analyze plan review file(s) and systematically extract improvement opportunities including:
- Technical debt items
- Improvement recommendations
- Enhancement opportunities
- Future iteration suggestions
- Follow-up items

## Review Context

**Plan ID:** ${input:plan_id}
**Review File:** plans/plan_${input:plan_id}/review.md

## Instructions

### Step 1: Read and Understand Review
1. Read the complete review file content provided below
2. Identify all sections that contain improvement items
3. Look for sections with headers containing keywords:
   - "Improvement Recommendations"
   - "Technical Debt"
   - "Enhancement" or "Enhancements"
   - "Future Iterations" or "Future Work"
   - "Follow-up Items"
   - "Optional" items
   - "OPTIONAL Enhancements"
   - "TODO" or "To-Do"

### Step 2: Extract Each Item
For each improvement item found:
1. Extract the full description
2. Identify the category:
   - `technical_debt` - Code quality issues, refactoring needs, architectural improvements
   - `enhancement` - Feature extensions, capability additions
   - `improvement` - Process improvements, documentation enhancements
   - `optional` - Nice-to-have items explicitly marked as optional
3. Determine priority if mentioned:
   - `high` - Critical or blocking issues
   - `medium` - Important but not urgent
   - `low` - Minor improvements or optional items
   - `unspecified` - No priority indicated
4. Extract effort estimate if mentioned (e.g., "1-2 hours", "1 day", "1 week")
5. Preserve original context and any relevant details

### Step 3: Quality Checks
For each extracted item:
1. **Specificity Check:** Ensure the item is specific enough to be actionable
   - ❌ Bad: "Improve error handling"
   - ✅ Good: "Improve error handling in verify.sh by adding validation for missing configuration files"
2. **Completeness Check:** Ensure sufficient context is preserved
   - Include: What needs improvement, where it's located, why it matters
3. **Duplication Check:** Note if similar items appear multiple times in the same review

### Step 4: Generate Structured Output

Output your findings in the following YAML format for each item:

```yaml
---
item_id: "DISC-${input:plan_id}-001"
plan_id: ${input:plan_id}
source_file: "plans/plan_${input:plan_id}/review.md"
category: "technical_debt"  # or "enhancement", "improvement", "optional"
priority: "medium"  # or "high", "low", "unspecified"
effort_estimate: "2-3 hours"  # or "unspecified" if not mentioned
title: "Short, descriptive title (5-10 words)"
description: |
  Full description of the improvement item with context.
  Include:
  - What needs to be done
  - Where it's located (file paths, components)
  - Why it matters (impact, benefits)
  - Any constraints or considerations
original_text: |
  Exact text from the review file (for traceability)
context_section: "Improvement Recommendations"  # Section header where found
labels:
  - "technical-debt"  # GitHub label suggestion
  - "from-review"
  - "plan-${input:plan_id}"
---
```

### Step 5: Summary Statistics

After extracting all items, provide a summary:

```yaml
---
summary:
  plan_id: ${input:plan_id}
  total_items: <number>
  by_category:
    technical_debt: <count>
    enhancement: <count>
    improvement: <count>
    optional: <count>
  by_priority:
    high: <count>
    medium: <count>
    low: <count>
    unspecified: <count>
  potential_duplicates: <list of item IDs if any duplicates detected within this review>
---
```

## Quality Standards

1. **Be Conservative:** Only extract items that are clearly actionable improvement opportunities
2. **Preserve Context:** Don't summarize away important details
3. **Be Specific:** Add clarifying details if the original text is vague (but note when you do)
4. **Flag Ambiguity:** If an item is unclear, note it in the description
5. **Maintain Traceability:** Always include exact original text

## Review File Content

```markdown
${input:review_content}
```

## Output Format

Provide the YAML-formatted items followed by the summary, all in a single response.
Each item should be a complete, self-contained YAML document separated by `---`.
