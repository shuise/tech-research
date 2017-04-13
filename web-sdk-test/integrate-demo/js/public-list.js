/**
 * Created by wangchengkuo on 17/4/12.
 */
function getPublicList(_options) {
    var options = {
        props:['stat'],
        template: 'public/public-list.html',
        methods: {
            getPublicServiceList: function () {
                /*
                 getRemotePublicServiceList = function (mpId, conversationType, pullMessageTime, callback)
                 */
                $.getJSON('mockData.json',function (data) {
                    console.log(data);
                    that.stat.publicList=data.publicList;
                    return false;
                });
                var that=this;
                RongIMClient.getInstance().getPublicServiceList({
                    onSuccess: function (list) {
                        console.log("获取已关注公众号 成功");
                        that.stat.publicList=list;
                    },
                    onError: function (error) {
                        console.log("获取已关注公众号 失败");
                    }
                });
            },
            publicAdd:function(){
                this.stat.currentView="publicSearch";
            }
        },
        mounted:function () {
            this.getPublicServiceList();
        }
    };
    return common.getComponent(options);
}