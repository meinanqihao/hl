var toaster = require("../../../common/toaster.js");
module.exports = ['$scope','$attrs','uibDateParser','$filter', function($scope, $attrs, dateParser, $filter){
  $scope.ngModel = $scope.ngModel || {};
  $scope.beginName = $attrs.beginName ;
  $scope.endName = $attrs.endName;
  var format = $attrs.format || "yyyyMMdd";

  if(!$scope.beginName || !$scope.endName){
    toaster.error("请配置 beginName 和 endName 属性");
  }
  $scope.dateBegin = dateParser.parse($scope.ngModel[$scope.beginName], format) || null;
  $scope.dateEnd = dateParser.parse($scope.ngModel[$scope.endName], format) || null;

  $scope.$watch('dateBegin',function(){
    if($scope.dateBeginSetValue) {
      $scope.dateBeginSetValue = false;
    }else {
      $scope.dateBeginSelected = true;
      $scope.ngModel[$scope.beginName] = $filter('date')($scope.dateBegin, format);
      $scope.dateRegion.dateEndOptions.minDate = $scope.dateBegin;
    }
  });

  $scope.$watch('dateEnd',function(){
    if($scope.dateEndSetValue) {
      $scope.dateEndSetValue = false;
    }else{
      $scope.dateEndSelected = true;
      $scope.ngModel[$scope.endName] = $filter('date')($scope.dateEnd,format);
      $scope.dateRegion.dateBeginOptions.maxDate = $scope.dateEnd;
    }
  });


  $scope.$watch('ngModel[beginName] ',function(){
    if($scope.dateBeginSelected == true){
      $scope.dateBeginSelected = false;
    }else{
      $scope.dateBeginSetValue = true;
      $scope.dateBegin = dateParser.parse($scope.ngModel[$scope.beginName], format) || null;
      $scope.dateRegion.dateEndOptions.minDate = $scope.dateBegin;
    }
  });
  $scope.$watch('ngModel[endName] ',function(){
    if($scope.dateEndSelected == true){
      $scope.dateEndSelected = false;
    }else{
      $scope.dateEndSetValue = true;
      $scope.dateEnd = dateParser.parse($scope.ngModel[$scope.endName], format) || null;
      $scope.dateRegion.dateBeginOptions.maxDate = $scope.dateEnd;

    }

  });

  $scope.dateRegion = {
    "format":"yyyyMMdd",
    "altInputFormats":["yyyy-MM-dd","yyyyMMdd","yyyy/MM/dd"],
    "beginOpened":false,
    "endOpened":false,
    "dateBeginOptions":{
        "appendToBody":true
    },
    "dateEndOptions":{
      "appendToBody":true
    }
  };
  $scope.openBegin = function(){
    $scope.dateRegion.beginOpened = true;
  }
  $scope.openEnd = function(){
    $scope.dateRegion.endOpened = true;
  }


}];
