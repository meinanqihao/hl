var angular = require('angular');
require("./css/tab.less");

//@require "./html/**/*.html"

module.exports = angular.module('ui.tab', ['once'])
    .controller('uiTab', require('./js/tab.controller.js'))
    .directive('uiTabHl', require('./js/tab.directive.js'))
    .name;
