var toaster = require("../common/toaster.js");
var urlTools = require("../common/urls.js");
module.exports = ["$q", "$rootScope", function($q, $rootScope){
    return {
        request: function(config){
            if(config.url.indexOf("/action") == 0){
                config.url = "" + config.url;
                if(config.url.indexOf('?')>-1){
                	config.url+="&_="+new Date().getTime();
                }else{
                	config.url+="?_="+new Date().getTime();
                }
            }
            if(urlTools.isDebug()&&config.method=="POST"&&config.url.indexOf('/action')==-1){
            	config.method = "GET";
            	console.log("params:");
            	console.log(config.data);
            }
            
            if(config.method=='POST'){
            	//增加loading效果
            }
            return config || $q.when(config);
        },
        requestError:function(rejection){
            return $q.reject(rejection);
        },
        response:function(response){
            var data = response.data||response.data.retObj;
            if(angular.isObject(data)){
                var isSuccess = data.success ;
                var errorNo = data.errCode || data.error_no|| data.errorCode;
                if(!isSuccess && (errorNo && errorNo != 0)){
                    var errorMsg = data.errMsg || data.error_msg|| data.errorMsg;
                    toaster.error(errorMsg);
                    return $q.reject(errorMsg);
                }else{
                    return response || $q.when(response);
                }
            }else{
                return response || $q.when(response);
            }
        },
        responseError:function(rejection){
            if(rejection.status == "550"){
                $rootScope.preParams = {};
                $rootScope.preState = $rootScope.$state.$current.name;
                angular.copy($rootScope.$stateParams, $rootScope.preParams);
                $rootScope.$state.go("login");
                return $q.reject(rejection);
            }else{
                return $q.reject(rejection);
            }

        }
    };
}];