# Git Commands — Greater Than Website

A quick reference for saving and syncing your project with GitHub.

---

## Everyday Commands

| Command | Description |
|---|---|
| `git status` | Show which files have been changed since the last save |
| `git add index.html` | Stage a specific file ready to be committed |
| `git add .` | Stage ALL changed files at once |
| `git commit -m "your message"` | Save a snapshot of your staged changes with a description |
| `git push` | Upload your committed changes to GitHub |

---

## The Standard Workflow (do these in order)

```bash
# 1. Check what has changed
git status

# 2. Stage the files you want to save
git add index.html

# 3. Commit with a short description of what you did
git commit -m "fix: updated hero slideshow images"

# 4. Push to GitHub
git push
```

---

## Viewing History

| Command | Description |
|---|---|
| `git log --oneline` | Show a compact list of all past commits |
| `git diff` | Show exactly what lines changed before staging |

---

## Undoing Things

| Command | Description |
|---|---|
| `git restore index.html` | Discard unsaved changes to a file (cannot be undone) |
| `git reset HEAD~1` | Undo the last commit but keep the file changes |

---

## Commit Message Conventions

Use a short prefix to describe the type of change:

| Prefix | Use for |
|---|---|
| `feat:` | Adding something new (e.g. a new page or section) |
| `fix:` | Fixing a bug or correcting something |
| `style:` | Visual/design changes only |
| `content:` | Text or image updates |
| `chore:` | Housekeeping (renaming files, deleting unused code) |

**Example:** `git commit -m "feat: added contact form to homepage"`

---

## Your GitHub Repository

https://github.com/BabaRezi/GreaterThanWebsite
