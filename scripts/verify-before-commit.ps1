param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("PreStage", "Staged")]
    [string]$Phase
)

$ErrorActionPreference = "Stop"

function Fail {
    param([string]$Message)
    Write-Error $Message
    exit 1
}

function Invoke-Checked {
    param(
        [string]$Label,
        [string]$Command,
        [string[]]$Arguments,
        [string]$WorkingDirectory
    )

    Write-Host "==> $Label"
    Push-Location $WorkingDirectory
    try {
        & $Command @Arguments
        if ($LASTEXITCODE -ne 0) {
            Fail "$Label failed with exit code $LASTEXITCODE."
        }
    }
    finally {
        Pop-Location
    }
}

function Get-ExistingCommand {
    param(
        [string]$PreferredPath,
        [string]$FallbackCommand
    )

    if ($PreferredPath -and (Test-Path -LiteralPath $PreferredPath)) {
        return $PreferredPath
    }

    return $FallbackCommand
}

function Get-RepoRoot {
    $root = (& git rev-parse --show-toplevel 2>$null)
    if ($LASTEXITCODE -ne 0 -or -not $root) {
        Fail "Run this script inside the kakao-assignment-3 Git worktree."
    }
    return $root.Trim()
}

function Test-MarkdownLinks {
    param(
        [string]$Root,
        [string[]]$Files
    )

    foreach ($relativePath in $Files | Where-Object { $_ -match "\.md$" }) {
        $fullPath = Join-Path $Root $relativePath
        if (-not (Test-Path -LiteralPath $fullPath)) {
            continue
        }

        $content = Get-Content -Raw -Encoding UTF8 -LiteralPath $fullPath
        $matches = [regex]::Matches($content, '\]\((?!https?://|#|mailto:)([^)#]+\.md)(?:#[^)]+)?\)')
        foreach ($match in $matches) {
            $target = Join-Path (Split-Path -Parent $fullPath) $match.Groups[1].Value
            if (-not (Test-Path -LiteralPath $target)) {
                Fail "Broken Markdown link in '$relativePath': '$($match.Groups[1].Value)'."
            }
        }

        if ($content -match '(?m)^(<<<<<<<|=======|>>>>>>>)') {
            Fail "Merge conflict marker found in '$relativePath'."
        }
    }
}

function Test-RequiredStructure {
    param([string]$Root)

    $required = @(
        "AGENTS.md",
        "docs/ARCHITECTURE.md",
        "docs/API.md",
        "docs/BACKEND.md",
        "docs/FRONTEND.md",
        "docs/HARNESS_LOGGING.md",
        "docs/PLANNING.md",
        "docs/PRE_COMMIT_VALIDATION.md",
        "docs/TESTING.md",
        "plans/TEMPLATE.md",
        "logs/TEMPLATE.md"
    )

    foreach ($path in $required) {
        if (-not (Test-Path -LiteralPath (Join-Path $Root $path))) {
            Fail "Required project document is missing: '$path'."
        }
    }
}

function Get-ChangedFiles {
    param(
        [string]$Root,
        [bool]$Cached
    )

    Push-Location $Root
    try {
        if ($Cached) {
            $files = @(& git diff --cached --name-only --diff-filter=ACMR)
        }
        else {
            $tracked = @(& git diff --name-only --diff-filter=ACMR)
            $untracked = @(& git ls-files --others --exclude-standard)
            $files = @($tracked + $untracked)
        }

        if ($LASTEXITCODE -ne 0) {
            Fail "Unable to determine changed files."
        }

        return @($files | Where-Object { $_ } | Sort-Object -Unique)
    }
    finally {
        Pop-Location
    }
}

function Test-StagedSecrets {
    param([string]$Root)

    Push-Location $Root
    try {
        $forbiddenFiles = @(& git diff --cached --name-only --diff-filter=ACMR) |
            Where-Object {
                $_ -match '(^|/)\.env($|\.)' -and $_ -notmatch '\.env\.example$' -or
                $_ -match '\.(db|sqlite|sqlite3|pem|key|p12|pfx)$' -or
                $_ -match '(^|/)(node_modules|dist|build|\.next|\.venv|__pycache__)/'
            }

        if ($forbiddenFiles) {
            Fail "Forbidden generated, environment, database, or key file is staged: $($forbiddenFiles -join ', ')."
        }

        $addedLines = @(& git diff --cached --unified=0 --no-color) |
            Where-Object { $_ -match '^\+[^+]' }
        $secretPatterns = @(
            '-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----',
            '(?i)(api[_-]?key|access[_-]?token|secret|password)\s*[:=]\s*["''][^"'']{8,}["'']'
        )

        foreach ($pattern in $secretPatterns) {
            if ($addedLines -match $pattern) {
                Fail "Potential secret detected in staged additions. Review the staged diff; the value is intentionally not printed."
            }
        }
    }
    finally {
        Pop-Location
    }
}

$repoRoot = Get-RepoRoot
$branch = (& git -C $repoRoot branch --show-current).Trim()
if ($branch -ne "week03-eojin") {
    Fail "Current branch must be 'week03-eojin'; found '$branch'."
}

if ($Phase -eq "PreStage") {
    $files = Get-ChangedFiles -Root $repoRoot -Cached $false
    if (-not $files) {
        Fail "No changed files found."
    }

    Test-RequiredStructure -Root $repoRoot
    Test-MarkdownLinks -Root $repoRoot -Files $files

    $frontendChanged = [bool]($files | Where-Object { $_ -like "frontend/*" })
    $backendChanged = [bool]($files | Where-Object { $_ -like "backend/*" })
    $contractChanged = [bool]($files | Where-Object { $_ -in @("docs/API.md", "docs/ARCHITECTURE.md") })

    if ($contractChanged) {
        $frontendChanged = $true
        $backendChanged = $true
    }

    if ($frontendChanged) {
        $frontend = Join-Path $repoRoot "frontend"
        if (-not (Test-Path -LiteralPath (Join-Path $frontend "package.json"))) {
            Fail "Frontend changes require a configured frontend/package.json."
        }
        Invoke-Checked "Frontend lint" "npm.cmd" @("run", "lint") $frontend
        Invoke-Checked "Frontend format check" "npm.cmd" @("run", "format:check") $frontend
        Invoke-Checked "Frontend typecheck" "npm.cmd" @("run", "typecheck") $frontend
        Invoke-Checked "Frontend production build" "npm.cmd" @("run", "build") $frontend
    }

    if ($backendChanged) {
        $backend = Join-Path $repoRoot "backend"
        if (-not (Test-Path -LiteralPath (Join-Path $backend "requirements.txt"))) {
            Fail "Backend changes require a configured backend/requirements.txt."
        }
        $venvScripts = Join-Path $backend ".venv\Scripts"
        $pythonCommand = Get-ExistingCommand (Join-Path $venvScripts "python.exe") "python"

        Invoke-Checked "Backend Ruff" $pythonCommand @("-m", "ruff", "check", ".") $backend
        Invoke-Checked "Backend pytest" $pythonCommand @("-m", "pytest") $backend
    }

    Write-Host "PreStage verification passed."
    exit 0
}

$stagedFiles = Get-ChangedFiles -Root $repoRoot -Cached $true
if (-not $stagedFiles) {
    Fail "No staged files found."
}

Invoke-Checked "Staged diff whitespace check" "git" @("diff", "--cached", "--check") $repoRoot
Test-RequiredStructure -Root $repoRoot
Test-MarkdownLinks -Root $repoRoot -Files $stagedFiles
Test-StagedSecrets -Root $repoRoot

$stagedPlans = @($stagedFiles | Where-Object { $_ -match '^plans/(\d{3})-(.+)\.md$' -and $_ -ne "plans/TEMPLATE.md" })
$stagedLogs = @($stagedFiles | Where-Object { $_ -match '^logs/(\d{3})-(.+)\.md$' -and $_ -ne "logs/TEMPLATE.md" })

if ($stagedPlans.Count -ne 1 -or $stagedLogs.Count -ne 1) {
    Fail "Exactly one numbered Plan and one matching harness log must be staged."
}

$planMatch = [regex]::Match($stagedPlans[0], '^plans/(\d{3})-(.+)\.md$')
$logMatch = [regex]::Match($stagedLogs[0], '^logs/(\d{3})-(.+)\.md$')
if ($planMatch.Groups[1].Value -ne $logMatch.Groups[1].Value -or
    $planMatch.Groups[2].Value -ne $logMatch.Groups[2].Value) {
    Fail "Staged Plan and harness log numbers or titles do not match."
}

$planContent = Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $repoRoot $stagedPlans[0])
$logContent = Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $repoRoot $stagedLogs[0])
if ($planContent -notmatch '(?m)^- .+: `Completed`$' -or $logContent -notmatch '(?m)^- .+: `Completed`$') {
    Fail "Staged Plan and harness log must both be Completed."
}

Write-Host "Staged verification passed."
exit 0
