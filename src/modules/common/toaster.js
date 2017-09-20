require("./css/toaster.less");
require("./html/toasterConfirm.html");

var toasterTool = {};
var confirmHtml;
var parentEl;
function init($rootScope, toaster, $uibModal){
    toasterTool.$rootScope = $rootScope;
    toasterTool.toaster = toaster;
    toasterTool.$uibModal = $uibModal;
    var confirmHtmlPath = require("./html/toasterConfirm.html");
    confirmHtml = $rootScope.$templateCache.get(confirmHtmlPath);
    parentEl = angular.element(document.querySelector('.confirm-container'));
}

function success(title, content){
    if(toasterTool.toaster){
        toasterTool.toaster.pop({
            toasterId : 2,
            "type": "success",
            "title": title,
            "body": content
        });
    }
}

function info(title, content){
    if(toasterTool.toaster){
        toasterTool.toaster.pop({
            toasterId : 2,
            "type": "info",
            "title": title,
            "body": content
        });
    }
}
function wait(title, content){
    if(toasterTool.toaster){
        toasterTool.toaster.pop({
            toasterId : 2,
            "type": "wait",
            "title": title,
            "body": content
        });
    }
}


function warning(title, content){
    if(toasterTool.toaster){
        toasterTool.toaster.pop({
            toasterId : 2,
            "type": "warning",
            "title": title,
            "body": content

        });
    }
}

function confirm( content,callback){
    if(toasterTool.$uibModal){
        var confirmDialog = toasterTool.$uibModal.open({
            animation: true,
            ariaDescribedBy: 'modal-body',
            backdrop:'static',
            controller:['$scope', '$uibModalInstance', 'data','$sce', function ($scope, $uibModalInstance, data,$sce){
            		data.content = $sce.trustAsHtml(data.content);
                $scope.data = data;
                $scope.ok = function(){
                	callback(true);
                  $uibModalInstance.close(true);
                }
                $scope.cancel = function(){
                		callback(false);
                    $uibModalInstance.dismiss(false);
                }
            }],
            appendTo : angular.element(document.body),
            template: confirmHtml,
            resolve: {
                data: function () {
                    return {
                        "content":content
                    };
                }
            }
        });
        return confirmDialog;
    }
}

function error(title, content){
    if(toasterTool.toaster){
        toasterTool.toaster.pop({
            toasterId : 1,
            "type": "error",
            "title": title,
            "body": content,
            "timeout" : 0
        });
    }
}



module.exports = {
    init : init,
    success : success,
    error : error,
    warning : warning,
    info : info,
    wait : wait,
    confirm:confirm,
    clear : function(toasterId, toastId){
        if(toasterTool.toaster){
            toasterTool.toaster.clear(toasterId, toastId);
        }
    }
}