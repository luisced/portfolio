// A tiny static server for ./dist (the room's worker needs http, it does not run from file://).
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, 'dist'), port = +process.env.PORT || 4325;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8' };
http.createServer((req, res) => {
  let file = path.normalize(path.join(root, decodeURIComponent(req.url.split('?')[0])));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, () => console.log('portfolio-v5 on http://localhost:' + port));
