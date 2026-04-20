# ================================================================
# SysGeS-PAT — Script de redesign complet
# Lance depuis : C:\Users\PC\Downloads\sysges-pat1
# ================================================================
Write-Host "`n=== SysGeS-PAT Redesign Institutionnel Beninois ===" -ForegroundColor Green

$files = @(
  @{ src="tailwind.config.js";         dst="tailwind.config.js" },
  @{ src="styles\globals.css";         dst="styles\globals.css" },
  @{ src="components\Sidebar.js";      dst="components\Sidebar.js" },
  @{ src="components\Navbar.js";       dst="components\Navbar.js" },
  @{ src="components\Layout.js";       dst="components\Layout.js" },
  @{ src="components\StatCard.js";     dst="components\StatCard.js" },
  @{ src="pages\_app.js";             dst="pages\_app.js" },
  @{ src="pages\login.js";            dst="pages\login.js" },
  @{ src="pages\404.js";              dst="pages\404.js" }
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = $PSScriptRoot

Write-Host "`nCopie des fichiers redesignes..." -ForegroundColor Yellow
foreach ($f in $files) {
  $srcPath = Join-Path $scriptDir $f.src
  $dstPath = Join-Path $projectDir $f.dst
  if (Test-Path $srcPath) {
    Copy-Item -Path $srcPath -Destination $dstPath -Force
    Write-Host "   OK $($f.dst)" -ForegroundColor Green
  } else {
    Write-Host "   MANQUANT $($f.src)" -ForegroundColor Red
  }
}

Write-Host "`nCommit et push..." -ForegroundColor Yellow
git add tailwind.config.js styles/globals.css components/Sidebar.js components/Navbar.js components/Layout.js components/StatCard.js pages/_app.js pages/login.js pages/404.js
git status --short
git commit -m "redesign: theme institutionnel beninois vert et or"
git push

Write-Host "`n=== REDESIGN POUSSE ===" -ForegroundColor Green
Write-Host "Vercel va builder en 3-5 minutes." -ForegroundColor White
