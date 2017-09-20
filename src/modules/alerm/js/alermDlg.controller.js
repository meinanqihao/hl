//这里 items是参数，打开modal的时候由resolve处理的
var toaster = require("../../common/toaster.js");
var tools = require("../../common/tools.js");
var urlTools = require("../../common/urls.js");
var desction = {
	bat:"您正在对【{{counts}}】条报警信息进行统一处理",
	tmpl:"【{{alarmType_}}】{{plateNo}} 在&nbsp;{{alarmTime_}}&nbsp;时发生如下报警:&nbsp;{{alarmDetail}},该车辆对应联系人:"+
				"<font style='text-decoration: underline;padding:0 10px;font-weight:bold;'>"+
				"{{contactsName}}&nbsp;&nbsp;(电话:&nbsp;{{contactsPhone}})</font>,该车辆属于'{{orgName}}'公司"
};
module.exports = ['$scope','$http',"item","$uibModalInstance",'$sce',function ($scope,$http,item,$uibModalInstance,$sce) {
	var singleFlag = true;
	if(angular.isArray(item)&&item.length==1){
		item = item[0];
	}
	if(angular.isArray(item)){
		singleFlag = false;
		$scope.description =$sce.trustAsHtml(tools.fillObj(desction.bat,{counts:item.length}));
	}else{
		item.alarmTime_ = item.alarmTime.toDate().format("yyyy-MM-dd hh:mm:ss");
		$scope.description = $sce.trustAsHtml(tools.fillObj(desction.tmpl,item));
	}
		
	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	}
	
	$scope.ok = function(){
		if(singleFlag){
			$http.post(urlTools.getUrl('doSingleAlerm'),{
				alermUuid:item.alermUuid,
				disposeInfo:$scope.disposeInfo,
				version:item.version
				})
		           .then(function(result){
	        toaster.success("处理成功");
					$uibModalInstance.close();
	    })
		}else{
			var ids = [];
			for(var i=0;i < item.length;i++){
				ids.push(item[i].alermUuid);
			}
			//批量处理报警
			$http.post(urlTools.getUrl('doSomeAlerm'),{
				alermUuids:ids,
				disposeInfo:$scope.disposeInfo
				})
		           .then(function(result){
	        toaster.success("处理成功");
					$uibModalInstance.close();
	    })
		}
	}
}];
