$response = Invoke-RestMethod -Uri 'http://localhost:8000/.well-known/jwks'
$x5c = $response.keys[0].x5c[0]

# Build PEM certificate
$certPem = "-----BEGIN CERTIFICATE-----`n"
for ($i = 0; $i -lt $x5c.Length; $i += 64) {
    $len = [Math]::Min(64, $x5c.Length - $i)
    $certPem += $x5c.Substring($i, $len) + "`n"
}
$certPem += "-----END CERTIFICATE-----"

# Parse cert and extract public key
$tempFile = [System.IO.Path]::GetTempFileName()
Set-Content -Path $tempFile -Value $certPem -Encoding Ascii
$cert = [System.Security.Cryptography.X509Certificates.X509Certificate2]::new($tempFile)
$rsaKey = $cert.GetRSAPublicKey()
$pubKeyBytes = $rsaKey.ExportSubjectPublicKeyInfo()
$pubKeyBase64 = [Convert]::ToBase64String($pubKeyBytes)
Remove-Item $tempFile

Write-Host "-----BEGIN PUBLIC KEY-----"
for ($i = 0; $i -lt $pubKeyBase64.Length; $i += 64) {
    $len = [Math]::Min(64, $pubKeyBase64.Length - $i)
    Write-Host $pubKeyBase64.Substring($i, $len)
}
Write-Host "-----END PUBLIC KEY-----"
