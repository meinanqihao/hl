module.exports = ['$stateProvider',function ($stateProvider) {
    $stateProvider
        .state('login',{  //在这里定义当前模块路由
            url:'/login',
            templateUrl:'/modules/login/html/login.html',
            controller:'loginController'
        })
}]/**
 * Created by hlet24 on 2017/5/28.
 */
