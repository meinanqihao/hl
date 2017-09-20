var angular = require('angular');
require('angular-once');
require('angular-ui-router');
require("angularjs-toaster");
require("angularjs-toaster/toaster.min.css");
var toasterTool = require("./modules/common/toaster.js");
var tools = require("./modules/common/tools.js");

var login = require("./modules/login");
require("angularjs-toaster");
require("./modules/common/css/beidou.less");

//@require "./modules/*/html/**/*.html"
//@require "./modules/*/css/**/*.less"

var getDynamicTemplateUrl = function(params){
  return '/modules/' + params.module + '/html/' + params.path;
};
var app = angular.module('app', ['ngAnimate', 'toaster', login]);
app.run(["$rootScope","$state","$stateParams",'$uibModal','toaster','$templateCache',function($rootScope, $state, $stateParams,$uibModal, toaster,$templateCache){
		$rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$templateCache = $templateCache;
    toasterTool.init($rootScope, toaster, $uibModal);
}] )
.factory("httpInterceptor", require("./modules/config/httpInterceptor.js"))
  .config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/login');
  }])
  .config(["$httpProvider", function($httpProvider){
      $httpProvider.interceptors.push("httpInterceptor");
  }]);


Date.prototype.format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
Number.prototype.toDate = function(){
	if(this=='')return null;
	var len = (this+"").length;
	var v = this;
	var d = ["2017","/","05","/","05"," ","00",":","00",":","00"];
	switch(len){
		case 8://20170506
			d[0] = parseInt(v/10000);
			v = v%10000;
			d[2] = parseInt(v/100);
			v = v%100;
			d[4] = v;
			break;
		case 14://20170202102325
			d[0] = parseInt(v/10000000000);
			v = v%10000000000;
			d[2] = parseInt(v/100000000);
			v = v%100000000;
			d[4] = parseInt(v/1000000);
			v = v%1000000;
			d[6] = parseInt(v/10000);
			v = v%10000;
			d[8] = parseInt(v/100);
			v = v%100;
			d[10] = v;
			break;
	}
	return new Date(d.join(""));
}
Number.prototype.formatDate = function(format){
	if(this=='')return null;
	return this.toDate().format(format);
}