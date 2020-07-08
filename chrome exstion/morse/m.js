function morseTranslation(){
	var LETTER2MORSEMAP={'A':'.-',
	                     'B':'-...',
	                     'C':'-.-.',
	                     'D':'-..',
	                     'E':'.',
	                     'F':'..-.',
	                     'G':'--.',
	                     'H':'....',
	                     'I':'..',
	                     'J':'.---',
	                     'K':'-.-',
	                     'L':'.-..',
	                     'M':'--',
	                     'N':'-.',
	                     'O':'---',
	                     'P':'.--.',
	                     'Q':'--.-',
	                     'R':'.-.',
	                     'S':'...',
	                     'T':'-',
	                     'U':'..-',
	                     'V':'...-',
	                     'W':'.--',
	                     'X':'-..-',
	                     'Y':'-.--',
	                     'Z':'--..',
	                     '1':'.----',
	                     '2':'..---',
	                     '3':'...--',
	                     '4':'....-',
	                     '5':'.....',
	                     '6':'-....',
	                     '7':'--...',
	                     '8':'---..',
	                     '9':'----.',
	                     '0':'-----',
	                     '.':'.-.-.-',
	                     ':':'---...',
	                     ',':'--..--',
	                     ';':'-.-.-.',
	                     '?':'..--..',
	                     '=':'-...-',
	                     "'":'.----.',
	                     '/':'-..-.',
	                     '!':'-.-.--',
	                     '+':'.-.-.',
	                     '-':'-....-',
	                     '_':'..--.-',
	                     '"':'.-..-.',
	                     '(':'-.--.',
	                     ')':'-.--.-',
	                     '$':'...-..-',
	                     '&':'.-...',
	                     '@':'.--.-.'
	};

	var MORSE2LETTERMAP={
	    '.-':'A',
	    '-...':'B',
	    '-.-.':'C',
	    '-..':'D',
	    '.':'E',
	    '..-.':'F',
	    '--.':'G',
	    '....':'H',
	    '..':'I',
	    '.---':'J',
	    '-.-':'K',
	    '.-..':'L',
	    '--':'M',
	    '-.':'N',
	    '---':'O',
	    '.--.':'P',
	    '--.-':'Q',
	    '.-.':'R',
	    '...':'S',
	    '-':'T',
	    '..-':'U',
	    '...-':'V',
	    '.--':'W',
	    '-..-':'X',
	    '-.--':'Y',
	    '--..':'Z',
	    '.----':'1',
	    '..---':'2',
	    '...--':'3',
	    '....-':'4',
	    '.....':'5',
	    '-....':'6',
	    '--...':'7',
	    '---..':'8',
	    '----.':'9',
	    '-----':'0',
	    '.-.-.-':'.',
	    '---...':':',
	    '--..--':',',
	    '-.-.-.':';',
	    '..--..':'?',
	    '-...-':'=',
	    '.----.':"'",
	    '-..-.':'/',
	    '-.-.--':'!',
	    '.-.-.':'+',
	    '-....-':'-',
	    '..--.-':'_',
	    '.-..-.':'"',
	    '-.--.':'(',
	    '-.--.-':')',
	    '...-..-':'$',
	    '.-...':'&',
	    '.--.-.':'@'
	};

	function trim(str){
		return str.replace(/^\s+|\s+$/g,"");
	}
	
	//利用正则表达式来分解字符串
	function regSplitStr(str,reg){
	    //var result=new Array();
	    var tempStr='';
	    //while((tempStr=reg.exec(str))!=null) result.push(tempStr[0].toString());
	    //result=str.match(reg);
	    return str.match(reg);
	}

	//字母翻译为摩斯密码（加密）
	function alphabet2Morse(str){
	    var result='';
	    var tempLetter;
	    str=str.toUpperCase();
	    //分解单词
	    var strArray=regSplitStr(str,new RegExp('\\S+','g'));
	    for(var i=0;i<strArray.length;i++){
	        for(var j=0;j<strArray[i].length;j++){
	            tempLetter=LETTER2MORSEMAP[strArray[i].charAt(j)];
	            if(tempLetter==undefined){
	                tempLetter=strArray[i].charAt(j)+'(undefined)';
	            }
	            result+=tempLetter;
	            result+=' ';
	        }
	        result+='  ';
	    }
	    return result.slice(0,-3);
	}

	//摩斯密码翻译为字母（解密）
	function morse2Alphabet(str){
	    var result='';
	    var wordArray;
	    var letterArray;
	    var tempWord='';
	    var tempLetter='';
	    
	    //分解单词
	    wordArray=regSplitStr(str,new RegExp('(\\S+\\s|\\S+$)+','g'));
	    for(var i=0;i<wordArray.length;i++){
	        //分解字母
	        letterArray=regSplitStr(wordArray[i],new RegExp('\\S+\\s|\\S+$','g'));
	        for(var j=0;j<letterArray.length;j++){
	            tempLetter=MORSE2LETTERMAP[trim(letterArray[j])];
	            if(tempLetter==undefined){
	                tempLetter=trim(letterArray[j]);
	            }
	            result+=tempLetter;
	        }
	        result+=' ';
	    }
	    return result.slice(0,-1);
	}

	function getCode(txt){
		var html = {"name":"原码","code":morse2Alphabet(txt)};
		var _1st = txt[0].toUpperCase();
		if(LETTER2MORSEMAP[_1st] && !MORSE2LETTERMAP[_1st]){
			html = {"name":"莫尔斯码","code":alphabet2Morse(txt)};
		}
		//var html = "<p style=\"padding-bottom:20px;\"><strong>加密:</strong><br>" + alphabet2Morse(txt) + "</p><p style=\"padding-bottom:20px;\"><strong>解密:</strong><br>" + morse2Alphabet(txt) + "</p>";
		return html;
	}

	function isChildOf(obj,objParent){
		while (obj && obj.tagName.toLowerCase() != 'body'){
			if (obj == objParent){
				return true;
			}
			obj = obj.parentNode;
		}
		return false;
	}

	function funGetSelectTxt() {
		var txt = document.getSelection();
		if(document.selection) {
			txt = document.selection.createRange().text;	// IE
		}
		return txt.toString();
	};
		
		
	function moveCursor(oTextarea,start,end){    
		if(isNaN(start)||isNaN(end)){   
			alert("位置输入错误");   
		}   
		if(document.all){   
			var oTextRange = oTextarea.createTextRange();   
			var LStart = start;   
			var LEnd = end;   
			var start = 0;   
			var end = 0;   
			var value = oTextarea.value;   
			for(var i=0; i<value.length && i<LStart; i++){   
				var c = value.charAt(i);   
				if(c!='\n'){   
					start++;   
				}   
			}   
			for(var i=value.length-1; i>=LEnd && i>=0; i--){   
				var c = value.charAt(i);   
				if(c!='\n'){   
					end++;   
				}   
			}   
			oTextRange.moveStart('character', start);   
			oTextRange.moveEnd('character', -end);  
			oTextRange.select();   
			oTextarea.focus();   
		}else{   
			oTextarea.select();   
			oTextarea.selectionStart=start;   
			oTextarea.selectionEnd=end;   
		}   
	}
	
	return {
		selectAll : moveCursor,
		isChildOf : isChildOf,
		funGetSelectTxt : funGetSelectTxt,
		getCode : getCode,
		title : "莫尔斯一下"
	};
}