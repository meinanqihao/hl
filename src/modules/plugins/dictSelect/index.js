var once = require('angular-once');

//@require "./html/**/*.html"

module.exports = angular.module('dict.select', ['once'])
    .controller('dictSelectController', require('./js/dict.select.controller.js'))
    .directive('dictSelect', require('./js/dict.select.directive.js'))
    .name;
