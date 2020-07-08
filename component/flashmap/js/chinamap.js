(function ($) {
  window.flashMap = function(config, data, callBack) {

    var size = {
      width:900,
      height:750
    }
    ,swf
    ,scale = config.width / size.width
    ,swfConfig = config;
    swfConfig.flashvars = data;
    swfConfig.height = scale * size.height;
    swfConfig.flashId = "chinaMapFlash" + Math.random();
    swfConfig.talker = "chinaMapFlash" + new Date().getTime();
    swfConfig.allowScriptAccess = "always";

    $.swf.embed(swfConfig, function(val) {
      swf = val; 
      swf.call("updateColor", {"data":data.initColor});
    });

    window[swfConfig.talker].handler = function(key, params, callback) {
      var func = params.func
      ,rData = params.data;
      switch (func) {
        case "clickArea": {
          rData.position = scalePosition(rData.position);
          if (callBack.click)
            callBack.click(rData);
          break;
        }
        case "overArea": {
          rData.position = scalePosition(rData.position);
          if (callBack.hover)
            callBack.hover(rData);
          break;
        }
        case "outArea": {
          rData.position = scalePosition(rData.position);
          if (callBack.out)
            callBack.out(rData);
          break;
        }
        case "positionData": {
          var i = rData.length;
          while (--i > -1){
            var data = rData[i];
            data.position = scalePosition(data.position);
          }
          if (callBack.positionData)
            callBack.positionData(rData);
          break;
        }
      }
    };

    function scalePosition(value) {
      var result = {};
      result.x = scale * value.x;
      result.y = scale * value.y;
      return result;
    }

    return $.swf.get(swfConfig.flashId)
  };
}(NE));