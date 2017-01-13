/**
 * 模板引擎
 * @see http://blog.jobbole.com/56689/
*/
(function (global, factory) {
    if(typeof exports === 'object' && typeof module !== 'undefined'){
        module.exports = factory() 
    }else if(typeof define === 'function' && define.amd){
        define(factory)
    }else{
        global.render = factory();
    }
})(this, function(){
    function render(template, data) {
        template = template || "";
        data = data || [""];
        var re = /{{((?:(?!}}).)+)}}/g, reExp = /(^( )?(var|if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0;
        var add = function(line, js) {
            js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
            return add;
        }
        var match;
        while(match = re.exec(template)) {
            add(template.slice(cursor, match.index))(match[1], true);
            cursor = match.index + match[0].length;
        }
        add(template.substr(cursor, template.length - cursor));
        code += 'return r.join("");';

        data = isNaN(data.length) ? [data] : data;
        var html = "";
        for(var i = 0, length = data.length; i < length; i++) {
            html += new Function(code.replace(/[\r\t\n]/g, '')).apply(data[i]);
        }
        return html;    
    }
    return render;
});