module.exports = ['$document', function($document) {
    return {
        restrict: 'A',
        scope : {
            ngModel : '='
        },
        templateUrl: '/modules/plugins/dateRegion/html/dateRegion.html',
        link:function(scope, element, attrs, ctrl, transclude){
            element.addClass("date-region");


        },
        controller:'dateRegionController'
    }
}];
