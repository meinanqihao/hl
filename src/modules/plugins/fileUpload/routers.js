module.exports = ['$stateProvider',function ($stateProvider) {
    $stateProvider
        .state('fileUploadContentState',{  //在这里定义当前模块路由
            url:'/plugins/fileUpload/uploadResult',
            templateUrl:'/modules/plugins/fileUpload/html/uploadResult.html',
            controller:'fileUploadResultController'
        })
}]


