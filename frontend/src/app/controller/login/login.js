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
                .then(_validUserCredentials)
                .catch(_invalidUserCredentials);
            };

            function _validUserCredentials() {
                userSession.save($scope.user);
                $state.go('app.work-logs', { username: $scope.user.username });
            }

            function _invalidUserCredentials(response) {
                $scope.error = response.data.msg;
                $scope.loginForm.password.$error = { invalidLogin: true };
            }

            function _isPossibleTryToLogin() {
                return $scope.loginForm.$valid && $scope.loginForm.$dirty;
            }

            $scope.isNotPossibleTryToLogin = function() {
                return !_isPossibleTryToLogin();
            };
        }
    ]);
})();
