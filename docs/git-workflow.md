# Recruit Connect Git Workflow

## Golden Rule
### Nobody Commits to directly to main. EVER.
All work happens on a branch and gets merged through a pull request. This protects everyone from broken code affecting the whole team.

## Key Concepts
### Repository(repo) 
the project folder that git is tracking
### Branch 
a separate copy of the code wher you can make changes safely without affecting everyone else. like a personal draft.
### Commit
saving a snapshot of your changes with a message describing what you did
### Push
uploading your commits to GitHub so others can see them
### Pull
downloading the latest changes from GitHub to your machine.
### Pull Request(PR)
asking to merge your branch into another branch. This is where teammates review your code before it goes in.

## Our Branches
| Branch | Purpose |
| :---:  | :---: |
| main | Always working, always deployable, never touch directly |
| dev | Where all features get merged first. Branch off this |
| feature/... | Your personal branch for a feature you are building |

## Branch Naming

Format: `type/short-description`
| Prefix | When to use |
| :---:  | :---: |
| feature/ | Building something new |
| fix/ | Fixing a bug |
| chore/ | Setup, config, dependencies |
| docs/ | README, documentation |

### Rules:
 - All lowercase
 - Hyphens between words, no spaces or underscores
 - Short and descriptive
 - One feature per branch

### Examples
```
feature/athlete-profile
feature/coach-search
feature/auth
feature/messaging
fix/login-redirect
chore/docker-setup
docs/readme
```

## First Time Setup
Do this once when you first join the project

### 1. Make sure Git is installed
```
git --version
```
### 2. Clone the repo
This downloads the project to your computer:
```bash
git clone https://github.com/CS-476-sportslink/sportslink
cd sportslink
```

### 4, Confirm you can see the Branches
```bash
git branch -a
```
you should see `main` and `dev`

## Every Day Workflow — Step by Step

Follow these steps every time you start working on something new.

---

### Step 1 — Switch to dev and get the latest code

Before you start, always make sure you have the most up to date version of `dev`:

```bash
git checkout dev
git pull origin dev
```

`checkout dev` — switches you to the dev branch
`pull origin dev` — downloads any new changes your teammates pushed

---

### Step 2 — Create your branch

Create a new branch off dev for the feature you are working on:

```bash
git checkout -b feature/your-feature-name
```

Replace `your-feature-name` with something descriptive like `athlete-profile` or `google-oauth`.

You are now on your own branch. Changes you make here do not affect anyone else.

Confirm which branch you are on:
```bash
git branch
```

The branch with a `*` next to it is your current branch.

---

### Step 3 — Write your code

Open the project in your editor and make your changes. Work normally.

---

### Step 4 — Check what files you changed

Before saving, see what you have changed:
```bash
git status
```

This shows you which files have been modified (shown in red) and which are staged to be committed (shown in green).

---

### Step 5 — Stage your changes

Tell Git which files you want to include in your save:
```bash
git add .
```

The `.` means add everything. If you only want to add one file:
```bash
git add filename.py
```

Run `git status` again and your files should now be green.

---

### Step 6 — Commit your changes

Save a snapshot with a message describing what you did:
```bash
git commit -m "add athlete profile model"
```

Write your message in present tense, short and descriptive.

**Good commit messages:**
```
add athlete profile page
fix coach search filter not working
add Google OAuth login button
update README with setup instructions
```

**Bad commit messages:**
```
update
fix stuff
changes
asdfgh
wip
```

Commit often — every time you finish a small piece of work. Small commits are easier to review and easier to undo.

---

### Step 7 — Push your branch to GitHub

Upload your branch so the team can see it:
```bash
git push origin feature/your-feature-name
```

Use the same branch name you created in Step 2.

The first time you push a new branch you might see a longer message — that is normal, just copy the suggested command if it gives you one.

---

### Step 8 — Open a Pull Request on GitHub

1. Go to `github.com/recruit-connect/recruit-connect`
2. You will see a yellow banner saying your branch was recently pushed — click **Compare & pull request**
3. Make sure the base branch is set to `dev` (not `main`)
4. Write a short title and description of what you built
5. Assign a teammate to review it
6. Click **Create pull request**

---

### Step 9 — Wait for review

Your teammate will look at your code and either:
- **Approve it** — then you or they can merge it into `dev`
- **Request changes** — make the changes, commit and push again, the PR updates automatically

---

### Step 10 — After your PR is merged, delete your branch

Clean up your local branch:
```bash
git checkout dev
git pull origin dev
git branch -d feature/your-feature-name
```

Then start back at Step 1 for your next task.

---
## Staying Up To Date While You Work

If teammates merge things into `dev` while you are working on your branch, bring those changes into your branch so you stay in sync:

```bash
git fetch origin
git merge origin/dev
```

Do this every day or two to avoid large conflicts later.

---

## Merge Conflicts

A merge conflict happens when two people edited the same part of the same file. Git does not know which version to keep so it asks you to decide.

It looks like this in the file:
```
<<<<<<< your-branch
your version of the code
=======
teammate's version of the code
>>>>>>> dev
```

To fix it:
1. Open the file in your editor
2. Decide which version to keep (or combine them)
3. Delete the `<<<<<<<`, `=======`, and `>>>>>>>` lines
4. Save the file
5. Run `git add .` and `git commit -m "resolve merge conflict"`

If you are unsure, ask a teammate before deciding which version to keep.

---

## If You Break Something

Don't panic. Tell the team in the group chat immediately. Don't try to quietly fix it.

Undo your last commit but keep your changes:
```bash
git reset --soft HEAD~1
```

Undo your last commit and throw away the changes entirely:
```bash
git reset --hard HEAD~1
```

---

## Merging to Main

Only Our chosen code reviewer merges `dev` into `main`. This happens when:
- A set of features are complete and tested
- Everyone has pulled the latest dev and confirmed it works
- We are ready to deploy to the VPS

`main` should always be in a state that could be shown to someone.

---

## Quick Reference Card

```bash
# First time setup
git clone https://github.com/recruit-connect/recruit-connect.git
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Start new work (do this every time)
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name

# Save your work (do this often)
git status
git add .
git commit -m "describe what you did"
git push origin feature/your-feature-name

# Stay in sync with teammates
git fetch origin
git merge origin/dev

# After your PR is merged
git checkout dev
git pull origin dev
git branch -d feature/your-feature-name
```

---

## Need Help?

Ask anything in the group chat. Git is confusing at first so if oyu don't know for sure ask and you'll learn it quick.


