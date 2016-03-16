(function() {
    'use strict';

    angular.module('demo-app', [
        'ui.router',
        'ngMaterial',
        'ngMessages',
        'angularMoment',
        'demo-app-tpl',
        'demo-app.controller',
        'demo-app.common.security',
        'demo-app.common.roles'
    ])
    .config([
        '$urlRouterProvider',
        '$stateProvider',
        '$locationProvider',
        '$mdThemingProvider',
        'USER_ROLES',
        function($urlRouterProvider, $stateProvider, $locationProvider, $mdThemingProvider, USER_ROLES) {
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
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
            .state('work-logs-summarize', {
                url: '/users/:username/work-logs/summary?dateFrom&dateTo',
                views: {
                    'app-view': {
                        templateUrl: 'controller/work-log/work-logs-summary.tpl.html',
                        controller: 'workLogSummaryController'
                    }
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
            .state('app.users', {
                url: '/users',
                views: {
                    'app-main-content': {
                        templateUrl: 'controller/user/users.tpl.html',
                        controller: 'usersController'
                    }
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager]
                }
            })
            .state('unauthorized', {
                url: '/unauthorized',
                views: {
                    'app-view': {
                        templateUrl: 'controller/unauthorized/unauthorized.tpl.html',
                        controller: 'unauthorizedController'
                    }
                }
            });
        }
    ])
    .run(function ($rootScope, $state, userSession) {
        $rootScope.$on('$stateChangeStart', function (event, next, params) {
            if(angular.isDefined(next.data)) {
                var user = userSession.getUser();
                var authorizedRoles = next.data.authorizedRoles;

                if(angular.isDefined(params.username)) {
                    if(params.username !== user.username)
                        _validateAuthorization(authorizedRoles, user.role, event);
                } else {
                    _validateAuthorization(authorizedRoles, user.role, event);
                }
            }
        });

        function _validateAuthorization(authorizedRoles, role, event) {
            if(_isNotAuthorized(authorizedRoles, role)) {
                event.preventDefault();
                $state.go('unauthorized');
            }
        }

        function _isNotAuthorized(authorizedRoles, role) {
            return authorizedRoles.indexOf(role) === -1;
        }
    });
})();
