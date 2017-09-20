//这里 items是参数，打开modal的时候由resolve处理的
var toaster = require("../../common/toaster.js");
var tools = require("../../common/tools.js");

var urlTools = require("../../common/urls.js");
var validTools = require("../../common/valid.js");
var dict = require("../../common/dict.js");
var rules = {
	'orgUuid':["所属企业",{type:"notNull"}],
	'manufactureId':["制造商",{type:"notNull"}]	,
	'terminalId':["终端编号",{type:"notNull"}]	
};
module.exports = ['$scope','$http',"device","$uibModalInstance",function ($scope,$http,device,$uibModalInstance) {
	$scope.device = device||{};
	$scope.vehicle = null;
	$scope.dictData ={};
	
	dict.load($http,["manufacture"],function(result){
      angular.extend($scope.dictData,result);
  });
	if(device!=null){
		$scope.org = {orgUuid:device.orgUuid,orgName:device.orgName};
		$scope.vehicle = {plateNo:device.plateNo};
		$scope.device.manufactureId_ = device.transValue.manufactureId_;
	}
	
	
	$scope.searchVehicle = function(value){
		return $http.get(urlTools.getUrl("vehiclePage"), {
      params: {
        plateNo:value,
        pageSize:15,
        currentPage:1
      }
    }).then(function(response){
      return response.data.body;
    });
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
		if($scope.vehicle!=""){
			$scope.device.plateNo = $scope.vehicle.plateNo;
		}
		if($scope.org!=""){
			$scope.device.orgUuid = $scope.org.orgUuid;
		}
		if(!validTools.valid(rules,$scope.device)){
			return;
		}
		if($scope.device.deviceUuid!=null){
			//修改
			$http.post(urlTools.getUrl('modifyDevice'),$scope.device)
	           .then(function(result){
	        toaster.success("修改设备成功");
					$uibModalInstance.close();
	    });
		}else{
			$http.post(urlTools.getUrl('addDevice'),$scope.device)
	           .then(function(result){
	        toaster.success("新增设备成功");
					$uibModalInstance.close();
	    });
		}
	}
}];
