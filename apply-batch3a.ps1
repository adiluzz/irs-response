$ErrorActionPreference = "Stop"

$root = "C:\tac-response"
$payload = Join-Path $root "PHASE2_PAYLOAD.TXT"

if (!(Test-Path $payload)) {
  throw "PHASE2_PAYLOAD.TXT not found in C:\tac-response"
}

Write-Host "Reading payload..."

$lines = Get-Content $payload

$files = @()
$currentPath = $null
$currentContent = @()

foreach ($line in $lines) {

  # Detect file header lines
  if ($line -like "*FILE:*") {

    # Save previous file
    if ($currentPath) {
      $files += [PSCustomObject]@{
        Path = $currentPath
        Content = ($currentContent -join "`r`n")
      }
    }

    # Extract path after FILE:
    $pathPart = $line.Substring($line.IndexOf("FILE:") + 5).Trim()
    $pathPart = $pathPart.Trim("=", " ")

    # Normalize
    $pathPart = $pathPart.TrimStart("/")
    $currentPath = $pathPart
    $currentContent = @()

    Write-Host "Found file: $currentPath"
    continue
  }

  if ($currentPath) {
    $currentContent += $line
  }
}

# Save last file
if ($currentPath) {
  $files += [PSCustomObject]@{
    Path = $currentPath
    Content = ($currentContent -join "`r`n")
  }
}

if ($files.Count -eq 0) {
  throw "No files parsed from payload."
}

Write-Host "Writing $($files.Count) files..."

foreach ($f in $files) {
  $dest = Join-Path $root $f.Path
  $dir = Split-Path $dest -Parent

  if (!(Test-Path $dir)) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
  }

  Set-Content -Path $dest -Value $f.Content -Encoding UTF8
  Write-Host "Wrote: $dest"
}

Write-Host ""
Write-Host "Batch 2 applied."
Write-Host "Next: npm run build"
