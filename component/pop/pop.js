function popOut(html,options){
	var options = options || {};
		options = {
			width :options.width || 500,
			height : options.height || 'auto',
			left : options.left != undefined ? options.left : 'auto',
			top : options.top != undefined ? options.top : 'auto',
			pageWidth : options.pageWidth || 960,
			mask : options.mask || false,
			zIndex : options.zIndex || 300,
			html : html || '',
			temp : options.temp || '<div class="common_popup common_popup_border">{html}</div>'
		};	
	var h1 = document.documentElement.clientHeight;
	var sizes = {
		screenWidth : Math.max(document.body.clientWidth,document.documentElement.clientWidth),
		screenHeight : h1,
		pageHeight : Math.max(document.documentElement.scrollHeight,h1),
		scroolTop : document.documentElement.scrollTop||document.body.scrollTop
	};
	
	var nodes = {};
	function substitute(temp, data, regexp){
		if(!(Object.prototype.toString.call(data) === "[object Array]")) data = [data];
		var ret = [];
		for(var i=0,j=data.length;i<j;i++){
			ret.push(replaceAction(data[i]));
		}
		return ret.join("");
		function replaceAction(object){
			return temp.replace(regexp || (/\\?\{([^}]+)\}/g), function(match, name){
				if (match.charAt(0) == '\\') return match.slice(1);
				return (object[name] != undefined) ? object[name] : '';
			});
		}
	}
	function popMask(){
		var h = sizes.pageHeight + 'px';
		var w = sizes.screenWidth + 'px';
		var zIndex = options.zIndex;

		var maskIfr = document.createElement("iframe");
			maskIfr.className = "common_popup_mask";
			maskIfr.style.zIndex = zIndex;
			maskIfr.style.height = h;
			maskIfr.style.width = w;
		nodes.body.appendChild(maskIfr);

		var maskDiv = document.createElement("div");
			maskDiv.className = "common_popup_mask";
			maskDiv.style.zIndex = zIndex + 1;
			maskDiv.style.height = h;
			maskDiv.style.width = w;
		nodes.body.appendChild(maskDiv);
		nodes.mask = maskDiv;
		nodes.maskIfr = maskIfr;
	}
	function popClose(){
		removeObj(nodes.popBox);
		removeObj(nodes.mask);	
		removeObj(nodes.maskIfr);	
	}
	function removeObj(obj){
		if (!obj){return false}
		obj.parentNode.removeChild(obj);
	}
	function init(){
		var popBox = document.createElement("div");
			popBox.innerHTML = substitute(options.temp,options);
			popBox.style.cssText = "display:block;position:absolute;";
			popBox.style.zIndex = options.zIndex + 2;
		nodes.body = document.getElementsByTagName("body")[0];
		nodes.body.appendChild(popBox);
		
		var height = options.height == 'auto' ? 'auto' : options.height  + 'px';
		var width = options.width == 'auto' ? 'auto' : options.width  + 'px';

		popBox.style.height = height;
		popBox.style.width = width;
		//popBox.style.overflow = 'hidden';
				
		var	topP = options.top;
		var	leftP = options.left;
		var	pageWidth = options.pageWidth + "";
		if(pageWidth.indexOf("%") > -1){
			pageWidth = pageWidth.split("%")[0] || 0;
			pageWidth = sizes.screenWidth*pageWidth/100;
		}
			pageWidth = parseInt(pageWidth);

		var topP2 = sizes.scroolTop + (sizes.screenHeight - popBox.offsetHeight)/2;
		var	leftP2 = (sizes.screenWidth - popBox.scrollWidth)/2;
			topP = topP =='auto' ? topP2 : sizes.scroolTop + topP;
			leftP = leftP =='auto' ? leftP2 : sizes.screenWidth/2 - pageWidth/2 + leftP;

		popBox.style.top = topP + 'px';
		popBox.style.left = leftP + 'px';
		nodes.popBox = popBox;
		if (options.mask){
			popMask();
		}
	}
	
	return {
		removeObj : removeObj,
		popMask : popMask,
		popClose : popClose,
		nodes : nodes,
		init : init
	};
}
