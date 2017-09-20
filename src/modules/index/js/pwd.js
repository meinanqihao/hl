//这里 items是参数，打开modal的时候由resolve处理的
var toaster = require("../../common/toaster.js");
var urlTools = require("../../common/urls.js");
var tools = require("../../common/tools.js");

module.exports = ['$scope','$http',"$uibModalInstance",'user',function ($scope,$http,$uibModalInstance,user) {
	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	}
	
	$scope.ok = function(){
		if($scope.nPwd!=$scope.cPwd){
			toaster.info("输出提醒","确认密码与新密码不一致");
			return;
		}
		if($scope.nPwd==""){
			toaster.info("输出提醒","新密码不能为空");
			return;
		}
		
		if($scope.oPwd==""){
			toaster.info("输出提醒","旧密码不能为空");
			return;
		}
		
		$http.post(urlTools.getUrl('changPwd'),angular.extend({
			loginName:user.loginName,
			oldPasswd:tools.md5($scope.oPwd),
			newPwd:tools.md5($scope.nPwd)
			},))
     .then(function(result){
				toaster.info("密码修改成功");
				$uibModalInstance.close();
     });
	}
}];
