
/**
 * Created by kevin on 2017/6/2.
 */
module.exports = ['$document','$templateCache', function($document, $templateCache) {

    return {
        restrict: 'A',
        scope : {
            ngModel : '='
        },
        templateUrl: '/modules/plugins/fileUpload/html/fileUpload.html',
        link:function(scope, element, attrs, ctrl, transclude){
            element.addClass("file-upload");
            var frameHtml = $templateCache.get("/modules/plugins/fileUpload/html/fileUploadIFrame.html");
            scope.frameName = "uploadTargetIFrame" + scope.uniqueId;
            frameHtml = frameHtml.replace(":uploadTargetIFrameName", scope.frameName);
            element.append(frameHtml);
        },
        controller:'fileUploadController'
    }
}];
