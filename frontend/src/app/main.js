(function() {
    'use strict';

    angular.module('demo-app', [
        'ui.router',
        'ngMaterial',
        'ngMessages',
        'demo-app-tpl',
        'demo-app.controller'
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
            .state('login', {
                url: '/',
                views: {
                    'app-view': {
                        templateUrl: 'controller/login/login.tpl.html',
                        controller: 'loginController'
                    }
                }
            })
            .state('sign-in', {
                url: '/sign-in',
                views: {
                    'app-view': {
                        templateUrl: 'controller/sign-in/sign-in.tpl.html',
                        controller: 'signInController'
                    }
                }
            });
        }
    ]);
})();
