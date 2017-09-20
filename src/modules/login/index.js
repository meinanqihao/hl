var angular = require('angular');
require('angular-ui-router');
require('angular-ui-bootstrap');
require('ui-select');
var once = require('angular-once');
require('angular-animate');
require('./css/login.less');

//@require "./html/**/*.html"

module.exports = angular.module('register',['ui.router','ui.bootstrap','ui.select','once','ngAnimate'])
    .config(require('./routers'))     //在这里引入当前模块路由
    .controller('loginController',require("./js/loginController")) 
    .name;/**
 * Created by hlet24 on 2017/5/28.
 */
