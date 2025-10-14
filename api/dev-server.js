const http = require('http');
const url = require('url');

const PORT = 3000;

const handlers = {
  '/api/health': require('./health.ts').default,
  '/api/auth/login': require('./auth/login.ts').default,
  '/api/auth/logout': require('./auth/logout.ts').default,
  '/api/auth/refresh': require('./auth/refresh.ts').default,
  '/api/errors/log': require('./errors/log.ts').default
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const handler = handlers[pathname];
  
  if (!handler) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const mockReq = {
        method: req.method,
        body: body ? JSON.parse(body) : {},
        query: parsedUrl.query,
        headers: req.headers
      };

      const mockRes = {
        status: (code) => {
          res.statusCode = code;
          return mockRes;
        },
        json: (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        }
      };

      await handler(mockReq, mockRes);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ API dev server running at http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  Object.keys(handlers).forEach(path => {
    console.log(`  - http://localhost:${PORT}${path}`);
  });
});
