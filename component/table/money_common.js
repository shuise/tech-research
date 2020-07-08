/* 财经常用模块
 * table 排序,表头置顶,表格滚动,css3隔行变色nth-child
 * zgxie@corp.netease.com
 * 2012.12.4
 */

function log(info){
	if(window.console){
		console.log(info);
	}
}

var _c_config={
 		'default_key' : -1 //默认表格列排序第一列即为0
};
 var money_common={	
 	'cls' : {
 		'asc'       : 'fn_cm_sort_up',
 		'asc_local' : 'fn_cm_sortor_up',
 		'desc'	    : 'fn_cm_sort',
 		'desc_local'      : 'fn_cm_sortor'
 	},
 	/*
	 *功能：表格排序
	 *参数：tableTd,需要排序的表格ID
	        col需要排序的表格列号 0,1,2
	        dataType所在列的数据类型（支持int,float,date,string四种数据类型)
	        nth 忽略(无需)排序的列,默认第一列,即值为0,整个表格都需排序则为负数即可
	*/
	$:function(id){
		return document.getElementById(id);
	},
	_getCols:function(id){
		return this.$(id).rows.item(0).cells.length;
	},
 	sort_table:function(tableId,col,dataType,t,nth){
 		this.nth_child('plate_performance','');
	    var k=0,_xh=nth || 0; //存在排序序号，则排序序号无需打乱重排
	    var oTable=document.getElementById(tableId);
	    var oTbody=oTable.tBodies[0]; 
	    var colDataRows=oTbody.rows; 

	    var aTRs=new Array(); //存放tbody里的行
	    for(var i=0;i<colDataRows.length;i++){  
	        aTRs.push(colDataRows[i]);
	    }
	    
	    if(oTable.sortCol==col){//非首次排序
	        aTRs.reverse();
	    }else{
	        if(k%2==0){//升序
	            aTRs.sort(this._Desc(col,dataType));
	        }
	        else if(k%2==1) {//降序
	            aTRs.sort(this._Asc(col,dataType));
	        }
	    }
	    var oFragment=document.createDocumentFragment();
	    for(var i=0;i<aTRs.length;i++){//把排序过的aTRs数组成员依次添加到文档碎片
	    	var xh=parseInt(_xh);
	    	if(xh>-1){
	    		aTRs[i].cells[xh].innerHTML=i+1;
	    	}
	        oFragment.appendChild(aTRs[i]);  
	    }
	    oTbody.appendChild(oFragment);  
	    oTable.sortCol=col;    //把当前列号赋值给sortCol,以此来区分首次排序和非首次排序,//sortCol的默认值为-1
	    this._replaceCls(t,col);
	    _c_config.default_key = col;
	    this.nth_child('plate_performance','background:#f4f5f6');

 	},

 	_getText:function(ele){
 		var terurn_value='';
 		if(ele&&ele.nodeType&&ele.nodeType===1){//如果第一个参数是元素类型
            if(typeof ele.textContent=='string'){
            	terurn_value = ele.textContent;	
            }else{
                terurn_value = ele.innerText;
	        }
	    }
	    terurn_value = terurn_value=="" ? ele.nodeValue : terurn_value;
	    return terurn_value;
 	},

	_Asc:function(col,dataType){
	    return   function compareTRs(oTR1,oTR2){
    		var value1=money_common._convert(money_common._getText(oTR1.cells[col].firstChild),dataType);	        
	        var value2=money_common._convert(money_common._getText(oTR2.cells[col].firstChild),dataType);
	        if(value1<value2){
	            return -1;
	        }
	        else if(value1>value2){
	            return 1;
	        }
	        else{
	            return 0;
	        }
	    };
	},

	_Desc:function(col,dataType){
	    return   function compareTRs(oTR1,oTR2){
	        var value1=money_common._convert(money_common._getText(oTR1.cells[col].firstChild),dataType);	        
	        var value2=money_common._convert(money_common._getText(oTR2.cells[col].firstChild),dataType);
	        if(value1>value2){
	            return -1;
	        }
	        else if(value1<value2){
	            return 1;
	        }
	        else{
	            return 0;
	        }
	    };
	},

	_convert:function(value,dataType){
	    switch(dataType){
	        case "int":return parseInt(value);
	        case "float": return parseFloat(value);
	        case "date":return new Date(Date.parse(value));
	        default:return value.toString();
	    }
	},

	_replaceCls:function(evt,f){
		var cnode=evt.parentNode.childNodes;
		var cls_local = evt.className;
		if(cls_local && _c_config.default_key===f){	
			if(cls_local.indexOf(this.cls.asc_local)>-1){
				evt.className = cls_local.replace(this.cls.asc_local,this.cls.desc_local);
			}else{
				evt.className = cls_local.replace(this.cls.desc_local,this.cls.asc_local);
			}
			return;
		}
		for(var i=0;i<cnode.length;i++){			
			var cls=cnode[i].className;
			if(cls){
				if(cls.indexOf(this.cls.desc_local)>-1){
					cnode[i].className = cls.replace(this.cls.desc_local,this.cls.desc);
				}
				if(cls.indexOf(this.cls.asc_local)>-1){
					cnode[i].className = cls.replace(this.cls.asc_local,this.cls.desc);
				}
				
			}
		}
		evt.className = this.cls.desc_local;
	},
	_getReportdate:function(url){
		var u = url || window.location.href,rep=u.indexOf('reportdate='),addrep='';
		if(rep>-1){
			addrep= 'reportdate='+u.substr(rep+11,8);
		};
		return addrep;
	},
	_returnBaseUrl:function(url){
		var u = url || window.location.href;
		var param =  u.indexOf('?');
		var return_value = param>-1 ? u.substr(0,u.indexOf('?')) : u;
		return return_value;
	},
	select_jump:function (el,frm,sel) {
		var href=el.options[el.selectedIndex].value; 
		var addrep=this._getReportdate();
		href +=("?"+addrep);
		if('_new'==frm) open(href); else eval(frm+".location='"+href+"'"); 
	},
	gegu_search:function(u){
		if (stockSuggest.aSug.length > 0) {
			var c=document.getElementById('sc_suggest_key').value;
			if(!isNaN(c) && c.length===6){}
			else{stockSuggest.oP.callback(stockSuggest.aSug[0]);}	
		} else {
			alert("请选择要查看的股票");
			return;
		}
		var code=document.getElementById('sc_suggest_key').value;
		var url=u.replace('{code}',code);
		window.open(url,'_self');
	},
	time_search:function(u){
		var inp=document.getElementById('fn_rp_selector').getElementsByTagName('input');
		var s=inp[0].value.replace(/-/g,''),e=inp[1].value.replace(/-/g,'');
		var url=u.replace('{time}',s+','+e);;
		window.open(url,'_self');
	},
	jumpTable:function(asc,sort){
		var url=window.location.href;
		var u=url.substr(0,url.indexOf('?')),addrep=this._getReportdate();
		window.open(u+'?sort='+sort+"&order="+asc+"&"+addrep,'_self');
	},
	nth_child:function(id,style,even,onlyIE){
		var o_I = onlyIE || false;
		if(!o_I){
			if(!document.all){
				return;
			}
		}
		var ev = even || 'even',d=id || false;
		if(!d){
			var tables = document.body.getElementsByTagName('table');
			for(var i=0,len=tables.length;i<len;i++){
				var dom_t = tables[i];
				exc_css(dom_t.rows,ev);
			}
		}else{
			var dom=this.$(id);
			if(!dom){
				return;
			}
			exc_css(dom.rows,ev);
		}
		function exc_css(e,ev){
			for(var i=0,len=e.length; i<len; i++){
		        if(ev=='even' && i%2==0){       
		           e[i].style.cssText=style;
		   		}
		   		if(ev=='odd' && i%2==1){       
		           e[i].style.cssText=style;
		   		}
		    }
		}
		
	},
	_getScrollTop:function(){ //滚动条距离页面顶部高度
		var scrollPos; 
        if (typeof window.pageYOffset != 'undefined') { //针对Netscape 浏览器
	        scrollPos = window.pageYOffset; 
	    } 
	    else if (typeof document.compatMode != 'undefined' &&   document.compatMode != 'BackCompat'){ 
	        scrollPos = document.documentElement.scrollTop; 
	    } 
	    else if (typeof document.body != 'undefined') { 
	        scrollPos = document.body.scrollTop; 
	    }
	    return scrollPos;
	},
	_getAbsPoint:function(e){ //元素距离页面顶部的距离
		e = getEL(e);
		var x = e.offsetLeft;
		var y = e.offsetTop;
		while(e = e.offsetParent){
			x += e.offsetLeft;
			y += e.offsetTop;
		}
		return {"x": x, "y": y};
		function getEL(id) {
			if (typeof id=="undefined")  {
				return null;
			}
			if (typeof id =="string") {
				return document.getElementById(id);
			}
			return id;
		}
	},
	fasten_thead:function(id,f_id){//固定表头
		var dom=document.getElementById(id),f_dom=document.getElementById(f_id),w=dom.offsetWidth;
		if(!dom || !f_dom) return;
		var th = dom.rows[0].cells,th_1=dom.rows[1].cells,f_th=f_dom.rows[0].cells;
		for(var i=0,len=th.length;i<len;i++){
			var  w_i = (100*th[i].offsetWidth/w)+"%";
			f_th[i].width=w_i;
			th_1[i].width=w_i;
		}
		dom.rows[0].className = 'hidden';
		var f_t=money_common._getAbsPoint(f_dom).y;
		window.onscroll=function(){
			var s_t = money_common._getScrollTop();
			var h=s_t - f_t;
			if(h>0){
				f_dom.style.top = h+"px";
			}else{
				f_dom.style.top = 0+"px";
			}
		}
	},
	scroll_crosswise:function(obj){//表格横向滚动,适用于等列宽表格
		/* arg = {
				ids:{
                    table_id    : 'table_id',    //滚动表格id
                    left_id     : 'left_id',     //控制左滚动id
                    right_id    : 'right_id'     //控制右滚动id
                },
                cls:{
                    left        : 'left',
                    left_hover  : 'left_hover',
                    right       : 'right',
                    right_hover : 'right_hover'
                },
                scroll_num      : 6             //每次滚动列数
		}
		*/
		var o_id=obj.ids.table_id,o_e=this.$(o_id),l_e=this.$(obj.ids.left_id),r_e=this.$(obj.ids.right_id),s_num=obj.scroll_num || 6;
		if(!o_e || !l_e || !r_e) return;
		var t_width=o_e.offsetWidth,cols=this._getCols(o_id),per_w=s_num*(t_width/cols);
		if(cols<=s_num){
			return;
		}
		l_e.onclick=function(){
			var m_l=o_e.style.marginLeft || 0;
			var n_margin= parseInt(m_l);
			r_e.className = obj.cls.right_hover;
			if(m_l===0 || -n_margin<2*per_w){ //已经是第一个了
				this.className = obj.cls.left;
				if(-n_margin===per_w){
					o_e.style.marginLeft = per_w+n_margin+'px';
				}
				return;	
			}else{
				o_e.style.marginLeft = per_w+n_margin+'px';
			}
			
		}
		r_e.onclick=function(){
			var m_l=o_e.style.marginLeft || 0;
			var n_margin= -parseInt(m_l);
			l_e.className=obj.cls.left_hover;
			if(t_width-n_margin<2*per_w){
				this.className=obj.cls.right;
				if(t_width-n_margin>per_w){
					o_e.style.marginLeft = '-'+(per_w+n_margin)+'px';
				}
			}else{
				o_e.style.marginLeft = '-'+(per_w+n_margin)+'px';
			}		
		}
	}
 }