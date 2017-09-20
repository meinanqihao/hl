//这里 items是参数，打开modal的时候由resolve处理的
var toaster = require("../../common/toaster.js");
var tools = require("../../common/tools.js");
var urlTools = require("../../common/urls.js");
var validTools = require("../../common/valid.js");
var rules = {
	'orgCode':["企业编号",{type:"notNull"}],
	'orgName':["企业名称",{type:"notNull"}]	,
	'parentOrgUuid':["所属企业",{type:"notNull"}]	
};
module.exports = ['$scope','$http',"dept","$uibModalInstance",function ($scope,$http,dept,$uibModalInstance) {
	$scope.dept = dept;
	if(dept.create==true){
		$scope.org="";
		$scope.dept.title = "新增";
	}else{
		$scope.org={orgName:dept.orgName,orgCode:dept.orgUuid};
		$scope.dept.title = "修改";
	}
	
	$scope.searchOrg = function(value){
		return $http.get(urlTools.getUrl("queryOrg10"), {
      params: {
        orgType: "company",
        orgName:value
      }
    }).then(function(response){
      return response.data.body;
    });
	}
	
	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	}
	
	$scope.ok = function(){
		if($scope.org!=""){
			$scope.dept.parentOrgUuid = $scope.org.orgUuid;
		}
		if(!validTools.valid(rules,$scope.dept)){
			return;
		}
		if($scope.dept.orgUuid!=null){
//			console.log($scope.dept);return;
			//TODO 修改
			$http.post(urlTools.getUrl('modifyOrg'),$scope.dept)
	           .then(function(result){
	        toaster.success("修改车队成功");
					$uibModalInstance.close();
	    });
		}else{
			$http.post(urlTools.getUrl('addDept'),$scope.dept)
	           .then(function(result){
	        toaster.success("新增车队成功");
					$uibModalInstance.close();
	    });
		}
	}
}];
