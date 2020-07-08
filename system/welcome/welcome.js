(function(){
  var _oHash;
  var group, _group;
  var groups = {
    f2e: {
      name : "网站与内部系统前端",
      nav : [
        {id : "sns", name : "个人工具"},
        {id : "auths", name : "系统权限"},
        {id : "flows", name : "业务流程"},
        {id : "rules", name : "约法三章"}
      ],
      taskList : "popo svn go server gongdan hudong cms rules special codereview"
    },
    backend: {
      name : "网站与内部系统后端",
      nav : [
        {id : "sns", name : "安装软件"},
        {id : "join", name : "加入组织"},
        {id : "auths", name : "开通权限"},
        {id : "flows", name : "基础技能"},
        {id : "rules", name : "内部规范"}
      ],
      taskList : "popo aurora devilfish photolib videolib live hudong cms rules train1 train2"
    },
    product: {
      name : "系统产品",
      nav : [
        {id : "sns", name : "安装软件"},
        {id : "join", name : "加入组织"},
        {id : "auths", name : "开通权限"},
        {id : "flows", name : "基础技能"},
        {id : "rules", name : "内部规范"}
      ],
      taskList : "popo email aurora devilfish photolib videolib live hudong cms rules train1 train2"
    }
  };
  var uid = getCookie("crewid") || "游客";
  if(!uid) return;
  var admin;
  var $ = function(q, root) { root = root || document;if(!root.nodeType && root[0]) root = root[0];return root.nodeType ? angular.element(typeof q == 'string' && q.substr(0,1) != '<' ? root.querySelectorAll(q) : q) : []; }
  $.template = function(temp, data, regexp){
	if(!(Object.prototype.toString.call(data) === "[object Array]")) data = [data];
	var ret = [];
	for(var i=0,j=data.length;i<j;i++){
      data[i].i = i;
	  ret.push(replaceAction(data[i]));
	}
	return ret.join("");
	function replaceAction(object){
	  return temp.replace(regexp || (/\\?\{([^}]+)\}/g), function(match, name){
		if (match.charAt(0) == '\\') return match.slice(1);
		return (object[name] != undefined) ? object[name] : '';
	  });
	}
  }
  $.API_URL = "/f2eapi";
  angular.$ = $;
  angular.element.prototype.show = function(){
    for(var i=0; i < this.length; i++) {
      this[i].style.display = "block";
    }
    return this;
  }
  angular.element.prototype.hide = function(){
    for(var i=0; i < this.length; i++) {
      this[i].style.display = "none";
    }
    return this;
  }
  angular.element.prototype.each = function(fn){
    for(var i = 0; i < this.length; i++) {
      fn.call(this[i], i);
    }
    return this;
  }

  var welcomeModule = angular.module('welcome', ['ngRoute']);
  welcomeModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/verify', {
        templateUrl: 'verify.html',
        controller: 'verify'
      }).
      when('/steps/:step', {
        templateUrl: function(params){
          if(typeof group == 'undefined') {
            _oHash = location.hash;
            location.hash = '/verify';
            return '';
          }
          return 'steps' + (group != 'f2e' ? '_' + group : '') + '/' + params.step + '.html';
        },
        controller: 'docs'
      }).
      when('/steps/:group/:step', {
        templateUrl: function(params){
          _group = params.group;
          if(typeof group == 'undefined') {
            _oHash = location.hash;
            location.hash = '/verify';
            return '';
          }
          if(admin && groups[_group]) {
            group = _group;
          }else{
            location.hash = '/steps/' + params.step;
          }
          return 'steps' + (group != 'f2e' ? '_' + group : '') + '/' + params.step + '.html';
        },
        controller: 'docs'
      }).
      otherwise({
        redirectTo: '/steps/sns'
      });
  }]);

  welcomeModule.controller("verify", ['$http', '$scope', '$rootScope', function ($http, $scope, $rootScope) { //鉴定身份
    var tasks = $rootScope.tasks = [];
    $rootScope.tasks.done = function(){
      var arr = [];
      for(var i = 0, len = this.length; i< len; i++){
        if(this[i].done) arr.push(this[i]);
      }
      return arr;
    }
    $rootScope.getProgress = function(){
      return 100 * tasks.done().length / tasks.length;
    }

    $rootScope.updateTask = function(){
      var taskStatus = {};
      for(var i = 0, len = tasks.length; i< len; i++){
        var task = tasks[i];
        if(task.done){
          taskStatus[task.id] = 1;
        }
      }
      $http.post($.API_URL + "/crews/" + uid, taskStatus)
        .success(function(json, code){
          //console.log(json);
        })
        .error(function(json, status, headers){
          console.log(json, status, headers);
        });
    };
    $rootScope.userInfo = {
      uid : uid
    };
    //初始化数据
    $http.get($.API_URL + "/crews/" + uid)
      .error(function(){
        $rootScope.isAdmin = admin = 1;
        group = admin && _group ? _group : 'f2e';
        $rootScope.topnav = groups[group].nav;
        location.hash = _oHash || "/steps/sns";
        $rootScope.available = true;
      })
      .success(function(json, code){
        if(!json || json == 'null'){ //不存在
          invalidCrew();
        }else{
          if(!groups[json.group]){
            invalidCrew();
            return;
          }
          $rootScope.isAdmin = admin = json.admin;
          group = admin && _group ? _group : json.group;
          var taskList = groups[group].taskList || "";
          taskList.split(/ /).forEach(function(taskid){
            tasks.push({id : taskid});
          });
          var groupName = groups[group].name;
          $rootScope.topnav = groups[group].nav;
          document.title = "网易" + groupName + "组 新人引导";
          if(json.newbie[0]){
            for(var i = 0, len = tasks.length; i< len; i++){
              var task = tasks[i];
              if(json.newbie[0][task.id]){
                task.done = true;
              }
            }
          }
          
          if(admin){
            var $admBtn = $(".newbie-adm");
            if($admBtn[0]){
              var $inputs = $admBtn.find("input");
              $("body").bind("click", function(){
                $admBtn.removeClass("active");
              });
              $admBtn.bind("click", function(e){
                if(e.target.tagName.toLowerCase() == 'a'){
                  $admBtn.toggleClass("active");
                }
                e.stopPropagation ? e.stopPropagation() : (window.event.cancelBubble = true);
              });
              $admBtn.find("button").bind("click", function(){
                var uid = $inputs[0].value.replace(/\s+/g, '');
                var name = $inputs[1].value.replace(/\s+/g, '');
                if(uid == ''){
                  alert("邮箱前缀不能为空。");
                  return;
                }
                if(name == ''){
                  alert("姓名不能为空。");
                  return;
                }
                
                $http.post($.API_URL + "/crews/", {
                  uid : uid,
                  name : name,
                  group : group
                }).success(function(json, code){
                  if(json.result == 'success'){
                    alert("新增组员"+name+"("+uid+")成功。");
                    $inputs[0].value = '';
                    $inputs[1].value = '';
                  }else{
                    alert(json.msg || "未知错误");
                  }
                });
              });
            }
          }

          setTimeout(function(){
            $rootScope.userInfo = json;
            if (!$scope.$root.$$phase) {
              $scope.$root.$digest();
            }
            $(".verify h4")[0].innerHTML = "欢迎您来到网易" + groupName + "组";
          }, 400);
          setTimeout(function(){
            location.hash = _oHash || "/steps/sns";
            $rootScope.available = true;
          }, 2000);
        }
      });

    function invalidCrew(){
      $rootScope.userInfo.name = $rootScope.userInfo.uid;
      $(".verify h4")[0].innerHTML = "鉴定结果：非吃货小分队成员";
    }
  }]);

  welcomeModule.controller("top", ['$http', '$scope', '$rootScope', function ($http, $scope, $rootScope) {
    var tasks = $rootScope.tasks = [];
  }]);
  
  welcomeModule.controller("docs", ['$routeParams', '$http', '$scope', '$rootScope', function ($routeParams, $http, $scope, $rootScope) {
    var step = $routeParams.step;
    $rootScope.step = step;
    if(_group){
      $rootScope.topnav = groups[_group].nav;
    }
  }]);
  
  welcomeModule.directive("task", ['$sce', function($sce){
    return {
      restrict : 'E',
      template : '<span ng-transclude></span> <div class="onoffswitch"><input id="task-{{id}}" class="onoffswitch-checkbox" type="checkbox" ng-checked="task.done" ng-click="toggletask($event)"><label for="task-{{id}}" class="onoffswitch-label"><div class="onoffswitch-inner"></div><div class="onoffswitch-switch"></div></label></div>', //<span ng-bind-html="content"></span>
      replace : false,
      transclude : true,
      scope : true,
      link : function ($scope, element, attr) {
        var taskid = $scope.id = element.attr("taskid");
        var tasks = $scope.$root.tasks, task;
        for(var i = 0, len = tasks.length; i < len; i ++){
          if(tasks[i].id == taskid){
            task = tasks[i];
            break;
          }
        }
        if(task){
          $scope.task = task;
          for(var key in task){
            if(key != 'done' && task.hasOwnProperty(key)){
              $scope[key] = $sce.trustAsHtml(task[key]);
            }
          }
        }
        $scope.toggletask = function($event){
          if(task.done){ //已做->未做
            task.done = false;
          }else{
            task.done = true;
          }
          if (!$scope.$root.$$phase) {
            $scope.$root.$digest();
          }
          $scope.$root.updateTask();
        };
      }
    };
  }]);
  
  function getCookie(name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) return unescape(arr[2]); return null;
  }
  
})();
