# update-tunnel.ps1
# Script pour auto-update l'URL Railway quand localhost.run change

$RAILWAY_PROXY_URL = "https://obsidian-proxy.railway.app"

# Récupère la nouvelle URL du tunnel
$newUrl = docker logs obsidian-localhost-tunnel | Select-String "lhr.life" | Select-Object -Last 1
if ($newUrl -match "https://([a-f0-9]+\.lhr\.life)") {
    $tunnelUrl = "https://$($matches[1])"
    
    Write-Host "Nouvelle URL détectée: $tunnelUrl"
    
    # Met à jour Railway
    $body = @{
        url = $tunnelUrl
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$RAILWAY_PROXY_URL/update-tunnel" -Method POST -Body $body -ContentType "application/json"
        Write-Host "✅ URL Railway mise à jour: $($response.url)"
    }
    catch {
        Write-Host "❌ Erreur mise à jour Railway: $($_.Exception.Message)"
    }
}
else {
    Write-Host "❌ Aucune URL localhost.run trouvée"
}
