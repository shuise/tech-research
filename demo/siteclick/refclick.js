(function($){
    var jsonData;
    var $daySel = $("#day_sel");
    var valSwitch = $("#valswitch")[0];
    var $tableWrap = $("#table_wrap");
    var tpl = {
        table : '<table>{thead}{tbody}</table>',
        tr : '<tr><td>{name}{tds}</tr>',
        thead : '<tr><th rowspan=2>来源{th1}<tr>{th2}'
    }
    var global = {
        dataUrl : "refclick.json",
        target : location.hash.replace(/^#/, '') || "click",
        day : '',
        ysNum : 3,
        val : 'vals2'
    }
    
    var desc = {
        "noclick" : "无有效点击",
        "doclick" : "有有效点击",
        "firstvisit" : "每个用户一天内的首次访问"
    }
    
    if(/\?(\S+)/.test(location.href.replace(/#.*/, ""))){
        global.name = RegExp.$1;
        global.dataUrl = "refclick." + global.name + ".json";
        $("#sample_desc").html("* 统计样本：" + desc[global.name] + "的访问。");
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
    
    function printTable(name){
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
                return "<td" + cls + ">" + val
                    + (global.val == 'vals2' ? '%' : '')
                    + "</td>";
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
        global.canvas.clear();
        
        global.ysNum = jsonData[name]["head"].length;
        
        if(name == 'button'){
            global.canvas.dualChart(
                [{
                    title : "点击概况",
                    data : jsonData[day][name]
                }],
                [{
                    title : "首次访问",
                    data : jsonData[day]['new']
                }],
                {
                    padding : {bottom:10, x:20},
                    mirror : true,
                    topLabel : "{percent}%",
                    tips : "无有效点击：{ys.0.percent}%\n有超前点击：{p_pre}%\n有左键点击：{p_lbtn}%\n有中键点击：{p_mbtn}%\n有右键点击：{p_rbtn}%",
                    subtips : "{sub.name}: {sub.y}次\n占{xtick}访问总数的{sub.percent}%",
                    showLegend : false,
                    grid:{shadow: 0, nogrid: 1},
                    Title : {title : '点击概况'},
                    yTick : {apronum : 5, labels : "{y}", startY: [0,0], fixNum:function(n){return parseInt(n)}},
                    colors : ['#B1DEE4']
                },
                {
                    padding : {bottom:10},
                    topLabel : "{y}次",
                    tips : "{title}: {ys.0.percent}%",
                    subtips : "{sub.name}: {sub.y}次\n占{xtick}访问总数的{sub.percent}%",
                    showLegend : false,
                    grid:{shadow: 0, nogrid: 1},
                    Title : {title : '首次访问'},
                    yTick : {apronum : 5, labels : "{y}", startY: [0,0], fixNum:function(n){return parseInt(n)}},
                    colors : ['#ffaa55']
                },
                jsonData[day]["labels"]
            );
        }else{
            global.canvas.xyChart([{
                title : "点击",
                data : jsonData[day][name]
            }], ["hbar"], {
                xTick : {labels : "{x}", txtAttr : { font: '12px 宋体'}, shiftY : 5},
                tips : "{y}次访问\n"+firstName[name]+"：{ys.0.percent}%",
                topLabel : "{percent}%",
                subtips : "{sub.name}: {sub.y}次\n占{xtick}访问总数的{sub.percent}%",
                showLegend : false,
                grid:{shadow: 0, nogrid: 1},
                yTick : {apronum:5, labels : "{y}", startY : [0,0]},
                colors : ['#ffaa55']
            });
        }
        
        global.target = name;
        location.hash = name;
    }
    
    function checkExist(dom, callback){
        if(dom && typeof callback == 'function') callback(dom);
    }
})(NE);