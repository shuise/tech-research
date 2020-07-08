const http = require('http');
const c = require('child_process');

const hostname = '127.0.0.1';

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World 3000......\n');
});

server.listen(3000, hostname, () => {
	var url = `http://${hostname}:3000`;
	c.exec("open " + url);
	console.log("服务器运行在 " + url);
});

const server2 = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World 4000\n');
});

server2.listen(4000, hostname, () => {
	var url = `http://${hostname}:4000`;	
  c.exec("open " + url);
	console.log("服务器运行在 " + 4000);
});

//http://dev.dafan.info/detail/331257?p=13

const httpProxy = require('http-proxy'),
    proxy = httpProxy.createProxyServer({});

proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something went wrong.');
});

var server3 = http.createServer(function(req, res) {
    var host = req.headers.host;
    switch (host){
         case 'f.rongcloud.cn:8080':
             proxy.web(req, res, { target: 'http://localhost:3000' });
         break;
         default:
            proxy.web(req, res, { target: 'http://localhost:4000' });
    }
    console.log("proxy 8080 success");
});
server3.listen(8080);
c.exec("open http://f.rongcloud.cn:8080");
