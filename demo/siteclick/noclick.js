(function($){
    var jsonData;
    var $daySel = $("#day_sel");
    var $tableWrap = $("#table_wrap");
    var tpl = {
        table : '<table>{thead}{tbody}</table>',
        tr : '<tr><td>{name}{tds}</tr>',
        thead : '<tr><th rowspan=2>来源{th1}<tr>{th2}'
    }
    var global = {
        dataUrl : /\?(\S+)/.test(location.href) ? "noclick" + RegExp.$1 + ".json" : "noclick.json",
        target : location.hash.replace(/^#/, '') || "scroll",
        day : '',
        ysNum : 3
    }
    
    checkExist($("#tab_bds"), initCharts);
    
    $.getJSON(global.dataUrl, function(json){
        jsonData = json;
        drawChart(global.target);
    });
    
    function initCharts($bds){
        var $sel = $("#tab_hds").val(global.target);
        global.target = $sel.val();
        var $legend = $bds.find("legend");
        $sel.change(function(){
            var name = this.value;
            drawChart(name);
            setTitle();
        });
        setTitle();
        
        function setTitle(){
            var title = $sel[0].options[$sel[0].selectedIndex].innerHTML + '分析';
            $legend.html(title);
        }
    }
    
    function drawChart(name){
        var oldDom = $("#" + global.target + "_chart")[0];
        if(oldDom) oldDom.style.display = 'none';
        
        var dom = $("#" + name + "_chart")[0];
        if(!dom) return;
        dom.style.display = 'block';
        
        if(!dom.getAttribute("inited")){
            for(var day in jsonData){
                
                var fieldset = document.createElement("fieldset");
                fieldset.className = "chart_wrap";
                var wrap = document.createElement("div");
                wrap.className = "chart";
                var title = document.createElement("legend");
                title.innerHTML = day + ' [' + jsonData[day]['total'] + '次]'
                fieldset.appendChild(wrap);
                fieldset.appendChild(title);
                dom.appendChild(fieldset);
                var canvas = new NTESChart({
                    container : wrap
                });

                canvas.pie(jsonData[day][name], {
                    tips : "{title}\n{value}: {percent}%",
                    tipRatio : 0.2,
                    legend : 2,
                    title : day
                });
            }
            dom.setAttribute("inited", 1);
        }
        global.target = name;
        location.hash = name;
    }
    
    function checkExist(dom, callback){
        if(dom && typeof callback == 'function') callback(dom);
    }
})(NE);