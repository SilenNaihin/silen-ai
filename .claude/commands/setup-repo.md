# Repository Setup

Initialize a new repository with proper structure and configuration.

## Context

This command runs AFTER planning is complete. You should already have:
- A clear understanding of the project requirements
- A plan for implementation (either in your context or written to a plan file)
- Knowledge of the tech stack and architecture

## Instructions

### 1. Create Core Structure

Based on the project type, create the appropriate directory structure:

**For any project:**
```
project-root/
├── .claude/
│   └── settings.local.json    # Claude Code permissions
├── CLAUDE.md                   # Agent instructions
├── SPRINT.md                   # Task tracking (see Sprint Setup below)
├── README.md                   # Project documentation
└── .gitignore                  # Standard ignores for stack
```

**Stack-specific additions:**
- **Next.js/React:** `src/`, `components/`, `app/`, `public/`
- **Python:** `src/`, `tests/`, `requirements.txt` or `pyproject.toml`
- **Node.js:** `src/`, `tests/`, `package.json`

### 2. Sprint Setup (SPRINT.md)

Create `SPRINT.md` to track all tasks and their completion state:

```markdown
# Sprint Backlog

## Current Sprint: [Sprint Name/Number]
Started: [Date]
Goal: [One-line sprint goal]

## In Progress
- [ ] **[TASK-001]** Task description
  - Assignee: Claude
  - Started: [Date]
  - Notes: Any blockers or context

## Backlog (Prioritized)
- [ ] **[TASK-002]** High priority task
- [ ] **[TASK-003]** Medium priority task
- [ ] **[TASK-004]** Lower priority task

## Completed This Sprint
- [x] **[TASK-000]** Initial setup
  - Completed: [Date]
  - PR/Commit: [reference]

## Blocked
<!-- Tasks waiting on external dependencies or decisions -->

## Sprint History
### Sprint 1 - [Date Range]
- Completed: 5 tasks
- Carried over: 2 tasks
- Notes: [retrospective notes]
```

**Task ID Convention:** Use `[TASK-XXX]` or `[FEATURE-XXX]`, `[BUG-XXX]`, `[CHORE-XXX]` prefixes.

### 3. CLAUDE.md Setup

Create project-specific agent instructions:

```markdown
# CLAUDE.md

## Project Overview
[Brief description of what this project does]

## Commands
[List common dev commands: build, test, lint, dev server]

## Architecture
[Key patterns, file organization, important decisions]

## Conventions
[Code style, naming conventions, commit format]

## Commit Rules

**IMPORTANT:** Before completing any task, you MUST run `/commit` to commit your changes.

- Only commit files YOU modified in this session — never commit unrelated changes
- Use atomic commits with descriptive messages
- If there are no changes to commit, skip this step
- Do not push unless explicitly asked
```

### 4. Git Initialization

```bash
git init
git add .
git commit -m "chore: initial project setup

- Add project structure
- Add CLAUDE.md agent instructions
- Add SPRINT.md task tracking
- Configure .gitignore

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### 5. Verification Checklist

Before completing setup, verify:

- [ ] Directory structure matches project type
- [ ] CLAUDE.md has accurate commands and architecture
- [ ] SPRINT.md has all planned tasks from the implementation plan
- [ ] .gitignore covers the tech stack
- [ ] .claude/settings.local.json has necessary permissions
- [ ] Git repo initialized with clean initial commit

## Output

After setup, provide the user with:
1. Summary of created structure
2. Key files to review/customize
3. Next steps for development
4. Any decisions that need user input before proceeding
