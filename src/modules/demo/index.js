var angular = require('angular');
require('angular-ui-router');
require('angular-ui-bootstrap');
require('ui-select');
var once = require('angular-once');
require('angular-animate');
require('../plugins/areaSelect');
require('../plugins/fileUpload');
require('../plugins/dictSelect');
require("./css/index.less");
require("../plugins/dateRegion");
//@require "./html/**/*.html"

//define the base.index module
module.exports = angular.module('base.demo', ['ui.router','ui.bootstrap','ui.select','once','ngAnimate','area.select','file.upload','dict.select','date.region'])
  .config(require('./routes.js'))
  .controller('demoController', require('./js/demo.controller.js'))
  .controller('modalController', require('./js/modal.controller.js'))
  .name;
