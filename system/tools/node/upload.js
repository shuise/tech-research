var http = require('http');
var querystring = require('querystring');
var request = require('request');
var url = "http://upload.buzz.163.com/upload/image";

exports.post = function(req, res){
    var body = '', options = req._parsedUrl;
    var params = querystring.parse(options.query);
    var post = request({url:url, method:'post'});
    post.pipe(res);
    req.pipe(post);
};

exports.option = function(req, res){
    var body = '';
    var post = request({url:url, method:'option'});
    console.log(url);
    post.pipe(res);
    req.pipe(post);
};
