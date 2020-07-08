define({
  "redirects": [
    {
      title: "前端跳转",
      list: [
        {name:"新闻首页","from":"http://news.163.com", "to":"http://3g.163.com/touch/news/",note:"?s=noRedirect表示不跳转到3g站，下同"},
        {name:"体育首页","from":"http://sports.163.com", "to":"http://3g.163.com/touch/sports/"},
        {name:"娱乐首页","from":"http://ent.163.com", "to":"http://3g.163.com/touch/ent/"},
        {name:"女人首页","from":"http://lady.163.com", "to":"http://3g.163.com/touch/lady/"},
        {name:"财经首页","from":"http://money.163.com", "to":"http://3g.163.com/touch/money/"},
        {name:"汽车首页","from":"http://auto.163.com", "to":"http://3g.163.com/touch/auto/"},
        {name:"手机首页","from":"http://mobile.163.com", "to":"http://3g.163.com/touch/mobile/"},
        {name:"科技首页","from":"http://tech.163.com", "to":"http://3g.163.com/touch/tech/"},
        {name:"游戏首页","from":"http://play.163.com", "to":"http://3g.163.com/touch/game/"},
        {name:"数码首页","from":"http://digi.163.com", "to":"http://3g.163.com/touch/digi/"},
        {name:"房产首页","from":"http://house.163.com", "to":"http://m.house.163.com/index.html","note":""},
        {name:"房产地方首页","from":"http://(\\w+).house.163.com/","to":"http://m.house.163.com/$1/xf/web/index.html","note":""},
        {name:"房产地方文章","from":"http://(\\w+).house.163.com/\\d{2}/\\d{4}/\\d{2}/(\\S+).html","to":"http://m.house.163.com/bj/xf/web/news_detail.shtml?docid=$1","note":""},
        {name:"cms专题","from":"(http://\\S+.163.com)/special/(\\S+)", "to":"$1/special/$2","note":"地址栏不变，优先读取$1/special/$2-4(pc|pad|phone)，取不到则读取默认文件","status":"waiting"}
      ]
    },
    {
      title: "运维跳转",
      list: [
        {name:"网易首页","from":"http://www.163.com", "to":"http://3g.163.com/touch/"},
        {name:"荐新闻","from":"http://j.news.163.com", "to":"http://j.news.163.com",note:"地址栏不变，页面根据ua读取(联系人:黄斌)"}
      ]
    }
  ],
  "todos": [{
    title: "图文列表",
    list: [
      {"name":"图集", id:"/modules/photoset/photoset.js", "desc":"", "status":"完成"},
      {"name":"焦点图", "desc":"与图集类似", "status":""},
      {"name":"带图新闻列表", id:"/modules/hotnews/list.phone.html", "desc":"文字区域比图片区域大，默认为左图右文", "status":"完成"},
      {"name":"无图新闻列表", id:"/modules/hotnews/list.phone.html", "desc":"", "status":"完成"},
      {"name":"列表AJAX切换", id:"/system/touchall/modules/tabnav/ajaxtabs.js", "desc":"", "status":"完成"},
      {"name":"封面列表(两列)", id:"/system/touchall/modules/list/photo_cols2.html", "desc":"默认为两列格式", "status":"完成"},
      {"name":"专栏导航", id:"/system/touchall/modules/tabnav/tabnav.html", "desc":"考虑使用左侧Tabs切换", "status":"完成"},
      {"name":"文字标签", "desc":"参考travel.163.com右侧'推荐目的地'", "status":""},
      {"name":"排行榜", id:"/system/touchall/modules/list/rank.html", "desc":"", "status":""},
      {"name":"图文拼块", id:"/system/touchall/modules/list/blocks.html", "desc":"类似聚合阅读", "status":""}
    ]
  },
  {
    title: "数据展示",
    list: [
      {"name":"表格", "desc":"", "status":""},
      {"name":"普通图表", "desc":"", "status":""},
      {"name":"财经图表", "desc":"", "status":""},
      {"name":"地图", "desc":"", "status":""},
      {"name":"地球仪", "desc":"", "status":""}
    ]
  },
  {
    title: "功能模块",
    list: [
      {"name":"站点导航", id:"/modules/nav/nav.js", "desc":"默认在右侧栏展开", "status":""},
      {"name":"登录", id:"/modules/nelogin/nelogin.js", "desc":"", "status":""},
      {"name":"分享", id:"/modules/shares/shares.js", "desc":"", "status":"完成"},
      {"name":"跟帖", id:"/modules/ne2015/tie/tie.js", "desc":"默认在左侧栏打开", "status":"完成"},
      {"name":"手势", id:"/modules/gesture/gesture.js", "desc":"", "status":"完成"},
      {"name":"侧工具栏", id:"modules/sidebar.js", "desc":"", "status":"完成"},
      {"name":"图片上传", id:"/modules/upload/upload.js", "desc":"", "status":""},
      {"name":"图片裁剪", id:"/modules/crop/crop.js", "desc":"", "status":""},
      {"name":"lazyLoad", id:"/modules/lazyload/lazyload.js", "desc":"", "status":""},
      {"name":"瀑布式加载", id:"/modules/waterfall/waterfall.js", "desc":"", "status":""}
    ]
  }]
});
