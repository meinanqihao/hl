module.exports = ['$stateProvider',function ($stateProvider) {
    $stateProvider
        .state('fileUploadContentState',{  //�����ﶨ�嵱ǰģ��·��
            url:'/plugins/fileUpload/uploadResult',
            templateUrl:'/modules/plugins/fileUpload/html/uploadResult.html',
            controller:'fileUploadResultController'
        })
}]


