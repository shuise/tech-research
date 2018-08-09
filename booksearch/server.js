const http = require('http');
const c = require('child_process');

const Books  = require('./getAllBooks.js');

const hostname = '127.0.0.1';

Books.getAllData(function(data){
    const server = http.createServer((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(data.join(""));
    });
    server.listen(3000, hostname, () => {
    	var url = `http://${hostname}:3000`;
    	c.exec("open " + url);
    	// console.log("服务器运行在 " + url);
    });
});


Books.getDownloadLink("三国志",function(link){
    console.log(link);
})
