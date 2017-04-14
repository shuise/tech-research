/**
 * Created by wangchengkuo on 17/4/12.
 */
function getPublicArticle(_options) {
    var options = {
        props: ['stat'],
        template: 'public/public-article.html',
        methods: {
            goPublicChat: function () {
                this.stat.currentView = 'publicChat';
            }
        }
    };
    return common.getComponent(options);
}