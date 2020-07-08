(function($){
    var jsonData;
    var $daySel = $("#day_sel");
    var $tabSel = $("#tab_hds");
    var valSwitch = $("#valswitch")[0];
    var $tableWrap0 = $("#table_wrap0");
    var $tableWrap = $("#table_wrap");
    var tpl = {
        table : '<table>{thead}{tbody}</table>',
        tr : '<tr><td>{name}{tds}</tr>',
        thead : '<tr><th>{th1}'
    }
    var global = {
        dataUrl : "cnxh.json",
        target : location.hash.replace(/^#/, '') || "region",
        day : '',
        ysNum : 3,
        val : 'vals'
    }
    
    var desc = {
        "pv" : "PV"
    }
    
    if(/\?(\S+)/.test(location.href.replace(/#.*/, ""))){
        global.name = RegExp.$1;
        global.dataUrl = "cnxh." + global.name + ".json";
    }
    
    if(global.name == 'pv'){
        $("#pv").addClass("current").click(function(){
            return false; 
        });
    }else{
        $("#uv").addClass("current").click(function(){
            return false; 
        });
    }
    
    checkExist($("#tab_bds"), initCharts);
    
    $.getJSON(global.dataUrl, function(json){
        jsonData = json;
        initSelect();
        initSwitch();
        drawChart(global.target);
        printTable(global.target);
    });
    
    function initSwitch(){
        if(valSwitch){
            valSwitch.checked = true;
            valSwitch.onclick = function(){
                if(this.checked){
                    global.val = "vals";
                }else{
                    global.val = "vals2";   
                }
                printTable(global.target);
            }
        }
    }
    
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
            var opt = new Option(day + ' [' + jsonData[day]['total'] 
                                 + (global.name == 'pv' ? '次' : '人')
                                 + ']', day);
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

        global.canvas.ring(jsonData[day][name], {
            tips : "{title}\n{value}: {percent}%",
            tipRatio : 0.2,
            legend : 2,
            title : day
        });
        
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
        var sel = $tabSel[0];
        global.regionName = sel.options[sel.selectedIndex].innerHTML.replace(/的点击次数/, "");
        if(!jsonData[name]){
            $tableWrap.html('');
            $tableWrap0.html('');
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
        
        //sum
        var html0 = '<table><tr><th>' + tpl.th1;
        html0 += '<tr><td>'+global.regionName+'总点击数<td>' + jsonData[name]["sumclick"].join("<td>");
        $tableWrap0.html(html0);
        
        
        //detail
        
        var bodyData = jsonData[name]["body"];
        var len = bodyData.length;
        for(var i = 0; i < len; i ++){
            var cursor = 0;
            bodyData[i]['tds'] = bodyData[i][global.val].map(function(val){
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