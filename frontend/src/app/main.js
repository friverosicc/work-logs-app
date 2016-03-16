(function() {
    'use strict';

    angular.module('demo-app', [
        'ui.router',
        'ngMaterial',
        'ngMessages',
        'angularMoment',
        'demo-app-tpl',
        'demo-app.controller',
        'demo-app.common.security'
    ])
    .config([
        '$urlRouterProvider',
        '$stateProvider',
        '$locationProvider',
        '$mdThemingProvider',
        function($urlRouterProvider, $stateProvider, $locationProvider, $mdThemingProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });

            $mdThemingProvider.theme('default')
            .primaryPalette('cyan');

            $urlRouterProvider.otherwise('/');

            $stateProvider
            // Login
            .state('login', {
                url: '/',
                views: {
                    'app-view': {
                        templateUrl: 'controller/login/login.tpl.html',
                        controller: 'loginController'
                    }
                }
            })
            // Sign in
            .state('sign-in', {
                url: '/sign-in',
                views: {
                    'app-view': {
                        templateUrl: 'controller/sign-in/sign-in.tpl.html',
                        controller: 'signInController'
                    }
                }
            })
            // Logout
            .state('logout', {
                url: '/logout',
                views: {
                    'app-view': {
                        controller: 'logoutController'
                    }
                }
            })
            .state('app', {
                views: {
                    'app-view': {
                        templateUrl: 'controller/base/base.tpl.html',
                        controller: 'baseController'
                    }
                }
            })
            .state('app.work-logs', {
                url: '/users/:username/work-logs',
                views: {
                    'app-main-content': {
                        templateUrl: 'controller/work-log/work-log.tpl.html',
                        controller: 'workLogController'
                    }
                }
            })
            .state('work-logs-summarize', {
                url: '/users/:username/work-logs/summary?dateFrom&dateTo',
                views: {
                    'app-view': {
                        templateUrl: 'controller/work-log/work-logs-summary.tpl.html',
                        controller: 'workLogSummaryController'
                    }
                }
            })
            .state('app.users', {
                url: '/users',
                views: {
                    'app-main-content': {
                        templateUrl: 'controller/user/users.tpl.html',
                        controller: 'usersController'
                    }
                }
            });
        }
    ]);
})();
