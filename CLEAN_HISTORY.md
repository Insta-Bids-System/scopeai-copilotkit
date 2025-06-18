# Clean Git History Script

## Issue
GitHub is blocking push due to exposed API keys in:
- ISSUE_RESOLUTION.md
- public/test-openai.html

## Solution
We need to remove these files from history or clean them.

## Option 1: Start Fresh (Recommended)
Since the remote has a different structure anyway, we should:
1. Create a new branch
2. Copy only the needed files
3. Push as a new clean branch

## Option 2: Clean History
Use BFG Repo-Cleaner or git-filter-branch to remove sensitive data.

## Immediate Fix
Let's remove sensitive files and create a clean commit.
