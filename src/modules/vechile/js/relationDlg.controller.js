//这里 items是参数，打开modal的时候由resolve处理的
var toaster = require("../../common/toaster.js");
var tools = require("../../common/tools.js");
var dict = require("../../common/dict.js");
var urlTools = require("../../common/urls.js");

module.exports = ['$scope','$http',"vechile","$uibModalInstance",
	function ($scope,$http,vechile,$uibModalInstance) {
	$scope.vechile = vechile;
	$scope.searchDevice = function(value){
		return $http.get(urlTools.getUrl("queryDevice10"), {
      params: {
        terminalId:value
      }
    }).then(function(response){
      return response.data.body;
    });
	}
	
	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	}
	
	$scope.ok = function(){
		if($scope.device!=null){
			//TODO 修改
			$http.post(urlTools.getUrl('vehicleBind'),{
				vechileUuid:vechile.vechileUuid,
				deviceUuid:$scope.device.deviceUuid,
				version:vechile.version
				}).then(function(result){
	        toaster.success("设备关联成功");
					$uibModalInstance.close();
	    })
		}
	}
}];
