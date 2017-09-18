var fs = require('fs');
var exec = require('child_process').exec;
var readline = require('readline');
var os = require('os');
var util = require('util');
var path = require('path');

var config = {
    path: null,
    output: './release',
    staticPath: './release/head-static.html',
    staticPathList: [],
    rootPathList: [],
    groupName: '_group',
    printName: '_print',
    time: null,
    compress: false,
};

var execConfig = {
    cwd: config.output,
    maxBuffer: 10000 * 1024
};

var isWindows = false;

var plugins = [ 'gulp', 'gulp-minify-css', 'gulp-uglify', 'gulp-concat', 'gulp-imagemin' ];

function start() {
    console.info('正在生成文件.........');
    setupEnvironment(function() {
        setupConfig(function() {
            copyDir(config.path, config.output, function(err) {
                if (err) {
                    console.error(err);
                    return;
                }
                checkNodeModules(function(unInstall) {
                    if (unInstall.length) {
                        installNodeModules(unInstall, function() {
                            setupReleaseList();
                        });
                    } else {
                        setupReleaseList();
                    }
                });
            });
        });
    });
}

function setupConfig(callback) {
    var args = process.args;
    args = process.argv.slice(2);
    var compressIndex = args.indexOf('-c');
    if (compressIndex !== -1) {
        config.compress = true;
        args.splice(compressIndex, 1);
    }
    if (args.length === 0) {
        return console.error('请输入正确的源码路径');
    } else {
        var pathArg = args[0];
        config.path = pathArg[pathArg.length - 1] === '/' ? pathArg.substring(0, pathArg.length - 1) : pathArg;
        if (args.length > 1) {
            config.output = args[1];
        }
    }

    var limit = function(number) {
        number += '';
        return [
            '00',
            0 + number,
            number
        ][number.length];
    }

    config.path = config.path.replace(/\\/g, '/');
    config.output = config.output.replace(/\\/g, '/');
    config.staticPath = config.output + '/inc/head-static.html';
    execConfig.cwd = config.output;

    if (!checkPathEffective()) {
        return console.error('源码目录和输出目录不能相同!');
    }

    var date = new Date();
    config.time = date.getFullYear() + limit(date.getMonth() + 1) + limit(date.getDate()) + limit(date.getHours()) + limit(date.getMinutes()) + limit(date.getSeconds());

    var pathDirs = [];
    try{
         pathDirs = fs.readdirSync(config.path);
    } catch(e) {
        return console.error('未找到源码目录：' + config.path);
    }
    if (pathDirs.indexOf('inc') === -1) {
        return console.error('源码路径错误');
    }

    var incDirs = fs.readdirSync(config.path + '/inc');
    incDirs.forEach(function(name) {
        if (name !== 'favicon.html') {
            config.staticPathList.push(config.output + '/inc/' + name);
        }
    });
    var rootDirs = fs.readdirSync(config.path);
    rootDirs.forEach(function(name) {
        if (name.indexOf('.html') !== -1) {
            config.staticPathList.push(config.output + '/' + name);
        }
    });

    isUserCoverOutputDir(function() {
        clearOldFiles(callback);
    });

}

function isUserCoverOutputDir(callback) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    var question = function(queContent) {
        rl.question(queContent, function(answer) {
            answer = answer.split('');
            answer = answer.filter(function(content) {
                return content !== ' ';
            });
            answer = answer.join('');
            answer = answer.toLowerCase();

            if (answer === 'yes') {
                rl.close();
                callback();
            } else if (answer !== 'no') {
                queContent = ' 输入错误, 请输入yes or no, 回车确认：\n ';
                question(queContent);
            } else {
                console.info('程序已退出');
                rl.close();
            }
            
        });
    };

    fs.access(config.output, function(err){
        if(err) {
            fs.mkdirSync(config.output);
            callback();
            rl.close();
        } else {
            var content = ' 是否覆盖目录' + config.output + '? (yes/no)\n ';
            question(content);
        }
    });
}

function checkPathEffective() {
    var getFormatPath = function(path) {
        if (path.indexOf('./') === 0) {
            path = path.substring(2, path.length);
        }
        if(path.substring(path.length - 1, path.length) === '/') {
            path = path.substring(0, path.length - 1);
        }
        return path;
    }
    var formatPath = getFormatPath(config.path);
    var formatOutput = getFormatPath(config.output);
    return formatPath !== formatOutput;
}

function setupEnvironment(callback) {
    exec('ls', function(err, stdout, stderr) {
        if (err) {
            isWindows = true;
        } else {
            isWindows = false;
        }
        callback();
    });
}

function installNodeModules(unInstall, callback) {
    unInstall = unInstall.join(' ');
    console.info('需要安装插件：' + unInstall);
    console.info('正在安装插件.........');
    var cmd = 'npm install ' + unInstall + ' --save-dev';
    exec(cmd, execConfig, function(err, stdout, stderr) {
        if (err) {
            console.error('安装插件错误：' + err);
            return;
        }
        console.info('安装插件完成\n');
        
        callback();
    });
}

function checkNodeModules(callback) {
    var unInstall = [];
    var check = function(index) {
        var nodeName = plugins[index];
        var checkContent = "require('{{name}}');";
        checkContent = checkContent.replace(/{{name}}/g, nodeName);
        var fileName = 'checkNode.js';
        var filePathName = config.output + '/' + fileName;
        fs.writeFile(filePathName, checkContent, function(err) {
            if (err) {
                console.error(err);
            }
            exec('node ' + fileName, execConfig, function(err, stdout, stderr) {
                if (err) {
                    unInstall.push(plugins[index]);
                }
                if (index === plugins.length - 1) {
                    deleteFile(filePathName, function() {
                        callback(unInstall);
                    });
                } else {
                    check(index + 1);
                }
            });
        });
    }
    var deleteFile = function(file, callback) {
        fs.unlink(file, callback);
    }
    check(0);
}


function releasePrint(callback) {
    var filename = './node_modules/gulp/bin/gulp.js';
    var cmd = 'node ' + filename;
    exec(cmd, execConfig, function(err, stdout, stderr) {
        if (err) {
            console.error('压缩合并print出现错误: ' + stderr);
        } else {
            var file = config.output + '/' + 'gulpfile.js';
            fs.unlink(file, callback);
        }
    });
}

function runGulp(jsMerges, cssMerges) {
    console.info('正在压缩合并文件........');
    var filename = './node_modules/gulp/bin/gulp.js';
    var cmd = 'node ' + filename;
    exec(cmd, execConfig, function(err, stdout, stderr) {
        if(err) {
            console.error('压缩合并出现错误: ' + stderr);
        } else {
            console.log(stdout);
            console.info('压缩合并文件成功\n');
            replaceHeadStatic();
            clearSourceFile(jsMerges, cssMerges);
        }
    });
}

function getIgnoreList(callback) {
    var ignoreFile = config.path + '/.gitignore';
    fs.access(ignoreFile, function(err) {
        if (err) {
            callback([]);
            return;
        }
        fs.readFile(ignoreFile, {flag: 'r+', encoding: 'utf8'}, function(err, data) {
            if (err) {
                callback([]);
            }
            var filenameList = data.split('\n');
            callback(filenameList);
        });
    });
}

function clearSourceFile(jsMerges, cssMerges) {
    var other = { key: 'other', value: ['package.json', 'package-lock.json'] };
    var mergeObj = {
        js: jsMerges, css: cssMerges, image: [{ key: 'image', value: ['css/images'] },], 
        node: [ { key: 'node', value: ['node_modules'] } ], other: [ other ]
    };
    for (var key in mergeObj) {
        for (var index = 0; index < mergeObj[key].length; index++) {
            var obj = mergeObj[key][index];
            if (obj.key.indexOf('normal') === 0) {
                clearAirDir(config.output);
                continue;
            }
            var pathList = obj.value;
            for (var i = 0; i < pathList.length; i++) {
                var path = pathList[i];
                if (getStaticName(path) === obj.key + "." + key) {
                    continue;
                }
                path = config.output + '/' + path;
                removeFile(path, function(selectPath) {
                    if (selectPath.indexOf(('css/images')) !== -1) {
                        fs.rename(selectPath + '-dev', selectPath, function() {});
                    }
                    (index === mergeObj[key].length - 1) && clearAirDir(config.output);
                });
                if (path.indexOf('.css') !== -1) {
                    var pathSass = path.replace('.css', '.scss');
                    removeFile(pathSass, function() {
                        (index === mergeObj[key].length - 1) && clearAirDir(config.output);
                    });
                }
            }
        }
    }
}

function replaceHeadStatic() {
    config.staticPathList.forEach(function(staticPath) {
        console.info('正在更新' + staticPath);
        var name = staticPath;
        var rename = staticPath.replace('.html', '-dev.html');
        fs.unlink(name, function(err) {
            if (err) {
                throw err;
            }
        });
        fs.rename(rename, name, function(err) {
            if (err) {
                throw err;
            }
            console.info('更新' + staticPath + "成功");
        });
    });
}

function setupReleaseList() {
    console.info('正在生成文件gulpfile.js .........');
    var jsMergeList = [];
    var cssMergeList = [];
    var printObj = {};
    config.staticPathList.forEach(function(staticPath, index) {
        var fReadName = staticPath;
        var fWriteName = staticPath.replace('.html', '-dev.html');
        var fRead = fs.createReadStream(fReadName);
        var fWrite = fs.createWriteStream(fWriteName);
        var objReadline = readline.createInterface({
            input: fRead,
            output: fWrite
        });
        objReadline.on('line', function(line) {
            var hasPrint = line.indexOf(config.printName) !== -1;
            var hasGroup = line.indexOf(config.groupName) !== -1;
            var isAnn = line.indexOf('<!--') !== -1 && line.indexOf('-->') !== -1 && line.indexOf('#include') === -1;
            hasGroup && writeFile(line, fWrite);
            var isJs = line.indexOf('</script>') !== -1 && line.indexOf('src') !== -1;
            var isCss = line.indexOf('<link') !== -1 && line.indexOf('href') !== -1;
            var key = isJs ? 'src' : 'href';
            if (!hasGroup && !isAnn && !hasPrint) {
                var formatLine = line;
                if (isJs || isCss) {
                    var path = getValueForKey(line, key);
                    setupGroup(isJs ? jsMergeList : cssMergeList, 'normal' + getStaticName(line, key), path);
                    formatLine = translateDefinition(line, key);
                }
                fWrite.write(formatLine + '\n');
            } else if (hasPrint) {
                var formatLine = line;
                var isPrint = getValueForKey(line, config.printName);
                if (isPrint === 'true') {
                    var path = getValueForKey(line, key);
                    if (!printObj[fWriteName]) {
                        printObj[fWriteName] = { js: [], css: [] };
                    }
                    if (isJs) {
                        printObj[fWriteName].js.push(path);
                    } else {
                        printObj[fWriteName].css.push(path);
                    }
                    
                }
                fWrite.write(formatLine + '\n');
            }
        });
        objReadline.on('close', function() {
            if (index === config.staticPathList.length - 1) {
                if (config.compress) {
                    writePrintGulpfile(printObj, function() {
                        writeGulpfile(jsMergeList, cssMergeList);
                    });
                } else {
                    writeGulpfile(jsMergeList, cssMergeList);
                }
            }
        });
    });
    var writeFile = function(line, fWrite) {
        var scriptTpl = '<script src="{{path}}/{{name}}.js?{{time}}"></script>\n';
        var cssTpl = '<link rel="stylesheet" href="{{path}}/{{name}}.css?{{time}}">\n';
        var isScript = line.indexOf('</script>') !== -1;
        var isCss = line.indexOf('<link') !== -1;
        if (isScript || isCss) {
            var group = getValueForKey(line, config.groupName);
            var pathKey = isScript ? 'src' : 'href';
            var path = getValueForKey(line, pathKey);
            var isFirst = !setupGroup(isScript ? jsMergeList : cssMergeList, group, path);
            if (isFirst) {
                var tpl = isScript ? scriptTpl : cssTpl;
                var path = getStaticPath(line);
                tpl = tpl.replace(/{{path}}/g, path);
                tpl = tpl.replace(/{{name}}/g, group);
                tpl = tpl.replace(/{{time}}/g, config.time);
                fWrite.write(tpl);
            }
        }
    }
}

function writePrintGulpfile(printObj, callback) {
    var filePathName = config.output + '/' + 'gulpfile.js';
    var content = "var gulp = require('gulp'), minifycss = require('gulp-minify-css'), concat = require('gulp-concat'), uglify = require('gulp-uglify'), imagemin = require('gulp-imagemin');\n\n";
    var tpl = "\n\tgulp.src('{{path}}')\t\t";
    var cssContentTpl = tpl + (config.compress ? "\n\t\t.pipe(minifycss())\n\t\t.pipe(gulp.dest('{{concatPath}}'));" : ';');
    var jsContentTpl = tpl + (config.compress ? "\n\t\t.pipe(uglify())\n\t\t.pipe(gulp.dest('{{concatPath}}'));" : ';');
    var content = "var gulp = require('gulp'), minifycss = require('gulp-minify-css'), concat = require('gulp-concat'), uglify = require('gulp-uglify'), imagemin = require('gulp-imagemin');\n\n";
    var releaseType = {
        js: '"minifyjs"', css: '"minifycss"'
    };
    var jsContent = '';
    var cssContent = '';
    var startGulp = [];
    for (var rootPath in printObj) {
        var print = printObj[rootPath];
        for (var type in print) {
            var mark = type === 'js' ? 'minifyjs' : 'minifycss';
            var pathList = print[type];
            if (pathList.length !== 0) {
                var releaseName = releaseType[type];
                if (startGulp.indexOf(releaseName) === -1) {
                    startGulp.push(releaseName);
                }
            }
            pathList.forEach(function(path) {
                var temp = type === 'js' ? jsContentTpl : cssContentTpl;
                var pathName = getStaticPath(path);
                temp = temp.replace(/{{path}}/g, path);
                temp = temp.replace(/{{concatPath}}/g, pathName);
                if (type === 'js') {
                    jsContent += temp + '\n';
                } else {
                    cssContent += temp + '\n';
                }
            });
        }
    }
    if (startGulp.indexOf('"minifyjs"') !== -1)  {
        content += 'gulp.task("minifyjs", function() {\n' + jsContent + '\n\n\treturn;\n});\n';
    }
    if (startGulp.indexOf('minifycss') !== -1)  {
        content += 'gulp.task("minifycss", function() {\n' + cssContent + '\n\n\treturn;\n});\n';
    }
    

    content += "\ngulp.task('default', [], function() {\n" + 
        "\tgulp.start(" + startGulp.join(',') + ");\n" +  
　　"});"

    var filePathName = config.output + '/' + 'gulpfile.js';
    fs.writeFile(filePathName, content, function(err) {
        if (err) {
            return console.error(err);
        }
        releasePrint(function() {
            changePrintDef(printObj, callback);
        });
    });
}

function changePrintDef(printObj, callback) {
    var read = function(type, file, back) {
        fs.readFile(file, function(err, data) {
            if (err) {
                return console.error('读取文件' + file + '错误');
            }
            back(type ,data.toString());
        });
    };
    var changeDef = function(jsContent, cssContent, roots, call) {
        var count = 0;
        roots.forEach(function(rootPath) {
            var fReadName = rootPath;
            var fWriteName = rootPath + '-dev.html';
            var fRead = fs.createReadStream(fReadName);
            var fWrite = fs.createWriteStream(fWriteName);
            var objReadline = readline.createInterface({
                input: fRead,
                output: fWrite
            });
            objReadline.on('line', function(line) {
                var isPrint = line.indexOf('_print') !== -1;
                var isJs = line.indexOf('<script') !== -1 && line.indexOf('src') !== -1;
                var isCss = line.indexOf('<link') !== -1 && line.indexOf('href') !== -1;
                var formatLine = line;
                if (isPrint) {
                    if (isJs) {
                        var path = getValueForKey(line, 'src');
                        formatLine = '<script>' + jsContent[path] + '</script>';
                    } else {
                        var path = getValueForKey(line, 'href');
                        formatLine = '<style>' + cssContent[path] + '</style>';
                    }
                }
                fWrite.write(formatLine + '\n');
            });
            objReadline.on('close', function() {
                fs.unlink(fReadName, function() {
                    fs.rename(fWriteName, fReadName, function() {
                        count++;
                        if (count === roots.length) {
                            var jsList = objectToArray(jsContent);
                            var cssList = objectToArray(cssContent);
                            var list = jsList.concat(cssList);
                            removeFileList(list, function() {
                                call();
                            });
                        }
                    });
                });
            });

        });
    };

    var rootPathList = [];
    var jsContent = {};
    var cssContent = {};
    var total = 0;
    var count = 0;
    for (var rootPath in printObj) {
        var printDetail = printObj[rootPath];
        rootPathList.push(rootPath);
        for (var type in printDetail) {
            var pathList = printDetail[type];
            pathList.forEach(function(path) {
                total++;
                read(type, config.output + '/' + path, function(type ,content) {
                    if (type === 'js') {
                        jsContent[path] = content;
                    } else {
                        cssContent[path] = content;
                    }
                    count++;
                    if (count === total) {
                        changeDef(jsContent, cssContent, rootPathList, callback);
                    }
                });
            });
        }
    }
}

function writeGulpfile(jsMerges, cssMerges) {
    var filePathName = config.output + '/' + 'gulpfile.js';
    var content = "var gulp = require('gulp'), minifycss = require('gulp-minify-css'), concat = require('gulp-concat'), uglify = require('gulp-uglify'), imagemin = require('gulp-imagemin');\n\n";
    var tpl = "\n\tgulp.src({{path}})\n\t\t.pipe(concat('{{concatName}}'))\n\t\t.pipe(gulp.dest('{{concatPath}}'))";
    var cssContentTpl = tpl + (config.compress ? "\n\t\t.pipe(minifycss())\n\t\t.pipe(gulp.dest('{{concatPath}}'));" : ';');
    var jsContentTpl = tpl + (config.compress ? "\n\t\t.pipe(uglify())\n\t\t.pipe(gulp.dest('{{concatPath}}'));" : ';');
    var mergeObj = { css: cssMerges, js: jsMerges };
    for (var key in mergeObj) {
        var mark = key === 'js' ? 'minifyjs' : 'minifycss';
        content += 'gulp.task("' + mark + '", function() {\n';
        mergeObj[key].forEach(function(obj) {
            var temp = key === 'js' ? jsContentTpl : cssContentTpl;
            var name = obj.key;
            var path = JSON.stringify(obj.value);
            var firstPath = obj.value[0];
            var concatName = name + '.' + key;
            var concatPath = getStaticPath(firstPath);
            if (name.indexOf('normal') === 0 ) {
                concatName = name.substring(6, name.length);
            }
            temp = temp.replace(/{{path}}/g, path);
            temp = temp.replace(/{{concatPath}}/g, concatPath);
            temp = temp.replace(/{{concatName}}/g, concatName);
            content += temp;
        });
        content += '\n\n\treturn;\n});\n';
    }
    var imageContent = "gulp.task('images', function() {\n\treturn gulp.src('css/images/**')\n\t.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))\n\t.pipe(gulp.dest('css/images-dev'));\n});"
    content += imageContent;
    var startGulp = [ '"images"' ];
    cssMerges.length !== 0 && startGulp.push('"minifycss"');
    jsMerges.length !== 0 && startGulp.push('"minifyjs"');

    content += "\ngulp.task('default', [], function() {\n" + 
            "\tgulp.start(" + startGulp.join(',') + ");\n" +  
    　　"});"
    fs.writeFile(filePathName, content, function(err) {
        if (err) {
            return console.error(err);
        }
        console.info('生成gulpfile.js成功\n');
        runGulp(jsMerges, cssMerges);
    });
}

function getStaticPath(static) {
    var pathIndex = static.indexOf('.js');
    pathIndex = pathIndex === -1 ? static.indexOf('.css') : pathIndex;
    var path = static.substring(0, pathIndex);
    pathIndex = path.lastIndexOf('="') === -1 ? path.lastIndexOf("='") : path.lastIndexOf('="');
    if (pathIndex !== -1) {
        path = path.substring(pathIndex + 2, path.length);
    }
    pathIndex = path.lastIndexOf('/');
    if (pathIndex === -1 || pathIndex === 1) {
        return './';
    }
    return path.substring(0, pathIndex);
}

function getStaticName(line, key) {
    var value = getValueForKey(line, key);
    var lastIndex = value.lastIndexOf('/');
    if (lastIndex === -1) {
        return value;
    } else {
        return value.substring(lastIndex + 1, value.length);
    }
}

function setupGroup(list, group, value) {
    var hasGroup = false;
    for (var i = 0; i < list.length; i++) {
        var obj = list[i];
        var key = obj.key;
        if (group === key) {
            hasGroup = true;
            if (obj.value.indexOf(value) === -1) {
                obj.value.push(value);
            }
        }
    }
    if (!hasGroup) {
        list.push({
            key: group,
            value: [ value ]
        });
    }
    return hasGroup;
}

function getValueForKey(line, k) {
    if (line.indexOf('<script') === -1 && line.indexOf('<link') === -1) {
        return line;
    }
    var beforeIndex = line.indexOf(k + '=');
    var key = line.substring(beforeIndex + k.length + 1);
    var semicolon = key.substring(0, 1);
    key = key.substring(1);
    var afterIndex = key.indexOf(semicolon);
    key = key.substring(0, afterIndex);
    return key;
}

function translateDefinition(line, key) {
    var value = getValueForKey(line, key);
    var index = line.indexOf(value);
    index = index + value.length;
    var beforeValue = line.substring(0, index);
    var afterValue = line.substring(index, line.length);
    return beforeValue + '?' + config.time + afterValue;
}

function copyDir(src, dist, callback) {
    fs.access(dist, function(err){
        if(err) {
            fs.mkdirSync(dist);
        }
        getIgnoreList(function(list) {
            var ignoreList = list.concat(['README.md', 'mock' ,'.git', '.gitignore', '.sass-lint.yml', '.editorconfig', '.eslintignore', '.eslintrc.json', 'release'])
            var _src = src === './' ? '.' : src;
            isWindows ? copyWin(_src, dist + '\\', ignoreList, callback) : copyLin(_src, dist, ignoreList, callback);
        });
    });
}

function copyLin(src, dist, ignoreList, callback) {
    var copyExec = function(path, callback) {
        var _src = getPath([src, path]);
        var _dist = getPath([dist, path]);
        var macCmd = ['cp', '-r', _src, _dist].join(' ');
        exec(macCmd, function(err, stdout, stderr) {
            if (err) {
                console.error('复制' + path + '失败：' + err);
            }
            callback();
        });
    };
    var ignorePathList = ignoreList;
    var srcDirs = fs.readdirSync(src);
    var tCount = 0;
    var ignoreCount = 0;
    srcDirs.forEach(function(path) {
        if (ignorePathList.indexOf(path) === -1) {
            copyExec(path, function() {
                tCount++;
                (tCount === srcDirs.length - ignoreCount) && callback();
            });
        } else {
            ignoreCount++;
        }
    });   
}

function copyWin(src, dist, ignoreList, callback) {
    src = src.replace(/\//g, '\\');
    if (src[src.length - 1] === '\\') {
        src = src.substring(0, src.length - 1);
    }
    dist = dist.replace(/\//g, '\\');
    var cmd = [ 'xcopy', src, dist, '/s', '/e', '/y' ].join(' ');
    exec(cmd, function(err, stdout, stderr) {
        if (err) {
            console.error('复制' + src + '失败：' + err);
        }
        var index = ignoreList.indexOf('node_modules');
        if (index !== -1) {
            ignoreList.splice(index, 1);
        }
        ignoreList.forEach(function(path, index) {
            if (path !== 'release') {
                path = config.output + '/' + path;
                removeFile(path, function() {
                    index === ignoreList.length -1 && callback();
                });
            }
        });
    });
}

function isDir(path) {
    var isDir = true;
    try{
        fs.readdirSync(path);
    } catch(e) {
        isDir = false;
    } finally {
        return isDir;
    }   
}

function clearOldFiles(callback) {
    var nodeModule = 'node_modules';
    fs.access(config.output, function(err) {
        if (!err) {
            var srcDirs = fs.readdirSync(config.output);
            if (srcDirs.indexOf(nodeModule) === -1) {
                removeFile(config.output, callback);
            } else {
                var count = 0;
                srcDirs.forEach(function(path) {
                    if (path.indexOf(nodeModule) === -1) {
                        var _path = config.output + '/' + path;
                        removeFile(_path, function() {
                            count++;
                            count === srcDirs.length && callback();
                        });
                    } else {
                        count++;
                        count === srcDirs.length && callback();
                    }
                });
            }
        } else {
            callback();
        }
    });
}

function removeFileList(list, callback) {
    var index = 0;
    list.forEach(function(path) {
        path = config.output + '/' + path;
        fs.unlink(path, function(err) {
            index ++;
            if (index === list.length) {
                callback();
            }
        });
    });
}

function removeFile(path, callback) {
    var macCmd = 'rm -r -f ' + path;
    var winPath = path.replace(/\//g, '\\');
    var isDirectory = isDir(path);
    var winCmd = (isDirectory ? 'rd /s/q ' : 'del /f/s/q ') + winPath;
    var cmd = isWindows ? winCmd : macCmd;
    exec(cmd, function(err) {
        if (err) {
            console.error(err);
        }
        callback && callback(path);
    });
}

function prettyPrint(level, message) {
  var fmt = ' \033[%dm%s\033[0m\n';
  switch (level) {
    case 0:
      process.stdout.write(util.format(fmt, 36, message));
      break;
    case 1:
      process.stderr.write(util.format(fmt, 31, message));
      break;
    default:
      process.stdout.write(util.format(fmt, 30, message));
      break;
  }
}

function clearAirDir(path) {
    fs.readdir(path, function(err, fileArr) {
        if (fileArr === undefined) return;
        if (fileArr[0]) {
            fileArr.forEach(function(item) {
                catDir(path + '/' + item);
            });
        } else {
            fs.rmdir(path, function() {});
        }
    });
}

function catDir(path){
    fs.stat(path,function(err,stats){
        if(err)return;
        //如果是目录 , 继续历遍
        if(stats.isDirectory()){
            clearAirDir(path);
        }
    });
}

function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
            break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
            break; 
        default: 
            return 0; 
            break; 
    } 
}

function objectToArray(obj) {
    var arr = [];
    for (var key in obj) {
        arr.push(key);
    }
    return arr;
}

function getPath(args) {
    var mark = isWindows ? '\\' : '/';
    return args.join(mark);
}

console.info = function() {
  var message = util.format.apply(this, arguments);
  prettyPrint(0, message);
}

console.error = function() {
  var message = util.format.apply(this, arguments);
  prettyPrint(1, message);
}

start();