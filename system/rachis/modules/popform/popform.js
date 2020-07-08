define(function(){
        var scope = this, $$ = bowlder;
        var state = scope.state = {};
        function SelfMod(){
            this.reset();
        }
        SelfMod.prototype = {
            reset: function(){
                this.title = '';
                this._id = '';
                this.files = {
                    html: true,
                    js: true,
                    css: true
                };
            },
            save: function(){
                var that = this,
                    _id = this._id.trim();
                if(!this.title.trim()){
                    alert('模块标题不能为空');
                    return;
                }
                if(!_id){
                    alert('请输入模块目录');
                    return;
                }else{
                    var moduleInfo = {
                        title: this.title,
                        _id: _id.replace(/\/\w+\.\w+$/, '').replace(/\/?$/, '/'),
                        files: this.files
                    };
                    that.reset();
                    that.pop.$emit('close');
                    $$.emit('selfMod.insert', moduleInfo);
                    scope.$refresh();
                }
            }
        };
        scope.selfMod = new SelfMod;
        
        scope.init = function(widget){
            var roles = widget.roles;
            var $wraps = roles["pop-wrap"];
            $wraps.plugin("/modules/plugins/popbox.js").then(function(scopes){
                $$.each(scopes, function(popScope, i){
                    var wrap = $wraps[i],
                        name = wrap.getAttribute('data-pop-name');
                    if(scope[name]){
                        scope[name].pop = popScope;
                    }
                    $$.on('pop.'+name, function(info){
                        $$.extend(state, info);
                        popScope.$emit('pop');
                        scope.$refresh();
                    });
                    popScope.$on('poped', function(){
                        var input = $$("input", wrap)[0];
                        input && input.focus();
                    });
                });
            });
        };
    });
