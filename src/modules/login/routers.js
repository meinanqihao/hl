module.exports = ['$stateProvider',function ($stateProvider) {
    $stateProvider
        .state('login',{  //�����ﶨ�嵱ǰģ��·��
            url:'/login',
            templateUrl:'/modules/login/html/login.html',
            controller:'loginController'
        })
}]/**
 * Created by hlet24 on 2017/5/28.
 */
