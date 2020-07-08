function ScrollBar(){
    this.scrollMoveObj = null;
    this.scrollPageY = 0;
    this.scrollY = 0;
    this.scrollDivList = new Array();
    this.dragdv = new Array();
}

/*
* obj: 需要加滚动条的模块
* barId：滚动条的id名
* barspacing: 滚动条跟内容之间的间距
* barAutoHeight: 滚动条是否随内容设置高
*/
ScrollBar.prototype.init = function(obj,opt){
    var _this = this;

    var _opt = {
        "barId" : '',
        "barspacing" : 0, //滚动条与滚动内容之间的间距
        "barAutoHeight" : false //滚动条高默认不随内容变化，固定高
    };
    opt = opt || {};
    this.opt = _this.copy(opt,_opt);
    
    _this.CreateScrollBar(obj);

    //当页面大小发生变化时，重新计算滚动条位置
    window.onresize = function(){
        for(var i=0; i<_this.scrollDivList.length; i++) {
            _this.scrollResetSize(_this.scrollDivList[i]);
        }
    }

    var _tempmousemove = document.documentElement.onmousemove;
    var _tempmouseup = document.documentElement.onmouseup;

    document.documentElement.onmousemove = function(evt){
        _tempmousemove&&_tempmousemove();

        if(!_this.scrollMoveObj)return;
        evt = evt || event;
        var per = (_this.scrollMoveObj.scrollHeight - _this.scrollMoveObj.clientHeight) / (_this.scrollMoveObj.clientHeight - _this.scrollMoveObj.scrollBarHeight)
        _this.scrollMoveObj.scrollTop = _this.scrollY - (_this.scrollPageY - evt.clientY) * per;
        _this.setScrollPosition(_this.scrollMoveObj);
    }
    document.documentElement.onmouseup = function(evt){
        _tempmouseup&&_tempmouseup();

        if(!_this.scrollMoveObj)return;
        _this.scrollMoveObj = null;
        document.body.onselectstart = function(){return true};
    }
}

//创建滚动条
ScrollBar.prototype.CreateScrollBar = function(obj){
    var _this = this;
    var version = _this.getBrowserVersion();

    //当内容未超出现在高度时，不添加滚动条    
    if(!obj || obj.scrollHeight <= obj.clientHeight || obj.clientHeight == 0) {
        return;
    }

    obj.scrollBar = document.createElement('div');
    document.body.appendChild(obj.scrollBar);
    obj.scrollBarIndex = document.createElement('span');
    obj.scrollBar.appendChild(obj.scrollBarIndex);
    obj.scrollBar.style.position = 'absolute';
    obj.scrollBarIndex.style.position = 'absolute';
    obj.scrollBar.className = "divScrollbar";
    obj.scrollBar.id = _this.opt.barId;
    
    _this.scrollDivList.push(obj);
    _this.scrollResetSize(obj);
    
    //使用鼠标滚轮滚动
    obj.scrollBar.scrollDiv = obj;
    obj.scrollBarIndex.scrollDiv = obj;
 
    if(version == "msie"){
        obj.onmousewheel = _this.scrollMove;
    }else if(version == "firefox"){
        obj.addEventListener('DOMMouseScroll',_this.scrollMove,false);
    }else{
        obj.onmousewheel = _this.scrollMove;
    }
    obj.scrollBar.onmousewheel = _this.scrollMove;
    obj.scrollBarIndex.onmousewheel = _this.scrollMove;
    _this.dragdv.push(obj);

    //拖动滚动条滚动
    obj.scrollBarIndex.onmousedown = function(evt){
       // evt = evt || event;
        var e = window.event || evt;
        _this.scrollPageY = evt.clientY;
        _this.scrollY = this.scrollDiv.scrollTop;
        document.body.onselectstart = function(){return false};
        _this.scrollMoveObj = this.scrollDiv;

        return false;
    }
}

//根据滚动条高度判断滚动条是否显示，再设置滚动条位置
ScrollBar.prototype.scrollResetSize = function(obj){
    var _this = this;
    if(obj.scrollHeight <= obj.clientHeight){
        obj.scrollTop = 0;
        obj.scrollBar.style.display = 'none';
    } else {
        obj.scrollBar.style.display = 'block';
    }

    var x=0, y=0;
    var p = obj;
    while(p) {
        x += p.offsetLeft;
        y += p.offsetTop;
        p = p.offsetParent;
    }

    var borderTop = parseInt(obj.style.borderTopWidth||0);
    var borderBottom = parseInt(obj.style.borderBottomWidth||0);
    obj.scrollBar.style.height = obj.clientHeight + 'px';
    obj.scrollBar.style.top = y + borderTop +'px'; 
    obj.scrollBar.style.left = x + obj.offsetWidth + _this.opt.barspacing + 'px'; 

    var h;
    if(_this.opt.barAutoHeight){
        //滚动条随内容变化高，当滚动条滑块最小20个像素
        h = obj.clientHeight - (obj.scrollHeight - obj.clientHeight);
        if(h < 20) {
            h = 20;
        }
    }else{
        h=70; //设置滚动条样式70高
    }
    
    obj.scrollBarHeight = h;
    obj.scrollBarIndex.style.height = h + 'px';
    _this.setScrollPosition(obj);
}

ScrollBar.prototype.setScrollPosition = function(obj){
    obj.scrollBarIndex.style.top = (obj.clientHeight - obj.scrollBarHeight) * obj.scrollTop / (obj.scrollHeight - obj.clientHeight) + 'px';
}

//鼠标滚轮滚动
ScrollBar.prototype.scrollMove = function(evt){
    var _this = ScrollBar.prototype;

    var div = _this.scrollDiv || this;
    if(div.scrollHeight <= div.clientHeight) return true;
    var e = window.event || evt;
    var temp;
    if(e.wheelDelta){
        temp = e.wheelDelta;
    }else if(e.detail){
        temp = -e.detail;
    }

    var step = 20;
    if(temp < 0) {
        if(div.scrollTop >= (div.scrollHeight - div.clientHeight)) return true;
        div.scrollTop += step;        
    } else {
        if(div.scrollTop == 0) return true;
        div.scrollTop -= step;
    }

    _this.stopDefault(evt);
    _this.setScrollPosition(div);
    
    return false;
}

/*
*设置内容滚动的位置
*top内容的offsetHeight
*nHeight每条新闻的高度，针对教育首页新闻列表
*/
ScrollBar.prototype.contentSetScrollPosition = function(obj,top,nHeight) {
    var _h = 200 || nHeight; 

    obj.scrollTop = top - _h;
    //70为滚动条高度
    obj.scrollBarIndex.style.top = top - _h - 70 + 'px';
}

ScrollBar.prototype.stopDefault = function(e){
    if(e && e.preventDefault){
        e.preventDefault();
    }else{
        window.event.returnValue = false;
    }

    return false;
}

ScrollBar.prototype.copy = function(a,b){
    for (var p in b){
        if (a[p] == 'undefined' || a[p] == null){
            a[p] = b[p];
        }
    }
    return a;
}

//浏览器版本
ScrollBar.prototype.getBrowserVersion = function(){
    var browser = {};
    var userAgent = navigator.userAgent.toLowerCase();
    var s;
    var version;
    (s = userAgent.match(/msie ([\d.]+)/)) ? browser.ie = s[1] : (s = userAgent.match(/firefox\/([\d.]+)/)) ? browser.firefox = s[1] : (s = userAgent.match(/chrome\/([\d.]+)/)) ? browser.chrome = s[1] : (s = userAgent.match(/opera.([\d.]+)/)) ? browser.opera = s[1] : (s = userAgent.match(/version\/([\d.]+).*safari/)) ? browser.safari = s[1] : 0;

    if (browser.ie) {
        version = 'msie';
    } else if (browser.firefox) {
        version = 'firefox';
    } else if (browser.chrome) {
        version = 'chrome';
    } else if (browser.opera) {
        version = 'opera';
    } else if (browser.safari) {
        version = 'safari';
    } else {
        version = '未知的浏览器类型';
    }

    return version;
}


