# apply-batch3e.ps1
$ErrorActionPreference = "Stop"

$root = "C:\tac-response"
$payload = Join-Path $root "PHASE3E_PAYLOAD.TXT"

if (!(Test-Path $payload)) { throw "PHASE3E_PAYLOAD.TXT not found in C:\tac-response" }

Write-Host "Using payload: $payload"

$lines = Get-Content -LiteralPath $payload
$files = @()
$currentPath = $null
$currentContent = @()

foreach ($line in $lines) {
  if ($line -like "*FILE:*") {
    if ($currentPath) {
      $files += [PSCustomObject]@{ Path = $currentPath; Content = ($currentContent -join "`r`n") }
    }
    $pathPart = $line.Substring($line.IndexOf("FILE:") + 5).Trim()
    $pathPart = $pathPart.Trim("=", " ").TrimStart("/")
    $currentPath = $pathPart
    $currentContent = @()
    Write-Host "Found file: $currentPath"
    continue
  }
  if ($currentPath) { $currentContent += $line }
}

if ($currentPath) {
  $files += [PSCustomObject]@{ Path = $currentPath; Content = ($currentContent -join "`r`n") }
}

if ($files.Count -eq 0) { throw "No files parsed from PHASE3E payload." }

Write-Host "Writing $($files.Count) files..."
foreach ($f in $files) {
  $dest = Join-Path $root $f.Path
  $dir = Split-Path $dest -Parent
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  Set-Content -Path $dest -Value $f.Content -Encoding UTF8
  Write-Host "Wrote: $dest"
}

Write-Host "`nBatch 3E applied. Next: npm run build"
