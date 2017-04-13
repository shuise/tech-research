/**
 * Created by wangchengkuo on 17/4/12.
 */
function getPublicChat(_options) {
    var options = {
        props:['stat'],
        template: 'public/public-chat.html',
        methods: {
            goPublicList:function () {
                this.stat.currentView='publicList';
            },
            goPublicInfo:function () {
                this.stat.currentView='publicInfo';
            }
        }
    };
    return common.getComponent(options);
}