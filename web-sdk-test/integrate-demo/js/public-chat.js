/**
 * Created by wangchengkuo on 17/4/12.
 */
function getPublicChat(_options) {
    var options = {
        props:['stat'],
        template: 'public/public-chat.html',
        methods: {
            // ...
        }
    };
    return common.getComponent(options);
}