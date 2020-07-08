var fs = require('fs');
var http = require('http');
var querystring = require('querystring');

exports.get = function(req, res){
  var body = '', options = req._parsedUrl;
  var params = querystring.parse(options.query);
  var url = "http://test.keyword.163.com/service/seodic/recommend.jsonp?word=" + params.word;
  http.get(url, function(_res){
    _res.setEncoding('UTF-8');//or hex
    var html = '';
    _res.on('data', function (chunk) {
      html += chunk;
    });
    _res.on('end', function(){
      html = new Buffer(html,'UTF-8');
      res.writeHead(200, {'Content-Type': 'application/javascript;charset=utf8'});
      res.end(params.callback + '(' + html + ')');
    });
  });
} 
