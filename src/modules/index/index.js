var angular = require('angular');
var once = require('angular-once');
require('angular-ui-router');
require('angular-ui-bootstrap');
require('ui-select');
require('angular-animate');
require("./css/index.less");
require("./css/leftMenu.less");
//@require "./html/**/*.html"

//define the base.index module
module.exports = angular.module('index', ['ui.router','ui.bootstrap','ui.select','once','ngAnimate','area.select','dict.select'])
    .config(require('./routes.js'))
    .controller('index', require('./js/index.js'))
    .controller('pwdController', require('./js/pwd.js'))
    .controller('orgIndex', require('../org/js/modal.controller.js'))
    .controller('vechileIdx', require('../vechile/js/modal.controller.js'))
    .controller('relationDevice', require('../vechile/js/relationDlg.controller.js'))
    .controller('deviceIdx', require('../device/js/modal.controller.js'))
    .controller('monitorIdx', require('../monitor/js/modal.controller.js'))
    .controller('alermIdx', require('../alerm/js/modal.controller.js'))
    .controller('orgDlgController', require('../org/js/orgDlg.controller.js'))
    .controller('deptDlgController', require('../org/js/deptDlg.controller.js'))
    .controller('vechileDlgController', require('../vechile/js/vechileDlg.controller.js'))
    .controller('deviceDlgController', require('../device/js/deviceDlg.controller.js'))
    .controller('alermDlgController', require('../alerm/js/alermDlg.controller.js'))
    .name;