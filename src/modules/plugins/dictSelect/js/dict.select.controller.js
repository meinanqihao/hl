module.exports = ['$scope','$attrs','$interval', function($scope, $attrs,$interval){
    $scope.data = {selected:{}};
    $scope.ngModel = $scope.ngModel || {};
    $scope.dictValueName = $attrs.dictValueName;
    $scope.dictDisplayName = $attrs.dictValueName + "_";

    var dictChangFn =  $attrs.dictChange;
    if(dictChangFn && typeof $scope.$parent[dictChangFn] == "function"){
        $scope.dictChangFn = $scope.$parent [dictChangFn];
    }


    if(!$scope.dictValueName){
        alert("请配置dict-select的dict-value-name属性");
    }


    $scope.selectDictItem = function($event){
        var element = $event.target;
        var itemCode =  $scope.data.selected["itemCode"];
        var display = element.innerHTML;
        var oldValue = $scope.ngModel[$scope.dictValueName];
        $scope.ngModel[$scope.dictValueName] = itemCode;
        $scope.ngModel[$scope.dictValueName + "_"] = display;
        if($scope.dictChangFn && oldValue != itemCode){
            $scope.dictChangFn(oldValue, itemCode);
        }
    }

}];