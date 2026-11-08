# Deploy automatico da landing EpicByte no Vercel
# Projeto: https://vercel.com/rafael-balbinos-projects/epicbyte
# Project ID: prj_KPdwaLDouW6T9fcghcdrj4vwk7a5
#
# Uso:
#   1. Clique com botao direito > Run with PowerShell
#   2. Ou rode no terminal: .\deploy-vercel.ps1
#
# Autenticacao:
#   - Usa o login salvo do Vercel CLI, se existir.
#   - Opcionalmente, defina VERCEL_TOKEN no ambiente para deploy sem login interativo.

param(
  [string]$ProjectName = "epicbyte",
  [string]$ProjectId = "prj_KPdwaLDouW6T9fcghcdrj4vwk7a5",
  [string]$VercelToken = $env:VERCEL_TOKEN,
  [string]$VercelScope = $env:VERCEL_SCOPE,
  [switch]$RunLocalBuild
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-Warn {
  param([string]$Message)
  Write-Host "AVISO: $Message" -ForegroundColor Yellow
}

function Stop-WithMessage {
  param([string]$Message)
  Write-Host ""
  Write-Host "ERRO: $Message" -ForegroundColor Red
  Write-Host ""
  Read-Host "Pressione Enter para fechar"
  exit 1
}

function Add-CommonNodePaths {
  $paths = @(
    "$env:ProgramFiles\nodejs",
    "${env:ProgramFiles(x86)}\nodejs",
    "$env:LOCALAPPDATA\Programs\nodejs"
  )

  foreach ($path in $paths) {
    if ($path -and (Test-Path (Join-Path $path "node.exe"))) {
      if ($env:Path -notlike "*$path*") {
        $env:Path = "$path;$env:Path"
      }
    }
  }
}

function Invoke-CommandChecked {
  param(
    [string]$FilePath,
    [string[]]$Arguments,
    [string]$FailureMessage
  )

  & $FilePath @Arguments
  if ($LASTEXITCODE -ne 0) {
    Stop-WithMessage $FailureMessage
  }
}

function Get-NodeMajorVersion {
  try {
    $raw = (& node --version).Trim().TrimStart("v")
    $major = ($raw.Split(".")[0] -as [int])
    return $major
  } catch {
    return 0
  }
}

Set-Location $PSScriptRoot

Write-Host "Deploy EpicByte Landing Page -> Vercel Production" -ForegroundColor White
Write-Host "Projeto: $ProjectName"
Write-Host "Project ID: $ProjectId"
Write-Host "Pasta: $PSScriptRoot"

Write-Step "Verificando Node.js e NPM"
Add-CommonNodePaths

$node = Get-Command node -ErrorAction SilentlyContinue
$npm = Get-Command npm.cmd -ErrorAction SilentlyContinue
$npx = Get-Command npx.cmd -ErrorAction SilentlyContinue

if (-not $node) {
  Stop-WithMessage "Node.js nao foi encontrado no PATH. Instale o Node.js LTS ou adicione node.exe ao PATH antes de rodar o deploy."
}

if (-not $npm -or -not $npx) {
  Stop-WithMessage "npm/npx nao foram encontrados. Reinstale o Node.js LTS marcando a opcao de adicionar ao PATH."
}

Write-Host "Node: $(& node --version)"
Write-Host "NPM:  $(& npm.cmd --version)"

$nodeMajor = Get-NodeMajorVersion
if ($nodeMajor -gt 0 -and $nodeMajor -lt 20) {
  Write-Warn "Seu Node local parece antigo para Vite 6. O deploy vai pular o build local e deixar a Vercel compilar em cloud."
}

if (-not (Test-Path "package.json")) {
  Stop-WithMessage "package.json nao encontrado. Rode este script dentro da raiz do projeto."
}

if (Test-Path ".env.local") {
  $envLocal = Get-Content ".env.local" -Raw
  if ($envLocal -notmatch "(?m)^OPENAI_API_KEY\s*=") {
    Write-Warn ".env.local nao contem OPENAI_API_KEY. O diagnostico IA depende dessa variavel no ambiente de producao da Vercel."
  }
} else {
  Write-Warn ".env.local nao encontrado. Isso nao impede o deploy, mas confira as variaveis de ambiente na Vercel."
}

if ($RunLocalBuild) {
  Write-Step "Instalando dependencias quando necessario"
  if (-not (Test-Path "node_modules")) {
    if (Test-Path "package-lock.json") {
      Invoke-CommandChecked "npm.cmd" @("ci") "Falha ao instalar dependencias com npm ci."
    } else {
      Invoke-CommandChecked "npm.cmd" @("install") "Falha ao instalar dependencias com npm install."
    }
  } else {
    Write-Host "node_modules ja existe. Pulando instalacao."
  }

  Write-Step "Validando build local"
  Invoke-CommandChecked "npm.cmd" @("run", "build") "Build local falhou. Corrija os erros antes de publicar."
} else {
  Write-Step "Pulando build local"
  Write-Host "A Vercel vai instalar dependencias e compilar o projeto durante o deploy."
  Write-Host "Para validar build nesta maquina antes de publicar, rode: .\deploy-vercel.ps1 -RunLocalBuild"
}

Write-Step "Verificando vinculo com o projeto Vercel"
if (-not (Test-Path ".vercel\project.json")) {
  Write-Warn "Projeto ainda nao esta vinculado localmente ao Vercel."
  Write-Host "Abrirei o 'vercel link'. Se solicitado, escolha:"
  Write-Host "  - conta/escopo: rafael-balbinos-projects"
  Write-Host "  - projeto: $ProjectName"
  Write-Host ""

  $linkArgs = @("--yes", "vercel@latest", "link", "--project", $ProjectName)
  if ($VercelToken) {
    $linkArgs += @("--token", $VercelToken)
  }
  if ($VercelScope) {
    $linkArgs += @("--scope", $VercelScope)
  }

  Invoke-CommandChecked "npx.cmd" $linkArgs "Falha ao vincular o projeto ao Vercel. Rode 'npx vercel@latest login' e tente novamente."
} else {
  Write-Host "Vinculo local encontrado em .vercel\project.json."
}

Write-Step "Publicando em producao"
$deployArgs = @("--yes", "vercel@latest", "deploy", "--prod", "--yes")
if ($VercelToken) {
  $deployArgs += @("--token", $VercelToken)
}
if ($VercelScope) {
  $deployArgs += @("--scope", $VercelScope)
}

Invoke-CommandChecked "npx.cmd" $deployArgs "Deploy no Vercel falhou."

Write-Host ""
Write-Host "Deploy concluido com sucesso." -ForegroundColor Green
Write-Host "Painel: https://vercel.com/rafael-balbinos-projects/epicbyte"
Write-Host ""
Read-Host "Pressione Enter para fechar"
