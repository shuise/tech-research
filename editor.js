/*
需要处理（匹配时大小写的问题）：
 1：回车换行 "\r\n" "\n"
 2：空格
 3：粘贴时的回行、空格、缩进 "\t" " "  "&#160;"
 4：链接识别转化  http、https、www、rongclod.cn
 5：特殊字符安全处理 <、>、
 6：过滤操作附加的冗余html
 7：表情处理
 8：@ 识别处理
 9：代码片段 特殊显示
10：


docs:
http://imweb.io/topic/56e804ef1a5f05dc50643106
http://www.haorooms.com/post/js_kong_ge
*/ 


function editor(content){
	content = content || "";
	if(content == ""){
		return "";
	}

	var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;

	content = content.replace(/<(.+?)>/gi,"&lt;$1&gt;");

	content =  content.replace(reg, '<a href="$1$2" target="_blank">$1$2</a>');

	// content = content.replace(/ /gi,"&#160;");
	
	content = content.replace(/\t/gi,"&#160;&#160;&#160;&#160;");

	content = content.replace(/\r\n/gi,"<br/>");
	content = content.replace(/\n/gi,"<br/>");


	return content;
}