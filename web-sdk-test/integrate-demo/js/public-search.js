/**
 * Created by wangchengkuo on 17/4/12.
 */
function getPublicSearch(_options) {
    var options = {
        props: ['stat'],
        template: 'public/public-search.html',
        methods: {
            publicSearch: function () {

                var that = this;
                $.getJSON('mockData.json', function (data) {
                    var listUnFollowed = [];
                    $(data.searchList).each(function () {
                        this.hasFollowed == false && listUnFollowed.push(this);
                    });

                    that.stat.searchList = listUnFollowed;

                });
                return false;

                var keywords = this.stat.searchVal;
                var searchType = 1; //[0-exact 1-fuzzy]
                RongIMClient.getInstance().searchPublicService(searchType, keywords, {
                    onSuccess: function (list) {
                        console.log("查找公众号 成功");
                        if (list.length === 0) {
                            that.stat.searchResult = false;
                        } else {
                            that.stat.searchResult = true;
                            var listUnFollowed = $(list).filter(function (index) {
                                return $('strong', this).length == 1;
                            });
                            that.stat.searchList = list;
                        }

                    },
                    onError: function (error) {
                        console.log("查找公众号 失败");
                    }
                });
            },
            goPublicInfo: function (item) {
                this.stat.currentView = 'publicInfo';
                this.stat.currentPublic = item;
            },
            goPublicList: function () {
                this.stat.currentView = "publicList";
            }
        },
        mounted: function () {

        }
    };
    return common.getComponent(options);
}