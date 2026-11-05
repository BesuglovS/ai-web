<#
.SYNOPSIS
  Build and deploy ai-web (Eleventy) to the production server via SSH.
.DESCRIPTION
  Reads config from .env, runs the 11ty build pipeline and syncs _site/ over
  SSH. Keeps remote data/ (SQLite ai.db, прогресс учеников) and root-owned
  quizzes/ intact, writes version.json for prod-vs-repo comparison and
  deploys the nginx config through the root helper deploy-nginx.sh.
.PARAMETER DryRun
  Show build/deploy commands without executing them.
.PARAMETER SkipBuild
  Skip the build step and deploy the existing _site/.
.EXAMPLE
  .\deploy.ps1
  .\deploy.ps1 -DryRun
  .\deploy.ps1 -SkipBuild
#>

param(
  [switch]$DryRun,
  [switch]$SkipBuild
)

$ErrorActionPreference = 'Stop'

# --- Deploy marker: writes version.json into the deployed payload ---
# Records commit/branch/tree/dirty/deployedAt/via so the deployed content can be
# compared with the local repository later (see na-web/check-deploy.ps1).
function New-DeployMarker {
  param(
    [Parameter(Mandatory)][string]$ProjectDir,
    [Parameter(Mandatory)][string]$OutFile,
    [string]$Via = 'deploy.ps1'
  )
  $commit = $null; $branch = $null; $tree = $null; $dirty = $null; $changed = $null
  if (Test-Path (Join-Path $ProjectDir '.git')) {
    $prevEap = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
    try {
      $commit  = (& git -C $ProjectDir rev-parse HEAD 2>$null)
      $branch  = (& git -C $ProjectDir rev-parse --abbrev-ref HEAD 2>$null)
      $tracked   = @(& git -C $ProjectDir diff HEAD --numstat 2>$null)
      $untracked = @(& git -C $ProjectDir ls-files -o --exclude-standard 2>$null)
      $changed   = $tracked.Count + $untracked.Count
      $dirty     = ($changed -gt 0)
      if ($dirty) {
        $stash = (& git -C $ProjectDir stash create 2>$null)
        if ($stash) { $tree = (& git -C $ProjectDir rev-parse "$($stash.Trim())^{tree}" 2>$null) }
      } else {
        $tree = (& git -C $ProjectDir rev-parse 'HEAD^{tree}' 2>$null)
      }
    } finally { $ErrorActionPreference = $prevEap }
  }
  $marker = [ordered]@{
    project    = Split-Path -Leaf $ProjectDir
    commit     = if ($commit) { $commit.Trim() } else { $null }
    branch     = if ($branch) { $branch.Trim() } else { $null }
    tree       = if ($tree)   { $tree.Trim() }   else { $null }
    dirty      = $dirty
    dirtyFiles = $changed
    deployedAt = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
    deployedBy = $env:USERNAME
    via        = $Via
  }
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $OutFile) | Out-Null
  [System.IO.File]::WriteAllText($OutFile, ($marker | ConvertTo-Json -Depth 3),
    (New-Object System.Text.UTF8Encoding($false)))
}

# ─── Load .env ───
$envFile = Join-Path $PSScriptRoot '.env'
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#=]+?)\s*=\s*(.+?)\s*$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
}

$sshHost  = [Environment]::GetEnvironmentVariable('DEPLOY_SSH_HOST')
$sshPort  = [Environment]::GetEnvironmentVariable('DEPLOY_SSH_PORT')
if (-not $sshPort) { $sshPort = '22' }
$sshUser  = [Environment]::GetEnvironmentVariable('DEPLOY_SSH_USER')
$remotePath = [Environment]::GetEnvironmentVariable('DEPLOY_REMOTE_PATH')
if ($remotePath) { $remotePath = $remotePath.TrimEnd('/') }

$identityFile = [Environment]::GetEnvironmentVariable('DEPLOY_SSH_KEY')
if ($identityFile -and (Test-Path $identityFile)) {
    $identityFile = (Resolve-Path $identityFile).Path
}

if (-not $sshHost -or -not $sshUser -or -not $remotePath) {
    Write-Host "ERROR: Set DEPLOY_SSH_HOST, DEPLOY_SSH_USER and DEPLOY_REMOTE_PATH in .env" -ForegroundColor Red
    exit 1
}

# Guard: the deploy wipes remotePath (except data/), allow only the project webroot.
$expectedPath = '/var/www/ai.nayanovaacademy.ru/public'
if ($remotePath -ne $expectedPath) {
    Write-Host ("ERROR: wrong DEPLOY_REMOTE_PATH=$remotePath, expected=$expectedPath. Deploy aborted.") -ForegroundColor Red
    exit 1
}

$remote = "${sshUser}@${sshHost}"
$portArg = if ($sshPort -ne '22') { "-P $sshPort" } else { '' }
$identityArg = if ($identityFile) { "-i `"$identityFile`"" } else { '' }

# ─── Fix SSH key permissions (Windows OpenSSH) ───
if ($identityFile -and (Test-Path $identityFile)) {
    icacls $identityFile /reset 2>$null
    icacls $identityFile /inheritance:r 2>$null
    icacls $identityFile /grant "${env:USERNAME}:(R)" 2>$null
}

# ─── Build ───
if (-not $SkipBuild) {
    Write-Host "`n==> Building project..." -ForegroundColor Cyan

    if ($DryRun) {
        Write-Host "  [DryRun] remove _site/; node build-css.mjs; node build-js.mjs; node build-highlight.mjs;" -ForegroundColor Yellow
        Write-Host "  [DryRun] node build-config-meta.mjs; node build-assets-hash.mjs; npx @11ty/eleventy; node build-sw.mjs" -ForegroundColor Yellow
    } else {
        if (Test-Path '_site') { Remove-Item -Recurse -Force '_site' }

        node build-css.mjs
        if ($LASTEXITCODE -ne 0) { Write-Host "CSS build failed" -ForegroundColor Red; exit 1 }

        node build-js.mjs
        if ($LASTEXITCODE -ne 0) { Write-Host "JS build failed" -ForegroundColor Red; exit 1 }

        node build-highlight.mjs
        if ($LASTEXITCODE -ne 0) { Write-Host "highlight.js build failed" -ForegroundColor Red; exit 1 }

        node build-config-meta.mjs
        if ($LASTEXITCODE -ne 0) { Write-Host "Config meta build failed" -ForegroundColor Red; exit 1 }

        node build-assets-hash.mjs
        if ($LASTEXITCODE -ne 0) { Write-Host "Asset hash failed" -ForegroundColor Red; exit 1 }

        npx @11ty/eleventy
        if ($LASTEXITCODE -ne 0) { Write-Host "Eleventy build failed" -ForegroundColor Red; exit 1 }

        node build-sw.mjs
        if ($LASTEXITCODE -ne 0) { Write-Host "Service worker build failed" -ForegroundColor Red; exit 1 }
    }
}

# ─── Deploy via tar + ssh ───
$sitePath = Join-Path $PSScriptRoot '_site'
if (-not (Test-Path $sitePath)) {
    if ($DryRun) {
        Write-Host "  [DryRun] _site/ not found: build is skipped, so there is nothing to archive." -ForegroundColor Yellow
        Write-Host "`n==> Deploy skipped (DryRun)" -ForegroundColor Yellow
        exit 0
    }
    Write-Host "ERROR: _site/ not found. Run build first." -ForegroundColor Red
    exit 1
}

# --- Deploy marker (version.json goes to webroot) ---
if (-not $DryRun) {
    New-DeployMarker -ProjectDir $PSScriptRoot -OutFile (Join-Path $sitePath 'version.json')
}

$sshArgStr = ""
if ($sshPort -ne '22') { $sshArgStr += "-P $sshPort " }
if ($identityFile) { $sshArgStr += "-i `"$identityFile`" " }
# Схема python-web (2026-10): data/ не стирается — SQLite ai.db
# (db_path = public/data/ai.db) и прогресс учеников переживают деплой под
# www-data. Прежний `rm -rf ${remotePath}/*` терял ai.db на каждом деплое.
# data/ из tar исключён — локальные артефакты не перезаписывают боевые данные.
$sshArgStr += "$remote `"find \`"$remotePath\`" -mindepth 1 -maxdepth 1 ! -name 'data' -exec rm -rf {} + 2>/dev/null; mkdir -p \`"$remotePath/data\`" 2>/dev/null; tar -xzf - --skip-old-files -C \`"$remotePath\`"`""

Write-Host "`n==> Deploying to ${remote}:${remotePath} ..." -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "  [DryRun] tar -czf - -C `"$sitePath`" --exclude=data --exclude=quizzes --exclude=.ratelimit --exclude=.repl_sessions ." -ForegroundColor Yellow
    Write-Host "  [DryRun] | ssh $sshArgStr" -ForegroundColor Yellow
} else {
    $targz = Join-Path $env:TEMP "deploy-$(Get-Random).tar.gz"
    try {
        & tar -czf $targz -C $sitePath --exclude=data --exclude=quizzes --exclude=.ratelimit --exclude=.repl_sessions .
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Archive creation failed" -ForegroundColor Red
            exit 1
        }

        $bytes = [System.IO.File]::ReadAllBytes($targz)

        $psi = New-Object System.Diagnostics.ProcessStartInfo('ssh', $sshArgStr)
        $psi.RedirectStandardInput = $true
        $psi.RedirectStandardOutput = $true
        $psi.RedirectStandardError = $true
        $psi.UseShellExecute = $false
        $psi.CreateNoWindow = $true
        $proc = [System.Diagnostics.Process]::Start($psi)

        try {
            $proc.StandardInput.BaseStream.Write($bytes, 0, $bytes.Length)
            $proc.StandardInput.Close()
        } catch [System.IO.IOException] {
            $stderr = $proc.StandardError.ReadToEnd()
            $proc.WaitForExit()
            Write-Host "Deploy failed: $($_.Exception.Message)" -ForegroundColor Red
            if ($stderr) { Write-Host "SSH: $stderr" -ForegroundColor Red }
            exit 1
        }

        $stdoutTask = $proc.StandardOutput.ReadToEndAsync()
        $stderrTask = $proc.StandardError.ReadToEndAsync()
        $proc.WaitForExit()
        $stdout = $stdoutTask.Result
        $stderr = $stderrTask.Result

        if ($proc.ExitCode -ne 0) {
            Write-Host "Deploy failed (exit code: $($proc.ExitCode))" -ForegroundColor Red
            if ($stdout) { Write-Host "SSH stdout: $stdout" -ForegroundColor Red }
            if ($stderr) { Write-Host "SSH stderr: $stderr" -ForegroundColor Red }
            exit 1
        }
    } finally {
        Remove-Item $targz -ErrorAction SilentlyContinue
    }
}

# ─── 4. Deploy nginx config ───
$nginxSite = 'ai.nayanovaacademy.ru'
$nginxLocal = Join-Path $PSScriptRoot $nginxSite
$nginxRemote = '/etc/nginx/sites-available/' + $nginxSite

if ($DryRun) {
  Write-Host "  [DryRun] Deploy nginx config: $nginxSite" -ForegroundColor Yellow
} elseif (Test-Path $nginxLocal) {
  Write-Host "`n==> Deploying nginx config ($nginxSite) ..." -ForegroundColor Cyan
  $scpCmd = "scp $portArg $identityArg `"$nginxLocal`" ${remote}:/tmp/nginx-$nginxSite"
  $sshNginxCmd = "ssh $portArg $identityArg $remote `"sudo -n /usr/local/sbin/deploy-nginx.sh $nginxSite`""
  cmd /c $scpCmd
  if ($LASTEXITCODE -ne 0) { Write-Host "  Nginx config scp failed" -ForegroundColor Red; exit 1 }
  cmd /c $sshNginxCmd
  if ($LASTEXITCODE -ne 0) { Write-Host "  Nginx config install/reload failed" -ForegroundColor Red; exit 1 }
  Write-Host "  Done." -ForegroundColor Green
}

# ─── 5. Smoke check ───
if (-not $DryRun -and -not $SkipBuild) {
    Write-Host "`n==> Smoke check..." -ForegroundColor Cyan
    $siteUrl = 'https://ai.nayanovaacademy.ru/'
    try {
        $resp = Invoke-WebRequest -Uri $siteUrl -Method Head -TimeoutSec 30 -UseBasicParsing
        if ($resp.StatusCode -eq 200) {
            Write-Host "  Site responds with HTTP 200." -ForegroundColor Green
        } else {
            Write-Host "  WARNING: site responded with HTTP $($resp.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  WARNING: smoke check failed: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host "`n==> Deploy complete" -ForegroundColor Green
