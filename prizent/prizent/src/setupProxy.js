const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('[SetupProxy] Configuring proxy middleware...');
  
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      pathRewrite: function (path, req) {
        // The middleware strips /api, so we need to add it back
        const newPath = '/api' + path;
        console.log('[Proxy] Rewriting path:', path, '->', newPath);
        return newPath;
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('[Proxy] Proxying:', req.method, req.originalUrl);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('[Proxy] Response:', proxyRes.statusCode, req.originalUrl);
      },
      onError: (err, req, res) => {
        console.error('[Proxy] Error:', err.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Proxy error: ' + err.message);
      }
    })
  );
  
  console.log('[SetupProxy] Proxy middleware configured successfully');
};
