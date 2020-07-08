;(function(window){
var autoComplete=function(o){
    var handler=(function(){
        var handler=function(e,o){ return new handler.prototype.init(e,o); };
        handler.prototype={
            e:null, o:null, timer:null, show:0, input:null, popup:null,
            config:{
                version: 1.0 ,
                dubug:true,
                global_key_pre:'search_key_'
            },
            init:function(e,o){
                this.e=e, this.o=o;
                var inp=this.o.input || 'input',popup = this.o.popup || 'ul';
                this.input=this.e.getElementsByTagName(inp)[0],
                this.popup=this.e.getElementsByTagName(popup)[0],
                this.initEvent();
            },
            fill_page:function(quickExpr,value,source){/* 生成提示 */
                var li = null,i_html='';
                for(var i in source){
                    if( value.length>0 && quickExpr.exec(source[i])!=null ){
                        i_html += '<li><a href="javascript:;">'+source[i]+'</a></li>';                        
                    }
                }
                if(i_html){
                    this.popup.innerHTML = i_html;
                }
                if(this.popup.getElementsByTagName('a').length){
                    this.popup.style.display='block';
                }else{
                    this.popup.style.display='none';
                }      
            },
            ajax:function(type,url,quickExpr,search){
                var that = this,key=this.config.global_key_pre+search;
                if(window[key]){ //如果此前有搜索该关键字,不请求接口
                    that.fill_page(quickExpr,search,window[key]);
                    return;  
                }
                var xhr = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
                xhr.open(type,url,true);
                // xhr.setRequestHeader("If-Modified-Since",0); 
                xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                xhr.onreadystatechange = function(){
                    if(xhr.readyState==4) {
                        if(xhr.status==200) {
                            var data = eval(xhr.responseText);
                            window[key] = data;
                            that.fill_page(quickExpr,search,data);
                        }else{
                            alert("请求接口异常!");
                        }
                    }
                };
                xhr.send(null);
            },
            fetch:function(ajax,search,quickExpr){
                var that=this;
                this.ajax(ajax.type,ajax.url+search,quickExpr,search);
            },
            initEvent:function(){
                var that=this;
                this.input.onfocus = function(){  
                    if(this.inputValue) this.value = this.inputValue;
                    var value=this.value, quickExpr=RegExp('^'+value,'i'), self=this;
                    var els = that.popup.getElementsByTagName('a');
                    if(els.length>0) that.popup.style.display = 'block';
                    that.timer=setInterval(function(){
                        if(value!=self.value){
                            value=self.value;
                            that.popup.innerHTML='';
                            if(value!=''){
                                quickExpr=RegExp('^'+value);
                                if(that.o.source) that.fill_page(quickExpr,value,that.o.source);
                                else if(that.o.ajax) that.fetch(that.o.ajax,value,quickExpr);
                            }
                        }
                    },200);
                };
                this.input.onblur = function(){/*  输入框添加事件 */
                    if(this.value!=this.defaultValue) this.inputValue = this.value;
                    clearInterval(that.timer);
                    var current=-1;/* 记住当前有焦点的选项 */
                    var els = that.popup.getElementsByTagName('a');
                    var len = els.length-1;
                    var aClick = function(){
                        that.input.inputValue = this.firstChild.nodeValue;
                        that.popup.innerHTML='';
                        that.popup.style.display='none';
                        that.input.focus();
                    };
                    var aFocus = function(){
                        for(var i=len; i>=0; i--){
                            if(this.parentNode===that.popup.children[i]){
                                current = i;
                                break;
                            }
                        }
                        for(var k in that.o.elemCSS.focus){
                            this.style[k] = that.o.elemCSS.focus[k];
                        }
                    };
                    var aBlur= function(){
                        for(var k in that.o.elemCSS.blur)
                            this.style[k] = that.o.elemCSS.blur[k];
                    };
                    var aKeydown = function(event){
                        event = event || window.event;
                        if(current === len && event.keyCode===9){
                            that.popup.style.display = 'none';
                        }else if(event.keyCode==40){
                            current++;
                            if(current<-1) current=len;
                            if(current>len){
                                current=-1;
                                that.input.focus();
                            }else{
                                that.popup.getElementsByTagName('a')[current].focus();
                            }
                        }else if(event.keyCode==38){
                            current--;
                            if(current==-1){
                                that.input.focus();
                            }else if(current<-1){
                                current = len;
                                that.popup.getElementsByTagName('a')[current].focus();
                            }else{
                                that.popup.getElementsByTagName('a')[current].focus();
                            }
                        }
                    };
                    for(var i=0; i<els.length; i++){
                        els[i].onclick = aClick;
                        els[i].onfocus = aFocus;
                        els[i].onblur = aBlur;
                        els[i].onkeydown = aKeydown;
                    }
                };
                this.input.onkeydown = function(event){
                    event = event || window.event;
                    var els = that.popup.getElementsByTagName('a');
                    if(event.keyCode==40){
                        if(els[0]) els[0].focus();
                    }else if(event.keyCode==38){
                        if(els[els.length-1]) els[els.length-1].focus();
                    }else if(event.keyCode==9){
                        if(event.shiftKey==true) that.popup.style.display = 'none';
                    }
                };
                this.e.onmouseover = function(){ that.show=1; };
                this.e.onmouseout = function(){ that.show=0; };
            }
        };
        handler.prototype.init.prototype=handler.prototype;
        return handler;
    })();
    
    handler(this,o);
    return this;
};
return window.autoComplete = autoComplete;
})(window);

function log(info){
    if(window.console){
        console.log(info);
    }
}


/* 调用方法
 * config对象可指定是请求本地资源还是异步请求
 *      source : 本地资源，亦可以是静态文件
 *      ajax   : 异步请求数据
 *      input  : 触发事件的对象，默认为input输入框
 *      popup  : 下拉提示，默认为li显示
 */
var config = {
    // source:['0123','023',123,1234,212,214,'033333','0352342',1987,17563,20932],
    ajax:{ type:'post',url:'b.php?k=' },
    elemCSS:{ focus:{'color':'black','background':'#ccc'}, blur:{'color':'black','background':'transparent'} }
}
autoComplete.call(document.getElementById('autoComplete'), config);
