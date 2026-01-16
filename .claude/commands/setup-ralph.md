# Ralph Setup

Set up Ralph autonomous development for a project.

## Context

This command sets up Ralph for autonomous development. You should already have:
- A project with basic structure (use `/setup-repo` first if needed)
- A clear understanding of the project requirements
- A plan for implementation (either in your context or written to a plan file)

## Instructions

### 1. Ralph File Structure

Create the Ralph-specific files:

```
project-root/
├── PROMPT.md           # Ralph's development instructions
├── @fix_plan.md        # Prioritized task list
├── specs/
│   └── requirements.md # Technical specifications
└── progress.txt        # Progress tracking
```

### 2. Import Existing Plan to Ralph Format

If you have an existing plan:
```bash
ralph-import [plan-file.md] [project-name]
cd [project-name]
```

This creates:
- `PROMPT.md` - Ralph's development instructions
- `@fix_plan.md` - Prioritized task list
- `specs/requirements.md` - Technical specifications

### 3. Configure PROMPT.md

Create or customize `PROMPT.md` with:
- Clear agent instructions ("You are the agent. Do the work.")
- Exit conditions
- Testing thresholds (default: 20% of effort)
- Commit behavior
- Documentation requirements

**IMPORTANT:** Make instructions direct. Claude can confuse itself into thinking it's advising *about* Ralph rather than *being* the agent.

### 4. Configure progress.txt

Set up progress tracking. **IMPORTANT:** Ralph exits early when it detects keywords like "done", "complete", or "finished". Use status terms like `PASSED`/`PENDING` instead to avoid premature exits.

### 5. Ralph File Mapping

| Ralph File | Purpose | Sync With |
|------------|---------|-----------|
| `PROMPT.md` | Agent instructions per loop | CLAUDE.md |
| `@fix_plan.md` | Current task queue | SPRINT.md "In Progress" + "Backlog" |
| `@AGENT.md` | Build/test commands | CLAUDE.md "Commands" |
| `specs/*.md` | Requirements | Original plan/PRD |

### 6. Start Autonomous Development

```bash
ralph --monitor
```

## Ralph Quick Reference

**Global commands (after `./install.sh` in ralph-claude-code):**
```bash
ralph --monitor          # Start autonomous loop with dashboard
ralph --status           # Check current loop status
ralph --reset-circuit    # Reset circuit breaker if stuck
ralph-setup [name]       # Create new Ralph project from scratch
ralph-import [prd] [name] # Convert PRD/plan to Ralph format
ralph-monitor            # Manual monitoring dashboard
```

**Ralph status signals in PROMPT.md:**
```
---RALPH_STATUS---
STATUS: IN_PROGRESS | COMPLETE | BLOCKED
EXIT_SIGNAL: false | true
RECOMMENDATION: [next action]
---END_RALPH_STATUS---
```

**Key tip:** Keep an accompanying chat open to guide Ralph and check on progress. Ralph runs in the background; you steer from the side. When starting Ralph, tell your monitoring chat: "Sleep for 30 seconds, then check if Ralph is executing correctly. Repeat 3 times." This catches early issues before you walk away.

**When to use Ralph:**
- Multi-step implementation tasks
- Greenfield projects where a lot needs to get done
- Feature development requiring iteration
- Tasks that benefit from autonomous progress tracking

**When NOT to use Ralph:**
- Quick fixes or single-file changes
- Exploration/research tasks
- Tasks requiring constant human decision-making
- Most things (Ralph is more pain than it's worth for almost everything)

## Output

After setup, provide the user with:
1. Summary of created Ralph files
2. Key files to review/customize
3. How to start the loop (`ralph --monitor`)
4. Any decisions that need user input before proceeding
