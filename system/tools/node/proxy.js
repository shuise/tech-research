var http = require('http');
var urlUtil = require('url');
var iconv = require('iconv-lite');
var querystring = require('querystring');

exports.get = function(req, res){
    var options = req._parsedUrl;
    var params = querystring.parse(options.query);
    var url = urlUtil.parse(params.url);
    var charset = params.charset || 'UTF-8';
    url.headers = {};
    for(var key in req.headers){
        if(/host|accept/i.test(key)) continue;
        url.headers[key] = req.headers[key];
    }
    http.get(url, function(_res){
        _res.setEncoding('binary');//or hex
        var html = '';
        _res.on('data', function (chunk) {
            html += chunk;
        });
        _res.on('end', function(){
            html = iconv.decode(new Buffer(html, 'binary'), charset);
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
            res.end(html);
        });
    });
}

function procJson(url, method, content, callback){
    var host = url.replace(/.*?\/\//, '').replace(/[:\/].*/, '');
    var options = {
        hostname: host,
        path: url.replace(/.*?\/\/.*?\//, '/'),
        method: method,
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8',
            'Transfer-Encoding': 'chunked', //没有的话延迟5s
            "Content-Length": Buffer.byteLength(content)
        }
    };
    var req = http.request(options, function(_res){
        _res.setEncoding('UTF-8');//or hex
        var html = '';
        _res.on('data', function (chunk) {
            html += chunk;
        });
        _res.on('end', function(){
            callback(new Buffer(html,'UTF-8'));
        });
    });
    req.write(content + '\n');
    req.end();
}

exports.post = function(req, res){
    var body = '', options = req._parsedUrl;
    var params = querystring.parse(options.query);
    var url = params.url;
    req.on('data', function(data){
        body += data;
    });
    req.on('end', function(){
        //options = JSON.parse(body);
        procJson(url, 'POST', body, function(html){
            res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
            res.end(html);
        });
    });
};

exports.delete = function(req, res){
    var body = '', options = req._parsedUrl;
    var params = querystring.parse(options.query);
    var url = params.url;
    req.on('data', function(data){
        body += data;
    });
    req.on('end', function(){
        procJson(url, 'DELETE', body, function(html){
            res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
            res.end(html);
        });
    });
};
