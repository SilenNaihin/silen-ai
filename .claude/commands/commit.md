# Atomic Git Commit

Create an atomic git commit for the changes made in this session.

## Instructions

1. **First, run `git status`** to see all changes (staged, unstaged, and untracked files).

2. **Identify only the files you touched** in this session. Do not commit files modified by other agents or processes.

3. **For tracked files (modified):**
   ```bash
   git commit -m "<scoped message>" -- path/to/file1 path/to/file2
   ```

4. **For brand-new (untracked) files:**
   ```bash
   git restore --staged :/ && git add "path/to/file1" "path/to/file2" && git commit -m "<scoped message>" -- path/to/file1 path/to/file2
   ```

5. **Quote paths with special characters:** Any path containing brackets `[]`, parentheses `()`, or other shell metacharacters must be quoted:
   ```bash
   git add "src/app/[candidate]/page.tsx"
   git commit -m "message" -- "src/app/[slug]/page.tsx"
   ```

## Commit Message Format

- Use a scoped, descriptive message (e.g., `feat(auth): add login form`, `fix(api): handle null response`)
- Keep the first line under 72 characters
- End with: `Co-Authored-By: Claude <noreply@anthropic.com>`

## Safety Rules - CRITICAL

**NEVER run these commands unless the user explicitly requests them in writing:**
- `git reset --hard`
- `git checkout <older-commit>`
- `git restore` to revert files you didn't author
- `rm` on tracked files
- Any destructive operation that could lose work

**If unsure, STOP and ask the user before proceeding.**

## Workflow

1. Run `git status` - review what changed
2. Run `git diff --staged` and `git diff` - understand the changes
3. Identify files from your session only
4. Compose a clear commit message
5. Execute the appropriate commit command
6. Run `git status` again to verify success
