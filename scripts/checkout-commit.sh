#!/bin/bash
# Bash helper to move the repo to a specific commit.
# Usage:
#   bash scripts/checkout-commit.sh                 # uses default hash
#   bash scripts/checkout-commit.sh <commit>        # use a different commit
#   bash scripts/checkout-commit.sh <commit> -b name  # create branch at commit

COMMIT=${1:-3c5f5e82b18097d3dd36edf3ff3969a67546185f}
CREATE_BRANCH=0
BRANCH_NAME=restore-commit

if [ "$2" = "-b" ] || [ "$2" = "--branch" ]; then
  CREATE_BRANCH=1
  BRANCH_NAME=${3:-$BRANCH_NAME}
fi

echo "Fetching..."
git fetch --all

echo "Reset hard to $COMMIT (will discard local changes)..."
git reset --hard "$COMMIT"

echo "Clean untracked files..."
git clean -fd

echo "Checkout $COMMIT (detached HEAD)..."
git checkout "$COMMIT"

if [ "$CREATE_BRANCH" -eq 1 ]; then
  echo "Creating branch $BRANCH_NAME at $COMMIT"
  git branch -f "$BRANCH_NAME" "$COMMIT"
  git checkout "$BRANCH_NAME"
fi

echo "Current HEAD: $(git rev-parse --short HEAD)"

# If you need to auto-answer prompts to other commands, use `yes` utility:
#   yes | some-command
# Note: `yes` sends an infinite stream of 'y' characters; use with care.
