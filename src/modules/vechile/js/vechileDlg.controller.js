//这里 items是参数，打开modal的时候由resolve处理的
var toaster = require("../../common/toaster.js");
var tools = require("../../common/tools.js");
var dict = require("../../common/dict.js");
var urlTools = require("../../common/urls.js");
var validTools = require("../../common/valid.js");
var urlData = {
		add:"/dist/data/org.json",
		edit:""
}
var rules = {
	'plateNo':["车牌号",{type:"notNull"}],
	'vechileType':["车辆类型",{type:"notNull"}]	,
	'engineNo':["发动机号",{type:"notNull"}]	,
	'orgUuid':["所属企业",{type:"notNull"}]	,
	'orgUuid':["所属企业",{type:"notNull"}]	,
	"contactsName":["联系人",{type:"notNull"}],
	"contactsPhone":["联系人手机号",{type:"notNull"}],
	"vechileLocation":["车籍所在地",{type:"notNull"}],
	"province":["所属省",{type:"notNull"}],
	"city":["所属市",{type:"notNull"}],
	"county":["所属县",{type:"notNull"}]
};

module.exports = ['$scope','$http',"vechile","$uibModalInstance",
	function ($scope,$http,vechile,$uibModalInstance) {
	$scope.vechile = vechile||{};
	$scope.title = vechile==null?"新增":"修改";
	
	$scope.dictData ={};
	if(vechile!=null){
		$scope.org = {orgUuid:vechile.orgUuid,orgNamePath:vechile.transValue.orgUuid_};
		$scope.vechile.vechileType_ = vechile.transValue.vechileType_;
	}
	
	dict.load($http,["plate_color","vechile_type","industry"],function(result){
      angular.extend($scope.dictData,result);
  });
	
	
	$scope.searchOrg = function(value){
		return $http.get(urlTools.getUrl("queryOrg10"), {
      params: {
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
		if($scope.org!=null&&$scope.org!=""){
			$scope.vechile.orgUuid = $scope.org.orgUuid;
		}
		if(!validTools.valid(rules,$scope.vechile)){
			return;
		}
		if(vechile!=null){
			//TODO 修改
			$http.post(urlTools.getUrl('modifyVehicle'),$scope.vechile)
	           .then(function(result){
	        toaster.success("修改车辆成功");
					$uibModalInstance.close();
	    })
		}else{
			$http.post(urlTools.getUrl('addVehicle'),$scope.vechile)
	           .then(function(result){
	        toaster.success("新增车辆成功");
					$uibModalInstance.close();
	    })
		}
	}
}];
