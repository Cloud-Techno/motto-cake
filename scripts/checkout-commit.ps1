<#
PowerShell helper to move the repo to a specific commit.
Usage examples:
  .\scripts\checkout-commit.ps1                   # uses default hash
  .\scripts\checkout-commit.ps1 -Commit <hash>    # use a different commit
  .\scripts\checkout-commit.ps1 -Commit <hash> -CreateBranch -BranchName my-branch

# This script uses forcey operations (`git reset --hard`, `git clean -fd`) so
# it will discard local changes without prompting. For commands that might
# prompt, it also offers `Invoke-WithYes` which pipes several "y" answers.
# Run this script from the repository root.
#>

param(
    [string]$Commit = '3c5f5e82b18097d3dd36edf3ff3969a67546185f',
    [switch]$CreateBranch,
    [string]$BranchName = 'restore-commit'
)

function Invoke-WithYes {
    param([string]$Cmd)
    Write-Host "Running (with automatic 'y' answers): $Cmd"
    # Pipe three 'y' responses (covers common interactive prompts)
    cmd.exe /c "(echo y & echo y & echo y) | $Cmd"
}

Write-Host "Fetching all remotes..."
git fetch --all

Write-Host "Resetting working tree (hard) to $Commit (this discards local changes)..."
git reset --hard $Commit

Write-Host "Removing untracked files and directories..."
git clean -fd

Write-Host "Checking out commit $Commit (detached HEAD)..."
git checkout $Commit

if ($CreateBranch) {
    Write-Host "Creating and switching to branch '$BranchName' at $Commit..."
    # if branch exists, use force create
    git branch -f $BranchName $Commit
    git checkout $BranchName
}

Write-Host "Done. Current HEAD:"
git rev-parse --short HEAD

Write-Host "If you expected interactive prompts for some git commands, you can
re-run those specific commands with Invoke-WithYes 'git ...' in this script.
Example: Invoke-WithYes 'git some-interactive-command'"