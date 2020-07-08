(function(NC){
  Date.prototype.format=function(fmt) {  
    var o = {
      "M+" : this.getMonth() + 1, //月份
      "d+" : this.getDate(), //日
      "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
      "H+" : this.getHours(), //小时
      "m+" : this.getMinutes(), //分
      "s+" : this.getSeconds(), //秒
      "q+" : Math.floor((this.getMonth()+3)/3), //季度
      "S" : this.getMilliseconds() //毫秒
    };
    var weekname = ["日", "一", "二", "三", "四", "五", "六"];
    if (/(y+)/.test(fmt)) {  
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));  
    }
    if (/(E+)/.test(fmt)) {  
      fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "周") : "")+weekname[this.getDay()]);  
    }
    for (var k in o) {  
      if (new RegExp("("+ k +")").test(fmt)) {  
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
      }
    }
    return fmt;  
  }
  NC.dateRange = function (opts){
    var params = {
      from : Date.UTC(2013,0,1),
      to : Date.UTC(2013,2,1)
    }
    NC.deepExtend(params, opts);
    var result = [];
    for (var dtime = params.from; dtime <= params.to; dtime += 3600*24000) {
      var dt = new Date(dtime);
      if (!params.format) {
        result.push(dt);
      }else{
        result.push(dt.format(params.format));
      }
    }
    return result;
  }
})(NTESChart);
