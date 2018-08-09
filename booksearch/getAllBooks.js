// http://nodejs.cn/api/modules.html#modules_accessing_the_main_module

var http = require('http');
var https = require('https');

//https://www.npmjs.com/package/cheerio
var cheerio = require('cheerio');


var baseUrl = "https://book.douban.com/people/shuise_8j/wish?sort=time&filter=all&mode=list&tags_sort=count&start=";

var url = baseUrl + "0";
var joinStr = "============";
var pageSize = 30;

function getAllData(callback){
    getBookData(url,function(data){
        var pages = data.pages + 1;
        var list = data.result.join(joinStr);
        for(var i=1; i<pages; i++){
            var url = baseUrl + i*pageSize;
            getBookData(url,function(data){
                var r = data.result.join(joinStr);
                list += joinStr + r;

                if(list.split(joinStr).length/pageSize + 2 >= pages){
                    list = list.split(joinStr);
                    callback(list);
                }
            })
        }
    });
}

function getBookData(url, callback){
	https.get(url, function(res) {
	    var html = '';
	    // 获取页面数据
	    res.on('data', function(data) {
	        html += data;
	    });
	    // 数据获取结束
	    res.on('end', function() {
	        // 通过过滤页面信息获取实际需求的轮播图信息
	        var bookListInfo = getBookList(html);
	        // 打印信息
	        callback(bookListInfo);
	    });
	}).on('error', function() {
	    console.log('获取数据出错！');
	});
}

/* 过滤页面信息 */
function getBookList(html) {
    if (html) {
        // 沿用JQuery风格，定义$
        var $ = cheerio.load(html);

        var total = $("#db-usr-profile h1").text(); //我想读的书(107)
        	total = total.split(")")[0].split("(")[1];
        	total = Math.ceil(total/pageSize);

        var books = $(".item-show .title a");
        // var books = $("h1");
        var result = [];
        for(var i=0, n=books.length; i<n; i++){
            var title = $(books[i]).text();
            title.replace("\n","");
            result.push(title);
        }

        return {
          pages : total,
          result : result
        };
    } else {
        console.log('无数据传入！');
    }
}

function getPageContent(url,callback){
	var h = http;
	if(url.indexOf("https://") == 0){
		h = https;
	}
    h.get(url, function(res) {
	    var html = '';
	    // 获取页面数据
	    res.on('data', function(data) {
	        html += data;
	    });
	    // 数据获取结束
	    res.on('end', function() {
	        // console.log(html);
	        callback(html);
	    });
	}).on('error', function() {
	    console.log('获取数据出错！');
	});
}

function getDownloadLink(title,callback){
	title = title.split(" ").join("");
	var url = "http://www.ireadweek.com/index.php/Index/bookList.html?keyword=" + title;

	getPageContent(url, function(html){
		var $ = cheerio.load(html);
		var links = $("a");
		// for(var i=0;i<links.length;i++){
		// 	console.log($(links[i]).attr("href"))
		// }
		if(links.length == 7){
	    	var link = $(links[4]).attr("href");
	    	callback(link)
		}
	});
	// var url = "http://cn.epubee.com/books/?s=" + title;
	// window.open(url);
}

exports.getAllData = getAllData;
exports.getDownloadLink = getDownloadLink;
