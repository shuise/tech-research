//http://nodejs.cn/api/fs.html#fs_fs_rename_oldpath_newpath_callback

const fs = require('fs');
const path = require('path');

//创建并删除dir
function dirCD(){
	const _dir2 = __dirname + "/" + Math.random();
	fs.mkdir(_dir2, 0o777, (err, data) => {
		console.log('成功删除' + _dir2);
		setTimeout(function(){
			fs.rmdir(_dir2);
		},200);
	});
}


//创建并删除file
function fileCD(){
	const file =__dirname + "/" + "abc";
	fs.appendFile(file);
	setTimeout(function(){
		fs.unlinkSync(file);
	},200);
}


renameFiles();

function renameFiles(){
	const _dir = __dirname + "/res/";
	fs.readdir(_dir, (err, data) => {
		if (err) throw err;
		// console.log(data);
		writeData(data,_dir);
	});
}

function writeData(data,_dir){
	var list = [];
	var arr;
	var newName;
	for(var i=0;i<data.length;i++){
		arr = data[i].split(".");
		if(arr[0]){
			// console.log(data[i]);
			newName = i + "." + arr[arr.length-1];
			fs.rename(_dir + data[i], _dir + newName, (err) => {});
			list.push({
				"name" : arr[0],
				"path" : 'res/' + newName
			});
		}
	}
	console.log(list);

	fs.writeFile('message.txt',JSON.stringify(list), (err) => {
	  if (err) throw err;
	  console.log('It\'s saved!');
	});
}