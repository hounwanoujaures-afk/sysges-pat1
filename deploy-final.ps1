# ================================================================
# SysGeS-PAT — Deploy FINAL complet
# Place ce script dans C:\Users\PC\Downloads\sysges-pat1\
# ================================================================
Write-Host "`n=== SysGeS-PAT v2 Deploy Final ===" -ForegroundColor Green

$dir  = $PSScriptRoot
$proj = $dir

$copies = @(
  @{ src="globals.css";        dst="styles\globals.css" },
  @{ src="tailwind.config.js"; dst="tailwind.config.js" },
  @{ src="Sidebar.js";         dst="components\Sidebar.js" },
  @{ src="Navbar.js";          dst="components\Navbar.js" },
  @{ src="Layout.js";          dst="components\Layout.js" },
  @{ src="StatCard.js";        dst="components\StatCard.js" },
  @{ src="_app.js";            dst="pages\_app.js" },
  @{ src="login.js";           dst="pages\login.js" },
  @{ src="404.js";             dst="pages\404.js" },
  @{ src="collecte.js";        dst="pages\collecte.js" },
  @{ src="dashboard.js";       dst="pages\dashboard.js" },
  @{ src="analytics.js";       dst="pages\analytics.js" },
  @{ src="parametres.js";      dst="pages\parametres.js" }
)

Write-Host "`nCopie des fichiers..." -ForegroundColor Yellow
$ok = 0; $missing = 0
foreach ($c in $copies) {
  $src = Join-Path $dir $c.src
  $dst = Join-Path $proj $c.dst
  if (Test-Path $src) {
    Copy-Item -Path $src -Destination $dst -Force
    Write-Host "   [OK] $($c.dst)" -ForegroundColor Green
    $ok++
  } else {
    Write-Host "   [MANQUANT] $($c.src)" -ForegroundColor Red
    $missing++
  }
}

Write-Host "`n$ok fichier(s) copies, $missing manquant(s)" -ForegroundColor Cyan

if ($missing -gt 0) {
  Write-Host "Certains fichiers manquent. Telechargez-les tous avant de relancer." -ForegroundColor Red
  exit 1
}

Write-Host "`nCommit et push vers GitHub..." -ForegroundColor Yellow
git add .
git status --short
git commit -m "feat: SysGeS-PAT v2 redesign complet institutionnel beninois"
git push

Write-Host "`n=== POUSSE ! Vercel builde dans 3-5 minutes ===" -ForegroundColor Green
Write-Host "Surveille l'onglet Deployments sur vercel.com" -ForegroundColor White
