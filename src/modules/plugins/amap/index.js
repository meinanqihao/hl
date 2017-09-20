var once = require('angular-once');
require("./css/amap.less");
//@require "./html/**/*.html"

module.exports = angular.module('amap.comp', ['once'])
    .directive('amapComp', require('./js/amap.comp.directive.js'))
    .name;
