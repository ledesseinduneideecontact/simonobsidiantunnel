# Obsidian Proxy Railway

Proxy pour URL fixe Obsidian via Railway.

## Déploiement

1. Connecte Railway à ce dossier
2. Configure la variable TUNNEL_URL
3. Deploy !

## URLs

- Proxy: https://your-app.railway.app/vault/
- Status: https://your-app.railway.app/tunnel-status
- Health: https://your-app.railway.app/health

## Mise à jour tunnel

```bash
curl -X POST https://your-app.railway.app/update-tunnel \
  -H "Content-Type: application/json" \
  -d '{"url": "https://nouvelle-url.lhr.life"}'
```
