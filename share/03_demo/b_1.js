function log(info){
    if(window.console){
        console.log(info);
    }
}

var config = {
   // source:['0123','023',123,1234,212,214,'033333','0352342',1987,17563,20932],
    ajax:{ type:'get',url:'b.php?k=' },
    elemCSS:{ focus:{'color':'black','background':'#ccc'}, blur:{'color':'black','background':'transparent'} },/* 些对象中的key要js对象中的style属性支持 */
    input:'input',
    popup:'ul'
}
autoComplete.call(document.getElementById('autoComplete'), config);
