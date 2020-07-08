
var draw_qrcode = function(text, typeNumber, errorCorrectLevel) {
	document.write(create_qrcode(text, typeNumber, errorCorrectLevel) );
};

var create_qrcode = function(text, typeNumber, errorCorrectLevel, table) {
	text=toAscString(text);
	var qr = qrcode(typeNumber || 10, errorCorrectLevel || 'M');
	qr.addData(text);
	qr.make();
	if(table){
		return qr.createTableTag();
	}else{
		return qr.createImgTag();
	}
};

var update_qrcode = function() {
	var text = document.forms[0].elements['msg'].value.
		replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
	var isIE6 = (navigator.appVersion.indexOf("MSIE 6.0") != -1);
	if(isIE6){
		document.getElementById('qr').innerHTML = create_qrcode(text,null,null,1);
	}else{
		document.getElementById('qr').innerHTML = create_qrcode(text);
	}
	
};

// ---- toAscString 函数为适应中文而编写，将Unicode转为ASCII编码 ---
function toAscString(s){
	var ret=new String();
	var src=new String();
	var i=0;
	
	src=encodeURI(s.replace(/^[\s\u3000]+|[\s\u3000]+$/g, ''));

	while(i<src.length){
		if(src.charAt(i)=="%"){
			ret+=String.fromCharCode(eval("0x"+src.charAt(i+1)+src.charAt(i+2)));
			i+=2;
		} else {
			ret+=src.charAt(i);
		}
		i++;
	}
	
	return ret;
}
