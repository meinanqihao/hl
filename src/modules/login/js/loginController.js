var tools = require("../../common/tools.js");
var urlTools = require("../../common/urls.js");
var validTools = require("../../common/valid.js");
var rules = {
	"name":["用户名",{type:"notNull"}],
	"password":["密码",{type:"notNull"}]
};
module.exports = ['$scope','$http','$rootScope',function ($scope,$http, $rootScope) {
    $scope.loginData={
        name:"",
        password:""
    };
    $scope.login=function(){
    		if(!validTools.valid(rules,$scope.loginData)){
    			return;
    		}
    	
        var pwd=$scope.loginData.password;
        var password1=tools.md5(pwd);
        var password3=tools.md5(password1+$scope.loginData.name);
        var args={"loginName":$scope.loginData.name,"password":password3,"password2":tools.encode64(pwd)};
      	$http.post(urlTools.getUrl('login'),args)
           .then(function(result){
                if( $rootScope.preState && "login" !=  $rootScope.preState){
                    $rootScope.$state.go($rootScope.preState, $rootScope.preParams);
                    $rootScope.preState = null;
                }else{
        					window.location.href="#/index?"+new Date().getTime();
                }
           })
    };

    $scope.clickLogin=function(e){
        var keycode=window.event? e.keyCode: e.which;
        if(keycode==13){
            $scope.login();
        }
    };

}]; 