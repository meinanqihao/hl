//这里 items是参数，打开modal的时候由resolve处理的
var toaster = require("../../common/toaster.js");
var tools = require("../../common/tools.js");
var urlTools = require("../../common/urls.js");
var validTools = require("../../common/valid.js");
var rules = {
	'orgCode':["企业编号",{type:"notNull"}],
	'orgName':["企业名称",{type:"notNull"}]	,
	'province':["所属省",{type:"notNull"}]		,
	'city':["所属市",{type:"notNull"}]		,
	'county':["所属县",{type:"notNull"}]	,
	'unitUuid':["所属会员管理单位",{type:"notNull"}]	
};
module.exports = ['$scope','$http',"org","$uibModalInstance",function ($scope,$http,org,$uibModalInstance) {
	$scope.org = org;
	if(org.create==true){
		$scope.org.title = "新增";
		$scope.mm="";
	}else{
		$scope.mm={agentName:org.unitName,agentUuid:org.unitUuid};
		$scope.org.title = "修改";
	}
	
	$scope.searchMm = function(value){
		return $http.get(urlTools.getUrl("queryMmUnit"), {
      params: {
        agentName: value
      }
    }).then(function(response){
      return response.data.body;
    });
	}
	
	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	}
	
	$scope.ok = function(){
		if($scope.mm!=""){
			$scope.org.unitUuid = $scope.mm.agentUuid;
			$scope.org.unitName = $scope.mm.agentName;
		}
		if(!validTools.valid(rules,$scope.org)){
			return;
		}
		if(org.orgUuid!=null){
			//TODO 修改
			
			$http.post(urlTools.getUrl('modifyOrg'),$scope.org)
	           .then(function(result){
	        toaster.success("修改企业成功");
					$uibModalInstance.close();
	    })
		}else{
			$http.post(urlTools.getUrl('addOrg'),$scope.org)
	           .then(function(result){
	        toaster.success("新增企业成功");
					$uibModalInstance.close();
	    })
		}
	}
}];
