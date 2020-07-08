var http = require('http');
var iconv = require('iconv-lite');
var querystring = require('querystring');

exports.get = function(req, res){
    var options = req._parsedUrl;
    var params = querystring.parse(options.query);
    var url = params.url;
    var charset = params.charset || 'UTF-8';
    http.get(url, function(_res){
        _res.setEncoding('binary');//or hex
        var html = '';
        _res.on('data', function (chunk) {
            html += chunk;
        });
        _res.on('end', function(){
            //console.log(_res);

            html = iconv.decode(new Buffer(html, 'binary'), charset);
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
            res.end(html);
        });
    });
} 
