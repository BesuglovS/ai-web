# deploy.ps1 — Build and deploy ai-web to server
# Usage: .\deploy.ps1

param(
  [switch]$SkipBuild
)

$ErrorActionPreference = 'Stop'

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

# ─── Deploy via tar + ssh ───
$sitePath = Join-Path $PSScriptRoot '_site'
if (-not (Test-Path $sitePath)) {
    Write-Host "ERROR: _site/ not found. Run build first." -ForegroundColor Red
    exit 1
}

$sshArgStr = ""
if ($sshPort -ne '22') { $sshArgStr += "-P $sshPort " }
if ($identityFile) { $sshArgStr += "-i `"$identityFile`" " }
$sshArgStr += "$remote `"rm -rf ${remotePath}/* ${remotePath}/.[!.]* 2>/dev/null; mkdir -p ${remotePath}; tar -xzf - -C $remotePath`""

Write-Host "`n==> Deploying to ${remote}:${remotePath} ..." -ForegroundColor Cyan

$targz = Join-Path $env:TEMP "deploy-$(Get-Random).tar.gz"
try {
    & tar -czf $targz -C $sitePath .
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

Write-Host "`n==> Deploy complete" -ForegroundColor Green
