/* ============================================================
   ScriptForge 404 - generator.js
   Motor que combina una plantilla + opciones globales + valores
   de campos para producir BAT, PS1, README y checklist finales.
   ============================================================ */

const SFGenerator = (() => {

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function timestamp() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function slug(str) {
    return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  }

  /**
   * options = {
   *   scriptType: 'bat' | 'ps1' | 'both',
   *   createLog: bool, logPath: string,
   *   dryRun: bool, silent: bool,
   *   confirmDangerous: bool,
   *   comments: bool, pauseAtEnd: bool,
   *   version: string, technician: string, client: string
   * }
   * fieldValues = objeto plano { key: value } segun template.fields
   */
  function buildVars(fieldValues, options) {
    return {
      ...fieldValues,
      dryRun: !!options.dryRun,
      silent: !!options.silent
    };
  }

  function generateBat(template, fieldValues, options, riskInfo) {
    const vars = buildVars(fieldValues, options);
    const ts = timestamp();
    const logPath = (options.logPath || '.\\logs').replace(/\/$/, '');
    const scriptSlug = slug(template.id);

    const lines = [];
    lines.push('@echo off');
    if (options.comments !== false) {
      lines.push(':: ============================================================');
      lines.push(`:: ScriptForge 404 - ${template.name}`);
      lines.push(`:: Categoria: ${template.category} | Nivel de riesgo: ${riskInfo.level.toUpperCase()}`);
      lines.push(`:: Generado: ${ts} | Version de script: ${options.version || '1.0'}`);
      lines.push(`:: Tecnico: ${options.technician || '(no especificado)'} | Cliente/equipo: ${options.client || '(no especificado)'}`);
      if (vars.dryRun) lines.push(':: MODO SIMULACION (DRY-RUN) ACTIVO: no se ejecutan acciones destructivas.');
      lines.push(':: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.');
      lines.push(':: ============================================================');
    }
    lines.push('setlocal enabledelayedexpansion');
    lines.push('');

    if (template.requiresAdmin) {
      lines.push(':: Comprobacion de permisos de administrador');
      lines.push('net session >nul 2>&1');
      lines.push('if %errorlevel% neq 0 (');
      if (options.autoElevate !== false) {
        lines.push('    echo [INFO] Este script requiere permisos de administrador.');
        lines.push('    echo [INFO] Solicitando elevacion UAC...');
        lines.push('    set "SF_SELF=%~f0"');
        lines.push('    set "SF_CWD=%~dp0"');
        lines.push('    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath $env:SF_SELF -Verb RunAs -WorkingDirectory $env:SF_CWD"');
        lines.push('    exit /b');
      } else {
        lines.push('    echo [ERROR] Este script requiere permisos de administrador.');
        lines.push('    echo Cierra esta ventana y ejecuta el archivo .bat como Administrador.');
        lines.push('    pause');
        lines.push('    exit /b 1');
      }
      lines.push(')');
      lines.push('');
    }

    if (options.createLog) {
      lines.push(':: Configuracion de log');
      lines.push(`set "LOGDIR=${logPath}"`);
      lines.push('if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1');
      lines.push(`set "LOGFILE=%LOGDIR%\\${scriptSlug}_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"`);
      lines.push('set "LOGFILE=%LOGFILE: =0%"');
      lines.push('echo [%date% %time%] Inicio de script: ' + template.name + ' >> "%LOGFILE%" 2>nul');
      lines.push('');
    }

    if (riskInfo.requiresConfirmation && options.confirmDangerous !== false) {
      lines.push(':: Confirmacion obligatoria por riesgo ALTO');
      lines.push('echo ============================================================');
      lines.push('echo   ATENCION: este script contiene acciones de RIESGO ALTO.');
      lines.push('echo   Revisa el informe de riesgo antes de continuar.');
      lines.push('echo ============================================================');
      lines.push('set /p CONFIRMA="Escribe SI en mayusculas para continuar: "');
      lines.push('if not "%CONFIRMA%"=="SI" (');
      lines.push('    echo Operacion cancelada por el usuario.');
      lines.push('    exit /b 1');
      lines.push(')');
      lines.push('');
    }

    if (!options.silent) {
      lines.push(`echo Ejecutando: ${template.name}`);
      lines.push('echo.');
    }

    lines.push(template.batBody(vars));
    lines.push('');

    if (options.createLog) {
      lines.push('echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul');
    }
    if (!options.silent) {
      lines.push('echo.');
      lines.push('echo Script finalizado.');
    }
    if (options.pauseAtEnd) {
      lines.push('pause');
    }
    lines.push('endlocal');

    return lines.join('\n');
  }

  function generatePS1(template, fieldValues, options, riskInfo) {
    const vars = buildVars(fieldValues, options);
    const ts = timestamp();
    const logPath = (options.logPath || '.\\logs').replace(/\/$/, '');
    const scriptSlug = slug(template.id);

    const lines = [];
    if (options.comments !== false) {
      lines.push('<#');
      lines.push('============================================================');
      lines.push(`ScriptForge 404 - ${template.name}`);
      lines.push(`Categoria: ${template.category} | Nivel de riesgo: ${riskInfo.level.toUpperCase()}`);
      lines.push(`Generado: ${ts} | Version de script: ${options.version || '1.0'}`);
      lines.push(`Tecnico: ${options.technician || '(no especificado)'} | Cliente/equipo: ${options.client || '(no especificado)'}`);
      lines.push('Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.');
      lines.push('============================================================');
      lines.push('#>');
      lines.push('');
    }

    lines.push('[CmdletBinding()]');
    lines.push('param(');
    lines.push(`    [switch]$DryRun = $${vars.dryRun ? 'true' : 'false'},`);
    lines.push(`    [switch]$Silent = $${vars.silent ? 'true' : 'false'}`);
    lines.push(')');
    lines.push('');
    lines.push('Set-StrictMode -Version Latest');
    lines.push('$ErrorActionPreference = "Stop"');
    lines.push('');

    if (template.requiresAdmin) {
      lines.push('# Comprobacion de permisos de administrador');
      lines.push('$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())');
      lines.push('if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {');
      if (options.autoElevate !== false) {
        lines.push('    Write-Host "[INFO] Este script requiere permisos de administrador." -ForegroundColor Yellow');
        lines.push('    Write-Host "[INFO] Solicitando elevacion UAC..." -ForegroundColor Yellow');
        lines.push('    $arguments = @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "`"$PSCommandPath`"")');
        lines.push('    if ($DryRun) { $arguments += "-DryRun" }');
        lines.push('    if ($Silent) { $arguments += "-Silent" }');
        lines.push('    $workingDirectory = Split-Path -Parent $PSCommandPath');
        lines.push('    Start-Process -FilePath "powershell.exe" -ArgumentList $arguments -Verb RunAs -WorkingDirectory $workingDirectory');
        lines.push('    exit');
      } else {
        lines.push('    Write-Host "[ERROR] Este script requiere permisos de administrador." -ForegroundColor Red');
        lines.push('    Write-Host "Vuelve a ejecutar PowerShell como Administrador." -ForegroundColor Red');
        lines.push('    exit 1');
      }
      lines.push('}');
      lines.push('');
    }

    if (options.createLog) {
      lines.push('# Configuracion de log');
      lines.push(`$LogDir = "${logPath}"`);
      lines.push('if (-not (Test-Path $LogDir)) { New-Item -Path $LogDir -ItemType Directory -Force | Out-Null }');
      lines.push(`$LogFile = Join-Path $LogDir ("${scriptSlug}_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")`);
      lines.push('');
    }

    lines.push('function Write-Log {');
    lines.push('    param([string]$Message)');
    lines.push('    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message');
    if (options.createLog) {
      lines.push('    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }');
    }
    lines.push('    if (-not $Silent) { Write-Host $line }');
    lines.push('}');
    lines.push('');

    if (riskInfo.requiresConfirmation && options.confirmDangerous !== false) {
      lines.push('# Confirmacion obligatoria por riesgo ALTO');
      lines.push('Write-Host "============================================================" -ForegroundColor Yellow');
      lines.push('Write-Host "  ATENCION: este script contiene acciones de RIESGO ALTO." -ForegroundColor Yellow');
      lines.push('Write-Host "  Revisa el informe de riesgo antes de continuar." -ForegroundColor Yellow');
      lines.push('Write-Host "============================================================" -ForegroundColor Yellow');
      lines.push('$confirm = Read-Host "Escribe SI en mayusculas para continuar"');
      lines.push('if ($confirm -ne "SI") {');
      lines.push('    Write-Host "Operacion cancelada por el usuario."');
      lines.push('    exit 1');
      lines.push('}');
      lines.push('');
    }

    lines.push(`Write-Log "Ejecutando: ${template.name}"`);
    lines.push('');
    lines.push('try {');
    // indent body, but keep PowerShell here-string closing delimiters at column 1.
    // PowerShell requires '@ and "@ to start at the beginning of the line.
    const bodyLines = template.ps1Body(vars).split('\n').map(l => {
      const trimmed = l.trim();
      if (trimmed === "'@" || trimmed === '"@') return trimmed;
      return l.length ? '    ' + l : l;
    });
    lines.push(bodyLines.join('\n'));
    lines.push('}');
    lines.push('catch {');
    lines.push('    Write-Log ("ERROR no controlado: " + $_.Exception.Message)');
    lines.push('    exit 1');
    lines.push('}');
    lines.push('');
    lines.push('Write-Log "Script finalizado."');
    if (options.pauseAtEnd) {
      lines.push('Read-Host "Pulsa Enter para salir"');
    }

    return lines.join('\n');
  }

  function generateReadme(template, fieldValues, options, riskInfo) {
    const ts = timestamp();
    const lines = [];
    lines.push(`# ${template.name}`);
    lines.push('');
    lines.push(`**Categoria:** ${template.category}  `);
    lines.push(`**Nivel de riesgo:** ${riskInfo.level.toUpperCase()}  `);
    lines.push(`**Requiere administrador:** ${template.requiresAdmin ? 'Si' : 'No'}  `);
    lines.push(`**Autoelevacion UAC:** ${template.requiresAdmin ? (options.autoElevate !== false ? 'Activada' : 'Desactivada') : 'No aplica'}  `);
    lines.push(`**Generado:** ${ts}  `);
    lines.push(`**Tecnico:** ${options.technician || '(no especificado)'}  `);
    lines.push(`**Cliente/equipo:** ${options.client || '(no especificado)'}  `);
    lines.push(`**Version del script:** ${options.version || '1.0'}  `);
    lines.push('');
    lines.push('## Descripcion');
    lines.push(template.description);
    lines.push('');
    lines.push('## Que hace este script');
    lines.push('Genera comandos ' + (options.scriptType === 'both' ? 'BAT y PS1' : options.scriptType.toUpperCase()) + ' basados en la plantilla "' + template.name + '" con las opciones configuradas por el usuario en ScriptForge 404.');
    lines.push('');
    if (riskInfo.reasons.length) {
      lines.push('## Motivos del nivel de riesgo');
      riskInfo.reasons.forEach(r => lines.push('- ' + r));
      lines.push('');
    }
    lines.push('## Requisitos previos');
    (template.checklistPre || []).forEach(item => lines.push('- ' + item));
    lines.push('');
    lines.push('## Posibilidad de rollback');
    lines.push(template.rollback ? template.rollback : 'Esta accion no requiere o no permite rollback especifico (ver detalle en el informe de riesgo).');
    lines.push('');
    lines.push('## Advertencia');
    lines.push('Revisa siempre el contenido del script antes de ejecutarlo. Usalo unicamente en equipos donde tengas autorizacion. El autor de ScriptForge 404 no se responsabiliza de danos derivados de un uso indebido.');
    return lines.join('\n');
  }

  function generateChecklist(template, fieldValues, options, riskInfo) {
    const lines = [];
    lines.push(`CHECKLIST - ${template.name}`);
    lines.push('='.repeat(60));
    lines.push('');
    lines.push('ANTES DE EJECUTAR:');
    (template.checklistPre || []).forEach((item, i) => lines.push(`  [ ] ${i + 1}. ${item}`));
    if (!(template.checklistPre || []).length) lines.push('  [ ] 1. Revisar el script completo antes de ejecutar.');
    lines.push('');
    lines.push('DESPUES DE EJECUTAR:');
    (template.checklistPost || []).forEach((item, i) => lines.push(`  [ ] ${i + 1}. ${item}`));
    if (!(template.checklistPost || []).length) lines.push('  [ ] 1. Confirmar que el resultado obtenido es el esperado.');
    lines.push('');
    lines.push(`NIVEL DE RIESGO DETECTADO: ${riskInfo.level.toUpperCase()}`);
    lines.push(`AUTOELEVACION UAC: ${template.requiresAdmin ? (options.autoElevate !== false ? 'ACTIVADA' : 'DESACTIVADA') : 'NO APLICA'}`);
    if (riskInfo.reasons.length) {
      lines.push('Motivos:');
      riskInfo.reasons.forEach(r => lines.push('  - ' + r));
    }
    lines.push('');
    lines.push('ROLLBACK:');
    lines.push('  ' + (template.rollback ? template.rollback : 'No aplica / no disponible para esta accion.'));
    return lines.join('\n');
  }

  /**
   * Genera el paquete completo de salida para un template + opciones dadas.
   */
  function generateAll(template, fieldValues, options) {
    const riskInfo = SFSecurity.analyzeRisk(template, fieldValues);
    const result = { riskInfo };

    if (options.scriptType === 'bat' || options.scriptType === 'both') {
      result.bat = generateBat(template, fieldValues, options, riskInfo);
    }
    if (options.scriptType === 'ps1' || options.scriptType === 'both') {
      result.ps1 = generatePS1(template, fieldValues, options, riskInfo);
    }
    result.readme = generateReadme(template, fieldValues, options, riskInfo);
    result.checklist = generateChecklist(template, fieldValues, options, riskInfo);
    return result;
  }

  return {
    generateBat,
    generatePS1,
    generateReadme,
    generateChecklist,
    generateAll,
    slug,
    timestamp
  };
})();
