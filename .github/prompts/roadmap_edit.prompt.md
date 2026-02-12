# Roadmap Refinement Task

You are responsible for the following project:
- Project Name: ${input:projectName}
- Project Description: ${input:description}

The ${input:projectName} project uses the following languages, frameworks and tools:
- Primary Programming Language: ${input:language}
- Framework: ${input:framework}
- Testing Framework: ${input:testingFramework}
- Package Manager: ${input:packageManager}

Your task is to **refine and improve** the project roadmap based on specific feedback, changing priorities, or new insights.

## Context

This is an **iterative refinement** of the project roadmap, not initial roadmap creation. Previous roadmap files exist in the `roadmaps/` directory.

The most recent roadmap can be identified by the timestamp in the filename:
`roadmaps/roadmap_<timestamp>.md`

## Finding the Latest Roadmap

To find the most recent roadmap:
```bash
# List roadmap files sorted by timestamp (newest first)
ls -t roadmaps/roadmap_*.md | head -n 1
```

Read this file to understand the current delivery plan before applying refinements.

## Context from Previous Roadmap

When refining the roadmap, maintain:
- ✅ Completed phases and issues (don't move them)
- ✅ Critical dependencies (unless explicitly instructed to change)
- ✅ Overall structure and format (unless refinement requests changes)

Update or change:
- Issue ordering within and across phases
- Phase groupings and naming
- Timeline estimates
- Dependency notes
- Risk assessments

## Refinement Guidelines

You should:
1. Read the most recent roadmap file to understand current delivery planning
2. Review all open issues to understand the current scope
3. Read the refinement instructions that follow this prompt
4. Adjust issue ordering, grouping, or priorities as instructed
5. Validate that dependencies between issues are respected
6. Create a NEW roadmap file (don't overwrite the previous one)

## Roadmap Considerations

When refining the roadmap, consider:
- **Dependencies:** Ensure dependent issues are ordered correctly
- **Priorities:** Reflect any priority changes from stakeholders
- **Capacity:** Consider realistic delivery timeframes
- **Risk:** Higher-risk items may need earlier delivery for feedback
- **Value:** Balance quick wins with strategic important work

## Delivery Grouping

Organize issues into logical groups:
- **Phase 1 - Foundation:** Core infrastructure and setup
- **Phase 2 - Core Features:** Essential functionality
- **Phase 3 - Enhancements:** Improvements and additional features
- **Phase 4 - Polish:** Documentation, optimization, final touches

Adjust phase names and groupings based on project needs.

## Output Requirements

Create a NEW roadmap file with current timestamp:
`roadmaps/roadmap_<new_timestamp>.md`

Include metadata at the top:
```
**Roadmap Version:** [Date]  
**Refinement Iteration:** [Count]  
**Refinement Reason:** [Brief description]  
**Previous Roadmap:** roadmap_<previous_timestamp>.md
```

## Roadmap Structure

Use this structure:
```markdown
# Project Roadmap - [Project Name]

**Generated:** [Date]  
**Status:** Active

## Executive Summary
[Brief overview of delivery plan]

## Delivery Phases

### Phase 1: [Phase Name]
**Target:** [Timeline]  
**Focus:** [What this phase delivers]

#### Issues
- Issue #X: [Title] - [Brief justification for placement]
- Issue #Y: [Title] - [Brief justification for placement]

[Repeat for each phase]

## Dependencies
[List any cross-issue dependencies that affect ordering]

## Risks & Considerations
[Note any risks or considerations for this delivery plan]
```

## Important Reminders

- Create a NEW file, don't overwrite the previous roadmap
- Preserve previous roadmap files for historical reference
- Validate issue dependencies are respected
- Use realistic timeline estimates
- Document the reasoning for major re-ordering decisions

---

**The refinement instructions follow below:**
