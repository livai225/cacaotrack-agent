const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 4000;
const TARGET_URL = 'http://localhost:3000'; // Utiliser le backend local pour tester les correctifs

app.use(cors());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[Proxy] ${req.method} ${req.url}`);
  next();
});

// Proxy middleware options
const apiProxy = createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true, // Needed for virtual hosted sites
  ws: true, // Proxy websockets
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    // console.log(`[ProxyReq] Forwarding to: ${TARGET_URL}${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[ProxyRes] Response status: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('[ProxyError]', err);
    res.status(500).send('Proxy Error');
  }
});

// Forward all requests to the target
app.use('/', apiProxy);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  =================================================
  🚀 LOCAL PROXY SERVER RUNNING
  =================================================
  
  Listening on: http://localhost:${PORT}
  Forwarding to: ${TARGET_URL}
  
  For Android Emulator, use: http://10.0.2.2:${PORT}
  
  =================================================
  `);
});
