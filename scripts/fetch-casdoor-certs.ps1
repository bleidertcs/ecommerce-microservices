param (
    [string]$CasdoorUrl = "http://localhost:8000",
    [switch]$UpdateConfig
)

try {
    Write-Host "Fetching certificates from $CasdoorUrl..." -ForegroundColor Cyan
    
    # Try public JWKS endpoint (no auth required)
    $jwksUrl = "$CasdoorUrl/.well-known/jwks"
    $jwks = Invoke-RestMethod -Uri $jwksUrl -Method Get
    
    if ($null -ne $jwks.keys) {
        $rs256Key = $jwks.keys | Where-Object { $_.alg -eq "RS256" -or $_.kty -eq "RSA" } | Select-Object -First 1
        
        if ($null -ne $rs256Key -and $null -ne $rs256Key.x5c) {
            $certBase64 = $rs256Key.x5c[0]
            
            Write-Host "`n--- CASDOOR PUBLIC CERTIFICATE (RS256) ---" -ForegroundColor Green
            Write-Host "-----BEGIN CERTIFICATE-----"
            # Format to 64 chars per line
            $formattedCert = $certBase64 -replace "(.{64})", "`$1`n"
            Write-Host $formattedCert
            Write-Host "-----END CERTIFICATE-----"
            Write-Host "------------------------------------------`n"
            
            if ($UpdateConfig) {
                # Find kong/config.yml relative to the script
                $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
                $configPath = Join-Path $scriptDir "../kong/config.yml"
                
                if (Test-Path $configPath) {
                    Write-Host "Updating $configPath..." -ForegroundColor Cyan
                    
                    $fileContent = Get-Content $configPath -Raw
                    $escapedUrl = [regex]::Escape($CasdoorUrl)
                    
                    # Indentation: 6 spaces for the cert block
                    $indent = "      "
                    $newPemBlock = "$indent-----BEGIN CERTIFICATE-----`n"
                    $formattedCert -split "`n" | ForEach-Object { 
                        $line = $_.Trim()
                        if ($line) { $newPemBlock += "$indent$line`n" }
                    }
                    $newPemBlock += "$indent-----END CERTIFICATE-----"
                    
                    # Regex to find the entry with the matching key and its rsa_public_key block
                    # It looks for 'key: URL', then 'rsa_public_key: |', and then everything until the next key or end of file
                    $pattern = "(?s)(key:\s*$escapedUrl.*?rsa_public_key:\s*\|\s*\r?\n)(?:\s*-----BEGIN.*?-----.*?-----END.*?-----\s*|.*?(?=\r?\n\s*[a-zA-Z0-9_-]+:|\z))"
                    
                    if ($fileContent -match $pattern) {
                        # Use '$1' in single quotes to pass the literal $1 to the regex engine
                        $replacement = '$1' + $newPemBlock + "`n"
                        $newContent = [regex]::Replace($fileContent, $pattern, $replacement)
                        Set-Content -Path $configPath -Value $newContent -NoNewline
                        Write-Host "Successfully updated kong/config.yml!" -ForegroundColor Green
                    } else {
                        Write-Warning "Could not find a matching jwt_secret entry for $CasdoorUrl in kong/config.yml"
                    }
                } else {
                    Write-Error "Could not find kong/config.yml at $configPath"
                }
            } else {
                Write-Host "Usage in Kong (jwt_secrets):" -ForegroundColor Yellow
                Write-Host "rsa_public_key: |"
                Write-Host "  -----BEGIN CERTIFICATE-----"
                $formattedCert -split "`n" | ForEach-Object { 
                    $line = $_.Trim()
                    if ($line) { Write-Host "  $line" }
                }
                Write-Host "  -----END CERTIFICATE-----"
                Write-Host "`nTip: Run with -UpdateConfig to automatically update kong/config.yml" -ForegroundColor Gray
            }
            exit 0
        }
    }

    # If JWKS fails or doesn't have x5c, fall back to admin API
    Write-Warning "Public JWKS not available or missing x5c. Trying admin API..."
    $response = Invoke-RestMethod -Uri "$CasdoorUrl/api/get-certs?owner=admin&pageSize=100" -Method Get
    
    if ($response.status -eq "ok") {
        $certs = $response.data
        $rs256Cert = $certs | Where-Object { $_.type -eq "RS256" } | Select-Object -First 1
        
        if ($null -eq $rs256Cert) {
            Write-Error "No RS256 certificate found in Casdoor."
            exit 1
        }
        
        Write-Host "`n--- CASDOOR PUBLIC KEY (RS256) ---" -ForegroundColor Green
        Write-Host $rs256Cert.publicKey
        Write-Host "----------------------------------`n"
        
        if ($UpdateConfig) {
            Write-Warning "Auto-update for admin API response not fully implemented, please copy manually."
        }
    } else {
        Write-Error "Failed to fetch certificates: $($response.msg)"
    }
} catch {
    Write-Error "Error connecting to Casdoor: $_"
}
