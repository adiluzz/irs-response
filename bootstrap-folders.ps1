# C:\tac-response\bootstrap-folders.ps1
# Bootstraps full folder structure for TAC Emergency IRS Responder
# Safe, idempotent, git-friendly

$ErrorActionPreference = "Stop"
$Root = "C:\tac-response"

$Dirs = @(
  # App Router
  "app",
  "app\notice",

  # Components
  "components",
  "components\shell",
  "components\layout",
  "components\forms",
  "components\ui",

  # Logic
  "lib",
  "lib\constants",
  "lib\notices",
  "lib\format",
  "lib\utils",

  # Working / staging
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
  $items = Get-ChildItem -LiteralPath $DirPath -Force -ErrorAction SilentlyContinue
  if (-not $items) {
    $keep = Join-Path $DirPath ".gitkeep"
    if (-not (Test-Path $keep)) {
      New-Item -ItemType File -Path $keep | Out-Null
    }
  }
}

Write-Host "== Bootstrapping TAC folders ==" -ForegroundColor Cyan
Write-Host "Root: $Root" -ForegroundColor Cyan

Ensure-Dir -Path $Root

foreach ($d in $Dirs) {
  $full = Join-Path $Root $d
  Ensure-Dir -Path $full
}

foreach ($d in $Dirs) {
  $full = Join-Path $Root $d
  Ensure-GitKeep -DirPath $full
}

Write-Host ""
Write-Host "All folders created and verified." -ForegroundColor Green
Write-Host "Empty folders seeded with .gitkeep." -ForegroundColor Green
