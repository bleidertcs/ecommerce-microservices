# Configuration
$GatewayUrl = "http://localhost:8000/api/v1/orders"
$AuthUrl = "http://localhost:9000/application/o/token/"
$ClientId = "TU_CLIENT_ID"
$ClientSecret = "TU_CLIENT_SECRET"
$Username = "tu_usuario"
$Password = "tu_password"
$Concurrency = 50

Write-Host "--- API Stress Test (PowerShell) ---" -ForegroundColor Cyan

# 1. Get Token
Write-Host "Obtaining access token..."
$authBody = @{
    grant_type    = "password"
    username      = $Username
    password      = $Password
    client_id     = $ClientId
    client_secret = $ClientSecret
    scope         = "openid profile email"
}

try {
    $authResponse = Invoke-RestMethod -Uri $AuthUrl -Method Post -Body $authBody -ContentType "application/x-www-form-urlencoded"
    $Token = $authResponse.access_token
} catch {
    Write-Error "Failed to obtain token: $($_.Exception.Message)"
    exit
}

if (-not $Token) {
    Write-Error "Token is empty."
    exit
}

Write-Host "Token obtained successfully." -ForegroundColor Green
Write-Host "Starting $Concurrency simultaneous requests..."

# 2. Run simultaneous requests using Jobs for parallelism
$jobs = 1..$Concurrency | ForEach-Object {
    $i = $_
    Start-Job -ScriptBlock {
        param($url, $token, $idx)
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type"  = "application/json"
        }
        $body = @{
            items = @(
                @{ productId = "prod-123"; quantity = 1 }
            )
            shippingAddress = @{
                street = "123 Test St"
                city = "Test City"
                state = "TS"
                zipCode = "12345"
                country = "Testerland"
                recipientName = "Test User"
                recipientPhone = "+1234567890"
            }
            paymentMethod = "Credit Card"
        } | ConvertTo-Json

        try {
            $resp = Invoke-WebRequest -Uri $url -Method Post -Headers $headers -Body $body -UseBasicParsing
            return "Request #$idx - Status: $($resp.StatusCode)"
        } catch {
            return "Request #$idx - Error: $($_.Exception.Message)"
        }
    } -ArgumentList $GatewayUrl, $Token, $i
}

# Wait for all jobs to finish
$results = $jobs | Wait-Job | Receive-Job
$results | ForEach-Object { Write-Host $_ }

# Cleanup jobs
$jobs | Remove-Job

Write-Host "--- Test Completed ---" -ForegroundColor Cyan
