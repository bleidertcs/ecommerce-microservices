param (
    [string]$CasdoorUrl = "http://localhost:8000"
)

try {
    Write-Host "Fetching certificates from $CasdoorUrl..." -ForegroundColor Cyan
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
        
        Write-Host "Usage in Kong (jwt_secrets):" -ForegroundColor Yellow
        Write-Host "rsa_public_key: |"
        $rs256Cert.publicKey -split "`n" | ForEach-Object { Write-Host "  $_" }
    } else {
        Write-Error "Failed to fetch certificates: $($response.msg)"
    }
} catch {
    Write-Error "Error connecting to Casdoor: $_"
}
