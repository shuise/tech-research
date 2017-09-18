## 使用说明
1. 使用前需要正确安装全局node以及npm。
2. 在任意位置执行终端命令：

	```
	node release.js <path> [output] [-c]
	/*
	   path为源码路径，必填。
	   output为合并后的输出路径，可选。不填则默认在当前目录生成release文件夹。
	   -c 表示是否压缩，可选。 
	*/ 
	```
3. `推荐`将release.js与RCE源码放在同一个目录。直接执行如下终端命令：

	```
	node release.js ./desktop-client -c
	```


## 规则说明

1. 需要合并的js，css必须以script或link标签的形式定义在inc目录下的html文件中。
2. 合并的规则由用户引入js，css的顺序和命名来决定，相同_group命名的文件将合并在一起。
3. 相同\_group的js或css，引入必须相邻，中间不能插入不同\_group命名的引入。

## 注意事项
1. 项目中的js变量不能全局声明，需要使用window.变量的方式进行设置。
2. js文件中'use strict'的定义不能放到全局。可以在每个js文件的最外层函数开始处加入'use strict’;