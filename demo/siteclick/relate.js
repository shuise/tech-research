(function($){
    var desc = {
        "firstload" : "按首屏加载时间不同",
        "domload" : "按DOM加载时间不同",
        "load" : "按资源加载时间不同" 
    };
    var jsonData;
    var $daySel = $("#day_sel");
    var $funSel = $("#tab_hds");
    var valSwitch = $("#valswitch")[0];
    var $tableWrap = $("#table_wrap");
    var tpl = {
        table : '<table>{thead}{tbody}</table>',
        tr : '<tr><td>{name}{tds}</tr>'
    }
    var global = {
        dataUrl : "relate.json",
        target : location.hash.replace(/^#/, '') || "button",
        day : '',
        ysNum : 3,
        val : 'vals2'
    }
    
    if(/\?(\S+)/.test(location.href.replace(/#.*/, ""))){
        global.name = RegExp.$1;
        global.dataUrl = "relate." + global.name + ".json";
        $("#h1desc").html(desc[global.name]);
    }
    
    var funLen = $funSel[0].options.length;
    if(global.name == 'firstload'){
        $funSel[0].options[funLen - 3] = null;
    }else if(global.name == 'domload'){
        $funSel[0].options[funLen - 2] = null;
    }else if(global.name == 'load'){
        $funSel[0].options[funLen - 1] = null;
    }
    
    checkExist($("#tab_bds"), initCharts);
    
    $.getJSON(global.dataUrl, function(json){
        jsonData = json;
        initSelect();
        initSwitch();
        drawChart(global.target);
        //printTable(global.target);
    });
    
    function initSwitch(){
        if(valSwitch){
            valSwitch.checked = false;
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
           
        var dom = $("#main_chart0")[0];
        var wrap = document.createElement("div");
        wrap.className = "chart";
        dom.appendChild(wrap);
        global.canvas0 = new NTESChart({
            container : wrap
        });
        
        dom = $("#main_chart")[0];
        wrap = document.createElement("div");
        wrap.className = "chart";
        dom.appendChild(wrap);
        global.canvas = new NTESChart({
            container : wrap
        });
        dom = $("#main_chart2")[0];
        wrap = document.createElement("div");
        wrap.className = "chart";
        dom.appendChild(wrap);
        global.canvas2 = new NTESChart({
            container : wrap
        });
        
        var days = jsonData["days"];
        var select = $daySel[0];
        
        for (var j=0; j < select.options.length; j++) { //清空options
            select.options[j] = null;
        }
        for(var i = 0; i < days.length; i++){
            var day = days[i];
            var opt = new Option(day + ' [' + jsonData[day]['total']['all'] + '次访问]', day);
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
            //printTable(name);
        });
    }
    
    function printTable(name){
        var sel = $("#tab_hds")[0];
        var title = sel.options[sel.selectedIndex].innerHTML.replace(/分析/, '')
        tpl.thead = '<tr><th rowspan=2>' + title + '{th1}<tr>{th2}';
        var wrap = $tableWrap;
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
        wrap.html(html);
    }
    
    function drawChart(name){
        var firstName = {
            'button' : '有点击比例',
            'login' : '从未登录比例',
            'new' : '首次访问比例',
            'time' : '0-20s比例',
            'browser' : 'IE比例',
            'scroll' : '无滚动'
        }
        var days = jsonData["days"];
        var day = global.day;
        global.canvas0.clear();
        global.canvas.clear();
        global.canvas2.clear();
        
        global.canvas0.xyChart(
            jsonData[day][name]['all'], ["line", "dot"],
            {
                tips : "{title}: {sum}次访问({y}%)",
                showLegend : true,
                grid : {shadow: 0, nogrid: 1},
                Title : {title : '所有访问 [下图百分比基于所在曲线上的数值之和]'},
                yTick : {apronum : 5, labels : "{y}%", startY: [0,0]}
            });
        
        global.canvas.xyChart(
            jsonData[day][name]['noclick'], ["line", "dot"],
            {
                tips : "{title}: {sum}次访问({y}%)",
                showLegend : true,
                grid : {shadow: 0, nogrid: 1},
                Title : {title : '无有效点击的访问 [下图百分比基于所在曲线上的数值之和]'},
                yTick : {apronum : 5, labels : "{y}%", startY: [0,0]}
            });
        
        
        global.canvas2.xyChart(
            jsonData[day][name]['doclick'], ["line", "dot"],
            {
                tips : "{title}: {sum}次访问({y}%)",
                showLegend : true,
                grid : {shadow: 0, nogrid: 1},
                Title : {title : '有有效点击的访问 [下图百分比基于所在曲线上的数值之和]'},
                yTick : {apronum : 5, labels : "{y}%", startY: [0,0]}
            });
        
        global.target = name;
        location.hash = name;
    }
    
    function checkExist(dom, callback){
        if(dom && typeof callback == 'function') callback(dom);
    }
})(NE);