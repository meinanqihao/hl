module.exports = ['$document', function($document) {
  return {
      restrict: 'A',
      scope : {
        ngModel : '='
      },
      templateUrl: '/modules/plugins/areaSelect/html/areaSelect.html',
      link:function(scope, element, attrs, ctrl, transclude){
        element.addClass("area-select");
        
        $document.on("click",function(event){
          var srcElement = event.srcElement || event.target;
          if(srcElement.querySelectorAll(".city-picker-dropdown").length > 0){
            scope.hideCities();
            scope.$apply();
          }
        });
      },
      controller:'areaSelectController'
  }
}];
