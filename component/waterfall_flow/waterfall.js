/*
*   waterfall  
*   Author:yaoguoli
*   new waterfall(container,cols,resizeable);
*   传入参数：
*   1.Container:容器对象
*   2.Cols：列对象
    {
      Colsnum：列数(当resizeable为ture时这个列数就无视了)
      Unit_width:每块砖的宽度 ，这个必须统一
    }
*   3.Resizeable: resize时是否需要改变布局（改变列数）可选
*   4.callback 可选
*   return {elems ,param,show ,hide ,trans,prev,next,addEvents,init}
*   返回参数：
*   {}(未定)
*  
*/
;(function(win){
    //做好兼容性的事件处理对象
    var EventUtil = {

        addHandler: function(element, type, handler){
            if (element.addEventListener){
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent){
                element.attachEvent("on" + type, handler);
            } else {
                element["on" + type] = handler;
            }
        },
        
        getButton: function(event){
            if (document.implementation.hasFeature("MouseEvents", "2.0")){
                return event.button;
            } else {
                switch(event.button){
                    case 0:
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                        return 0;
                    case 2:
                    case 6:
                        return 2;
                    case 4: return 1;
                }
            }
        },
        
        getCharCode: function(event){
            if (typeof event.charCode == "number"){
                return event.charCode;
            } else {
                return event.keyCode;
            }
        },
        
        getClipboardText: function(event){
            var clipboardData =  (event.clipboardData || window.clipboardData);
            return clipboardData.getData("text");
        },
        
        getEvent: function(event){
            return event ? event : window.event;
        },
        
        getRelatedTarget: function(event){
            if (event.relatedTarget){
                return event.relatedTarget;
            } else if (event.toElement){
                return event.toElement;
            } else if (event.fromElement){
                return event.fromElement;
            } else {
                return null;
            }
        
        },
        
        getTarget: function(event){
            return event.target || event.srcElement;
        },
        
        
        preventDefault: function(event){
            if (event.preventDefault){
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        },

        removeHandler: function(element, type, handler){
            if (element.removeEventListener){
                element.removeEventListener(type, handler, false);
            } else if (element.detachEvent){
                element.detachEvent("on" + type, handler);
            } else {
                element["on" + type] = null;
            }
        },
        
        setClipboardText: function(event, value){
            if (event.clipboardData){
                event.clipboardData.setData("text/plain", value);
            } else if (window.clipboardData){
                window.clipboardData.setData("text", value);
            }
        },
        
        stopPropagation: function(event){
            if (event.stopPropagation){
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        }

    };
    var waterfall = function(container,cols,resizeable,callback){
        var contain = container || null;
        console.log(contain);
        var col = {
            colnum: cols.colnum || 3,
            unit_width : cols.unit_width || 400
        }; //默认三列
        var colnum = col.colnum;

        var isResize = false;//默认不支持resize
        var callback = null; 
        var unitid = 0;

        //如果用户在实例化waterfall，填写参数不规范
        for (var i = 0; i < arguments.length; i++) {
            //根据参数的typeof值，各自赋值
            var type = typeof arguments[i];
            switch(type){
                case "boolean":
                isResize = arguments[i];
                break;
                case "function":
                callback = arguments[i]
            }
        }
        //client no border
        //offset add border
        function makewaterfall(container,cols){
            container.innerHTML = "";
            unitid = 0;

            var colnum = cols.colnum;
            var unit_width = cols.unit_width;
            var url;
            console.log(container,cols);
            //创建dom
            for (var i = 0; i < colnum; i++) {
                var div_col = document.createElement("div");
                div_col.id = "cols"+i;
                addClass(div_col,"col");
                div_col.style.width = unit_width + "px";
                container.appendChild(div_col);
            }

            addUnits(url,30);
            //数据的添加
            EventUtil.addHandler(window,"scroll",function(){
                if (document.body.clientHeight - (document.body.scrollTop + window.innerHeight) < 300 ) {
                    addUnits(url,10);
                }
            });
        }

        function addUnits(url,num){
            //去url里面请求数据，数量num
            var unitarray = [];
            for (var i = 0; i < num; i++) {
                //每个unit添加时 需要制定添加到那个列
                var unit = document.createElement("div");
                unit.style.width = col.unit_width+"px";
                unit.style.height = col.unit_width+"px";
                addClass(unit,"unit");
                addClass(unit,"unit"+unitid);
                unit.innerHTML = "<span class='unitid'>"+unitid+"</span>";
                var addcol = whichcolToadd();
                addcol.appendChild(unit);

                unitid++;
            }
        }

        function whichcolToadd(){
            var colsobj = contain.children;
            var col = colsobj[0];
            for (var i = 1; i < colsobj.length; i++) {
                if (colsobj[i].offsetHeight < col.offsetHeight) {
                    col = colsobj[i];
                }
            }
            return col;
        }

        function hasclassName(o,_css){
            var c = " "+o.className+" ";
            if(-1 === c.indexOf(" "+_css+" ")){
                return false;
            }
            return true;            
        }
        function addClass(o,_css) {
            if(!hasclassName(o,_css)){
                o.className +=" "+ _css; 
            }
        }
        function removeClass(o,_css){
            if(hasclassName(o,_css)){
                o.className = trim((" "+o.className+" ").replace(" "+_css+" "," "));
            }   
        }
        function trim(str){
            return str.replace(/^[\s\xA0]+/,'').replace(/[\s\xA0]+$/,'');
        }
        function containlistener(container,unit_width,colnum){
            var contain_width = getwidth(container);
            var nowcolum = Math.floor(contain_width / unit_width);
            if (colnum != nowcolum) {
                col.colnum = nowcolum;
                return nowcolum;
            }else{
                return false;
            }
        }
        function getwidth(o){
            return o.offsetWidth;
        }

        function init(){
            if (isResize) {
                //若支持resize 列数需要重新计算
                colnum = Math.floor(getwidth(container) / col.unit_width);
                col.colnum = colnum;
                console.log(colnum);
                makewaterfall(contain,col);
                //监听 容器的宽度变化 有改变 可能需要重新排布
                EventUtil.addHandler(window,"resize",function(){
                    var nowcolum = containlistener(contain,col.unit_width,col.colnum);
                    if (nowcolum) {
                        console.log(nowcolum);
                        col.colnum = nowcolum;
                        makewaterfall(contain,col);
                    }
                });
            }else{
                makewaterfall(contain,col);
            }
        }
        init();

        return {
            addClass :addClass,
            removeClass : removeClass
        }
    };

    var con = document.getElementById("wrapper");
    var a = new waterfall(con,{
            colnum:3,
            unit_width : 300
        },true);
    
    EventUtil.addHandler(window,"resize",function(){
        if (window.innerWidth < 1200) {
            a.removeClass(con,"width1300");
            a.addClass(con,"width960");
        }else if(window.innerWidth > 1500){
            a.removeClass(con,"width960");
            a.addClass(con,"width1300");
        }
    });
})(window);


