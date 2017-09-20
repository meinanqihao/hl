require("./js/angular-locale_zh-cn.js");
require("./css/dateRegion.less");
var once = require('angular-once');

//@require "./html/**/*.html"

module.exports = angular.module('date.region', ['once'])
    .controller('dateRegionController', require('./js/date.region.controller.js'))
    .directive('dateRegion', require('./js/date.region.directive.js'))
    .name;
