# C:\tac-response\setup-folders.ps1
# Creates required folder structure for TAC Emergency IRS Responder
# Adds .gitkeep to ensure empty directories are tracked by git
# Safe to run multiple times. Does not delete anything.

$ErrorActionPreference = "Stop"

$Root = "C:\tac-response"

# --- Folder list (add more here as the project grows) ---
$Dirs = @(
  "app",
  "app\notice",

  "components",
  "components\shell",
  "components\layout",
  "components\forms",
  "components\ui",

  "lib",
  "lib\constants",
  "lib\notices",
  "lib\format",       # only a folder; remove if you don't use it
  "lib\utils",        # only a folder; remove if you don't use it

  "__incoming",
  "__incoming\chunk-3",
  "__incoming\chunk-4",
  "__incoming\chunk-5"
)

function Ensure-Dir {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
  }
}

function Ensure-GitKeep {
  param([string]$DirPath)

  $keepPath = Join-Path $DirPath ".gitkeep"

  # If the dir is empty (no files, no subdirs), create .gitkeep
  $items = Get-ChildItem -LiteralPath $DirPath -Force -ErrorAction SilentlyContinue
  if (-not $items) {
    if (-not (Test-Path -LiteralPath $keepPath)) {
      New-Item -ItemType File -Path $keepPath | Out-Null
    }
    return
  }

  # If the dir contains only .gitkeep already, leave it.
  # If it contains any real files/subdirs, do not create .gitkeep.
}

Write-Host "== TAC folder bootstrap ==" -ForegroundColor Cyan
Write-Host "Root: $Root" -ForegroundColor Cyan

Ensure-Dir -Path $Root

foreach ($d in $Dirs) {
  $full = Join-Path $Root $d
  Ensure-Dir -Path $full
}

# Add .gitkeep ONLY to directories that are empty
foreach ($d in $Dirs) {
  $full = Join-Path $Root $d
  Ensure-GitKeep -DirPath $full
}

Write-Host ""
Write-Host "Done. Created/verified $($Dirs.Count) directories." -ForegroundColor Green
Write-Host "Empty directories were seeded with .gitkeep for git tracking." -ForegroundColor Green
