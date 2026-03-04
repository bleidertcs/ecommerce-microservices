$jwks = Invoke-RestMethod -Uri 'http://localhost:8000/.well-known/jwks'
$x5c = $jwks.keys[0].x5c[0]

# Write the cert to a temp file
$certContent = "-----BEGIN CERTIFICATE-----`r`n"
for ($i = 0; $i -lt $x5c.Length; $i += 64) {
    $len = [Math]::Min(64, $x5c.Length - $i)
    $certContent += $x5c.Substring($i, $len) + "`r`n"
}
$certContent += "-----END CERTIFICATE-----"
$certContent | Out-File -FilePath "C:\tmp\casdoor-cert.pem" -Encoding ASCII -NoNewline

Write-Host "Certificate saved to C:\tmp\casdoor-cert.pem"
Write-Host ""
Write-Host "x5c value (first 100 chars): $($x5c.Substring(0, 100))..."
Write-Host ""
Write-Host "Full certificate:"
Write-Host $certContent
