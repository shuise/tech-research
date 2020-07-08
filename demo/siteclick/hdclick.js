(function($){
    var jsonData;
    var $daySel = $("#day_sel");
    var $tableWrap = $("#table_wrap");
    var tpl = {
        table : '<table>{thead}{tbody}</table>',
        tr : '<tr><td>{name}{tds}</tr>',
        thead : '<tr><th rowspan=2>{th1}<tr>{th2}'
    }
    var global = {
        dataUrl : /\?(\S+)/.test(location.href) ? "hdclick"+RegExp.$1+".json" : "hdclick.json",
        target : location.hash.replace(/^#/, '') || "hdtime",
        day : '',
        ysNum : 3
    }
    
    checkExist($("#tab_bds"), initCharts);
    
    $.getJSON(global.dataUrl, function(json){
        jsonData = json;
        initSelect();
        drawChart(global.target);
        printTable(global.target);
    });
    
    function initSelect(){
        
        var dom = $("#main_chart")[0];
        var wrap = document.createElement("div");
        wrap.className = "chart";
        dom.appendChild(wrap);
        global.canvas = new NTESChart({
            container : wrap
        });
        
        var days = jsonData["days"];
        var select = $daySel[0];
        
        for (var j=0; j < select.options.length; j++) { //清空options
            select.options[j] = null;
        }
        for(var i = 0; i < days.length; i++){
            var day = days[i];
            var opt = new Option(day + ' [' + jsonData[day]['total'] + '次访问]', day);
            select.options.add(opt);
        }
        $daySel.change(function(){
            global.day = this.value;
            drawChart(global.target);
        });
        global.day = $daySel.val();
    }
    
    function initCharts($bds){
        var $sel = $("#tab_hds").val(global.target);
        global.target = $sel.val();
        $sel.change(function(){
            var name = this.value;
            drawChart(name);
            printTable(name);
        });
    }
    
    function drawChart(name){
        var days = jsonData["days"];
        var day = global.day;
        
        global.canvas.clear();
        
        if(jsonData[name]){
            global.ysNum = jsonData[name]["head"].length;
        }

        if(name == 'hdtime'){
            global.canvas.dualChart(
                [{
                    title : "头部导航",
                    data : getBarData('t12')
                }],
                [{
                    title : "有道导航",
                    data : getBarData('t54')
                }],
                {
                    padding : {bottom:10, x:20},
                    mirror : true,
                    topLabel : "{percent}%",
                    tips : "{x}\n{y}次访问\n",
                    showLegend : false,
                    grid : {shadow: 0, nogrid: 1},
                    Title : {title : '头部导航'},
                    yTick : {apronum : 5, labels : "{y}", startY: [0,0]},
                    colors : ['#B1DEE4']
                },
                {
                    padding : {bottom:10},
                    topLabel : "{percent}%",
                    tips : "{x}\n{y}次访问",
                    showLegend : false,
                    grid : {shadow: 0, nogrid: 1},
                    Title : {title : '有道导航'},
                    yTick : {apronum : 5, labels : "{y}", startY: [0,0]},
                    colors : ['#ffaa55']
                },
                jsonData[day]["labels"]
            );
        }else{
            global.canvas.ring(jsonData[day][name], {
                tips : "{title}\n{value}: {percent}%",
                tipRatio : 0.2,
                legend : 2,
                title : day
            });
        }
        global.target = name;
        location.hash = name;
    }
    
    function getBarData(name){
        var barData = [];
        var day = global.day;
        var pieData = jsonData[day][name];
        var total = jsonData[day]['total'];
        
        var keys = jsonData[day]["labels"];
        for(var i = 0; i < keys.length; i ++){
            var key = keys[i];
            var y = pieData[key] || 0;
            barData.push({
                x : key,
                y : y,
                percent : (y / total * 100).toFixed(2)
            });
        }
        return barData;
    }
    
    function printTable(name){
        if(name != 'hdtime') name = 'hdclick';
        if(!jsonData[name]){
            $tableWrap.html('');
            return;
        }
        tpl.thgroup = jsonData[name]["head"].map(function(val){
            return "<th>" + val + "</th>";
        }).join("");
        
        var days = jsonData["days"];
        tpl.th1 = '';
        tpl.th2 = '';
        for(var i = 0; i < days.length; i++){
            var day = days[i];
            tpl.th1 += '<th colspan=' + global.ysNum + '>' + day;
            tpl.th2 += tpl.thgroup;
        }
        
        var bodyData = jsonData[name]["body"];
        var len = bodyData.length;
        for(var i = 0; i < len; i ++){
            var cursor = 0;
            bodyData[i]['tds'] = bodyData[i]['vals'].map(function(val){
                var cls = "";
                if(Math.floor((cursor++) / global.ysNum) % 2 == 0){
                    cls = ' class="odd"';   
                }
                return "<td"+cls+">" + val + "</td>";
            }).join("");
        }

        var tbody = $.template(tpl.tr, bodyData);
        var html = $.template(tpl.table, {
            thead : $.template(tpl.thead, {
                th1 : tpl.th1,
                th2 : tpl.th2
            }),
            tbody : tbody 
        });
        $tableWrap.html(html);
    }
    
    function checkExist(dom, callback){
        if(dom && typeof callback == 'function') callback(dom);
    }
})(NE);