# PR Summary Generation

You are responsible for the following project:
- Project Name: ${input:projectName}
- Project Description: ${input:description}

The ${input:projectName} project uses the following languages, frameworks and tools:
- Primary Programming Language: ${input:language}
- Framework: ${input:framework}
- Testing Framework: ${input:testingFramework}
- Package Manager: ${input:packageManager}

Your task is to **analyze the provided PR changes and create a complete, accurate description** using the project's PR template.

## Context Available

You should use `gh pr view ${input:pr_id}` to examine the current PR details and context as well as information available in the project code base and git history.

## Your Task

Generate a complete PR description that:
1. Accurately describes what changed and why
2. Fills all sections of the PR template appropriately
3. Checks relevant boxes based on evidence in the diff
4. Links related issues correctly
5. Provides context for reviewers

## Template Structure to Follow

## Description

<!-- Provide a brief description of your changes -->

## Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update (changes to documentation only)
- [ ] 🔧 Configuration change (changes to configuration files)
- [ ] 🎨 Code style update (formatting, renaming, etc.)
- [ ] ♻️ Refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] ✅ Test update (adding or updating tests)
- [ ] 🔨 Build/CI update (changes to build process or CI configuration)

## Related Issues

<!-- Link to related issues using # (e.g., Fixes #123, Related to #456) -->

Fixes #

## Changes Made

<!-- List the specific changes made in this PR -->

-
-
-

## Testing Performed

<!-- Describe the testing you've done -->

- [ ] Ran `make lint` - all checks pass
- [ ] Ran `make test` - all tests pass
- [ ] Tested manually in local environment
- [ ] Added new tests for new functionality
- [ ] Updated existing tests as needed

## Documentation Checklist

<!-- Complete this section if your PR includes documentation changes -->

- [ ] Updated relevant documentation in `docs/` directory
- [ ] Added/updated code examples where appropriate
- [ ] Ran `mkdocs build --strict` - build succeeds without warnings
- [ ] Tested documentation locally with `mkdocs serve` or `monitor.sh`
- [ ] Updated navigation in `mkdocs.yml` if new pages added
- [ ] Checked for broken internal links
- [ ] Updated search index if significant content changes
- [ ] Followed [Documentation Maintenance Guide](docs/developer-guide/documentation-maintenance.md)
- [ ] Updated README.md if changes affect getting started
- [ ] Updated CONTRIBUTING.md if changes affect contribution process

## Code Quality Checklist

<!-- Complete this section for code changes -->

- [ ] Code follows project style guidelines
- [ ] Self-reviewed my own code
- [ ] Commented code in hard-to-understand areas
- [ ] Made corresponding changes to documentation
- [ ] Changes generate no new warnings
- [ ] Added tests that prove fix is effective or feature works
- [ ] New and existing tests pass locally
- [ ] Any dependent changes have been merged and published

## Screenshots (if applicable)

<!-- Add screenshots to help reviewers understand your changes -->

## Additional Context

<!-- Add any other context about the PR here -->

## Reviewer Notes

<!-- Any specific areas you'd like reviewers to focus on? -->

---

## For Maintainers

<!-- This section is for maintainers only -->

### Pre-Merge Checklist

- [ ] PR title follows conventional commit format
- [ ] All CI checks pass
- [ ] Code has been reviewed and approved
- [ ] Documentation is complete and accurate
- [ ] Breaking changes are documented
- [ ] Version number updated (if applicable)
- [ ] Changelog updated (if applicable)

## Instructions for Each Section

### Description Section
- Write 2-4 paragraphs explaining the changes
- Start with high-level purpose, then key details
- Reference linked issues for context
- If existing body has useful content, incorporate it
- Be clear and concise

### Type of Change
Mark with [x] the types that apply based on diff analysis:
- Bug fix: Look for fixes to incorrect behavior
- New feature: Look for new capabilities or functionality
- Breaking change: Look for API changes, removed features, incompatible updates
- Documentation: Check if only .md files changed
- Configuration: Check for changes to config files, .json, .toml, .yml
- Code style: Look for formatting-only changes
- Refactoring: Look for structural changes without behavior change
- Performance: Look for optimization changes
- Test update: Check for changes only in test files
- Build/CI: Check for changes in workflows, build scripts, CI configs

**Important:** Mark ALL that apply, not just one

### Related Issues
- Link using "Fixes #<number>" for issues this PR closes
- Link using "Related to #<number>" for referenced issues
- Find issue numbers from commit messages and PR metadata
- If unsure, leave the template placeholder

### Changes Made
List 3-8 specific changes in bullet points:
- Focus on WHAT changed, not HOW
- Be specific: "Added X function to Y module" not "Updated code"
- Group related changes together
- Order from most significant to least

### Testing Performed
Check boxes based on evidence in diff:
- [ ] Ran `make lint`: If linting-related changes or new code
- [ ] Ran `make test`: If test files updated or new tests added
- [ ] Tested manually: If code changes affect behavior
- [ ] Added new tests: If new test files or test cases added
- [ ] Updated existing tests: If existing test files modified

**Be conservative:** Only check if clear evidence exists in diff

### Documentation Checklist
Check boxes only if documentation changes are present:
- Look for changes in docs/ directory
- Look for README.md updates
- Look for CONTRIBUTING.md updates
- Look for mkdocs.yml changes
- Look for new .md files
- Check if code examples were updated

**If no doc changes, leave all unchecked**

### Code Quality Checklist
Check based on the nature of changes:
- Code follows style: Check if changes appear consistent
- Self-reviewed: Always check (you are reviewing)
- Commented code: Check if comments added to complex areas
- Documentation changes: Check if docs were updated
- No new warnings: Check if changes are clean
- Added tests: Check if test files modified
- Tests pass: Check if test updates present
- Dependencies merged: Leave unchecked unless mentioned

### Screenshots
- Leave section empty with comment: "<!-- No screenshots required -->"
- Unless UI/visual changes are obvious (CSS, HTML, frontend files)

### Additional Context
- Add any important notes not covered above
- Mention if this is part of larger work
- Note any temporary workarounds
- Reference external resources if relevant
- Leave empty if nothing to add

### Reviewer Notes
- Point out complex areas that need careful review
- Mention any risky changes
- Request specific feedback if needed
- Leave empty if straightforward

## Analysis Guidelines

### Diff Analysis
- Read the aggregated diff carefully
- Look at file paths to understand scope
- Count additions/deletions for scale
- Identify patterns (all tests, all docs, mixed)
- Note languages and frameworks involved

### Existing Content Handling
- Read existing PR body first
- Incorporate useful context
- Don't preserve if it's just template placeholders
- **Primary source is always the diff**, existing content is secondary
- Rewrite if existing content is unclear or wrong

### Edge Cases

**Empty/New PR:**
- Generate description purely from diff analysis
- Check boxes conservatively
- Focus on changes made

**PR with Existing Description:**
- Read and understand existing content
- Use as context but regenerate using template
- Preserve factual information
- Improve clarity and completeness

**Large PR (50+ files):**
- Focus on high-level patterns
- Group changes by category
- Summarize rather than listing every file
- Highlight most significant changes

**No Linked Issues:**
- Generate description from diff alone
- Infer purpose from commit messages and changes
- Be thorough in Description section

**Multiple Linked Issues:**
- Synthesize context from all issues
- Link all relevant issues
- Explain how changes address multiple concerns

## What NOT to Do

❌ Do NOT analyze individual commits (only aggregated diff)
❌ Do NOT include status check information
❌ Do NOT create new template sections
❌ Do NOT remove template sections
❌ Do NOT use non-standard checkbox syntax
❌ Do NOT make assumptions about testing not evident in diff
❌ Do NOT speculate about future changes
❌ Do NOT include implementation details (focus on WHAT, not HOW)

## Output Format

Return ONLY the populated PR description in markdown format. The output should:
- Be valid markdown
- Follow template structure exactly
- Use proper checkbox syntax: [x] or [ ]
- Include all template sections
- Be complete and ready to use

Do not include explanations, notes, or meta-commentary. Output only the PR description.

---
