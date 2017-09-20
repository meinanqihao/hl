var angular = require('angular');
require("./css/grid.less");

//@require "./html/**/*.html"

module.exports = angular.module('grid.table', ['once'])
    .controller('gridTable', require('./js/grid.controller.js'))
    .directive('gridTable', require('./js/grid.directive.js'))
    .name;
