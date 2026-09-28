# ==========================================
# Docker Monitoring Lab
# Log Retention & Archiving
# ==========================================

$ErrorRetentionDays = 5
$ApplicationArchiveDays = 7

$ProjectRoot = Split-Path $PSScriptRoot -Parent
$LogDirectory = Join-Path $ProjectRoot "logs"

$ArchiveDirectory = Join-Path $HOME "docker-log-archive"

$ApplicationLog = Join-Path $LogDirectory "application.log"
$ErrorLog = Join-Path $LogDirectory "error.log"

# Create directories
New-Item -ItemType Directory -Path $LogDirectory -Force | Out-Null
New-Item -ItemType Directory -Path $ArchiveDirectory -Force | Out-Null

Write-Host ""
Write-Host "=========================================="
Write-Host " Docker Log Retention Manager"
Write-Host "=========================================="
Write-Host "Error retention     : $ErrorRetentionDays days"
Write-Host "Archive after       : $ApplicationArchiveDays days"
Write-Host "Archive directory   : $ArchiveDirectory"
Write-Host "=========================================="
Write-Host ""


# ==========================================
# FUNCTION: Extract timestamp from log line
# ==========================================

function Get-LogTimestamp {
    param (
        [string]$Line
    )

    if ($Line -match '\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z') {

        try {
            return [DateTime]::Parse(
                $Matches[0],
                $null,
                [Globalization.DateTimeStyles]::AssumeUniversal
            ).ToUniversalTime()
        }
        catch {
            return $null
        }
    }

    return $null
}


# ==========================================
# ERROR LOG RETENTION
# ==========================================

if (Test-Path $ErrorLog) {

    Write-Host "Processing error.log..."

    $Cutoff = [DateTime]::UtcNow.AddDays(-$ErrorRetentionDays)

    $Keep = New-Object System.Collections.Generic.List[string]

    $Deleted = 0

    foreach ($Line in Get-Content $ErrorLog) {

        $Timestamp = Get-LogTimestamp $Line

        if ($null -eq $Timestamp) {
            $Keep.Add($Line)
            continue
        }

        if ($Timestamp -ge $Cutoff) {
            $Keep.Add($Line)
        }
        else {
            $Deleted++
        }
    }

    $TempFile = "$ErrorLog.tmp"

    $Keep | Set-Content -Path $TempFile -Encoding UTF8

    Move-Item `
        -Path $TempFile `
        -Destination $ErrorLog `
        -Force

    Write-Host "Old error entries deleted: $Deleted"
}
else {

    Write-Host "error.log not found."
}


# ==========================================
# APPLICATION LOG ARCHIVING
# ==========================================

if (Test-Path $ApplicationLog) {

    Write-Host ""
    Write-Host "Processing application.log..."

    $Cutoff = [DateTime]::UtcNow.AddDays(-$ApplicationArchiveDays)

    $RecentLines = New-Object System.Collections.Generic.List[string]

    $OldLogs = @{}

    foreach ($Line in Get-Content $ApplicationLog) {

        $Timestamp = Get-LogTimestamp $Line

        # Keep lines without timestamps
        if ($null -eq $Timestamp) {
            $RecentLines.Add($Line)
            continue
        }

        # Old log → archive
        if ($Timestamp -lt $Cutoff) {

            # Use ACTUAL log date
            $DateKey = $Timestamp.ToString("yyyy-MM-dd")

            if (!$OldLogs.ContainsKey($DateKey)) {
                $OldLogs[$DateKey] =
                    New-Object System.Collections.Generic.List[string]
            }

            $OldLogs[$DateKey].Add($Line)
        }
        else {

            # Recent log → keep
            $RecentLines.Add($Line)
        }
    }


    # ======================================
    # WRITE ARCHIVED LOGS
    # ======================================

    foreach ($DateKey in $OldLogs.Keys) {

        $ArchiveFile = Join-Path `
            $ArchiveDirectory `
            "application_$DateKey.log"

        # Append instead of overwriting
        $OldLogs[$DateKey] |
            Add-Content `
                -Path $ArchiveFile `
                -Encoding UTF8

        Write-Host "Archived: application_$DateKey.log"
        Write-Host "Entries : $($OldLogs[$DateKey].Count)"
    }


    # ======================================
    # REWRITE ACTIVE LOG
    # ======================================

    $TempApplicationFile = "$ApplicationLog.tmp"

    $RecentLines |
        Set-Content `
            -Path $TempApplicationFile `
            -Encoding UTF8

    Move-Item `
        -Path $TempApplicationFile `
        -Destination $ApplicationLog `
        -Force
}
else {

    Write-Host "application.log not found."
}


# ==========================================
# COMPLETE
# ==========================================

Write-Host ""
Write-Host "=========================================="
Write-Host " Log management completed successfully"
Write-Host "=========================================="
Write-Host ""