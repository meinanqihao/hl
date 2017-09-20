//这里 items是参数，打开modal的时候由resolve处理的
module.exports = ['$scope', '$uibModalInstance', 'items', function ($scope, $uibModalInstance, items) {
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}];
