module.exports = ['$scope','$state','$injector', '$stateParams', function($scope, $state,$injector,$stateParams) {
  var currDeps = {
    '$scope':$scope,
    '$state':$state,
    '$injector':$injector,
    '$stateParams':$stateParams
  };
  var controllerPrefix = $stateParams.controllerPrefix;
  var currModule = $stateParams.module;
  $scope['menu-url'] = '/modules/' + currModule + "/html/" + $stateParams.path;

  var controllerDef = require('./modules/' + currModule + "/js/" + controllerPrefix + ".controller.js");
  var deps = [];
  if(controllerDef){ //此时转到对应的controller里进行处理
    if(controllerDef.length > 1){
      for(var i = 0; i < controllerDef.length - 1; i++){
        var depsKey = controllerDef[i];
        var depsObj = currDeps[depsKey];
        if(!depsObj){
          depsObj = $injector.get(depsKey);
        }
        deps.push(depsObj);
      }
    }
    console.log(deps);
    return controllerDef[controllerDef.length - 1].apply(this, deps);
  }

}];
