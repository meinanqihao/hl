module.exports = ['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('index', {
            url: '/index',
            templateUrl: '/modules/index/html/index.html',
            controller:"index"
        });/*
    .state('index.org', {
        url: '/org',
        templateUrl: '/modules/org/html/index.html',
        controller:"orgIndex"
    })
    .state('index.vechile', {
        url: '/vechile',
        templateUrl: '/modules/vechile/html/index.html',
        controller:"vechileIdx"
    })
    .state('index.device', {
        url: '/device',
        templateUrl: '/modules/device/html/index.html',
        controller:"deviceIdx"
    })
    .state('index.monitor', {
        url: '/monitor',
        templateUrl: '/modules/monitor/html/index.html',
        controller:"monitorIdx"
    })
    .state('index.alerm', {
        url: '/alerm',
        templateUrl: '/modules/alerm/html/index.html',
        controller:"alermIdx"
    });*/
}];