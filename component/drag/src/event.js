(function(){
	var guid = 1;

	this.addEvent = function (elem, type, fn) {
		var data = getData(elem);
		data.handlers = data.handlers || {}; 
		data.handlers[type] = data.handlers[type] || [];
		fn.guid = fn.guid || guid++;
		data.handlers[type].push(fn);
		data.dispatcher = data.dispatcher || function(e){
			e = fixEvent(e);
			var handlers = data.handlers[e.type];
			for(var i = 0, length = handlers.length; i < length; i++) {
				handlers[i].call(elem, e);
			}
		};

		if (document.addEventListener) {
			elem.addEventListener(type, data.dispatcher, false);
		}
		else if (document.attachEvent) {
			elem.attachEvent("on" + type, data.dispatcher);
		}
	};

	this.removeEvent = function (elem, type, fn) {
		var data = getData(elem);
		if (!data.handlers) return;

		if(!type) {
			for(var t in data.handlers) {
				data.handlers[t] = [];
			}
			return;
		}

		var handlers = data.handlers[type];
    	if (!handlers) return;

		if(!fn) {
			handlers[type] = [];
			return;
		}

		if(fn.guid) {
			for (var i = 0; i < handlers.length; i++) {
				(handlers[i].guid === fn.guid) && handlers.splice(i--, 1);
			}
		}

		if (handlers.length === 0) {
			delete data.handlers[type];
			if (document.removeEventListener) {
				elem.removeEventListener(type, data.dispatcher, false);
			} else if (document.detachEvent) {
				elem.detachEvent("on" + type, data.dispatcher);
			}
		}
	};

	this.triggerEvent = function(elem, event){
		var data = getData(elem);
		if (typeof event === "string") {
			event = { type:event, target:elem };
		}
		event = fixEvent(event);
		data.dispatcher && data.dispatcher.call(elem, event);
	};

})();