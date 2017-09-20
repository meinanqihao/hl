var angular = require('angular');
var once = require('angular-once');
require("./css/areaSelect.less");

//@require "./html/**/*.html"

module.exports = angular.module('area.select', ['once'])
  .controller('areaSelectController', require('./js/area.select.controller.js'))
  .directive('areaSelect', require('./js/area.select.directive.js'))
  .name;
