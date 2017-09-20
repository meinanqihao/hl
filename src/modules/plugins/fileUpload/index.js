var angular = require('angular');
require("./css/fileUpload.less");

//@require "./html/**/*.html"

module.exports = angular.module('file.upload', ['once'])
    .controller('fileUploadController', require('./js/file.upload.controller.js'))
    .directive('fileUpload', require('./js/file.upload.directive.js'))
    .name;
