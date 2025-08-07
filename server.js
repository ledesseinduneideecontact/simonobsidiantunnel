// server.js - Proxy Railway pour URL fixe Obsidian
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// URL localhost.run actuelle (à mettre à jour via variable d'environnement)
let CURRENT_TUNNEL_URL = process.env.TUNNEL_URL || 'https://5ff86519f227dd.lhr.life';

// Middleware pour logs
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Endpoint pour mettre à jour l'URL du tunnel
app.post('/update-tunnel', express.json(), (req, res) => {
    const { url } = req.body;
    if (url && url.includes('lhr.life')) {
        CURRENT_TUNNEL_URL = url;
        console.log(`Tunnel URL updated to: ${CURRENT_TUNNEL_URL}`);
        res.json({ success: true, message: 'Tunnel URL updated', url: CURRENT_TUNNEL_URL });
    } else {
        res.status(400).json({ success: false, message: 'Invalid URL' });
    }
});

// Endpoint pour vérifier l'URL actuelle
app.get('/tunnel-status', (req, res) => {
    res.json({ 
        current_url: CURRENT_TUNNEL_URL,
        status: 'active',
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Proxy vers Obsidian via localhost.run
app.use('/vault', createProxyMiddleware({
    target: CURRENT_TUNNEL_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/vault': '/vault' // Garde le chemin /vault
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.status(502).json({ 
            error: 'Tunnel unavailable', 
            message: 'Update tunnel URL via POST /update-tunnel',
            current_url: CURRENT_TUNNEL_URL 
        });
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying ${req.method} ${req.path} to ${CURRENT_TUNNEL_URL}`);
    }
}));

// Endpoint racine
app.get('/', (req, res) => {
    res.json({
        service: 'Obsidian Proxy',
        tunnel_url: CURRENT_TUNNEL_URL,
        endpoints: {
            vault: '/vault/*',
            update_tunnel: 'POST /update-tunnel',
            status: '/tunnel-status',
            health: '/health'
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Obsidian Proxy running on port ${PORT}`);
    console.log(`📡 Proxying to: ${CURRENT_TUNNEL_URL}`);
    console.log(`🔗 Railway URL will be: https://your-app.railway.app`);
});

module.exports = app;
