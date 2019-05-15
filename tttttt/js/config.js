Vue.prototype.$urlConfig = {
    chatServiceUrl:'https://zzs.jt.cmcc.com:9088/'
    //chatServiceUrl:'https://127.0.0.1:9088/'           zzs.jt.cmcc.com
};

Vue.prototype.$rongAuthconfig = {
    appKey:'qd46yzr43gwwf',//'kj7swf87e4zv2',
    appSecret: '7Aq2s2qNfHXGVB',
   navi:'https://zzs.jt.cmcc.com:1444',  //https://10.129.92.19:1444  //http://10.129.92.19:8082   https://10.129.92.19/token
   api:'https://zzs.jt.cmcc.com:1443', //https://10.129.92.19:1443  // http://10.129.92.19:8081
    // navi:'https://gate.cq.pddc.bjmesspush.com.cn:1445',
    // api:'https://gate.cq.pddc.bjmesspush.com.cn:1444',
    wsNavUrl:'https://zzs.jt.cmcc.com/nav/websocketlist'//这是之前在RongCallLib包里面找的
    //wsNavUrl:'https://rtc.ronghub.com/nav/websocketlist'
};

Vue.prototype.$rtcAuthconfig = {
    appId:'1234567890abcdefg',//'kj7swf87e4zv2',
    appSecret: 'kfJSCe5OjKeP',
    wsNavUrl:'https://zzs.jt.cmcc.com/nav/websocketlist',//这是之前在RongCallLib包里面找的
    tokenUrl:'https://zzs.jt.cmcc.com/token'
};