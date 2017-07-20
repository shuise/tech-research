const co = require('co');
const thunkify = require('thunkify');
const fs = require('fs');
const logger = require('./logger');

const request = require('request');

var readFile = thunkify(fs.readFile);
var writeFile = thunkify(fs.writeFile);

var stringFormat = (str, vals) => {
	for (var i = 0, len = vals.length; i < len; i++) {
		var val = vals[i],
			reg = new RegExp("\\{" + (i) + "\\}", "g");
		str = str.replace(reg, val);
	}
	return str;
};

var pathStore = {
	screencapture: {
		req: './{0}.node',
		path: './modules/screenshot/{0}.node'
	}
};

var getName = function(obj){
	var {name, version} = obj;
	return [name, version].join('-');
};

var isArray = (arr) => {
	return Object.prototype.toString.call(arr) == '[object Array]';
};
var confPath = './module-conf.json';
var character = 'utf-8';

var updateConfig = (rows) => {
	rows = rows.filter((row) => {
		return row.success;
	});
	rows.forEach(row => {
		co(function*() {
			var content = yield readFile(confPath, character);
			content = JSON.parse(content);
			rows.forEach(row => {
				var id = row.id;
				var name = getName(row);
				var item = pathStore[id];
				var rName = stringFormat(item.req, [name]);
				content[id] = rName;
			});
			content = JSON.stringify(content, null, 4);
			yield writeFile(confPath, content, character);
		});
	});
};

var downloadFiles = (updateList) => {
	if (!isArray(updateList)) {
		updateList = [updateList];
	}

	var log = {
		key: 'upgrade'
	};
	var writeLog = (content) => {
		log.content = content;
		log = JSON.stringify(log);
		logger.info(log);
	};
	/*
		var updateList = [{
			id: 'screencapture',
			version: '1.0.1',
			name: 'screencapture',
			source: 'http://www.download.cn/screencapture-1.0.1.node'
		}];
	*/
	var downloadProcess = (file) => {
		var {source, id} = file;
		var name = getName(file);

		var item = pathStore[id];

		var local = stringFormat(item.path, [name]);

		var promise = new Promise((resolve, reject) => {
			var received_bytes = 0;
			var total_bytes = 0;

			var req = request({
				method: 'GET',
				uri: source
			});

			var out = fs.createWriteStream(local);
			req.pipe(out);

			req.on('response', (data) => {
				total_bytes = parseInt(data.headers['content-length']);
			});

			req.on('data', (chunk) => {
				received_bytes += chunk.length;
			});

			req.on('error', (error) => {
				file.error = error;
				writeLog(file);
				reject();
			});

			req.on('end', () => {
				file.success = true;
				writeLog(file);
				resolve();
			});
		});
		return promise;
	};

	var promise = new Promise((resolve) => {
		var promiseList = [];
		updateList.forEach(file => {
			promiseList.push(downloadProcess(file));
		});
		Promise.all(promiseList).then(() =>{
			resolve();
		});
	});

	return promise;
};

/*
	var updateList = [{
		id: 'screenshot',
		version: '1.0.1',
		name: 'screenshot',
		source: 'http://www.download.cn/screenshot-1.0.1.node'
	}];
	
	var params = {
		updateList: updateList
	};
*/
var upgrade = (updateList) => {
	updateList.map(item => {
		item.success = false;
		return item;
	});
	downloadFiles(updateList).then(() => {
		updateConfig(updateList);
	});
}
module.exports = {
	upgrade
};