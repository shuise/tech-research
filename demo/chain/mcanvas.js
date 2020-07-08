///包装canvas的API函数，返回一个包装器，以支持链式调用，同时支持包装器卸载
var mcanvas = {
    wrap: function(canvas) {
        var obj = {
            ///卸载包装器，释放引用
            unwrap: function() {
                for (var k in this) delete this[k];
                this.ctx = null;
            },

            ///支持设置cavnas属性
            ///1、单属性：mcanvas.attr('fillStyle','#ff0000')
            ///2、多属性：mcanvas.attr({fillStyle:'#ff0000',lineWidth:2})
            attr: function(name, value) {
                if (this.ctx) {
                    var as = name;
                    typeof name === 'string' && (as = {}, as[name] = value);
                    for (var k in as) this.ctx[k] = as[k];
                }
                return this; //关键在这里
            }
        };

        typeof name === 'string' && (canvas = document.getElementById(canvas));
        if (canvas && canvas.tagName === 'CANVAS') {
            var ctx = canvas.getContext('2d');
            for (var k in ctx) {
                if (typeof ctx[k] === 'function') {
                    ///包装canvas API函数
                    var fn = function() {
                        this.ctx[arguments.callee.method].apply(this.ctx, arguments);
                        return this; //关键在这里
                    }
                    fn.method = k;
                    obj[k] = fn;
                }
            }
            obj.ctx = ctx;
        }
        return obj;
    }
}