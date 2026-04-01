# Peri Peri Bites - Git Version Control Guide

## Overview
This README focuses on Git version control best practices for the Peri Peri Bites project. It is intended for developers who are collaborating on the frontend/backend codebase via Git.

## Initial Setup
1. Install Git: https://git-scm.com/downloads
2. Configure user information:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
   ```
3. Clone existing repository:
   ```bash
   git clone <repository-url>
   cd "Peri Peri Bites"
   ```

## Branching Strategy
- `main` (or `master`): production-ready stable code.
- `develop`: integration branch for features and fix previews.
- feature branches: `feature/<description>`
- bugfix branches: `bugfix/<description>`
- hotfix branches: `hotfix/<description>`

### Create a new branch
```bash
git checkout -b feature/login-form
```

## Standard Workflow
1. Update local main:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Create and checkout feature branch.
3. Make code changes.
4. Stage files:
   ```bash
   git add .
   ```
5. Commit changes:
   ```bash
   git commit -m "Add login API integration and user dispatch"
   ```
6. Push branch:
   ```bash
   git push -u origin feature/login-form
   ```

## Pull Request / Merge Request
- Open PR/MR from feature branch to `develop` or `main` based on workflow.
- Include:
  - Summary
  - Testing steps
  - Related issue/ticket
- Request code review from team.

## Conflicts
- If merge conflict:
  ```bash
  git pull origin main
  # resolve conflicts manually 
  git add <file>
  git commit -m "Resolve merge conflict"
  ```

## Gitignore
- Ensure `.gitignore` has standard exclusions:
  - `node_modules/`
  - `dist/` or `build/`
  - `.env`
  - `.DS_Store`
  - `*.log`

## Commit Message Convention
- Format: `<type>(<scope>): <short summary>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Example:
  ```bash
  git commit -m "feat(auth): add JWT-based login response"
  ```

## Keeping Local Branch Up to Date
```bash
git fetch origin
git checkout feature/login-form
git rebase origin/develop
# or merge
# git merge origin/develop
```

## Revert a Commit (if needed)
- soft reset:
  ```bash
  git reset --soft HEAD~1
  ```
- revert commit:
  ```bash
  git revert <commit-hash>
  ```

## Tagging Releases
```bash
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0
```

## Additional Notes
- Commit frequently with meaningful messages.
- Keep branches small and focused.
- Run tests and lint before PR.
- Keep `.env` off Git and provide `.env.example`.
