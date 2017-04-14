/**
 * Created by wangchengkuo on 17/4/12.
 */
function getPublicInfo(_options) {
    var options = {
        props: ['stat'],
        template: 'public/public-info.html',
        methods: {
            goPublicChat: function () {
                this.stat.currentView = 'publicChat';
            },
            unsubscribePublic: function () {
                var publicServiceType = RongIMLib.ConversationType.APP_PUBLIC_SERVICE; //固定值
                var publicServiceId = this.stat.currentPublic.publicServiceId;
                RongIMClient.getInstance().unsubscribePublicService(publicServiceType, publicServiceId, {
                    onSuccess: function (list) {
                        console.log("取消订阅公众号 成功");
                        console.log(list);
                    },
                    onError: function (error) {
                        console.log("取消订阅公众号 失败");
                    }
                });
            },
            subscribePublic: function () {
                var publicServiceType = RongIMLib.ConversationType.APP_PUBLIC_SERVICE; //固定值
                var publicServiceId = this.stat.currentPublic.publicServiceId;
                RongIMClient.getInstance().unsubscribePublicService(publicServiceType, publicServiceId, {
                    onSuccess: function (list) {
                        console.log("订阅公众号 成功");
                        console.log(list);
                    },
                    onError: function (error) {
                        console.log("订阅公众号 失败");
                    }
                });
            },
            goPublicSearch: function () {
                this.stat.currentView = 'publicSearch';
            }
        },
        mounted: function () {

        }
    };
    return common.getComponent(options);
}