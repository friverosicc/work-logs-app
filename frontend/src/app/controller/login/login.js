(function() {
    'use strict';

    angular.module('demo-app.controller.login', [
        'ui.router',
        'demo-app.resource.user',
        'demo-app.common.session'
    ])
    .controller('loginController', [
        '$scope',
        '$state',
        'userResource',
        'userSession',
        function($scope, $state, userResource, userSession) {
            $scope.login = function() {
                userResource.login($scope.user.username, $scope.user.password)
                .then(function() {
                    userSession.save($scope.user);
                    $state.go('app.work-logs', { username: $scope.user.username });
                })
                .catch(function(res) {
                    $scope.error = res.data.msg;
                    $scope.loginForm.password.$error = { invalidLogin: true };
                });
            };

            $scope.isPossibleTryToLogin = function() {
                return $scope.loginForm.$valid && $scope.loginForm.$dirty;
            };
        }
    ]);
})();
