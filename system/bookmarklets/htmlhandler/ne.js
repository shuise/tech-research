(function(e,t){function y(){if(d.isReady)return;try{document.documentElement.doScroll("left")}catch(e){setTimeout(y,1);return}b()}function b(){if(!d.isReady){if(!document.body)return setTimeout(b,13);d.isReady=!0;if(v){var e=-1,t=v.length;while(++e<t)v[e].call(document);v=null}}}function w(){if(m)return;if("complete"===document.readyState)return b();if(document.addEventListener)document.addEventListener("DOMContentLoaded",b,!1),window.addEventListener("load",b,!1);else if(document.attachEvent){document.attachEvent("onreadystatechange",b),window.attachEvent("onload",b);var e;try{e=window.frameElement==null}catch(t){}document.documentElement.doScroll&&e&&y()}m=!0}var n=e.document,r=Object.prototype.toString,i=Object.prototype.hasOwnProperty,s=Array.prototype.push,o=Array.prototype.slice,u=Array.prototype.indexOf,a=String.prototype.trim,f,l=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,c={},h=[],p="1.7.17",d=function(e,t){return new d.fn.init(e,t)};d.fn=d.prototype={version:p,constructor:d,init:function(e,t,r){var i,s,o;return e?e.nodeType||e===window?(this.context=this[0]=e,this.length=1,this):r?(t=t||f,T.exec(e,t)):typeof e=="string"?!t||t.version?(t||d(n)).find(e):this.constructor(t).find(e):(e.selector!==undefined&&(this.selector=e.selector,this.context=e.context),d.makeArray(e,this)):this},selector:"",length:0,toArray:function(){return o.call(this)},get:function(e){return e==null?this.toArray():e<0?this[this.length+e]:this[e]},pushStack:function(e,t,n){var r=d.array.merge(this.constructor(),e);return r.prevObject=this,r.context=this.context,t==="find"?r.selector=this.selector+(this.selector?" ":"")+n:t&&(r.selector=this.selector+"."+t+"("+n+")"),r},each:function(e,t){return d.array.each(this,e,t)},slice:function(){return this.pushStack(o.apply(this,arguments),"slice",o.call(arguments).join(","))},map:function(e){return this.pushStack(d.map(this,function(t,n){return e.call(t,n,t)}))},push:s,sort:[].sort,splice:[].splice},d.fn.init.prototype=d.fn,d.extend=d.fn.extend=function(){var e,t,n,r,i,s,o=arguments[0]||{},u=1,a=arguments.length,f=!1;typeof o=="boolean"&&(f=o,o=arguments[1]||{},u=2),typeof o!="object"&&!d.isFunction(o)&&(o={}),a===u&&(o=this,--u);for(;u<a;u++)if((e=arguments[u])!=null)for(t in e){n=o[t],r=e[t];if(o===r)continue;f&&r&&(d.isPlainObject(r)||(i=d.isArray(r)))?(i?(i=!1,s=n&&d.isArray(n)?n:[]):s=n&&d.isPlainObject(n)?n:{},o[t]=d.extend(f,s,r)):r!==undefined&&(o[t]=r)}return o};var v=[],m,g;document.addEventListener?g=function(){document.removeEventListener("DOMContentLoaded",g,!1),b()}:document.attachEvent&&(g=function(){"complete"===document.readyState&&(document.detachEvent("onreadystatechange",g),b())}),d.extend({version:p,makeArray:function(e,t){var n,r=t||[];return e!=null&&(n=d.type(e),e.length==null||n==="string"||n==="function"||n==="regexp"?s.call(r,e):d.array.merge(r,e)),r},isFunction:function(e){return d.type(e)==="function"},isWindow:function(e){return e!=null&&e==e.window},isArray:Array.isArray||function(e){return d.type(e)==="array"},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},isPlainObject:function(e){if(!e||d.type(e)!=="object"||e.nodeType||d.isWindow(e))return!1;try{if(e.constructor&&!i.call(e,"constructor")&&!i.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(t){return!1}var n;for(n in e);return n===undefined||i.call(e,n)},type:function(e){return e==null?String(e):c[r.call(e)]||"object"},trace:function(e){typeof console!="undefined"&&console.log&&console.log(e)},parseXML:function(e){if(typeof e!="string"||!e)return null;var t,n;try{window.DOMParser?(n=new DOMParser,t=n.parseFromString(e,"text/xml")):(t=new ActiveXObject("Microsoft.XMLDOM"),t.async="false",t.loadXML(e))}catch(r){t=undefined}return(!t||!t.documentElement||t.getElementsByTagName("parsererror").length)&&NE.trace("Invalid XML: "+e),t},ready:function(e){return w(),d.isReady?e.call(document):v.push(e),this}}),h="Boolean Number String Function Array Date RegExp Object".split(" ");for(var E=0,S=h.length;E<S;E++)c["[object "+h[E]+"]"]=h[E].toLowerCase();var x=document.createElement("div");x.innerHTML="<p class='TEST'></p>";var T={SPACE:/\s*([\s>~+,])\s*/g,ISSIMPLE:/^#?[\w\u00c0-\uFFFF_-]+$/,IMPLIEDALL:/([>\s~\+,]|^)([#\.\[:])/g,ATTRVALUES:/=(["'])([^'"]*)\1]/g,ATTR:/\[\s*([\w\u00c0-\uFFFF_-]+)\s*(?:(\S?\=)\s*(.*?))?\s*\]/g,PSEUDOSEQ:/\(([^\(\)]*)\)$/g,BEGINIDAPART:/^(?:\*#([\w\u00c0-\uFFFF_-]+))/,STANDARD:/^[>\s~\+:]/,STREAM:/[#\.>\s\[\]:~\+]+|[^#\.>\s\[\]:~\+]+/g,ISINT:/^\d+$/,enableQuerySelector:x.querySelectorAll&&x.querySelectorAll(".TEST").length>0,tempAttrValues:[],tempAttrs:[],idName:"NEUniqueId",id:0,exec:function(e,t,n){var r,i,u,a,f,l,c,h,p,v,m=T;e=NE.string.trim(e);if(""===e)return[];if(t.nodeType==9&&e==="body"&&t.body)return g=t.body,n&&n.push(g),g;if(m.ISSIMPLE.test(e)){if(0===e.indexOf("#")&&typeof t.getElementById!="undefined")return r=m.getElemById(t,e.substr(1)),n&&r&&s.apply(n,[r],0),r;if(typeof t.getElementsByTagName!="undefined"){r=t.getElementsByTagName(e);if(n)for(var a=0;a<r.length;a++)n.push(r[a]);return r}}if(m.enableQuerySelector){var g;NE.isArray(t)&&NE.array.each(t,function(t,n){s.apply(g,T.exec(e,n),0)});try{return r=o.call(t.querySelectorAll(e)),n&&s.apply(n,r,0),r}catch(y){}}t=t.nodeType?[t]:o.call(t),i=e.replace(m.SPACE,"$1").replace(m.ATTRVALUES,m.analyzeAttrValues).replace(m.ATTR,m.analyzeAttrs).replace(m.IMPLIEDALL,"$1*$2").split(","),u=i.length,a=-1,r=[];while(++a<u){l=t,e=i[a];if(m.BEGINIDAPART.test(e))if(typeof t[0].getElementById!="undefined"){l=[m.getElemById(t[0],RegExp.$1)];if(!l[0])continue;e=RegExp.rightContext}else e=i[a];if(e!==""){m.STANDARD.test(e)||(e=" "+e),c=e.match(m.STREAM)||[],h=c.length,f=0;while(f<h){p=c[f++],v=c[f++],l=m.operators[p]?m.operators[p](l,v):[];if(0===l.length)break}}d.array.merge(r,l)}return m.tempAttrValues.length=m.tempAttrs.length=0,r=r.length>1?m.unique(r):r,n&&s.apply(n,r,0),r},analyzeAttrs:function(e,t,n,r){return"[]"+(T.tempAttrs.push([t,n,r])-1)},analyzeAttrValues:function(e,t,n){return"="+(T.tempAttrValues.push(n)-1)+"]"},generateId:function(e){var t=this.idName,n;try{n=e[t]=e[t]||new Number(++this.id)}catch(r){n=e.getAttribute(t),n||(n=new Number(++this.id),e.setAttribute(t,n))}return n.valueOf()},unique:function(e){var t=[],n=0,r={},i,s;while(i=e[n++])1===i.nodeType&&(s=this.generateId(i),r[s]||(r[s]=!0,t.push(i)));return t},attrMap:{"class":"className","for":"htmlFor"},getAttribute:function(e,t){var n=this.attrMap[t]||t,r=e[n];return"string"!=typeof r&&("undefined"!=typeof e.getAttributeNode?(r=e.getAttributeNode(t),r=undefined==r?r:r.value):e.attributes&&(r=String(e.attributes[t]))),null==r?"":r},getElemById:function(e,t){var n=e.getElementById(t);if(!n||n.id===t||!e.all)return n;n=e.all[t];if(n){n.nodeType&&(n=[n]);for(var r=0;r<n.length;r++)if(this.getAttribute(n[r],"id")===t)return n[r]}},getElemsByTagName:function(e,t,n,r,i){var s=[],o=-1,u=e.length,a,f,l;r!=="*"&&(l=r.toUpperCase());while(++o<u){a=e[o][t],f=0;while(a&&(!i||f<i))1===a.nodeType&&((a.nodeName.toUpperCase()===l||!l)&&s.push(a),f++),a=a[n]}return s},checkElemPosition:function(e,t,n,r){var i=[];if(!isNaN(t)){var s=e.length,o=-1,u={},a,f,l,c;while(++o<s){a=e[o].parentNode,f=this.generateId(a);if(undefined===u[f]){l=0,c=a[n];while(c){1===c.nodeType&&l++;if(!(l<t))break;c=c[r]}u[f]=c||0}else c=u[f];e[o]===c&&i.push(e[o])}}return i},getElemsByPosition:function(e,t,n){var r=t,i=e.length,s=[];while(r>=0&&r<i)s.push(e[r]),r+=n;return s},getElemsByAttribute:function(e,t){var n=[],r,i=0,s=this.attrOperators[t[1]||""],o="~="===t[1]?" "+t[2]+" ":t[2];if(s)while(r=e[i++])s(this.getAttribute(r,t[0]),o)&&n.push(r);return n},operators:{"#":function(e,t){return T.getElemsByAttribute(e,["id","=",t])}," ":function(e,t){var n=e.length;if(1===n)return e[0].getElementsByTagName(t);var r=[],i=-1;while(++i<n)d.array.merge(r,e[i].getElementsByTagName(t));return r},".":function(e,t){return T.getElemsByAttribute(e,["class","~=",t])},">":function(e,t){return T.getElemsByTagName(e,"firstChild","nextSibling",t)},"+":function(e,t){return T.getElemsByTagName(e,"nextSibling","nextSibling",t,1)},"~":function(e,t){return T.getElemsByTagName(e,"nextSibling","nextSibling",t)},"[]":function(e,t){return t=T.tempAttrs[t],t?(T.ISINT.test(t[2])&&(t[2]=T.tempAttrValues[t[2]]),T.getElemsByAttribute(e,t)):e},":":function(e,t){var n;return T.PSEUDOSEQ.test(t)&&(n=parseInt(RegExp.$1),t=RegExp.leftContext),T.pseOperators[t]?T.pseOperators[t](e,n):[]}},attrOperators:{"":function(e){return e!==""},"=":function(e,t){return t===e},"~=":function(e,t){return(" "+e+" ").indexOf(t)>=0},"!=":function(e,t){return t!==e},"^=":function(e,t){return e.indexOf(t)===0},"$=":function(e,t){return e.substr(e.length-t.length)===t},"*=":function(e,t){return e.indexOf(t)>=0}},pseOperators:{"first-child":function(e){return T.checkElemPosition(e,1,"firstChild","nextSibling")},"nth-child":function(e,t){return T.checkElemPosition(e,t,"firstChild","nextSibling")},"last-child":function(e){return T.checkElemPosition(e,1,"lastChild","previousSibling")},"nth-last-child":function(e,t){return T.checkElemPosition(e,t,"lastChild","previousSibling")},odd:function(e){return T.getElemsByPosition(e,0,2)},even:function(e){return T.getElemsByPosition(e,1,2)},lt:function(e,t){return T.getElemsByPosition(e,t-1,-1)},gt:function(e,t){return T.getElemsByPosition(e,t+1,1)}}};d.find=T.exec,d.$=function(e,t){return l.test(e)?n.getElementById(e.replace("#","")):new d.fn.init(e,t,!0)},d.fn.extend({find:function(e){var t,n,r,i,s,o,u=this;o=this.pushStack("","find",e);for(t=0,n=this.length;t<n;t++){r=o.length,d.find(e,this[t],o);if(t>0)for(i=r;i<o.length;i++)for(s=0;s<r;s++)if(o[s]===o[i]){o.splice(i--,1);break}}return o}}),f=d(n),e[t]&&d.extend(e[t]),e[t]=d})(window,"NE"),function(){var e=window.NE||{};e.event={name:"Event",space:"Events",eventNum:0,add:function(e,t,n,r){r=r||[],n=this.delegate(e,t,n,r),e.attachEvent?e.attachEvent("on"+t,n):e.addEventListener&&e.addEventListener(t,n,!1)},remove:function(e,t,n){_handle=this.getDelegate(e,t,n),_handle&&(e.detachEvent?e.detachEvent("on"+t,_handle):e.removeEventListener&&e.removeEventListener(t,_handle,!1),this.removeDelegate(e,t,n))},trigger:function(e,t,n){if(!(!e||e.nodeType!==3&&e.nodeType!==8))return;var r=this.getDelegateObj(e);if(!r||!r[t])return;for(var i in r[t])r[t][i].call(e,n)},delegate:function(e,t,n,r){var i=e[this.space]=e[this.space]||{},s=n[this.name]=n[this.name]||++this.eventNum,o=this;i[t]=i[t]||{};var u=i[t][s];return u||(u=function(t){t=o.fix(t);var i=n.call(e,t,r);return!1===i&&t.preventDefault(),i},i[t][s]=u),u},getDelegate:function(e,t,n){try{return e[this.space][t][n[this.name]]}catch(r){}return n},removeDelegate:function(e,t,n){try{return delete e[this.space][t][n[this.name]]}catch(r){}},getDelegateObj:function(e){try{return e[this.space]}catch(t){return undefined}},fix:function(e){if(!e)return;!e.target&&(e.target=e.srcElement||document),3==e.target.nodeType&&(e.target=e.target.parentNode),e.preventDefault=e.preventDefault||function(){this.returnValue=!1},e.stopPropagation=e.stopPropagation||function(){this.cancelBubble=!0};if(undefined===e.pageX&&undefined!==e.clientX){var t=document.documentElement,n=document.body;e.pageX=e.clientX+(t.scrollLeft||n.scrollLeft||0)-(t.clientLeft||0),e.pageY=e.clientY+(t.scrollTop||n.scrollTop||0)-(t.clientTop||0)}return!e.which&&(e.charCode||e.charCode===0?e.charCode:e.keyCode)&&(e.which=e.charCode||e.keyCode),!e.which&&e.button!==undefined&&(e.which=e.button&1?1:e.button&2?3:e.button&4?2:0),e}},window.NE=e;if(!e.fn)return;e.fn.extend({bind:function(t,n,r){if(typeof t=="object"){for(var i in t)this.bind(i,t[i],r);return this}return this.each(function(){e.event.add(this,t,n,r)})},unbind:function(t,n){if(typeof t=="object"){for(var r in t)this.unbind(r,t[r]);return this}return this.each(function(){e.event.remove(this,t,n)})},trigger:function(t,n){return this.each(function(){e.event.trigger(t,n,this)})}})}(),function(){var e=window.NE||{},t=/^-ms-/,n=/-([\da-z])/gi,r=function(e,t){return(t+"").toUpperCase()};e.string={camelCase:function(e){return e.replace(t,"ms-").replace(n,r)},trim:function(e,t){var n={left:/^\s+/,right:/(\s*?$)/g,both:/^\s+|\s+$/g,all:/\s+/g};return t=n[t]||n.both,e.replace(t,"")},guid:function(){return"ne"+(Math.random()*(1<<30)).toString(16).replace(".","")}},window.NE=e}(),function(){var e=Object.prototype.hasOwnProperty,t=window.NE||{};t.array={each:function(e,t,n){var r,i=0,s=e.length,o=s===undefined;if(n){if(o){for(r in e)if(t.apply(e[r],n)===!1)break}else for(;i<s;)if(t.apply(e[i++],n)===!1)break}else if(o){for(r in e)if(t.call(e[r],r,e[r])===!1)break}else for(;i<s;)if(t.call(e[i],i,e[i++])===!1)break;return e},merge:function(e,t){var n=t.length,r=e.length,i=0;if(typeof n=="number")for(;i<n;i++)e[r++]=t[i];else while(t[i]!==undefined)e[r++]=t[i++];return e.length=r,e},indexOf:function(e,t){if(e.indexOf)return e.indexOf(t);for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},filter:function(e,t){var n=[];for(var r=0,i=e.length;r<i;r++){var s=e[r];t(s)&&n.push(s)}return n},keys:function(t,n){var r=[],i=n||!0;if(typeof t!="object")return;for(var s in t)(i||e(s))&&r.push(s);return r},uniq:function(e){var n=[];for(var r=0,i=e.length;r<i;r++)t.array.indexOf(n,e[r])==-1&&n.push(e[r]);return n},map:function(e,n,r){var i,s,o=[],u=0,a=e.length,f=e instanceof t||a!==undefined&&typeof a=="number"&&(a>0&&e[0]&&e[a-1]||a===0||t.isArray(e));if(f)for(;u<a;u++)i=n(e[u],u,r),i!=null&&(o[o.length]=i);else for(s in e)i=n(e[s],s,r),i!=null&&(o[o.length]=i);return o.concat.apply([],o)}},window.NE=t}(),function(){var NE=window.NE||{};NE.json={stringfy:function(e){if(window.JSON&&window.JSON.stringfy)return window.JSON.stringfy(e);if(e===null||e==undefined)return"";switch(e.constructor){case String:return typeof e=="string"?'"'+e.replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+'"':String(e);case Array:return"["+NE.array.map(e,NE.json.stringfy).join(",")+"]";case Object:var t=[];for(var n in e)typeof e[n]!="function"&&t.push(NE.json.stringfy(n)+":"+NE.json.stringfy(e[n]));return"{"+t.join(",")+"}";case Number:if(isFinite(e))break;case Function:return'""';case Boolean:return e}return String(e)},parse:function(str){return window.JSON&&window.JSON.parse?window.JSON.parse(str):typeof str=="object"?str:(str=str!=null?str.split("\n").join("").split("\r").join(""):"",/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/.test(str.replace(/\\./g,"@").replace(/"[^"\\\n\r]*"/g,""))&&str!=""?eval("("+str+")"):{})},encode:function(e,t,n){if(typeof e=="string")return e;t=t===undefined?"&":t,n=n===!1?function(e){return e}:encodeURIComponent;var r=[];return NE.array.each(e,function(e,t){if(t!==null&&typeof t!="undefined"){var i=n(e)+"="+n(t);r.push(i)}}),r.sort(),r.join(t)},decode:function(e,t){var n={},r=e.split("&");t=t||decodeURIComponent;for(var i=0,s=r.length;i<s;i++){var o=r[i].split("=");o&&o[0]&&(n[t(o[0])]=t(o[1]||""))}return n},copy:function(e,t,n,r){r=r||function(e){return e};for(var i in t)if(n||typeof e[i]=="undefined"||e[i]===null)e[i]=r(t[i]);return e}},window.NE=NE}(),function(){var e=window.NE||{},t,n,r=navigator.userAgent;e.uaMatch=function(e){e=e.toLowerCase();var t=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:t[1]||"",version:t[2]||"0"}},t=e.uaMatch(r),n={};var i="chrome webkit opera msie".split(" ");for(var s=0,o=i.length;s<o;s++)n[i[s]]=!1;t.browser&&(n[t.browser]=!0,n.version=t.version),n.webkit?n.safari=!0:n.safari=!1,n.webkit=n.chrome||n.webkit,n.is64=function(){var e=!1,t=["amd64","ppc64","_64","win64"],n=["x86_64","wow64"],i=navigator.platform.toLowerCase();for(var s=0,o=t.length;s<o;s++)if(i.indexOf(t[s])>-1){e=!0;break}for(var s=0,o=n.length;s<o;s++)if(r.toLowerCase().indexOf(n[s])>-1){e=!0;break}return e}(),n.mock=function(){var e=!1,t=["maxthon","tencent","qqbrowser"," se "];for(var n=0,i=t.length;n<i;n++)if(r.toLowerCase().indexOf(t[n])>-1){e=!0;break}try{var s=typeof navigator.userProfile!="undefined",o=typeof (window.external+"")=="string"}catch(u){}return e||s&&o}(),e.browser=n,window.NE=e}(NE),function(){var e={set:function(e,n,r,i,s,o){s||(s="/"),t.isNumeric(r)||(r=365),r*=864e5;var u=new Date;u.setTime(+u+r),document.cookie=e+"="+encodeURIComponent(n)+(r?"; expires="+u.toGMTString():"")+(i?"; domain="+i:"")+(s?"; path="+s:"")+(o?"; secure":"")},get:function(e){var t=document.cookie.split("; ");for(var n=0;n<t.length;n++){var r=t[n].split("=");if(e==r[0])try{return decodeURIComponent(r[1])}catch(i){return null}}return""},remove:function(e,t,n){document.cookie=e+"=1"+(n?"; path="+n:"; path=/")+(t?"; domain="+t:"")+";expires=Fri, 02-Jan-1970 00:00:00 GMT"},getDomain:function(){return"."+location.host.split(".").slice(-2).join(".")}},t=window.NE||{};t.cookie=e,window.NE=t}(),function(){var e=window.NE||{};e.date={parseDate:function(e){if(e instanceof Date)return e;if(typeof e=="string"){var t=new Date(e);if(t.getTime())return t;var n=e.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) *$/);if(n&&n.length>3)return new Date(parseFloat(n[1]),parseFloat(n[2])-1,parseFloat(n[3]));n=e.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);if(n&&n.length>6)return new Date(parseFloat(n[1]),parseFloat(n[2])-1,parseFloat(n[3]),parseFloat(n[4]),parseFloat(n[5]),parseFloat(n[6]));n=e.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,9}) *$/);if(n&&n.length>7)return new Date(parseFloat(n[1]),parseFloat(n[2])-1,parseFloat(n[3]),parseFloat(n[4]),parseFloat(n[5]),parseFloat(n[6]),parseFloat(n[7]))}return null},format:function(e,t){e=this.parseDate(e);if(e==null)return null;if(e){var n={"M+":e.getMonth()+1,"d+":e.getDate(),"h+":e.getHours(),"m+":e.getMinutes(),"s+":e.getSeconds(),"q+":Math.floor((e.getMonth()+3)/3),S:e.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(e.getFullYear()+"").substr(4-RegExp.$1.length)))}for(var r in n)(new RegExp("("+r+")")).test(t)&&(t=t.replace(RegExp.$1,RegExp.$1.length==1?n[r]:("00"+n[r]).substr((""+n[r]).length)));return t},diff:function(e,t){var n={};e=this.parseDate(e),t=this.parseDate(t);if(e==null||t==null)return null;var r=1e3,i=r*60,s=i*60,o=s*24,u=t-e;return n.day=~~(u/o),n.hours=~~(u/s)%24,n.minutes=~~(u/i)%60,n.seconds=Math.floor(~~(u%i)/r)==60||Math.floor(~~(u%i)/r)==-60?0:Math.floor(~~(u%i)/r),n},stringToDate:function(e){var t=Date.parse(e),n=new Date(t);if(isNaN(n)){var r=e.split("-");n=new Date(r[0],r[1],r[2])}return n}},window.NE=e}(),function(){NE=window.NE||{},NE.template={replace:function(e,t,n){function o(t){return e.replace(n||/\\?\{([^}]+)\}/g,function(e,n){return e.charAt(0)=="\\"?e.slice(1):t[n]!=undefined?t[n]:""})}Object.prototype.toString.call(t)!=="[object Array]"&&(t=[t]);var r=[];for(var i=0,s=t.length;i<s;i++)r.push(o(t[i]));return r.join("")}},window.NE=NE}(),function(e){function l(e,n){function o(){s=d(r),n(s)}e.flashId=e.flashId||a();var r=e.flashId,i=e.talker||"NESWF",s;c(e),t[i]||(t[i]={}),t[i].call=function(e,n){switch(e){case"swfReady":o(),f("swf Ready");break;case"trace":f(params);break;default:t[i][e]?(f(e),t[i][e](e,n,function(r){t[i].callSwfBack(e,n,r)})):f("\u65b9\u6cd5"+e+"\u6682\u65f6\u672a\u5b9e\u73b0")}},t[i].callSwfBack=function(e,t,n){f("callSwfBack: "+t.requestId),t.requestId?s.call(e,{args:t,data:n}):f("no legal requestId")}}function c(e,t){var r=['<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="{codebase}" width="{width}" height="{height}" id="{flashId}" align="middle" type="application/x-shockwave-flash" data="{swf}">','<param name="allowScriptAccess" value="{allowScriptAccess}" />','<param name="allowFullScreen" value="{allowFullScreen}" />','<param name="movie" value="{swf}" />','<param name="src" value="{swf}" />','<param name="loop" value="false" />','<param name="menu" value="{menu}" />','<param name="quality" value="best" />','<param name="bgcolor" value="{bgcolor}" />','<param name="flashvars" value="{flashvars}"/>','<param name="wmode" value="{wmode}"/>',"</object>"].join("");n||(r='<embed id="{flashId}" src="{swf}" loop="false" menu="{menu}" quality="best" bgcolor="{bgcolor}" width="{width}" height="{height}" name="{flashId}" align="middle" allowScriptAccess="{allowScriptAccess}" allowFullScreen="{allowFullScreen}" type="application/x-shockwave-flash" pluginspage="{pluginspage}" flashvars="{flashvars}" wmode="{wmode}" />'),e=h(e),target=i("#"+e.targetId),target.innerHTML=u(r,e)}function h(e){var t={width:"100%",height:"100%",bgcolor:"transparent",wmode:"transparent",allowFullScreen:"false",allowScriptAccess:"false",menu:"false",flashvars:{}};return e=e||{},e=o(e,t),e.codebase=r+"//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0",e.pluginspage=r+"//www.macromedia.com/go/getflashplayer",e.flashvars.namespace=e.talker,e.flashvars=s(e.flashvars),e}function p(){var e="",t=navigator;if(t.plugins&&t.plugins.length){for(var n=0;n<t.plugins.length;n++)if(t.plugins[n].name.indexOf("Shockwave Flash")!=-1){e=t.plugins[n].description.split("Shockwave Flash ")[1],e=e.split(" ").join(".");break}}else if(window.ActiveXObject){var r=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");r&&(e=r.GetVariable("$version").toLowerCase(),e=e.split("win ")[1],e=e.split(",").join("."))}return e}function d(e){var t=document[e];return n&&(t=window[e]),t}var t=window,n=e.browser.msie,r=location.protocol,i=NE.$,s=e.json.encode,o=e.json.copy,u=e.template.replace,a=e.string.guid,f=e.trace;e.extend({swf:{embed:l,version:p,get:d}})}(NE),function(){var e=window.NE||{};e.para={set:function(t,n,r){t=e.string.trim(t);var i=n+"="+r,s=e.para.get(t,n),o="";return s==""?t.substring(t.length-1)=="?"?o=t+i:o=t+(t.indexOf("?")==-1?"?":"&")+i:(o=t.replace("&"+n+"="+s,"&"+i),o=o.replace("?"+n+"="+s,"?"+i)),o},get:function(e,t){var n="",r=t+"=",e=e.split("#!")[0]||"";return e.indexOf("&"+r)>-1&&(n=e.split("&"+r)[1].split("&")[0]),e.indexOf("?"+r)>-1&&(n=e.split("?"+r)[1].split("&")[0]),n},remove:function(t,n){if(!n)return t;var r=e.para.get(t,n);return t.indexOf("&"+n+"="+r)>-1?t=t.replace("&"+n+"="+r,""):t.indexOf("?"+n+"="+r+"&")>-1?t=t.replace(n+"="+r+"&",""):t=t.replace("?"+n+"="+r,""),t}},window.NE=e}(NE),function(){var e=window.NE||{};e.hash={set:function(t,n){var r=location.hash.split("#!")[1]||"";r="?"+r,location.hash=e.para.set(r,t,n).replace("?","!")},get:function(t){var n=location.hash.split("#!")[1]||"";return n="?"+n,e.para.get(n,t)},remove:function(t){var n=location.hash.split("#!")[1]||"";n="?"+n,location.hash=e.para.remove(n,t).replace("?","!")}},window.NE=e}(),function(){var e=window.NE||{},t=window.localStorage||{userdata_inpt:null,init:function(){var e=this;if(e.userdata_inpt==null)try{e.userdata_inpt=document.createElement("input"),e.userdata_inpt.type="hidden",e.userdata_inpt.style.display="none",e.userdata_inpt.addBehavior("#default#userData"),document.body.appendChild(e.userdata_inpt),e.userdata_inpt.load("tools_userData")}catch(t){return!1}return!0},setItem:function(e,t){var n=this;if(n.init()){var r=n.userdata_inpt;r.setAttribute(e,t),r.save("tools_userData")}},getItem:function(e){var t=this;if(t.init()){var n=t.userdata_inpt;return n.getAttribute(e)}return null},removeItem:function(e){var t=this;if(t.init()){var n=t.userdata_inpt;n.removeAttribute(e),n.save("tools_userData")}}};e.store={set:function(e,n,r){!r||typeof r==undefined?(r=n,n=e):e&&(n=e+"."+n),t.setItem(n,r)},get:function(e,n){typeof n=="string"?n=e+"."+n:n=e;var r=t.getItem(n)||"";return r},remove:function(e,n){typeof n=="string"?n=e+"."+n:n=e,t.removeItem(n)}},window.NE=e}(),function(){var e=window.NE||{},t={json:e.json.parse,xml:e.parseXML};e.load={isXD:function(e){if(e.indexOf("http://")==-1&&e.indexOf("https://")==-1)return!1;var t=location.protocol+"//",n=t+location.host;return e.indexOf(n)!==0},js:function(t,n,r){var i=document.createElement("script");i.src=t,r&&(i.charset=r),document.getElementsByTagName("head")[0].appendChild(i),e.dom.ready(i,n)},css:function(e,t){var n=document.createElement("link");n.href=e,n.type="text/css",n.rel="stylesheet",document.getElementsByTagName("head")[0].appendChild(n)},ajax:function(n,r){function c(){if(a!=null&&a.readyState==4){if(n.dataType&&n.dataType&&t[n.dataType]){r&&r(t[n.dataType](a.responseText));return}r&&r(a)}}var i=n.method||"get";i=i.toLowerCase();var s=!1;n.async&&n.async!==!1&&(s=!0);var o=n.url,u=n.data||{};u=e.json.encode(u),i=="get"&&(o.indexOf("?")>-1?o+="&"+u:o+="?"+u,setTimeout(function(){u=null},0));var a=window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest;a.open(i,o,s),a.setRequestHeader("Content-Type",n.contentType||"application/x-www-form-urlencoded"),a.setRequestHeader("X-Requested-With","XMLHttpRequest"),a.onreadystatechange=c,n.dataType=n.dataType||"string";var f=[];if(n.headers)for(var l in n.headers)"content-type"===l.toLowerCase()?f.push(n.headers[l]):a.setRequestHeader(l,n.headers[l]);return f.length&&a.setRequestHeader("Content-Type",f.join(";").replace(/;+/g,";").replace(/;$/,"")),a.send(u),n.xhr=a,n},jsonp:function(t,n){if(!t.url||!n)return!1;var r=t.url||"",i=t.data||{};i=e.json.encode(i);var s=e.string.guid();window[s]=n,r=e.para.set(r,"callback",s),r+="&"+i;var o=document.createElement("script");t.charset&&(o.charset=t.charset),o.src=r,document.getElementsByTagName("head")[0].appendChild(o)},request:function(t,n){var r=e.load;r.isXD(t.url)?r.jsonp(t,n):r.ajax(t,n)}},window.NE=e}(),function(){var e=window.NE||{};e.prop={set:function(e,t,n){if(typeof n=="object"){var r=e[t];if(typeof r=="object")for(var i in n)e[t][i]=n[i];return}e[t]=n,e.setAttribute(t,n)},get:function(e,t){return e[t]||e.getAttribute(t)||""},remove:function(e,t){e[t]=null,e.removeAttribute(t)}},window.NE=e;if(!e.fn)return;e.fn.extend({css:function(t,n){var r=t,i={};return typeof r=="string"&&typeof n=="undefined"?e.classList.getStyle(this[0],r):typeof r=="object"?this.each(function(t,n){e.classList.setStyle(n,r)}):(t=e.string.camelCase(t),this.each(function(e,r){r.style[t]=n}))},attr:function(t,n){return typeof n=="undefined"?e.prop.get(this[0],t):this.each(function(r,i){e.prop.set(i,t,n)})}})}(NE),function(){var e=window.NE||{};e.dom={before:function(t,n){if(!t||!n)return;if(t.version){t.each(function(){e.dom.before(this,n)});return}var r=n.parentNode;r&&r.insertBefore(t,n)},after:function(t,n){if(!t||!n)return;t.ntes&&t.each(function(){e.dom.after(this,n)});var r=n.parentNode;r.lastChild==n?r.appendChild(t):r.insertBefore(t,n.nextSibling)},remove:function(t){if(!t||t.nodeType!==1)return;t.ntes&&t.each(function(){e.dom.remove(this)}),t.parentNode.removeChild(t)},append:function(t,n){t.ntes&&t.each(function(){e.dom.append(this,n)});if(t.nodeType!==1)return;n.appendChild(t)},ready:function(t,n){if(e.type(t)==="function"){n=t,t=document,document.addEventListener?document.addEventListener("DOMContentLoaded",n,!1):document.attachEvent("onreadystatechange",n);return}e.type(t)==="array"&&t.each(function(){e.dom.ready(this,n)});if(!n)return!1;e.browser.msie?t.onreadystatechange=function(){(this.readyState=="complete"||this.readyState=="loaded")&&n()}:t.onload=function(){n()}},mock:function(t,n,r,i){var s=typeof t=="string",o=s?t:e.string.guid(),t=s?e.$("#"+t):t,i=i||e.$("body")[0];if(!t){var n=n||"div",u=document.createElement(n);u.className=r||"",u.id=o,i.appendChild(u),t=u}return t}},window.NE=e;if(!e.fn)return;e.fn.extend({before:function(t){return this.each(function(){e.dom.before(t.cloneNode(!0),this)})},after:function(t){return this.each(function(){e.dom.after(t.cloneNode(!0),this)})},remove:function(t){return this.each(function(){e.dom.remove(this)})},append:function(t){return this.each(function(){e.dom.append(t.cloneNode(!0),this)})}}),e.fn.extend({show:function(){return this.each(function(){this.style.display="block"})},hide:function(){return this.each(function(){this.style.display="none"})},html:function(e){return typeof e!="undefined"?this.each(function(){this.innerHTML=e}):this[0].innerHTML||""}})}(),function(){function a(e,t){return e.nodeType!==1||typeof t!="string"?!1:!0}var e=function(){var e=document.createElement("div");return e.className="a",!!e.classList}(),t=window.NE||{},n,r,i,s,o,u;u={fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},e?(n=function(e,t){return a(e,t)?e.classList.contains(t):!1},r=function(e,t){var n=0,r;if(a(e,t)){t=t.split(" ");while(r=t[n++])e.classList.add(r)}},i=function(e,t){var n=0,r;if(a(e,t)){t=t.split(" ");while(r=t[n++])e.classList.remove(r)}},s=function(e,t){a(e,t)&&e.classList.toggle(t)}):(n=function(e,t){return a(e,t)?(" "+e.className+" ").indexOf(" "+t+" ")!=-1:!1},r=function(e,t){a(e,t)&&!n(e,t)&&(e.className+=(e.className?" ":"")+t)},i=function(e,t){a(e,t)&&(e.className=e.className.replace(RegExp("\\b"+t+"\\b","g"),""))},s=function(e,t){n(e,t)?i(e,t):r(e,t)}),o=function(e,t,n){i(e,t),r(e,n)},t.classList={contains:n,add:r,remove:i,toggle:s,replace:o,cssNumber:u,getStyle:function(e,n){n=t.string.camelCase(n);if(e.currentStyle)return e.currentStyle[n]||"";if(window.getComputedStyle)return window.getComputedStyle(e,null)[n]},setStyle:function(e,n){if(typeof n=="string")e.style.cssText+=";"+n;else if(typeof n=="object"){var r={};for(var i in n){var s=t.string.camelCase(i);typeof n[i]=="number"&&!t.classList.cssNumber[i]&&(n[i]=n[i]+"px"),e.style[s]=n[i]}}}},window.NE=t;if(!t.fn)return;t.fn.extend({addClass:function(e){var n,r,i,s,o,u,a;if(t.isFunction(e))return this.each(function(n){t(this).addClass(e.call(this,n,this.className))});if(e&&typeof e=="string")for(r=0,i=this.length;r<i;r++)t.classList.add(this[r],e);return this},removeClass:function(e){var n,r,i;if(t.isFunction(e))return this.each(function(t){N(this).removeClass(e.call(this,t,this.className))});if(e&&typeof e=="string"||e===undefined)for(r=0,i=this.length;r<i;r++)n=this[r],t.classList.remove(n,e);return this},toggleClass:function(e){return this.each(function(){t.classList.toggle(this,e)})},hasClass:function(e){var n=0,r=this.length;for(;n<r;n++)if(t.classList.contains(this[n],e))return!0;return!1}})}();