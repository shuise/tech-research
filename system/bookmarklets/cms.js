(function(){
  /*
   功能菜单：
   进入发布器
   一键转载
   快速编辑
   页面检查(链接重复,文章过期,SEO)
   缓存清理
   */

  /*
   浏览器需要支持localStorage+doucment.querySelector
   */

  var d = document, w = window;
  if(!d.querySelector && !w.localStorage){
	alert("请使用chrome，firefox，safari，IE9+等高级浏览器。");
	return false;
  }
  var config = {
    exp1: parseInt(localStorage.cms_config_exp1) || 8,
    exp2: parseInt(localStorage.cms_config_exp2) || 16,
    topicid: localStorage.cms_config_topicid || "00014AED"
  }
  var cls = {
    dupIndicator: "necms_dup_indicate"
  }

  var _style = ['.necms_wrap{width:100px;border:1px solid #ccc;background:#f5f5f5;border-shadow:3px 3px 3px #ddd;font-size:14px;line-height:20px;padding-bottom:10px;position:fixed;top:50px;right:10px;z-index:10000;}',
				'.necms_wrap *{margin:0;padding:0;list-style:none;}',
				'[data-exp]{position:relative;}',
				'[data-exp]:after{text-indent:0;font-weight:normal;content:attr(data-exp);position:absolute;right:-15px;top:-7px;padding:1px 2px;font-size:12px;transform:scale(0.9);border:1px solid red;color:red;background:#eee;text-align:center;line-height:1;border-radius:2px;box-shadow:0 0 2px solid #999;-webkit-box-shadow:0 0 2px solid #999;-moz-box-shadow:0 0 2px solid #999;z-index:10}',
				'.necms_exp_1{background:yellow;}',
				'.necms_exp_2{background:red !important;}',
				'.necms_exp_2,.necms_exp_2 *{color:#f0f0f0 !important}',
				'.necms_dup{font-weight:bold;outline:1px solid red}',
				'.necms_dup_cross{position:absolute;right:0}',
				'.necms_dup_cross:before{content:"";position:absolute;left:-1600px;right:0;height:1px;background:#555}',
				'.necms_dup_cross:after{content:"";position:fixed;top:0;height:100%;width:1px;background:#555}',
				'.necms_wrap a{font-size:12px;color:#369;display:block;padding:5px 10px;}',
				'.necms_wrap_pop {width:400px;opacity:0.93;font-size:14px;line-height:18px;border:1px solid #ccc;background:#fff;padding:15px;max-height:300px;overflow:auto;position:fixed;top:50px;right:110px;z-index:10000;}',
				'.necms_wrap_pop *{font-size:12px;}',
				'.necms_wrap_pop h2{font-weight:bold;}',
				'.necms_dup_indicate{cursor:pointer;margin:0 3px;}',
				'.necms_dup_indicate:hover{text-decoration:underline;font-weight:bold}',
				'.necms_wrap_pop li{padding:5px;}',
				'.necms_wrap_pop label{display:inline-block;width:75px;}',
				'.necms_wrap h2{font-size:14px;background:#000;padding:5px;color:#fff;margin-bottom:10px;}'].join("");
  
  /*
   文章页地址规则：
   域名/年/月日/小时/文章ID（docid），docid去除前8位即为topicid
   http://news.163.com		/15/	0104/	02/	AF367PQ700014AED	.html
   */
  var urlModel = /^http:\/\/[\w\.]+.163.com\/\d{2}\/\d{4}\/\d{2}\/\w+?\.html/;
  var cms_cross = document.createElement("div");
  cms_cross.className = "necms_dup_cross";
  document.body.appendChild(cms_cross);
  var tpl = ['<h2>发布器助手</h2>'];
  if(/163\.com$/.test(location.host)){
    if(urlModel.test(location.href)){ //文章页
      tpl.push('<a href="javascript:void(0)" class="cms_edit" target="_self">快速编辑</a>');
    }else{
      tpl.push('<a href="javascript:void(0)" class="cms_check" target="_self">页面检查</a>');
    }
  }else{
    tpl.push('<a href="javascript:void(0)" class="cms_post" target="_self">一键转载</a>');
  }
  tpl.push('<a href="javascript:void(0)" class="cms_clean" target="_self">缓存清理</a>');
  tpl.push('<a href="javascript:void(0)" class="cms_config" target="_self">设置</a>');
  tpl.push('<a href="https://cms.ws.netease.com/login.jsp" class="cms_link" target="_blank">进入发布器</a>');
  var _css = d.createElement("style");
  _css.innerHTML = _style;
  d.head.appendChild(_css);
  var target = d.createElement("div");
  target.classList.add("necms_wrap");
  target.innerHTML = tpl.join("");
  d.body.appendChild(target);
  var doms = {
    cms_config: target.querySelector(".cms_config"),
    cms_check: target.querySelector(".cms_check"),
    cms_edit: target.querySelector(".cms_edit"),
    cms_clean: target.querySelector(".cms_clean"),
    cms_post: target.querySelector(".cms_post"),
    cms_cross: cms_cross
  }


  /*
   config
   */
  if(doms.cms_config) doms.cms_config.onclick = function(){
	var tpl = ['<ul>',
			   '<li><label for="">转帖topicid：</label><input type="text" _key="cms_config_topicid" value="00014AED" require></li>',
			   '<li><label class="necms_exp_1">一般过期：</label><input type="text" value="8" _key="cms_config_exp1" type="number" require> 小时</li>',
			   '<li><label  class="necms_exp_2">严重过期：</label><input type="text" value="16" _key="cms_config_exp2" type="number" require> 小时</li>',
			   '<li><label for="">&#160;</label><input type="button" value="确定" id="cms_config_ok"></li>',
			   '</ul>'].join("");
	var _wrap = d.querySelector("#cms_config_pop");
	if(!_wrap){
	  _wrap = d.createElement("div");
	  _wrap.id = "cms_config_pop";
	  d.body.appendChild(_wrap);
	}
	_wrap.innerHTML = tpl;
	var inps = _wrap.querySelectorAll("input");
	for(var i=0,len=inps.length-1;i<len;i++){
	  var key = inps[i].getAttribute("_key");
	  if(localStorage[key]) inps[i].value = localStorage[key];
	}
	_wrap.classList.add("necms_wrap_pop");
	_wrap.style.cssText = "width:300px;top:135px;";


	var btn = document.querySelector("#cms_config_ok");
	btn.onclick = function(){
	  //var inps = _wrap.querySelectorAll("input");
	  for(var i=0,len=inps.length-1;i<len;i++){
		var key = inps[i].getAttribute("_key");
		localStorage.setItem(key,inps[i].value);
	  }
	  alert("配置成功");
	  d.body.removeChild(_wrap);
	}
  }

  /*
   一键转载
   等接口

   var api = "https://cms.ws.netease.com/capture/tools/repost";
   参数名称	参数说明
   url	必选，要转载的文章地址。
   topicid	 必填，编辑输入。
   content	"可选，要转载的文章HTML内容，目前没有在用。
   content为空时，后台会请求参数url获取content。"
   */
  if(doms.cms_post) doms.cms_post.onclick = function(){
	var api = "https://cms.ws.netease.com/capture/tools/repost?";
	var url = location.href, topicid;
    if((topicid = prompt("请输入要转载到的栏目(topicid)", config.topicid))){
      if(/^\w{8}$/.test(topicid)){
        localStorage.setItem("cms_config_topicid", topicid);
	    window.open(api + "topicid=" + topicid + "&url=" + url);
      }else{
        alert("topicid格式不正确");
      }
    }
  }



  /*
   快速编辑
   原文：http://news.163.com/15/0104/02/AF367PQ700014AED.html
   编辑地址：https://cms.ws.netease.com/post/edit_test.jsp?docid=AF367PQ700014AED&topicid=00014AED
   */
  if(doms.cms_edit) doms.cms_edit.onclick = function(){
	if(location.host.indexOf("163.com") == -1){
	  return false;
	}
	var url = location.href;
	if(!urlModel.test(url)){
	  alert("非发布器生成的文章页.");
	  return false;
	}
	url = url.split("/");
	var docid = url[url.length-1];
	docid = docid.split(".html")[0].replace(/_.*/, '');
	var topicid = docid.substring(8,docid.length);
	var cmsUrl = "https://cms.ws.netease.com/post/edit_test.jsp?docid=" + docid + "&topicid=" + topicid;
	window.open(cmsUrl);
	return false;
  }


  /*
   链接重复
   判断url是否相同（忽略queryString与hash）

   信息老旧(仅限文章页)
   根据url里的时间做判断
   可设置三个级别的过期标准：正常，过期，严重过期
   以8小时为一个默认周期
   */
  var cmsCheck = function(){
	var checkData = {};
	var mutLinks = {};
    var now = +new Date;
	var links = document.querySelectorAll("a");
	for(var i=0,len=links.length;i<len;i++){
	  var link = links[i];
	  //移除queryString+hash
	  var url = (link.getAttribute("href") || "").split(".html")[0] + ".html";
      if(location.href.indexOf(url) > -1) continue; //当前页
	  //url model:http://news.163.com/15/0103/16/AF21AK8E00014JB5.html
	  if(urlModel.test(url)){
		//过期判断
        if(!urlModel.test(location.href)){ //文章页不做过期判断
          var articleInfo = url.split("/");
		  var publicYear = "20" + articleInfo[3];
		  var publicDate = articleInfo[4];
		  var publicTime = articleInfo[5];
          var datetime = +new Date(publicYear + "/" + publicDate.replace(/(..)/, "$1/") + " " + publicTime + ":00");
		  var diff = Math.round((now - datetime) / (3600*1000));
		  link.setAttribute("_diff",diff);
		  if(config.exp1 < diff && diff < config.exp2){
		    link.classList.add("necms_exp_1");
            link.setAttribute("data-exp", diff);
		    link.title = "过期，"+diff+"小时以前的更新";
		  }
		  if(diff >= config.exp2){
		    link.classList.add("necms_exp_2");
            link.setAttribute("data-exp", diff);
		    link.title = "严重过期，"+diff+"小时以前的更新";
		  }
        }
        if(!link.offsetTop && !link.offsetLeft) continue;
		//重复判断
        if(!mutLinks[url]) mutLinks[url] = [];
        mutLinks[url].push(link);
		if(!checkData[url]){
		  //link.innerHTML 过滤html格式
		  checkData[url] = getStr(link.innerHTML);
		}

	  }
	}

    function getMulIndicator(url, len){
      var html = '';
      for(var i = 0; i < len; i ++){
        html += '<span class="'+cls.dupIndicator+'" data-dup="'+url+'">' + (i+1) + '</span>';
      }
      return html;
    }
	var html = '<h2>重复链接：</h2><span style="position:absolute;right:10px;top:10px;color:red;cursor:pointer;" id="cms_mut_pop_close">X</span>';
	for(var url in mutLinks)if(mutLinks[url].length > 1){
	  html += '<a href="' + url + '" style="decoration:underline;font-size:12px;">' + checkData[url] + '</a><em style="color:red;margin-left:20px;">' + ':    ' + mutLinks[url].length + '次( '+getMulIndicator(url, mutLinks[url].length)+' )</em><br>';
	}
	var _pop = d.querySelector("#cms_mut_pop");
	if(!_pop){
	  _pop = d.createElement("div");
	  _pop.id = "cms_mut_pop";
	  d.body.appendChild(_pop);
	}
	_pop.innerHTML = html;
	_pop.classList.add("necms_wrap_pop");
    _pop.onmouseover = function(e){ //高亮重复链接
      var target = e.target, url, links, idx = 0;
      if(tagLC(target) == 'a'){
        url = target.getAttribute("href");
        links = mutLinks[url];
      }else if(target.classList.contains(cls.dupIndicator)){
        url = target.getAttribute("data-dup");
        links = mutLinks[url];
        idx = parseInt(target.innerHTML) - 1;
      }
      if(links){
        links.forEach(function(link){
          link.classList.add("necms_dup");
        });
        var emLink = links[idx];
        if(emLink){ //滚动视图
          var pos = getPos(emLink);
          if(top){
            document.body.scrollTop = pos.top - 100;
            document.documentElement.scrollTop = pos.top - 100;
          }
          if(doms.cms_cross){
            doms.cms_cross.style.display = "block";
            doms.cms_cross.style.left = pos.left + emLink.offsetWidth/2 + "px";
            doms.cms_cross.style.top = pos.top + emLink.offsetHeight/2 + "px";
          }
        }
      }
    }
    _pop.onmouseout = function(e){
      var target = e.target, url, links, emLink;
      if(doms.cms_cross){
        doms.cms_cross.style.display = "none";
      }
      if(tagLC(target) == 'a'){
        url = target.getAttribute("href");
        links = mutLinks[url];
      }else if(target.classList.contains(cls.dupIndicator)){
        url = target.getAttribute("data-dup");
        links = mutLinks[url];
      }
      if(links) links.forEach(function(link){
        link.classList.remove("necms_dup");
      });
    }

	var _close = d.querySelector("#cms_mut_pop_close");
	if(_close){
	  _close.onclick = function(){
		d.body.removeChild(_pop);
	  }
	}

	return false;
  }
  if(/163\.com$/.test(location.host)) cmsCheck();
  if(doms.cms_check) doms.cms_check.onclick = cmsCheck;

  /*
   缓存清理
   */
  if(doms.cms_clean) doms.cms_clean.onclick = function(){
	//todo
	location.reload(true);
	return false;
  }

  function getPos(node){
    var pos = {left:0,top:0};
    if(!node || node.nodeType !== 1) return pos; 
    pos.left = node.offsetLeft; 
    pos.top = node.offsetTop;
    while( node.offsetParent ){
      node = node.offsetParent; 
      pos.left += node.offsetLeft; 
      pos.top += node.offsetTop;
    }
    return pos;
  }
  function getStr(str) {
	str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
	str.value = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
	//str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
	return str;
  }
  function tagLC(node) {return node && node.nodeName ? node.nodeName.toLowerCase() : "";};
})();
