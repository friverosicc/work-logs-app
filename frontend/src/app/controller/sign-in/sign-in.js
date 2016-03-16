(function() {
    'use strict';

    angular.module('demo-app.controller.sign-in', [
        'ui.router',
        'demo-app.common.session',
        'demo-app.resource.user'
    ])
    .controller('signInController', [
        '$scope',
        '$state',
        'userSession',
        'userResource',
        function($scope, $state, userSession, userResource) {
            $scope.signIn = function() {
                userResource.signIn($scope.user)
                .then(_accountRegisteredSuccessfully)
                .catch(_accountRegistrationFailed);
            };

            function _accountRegisteredSuccessfully() {
                $scope.user.role = 'regular';
                userSession.save($scope.user);
                $state.go('app.work-logs', { username: $scope.user.username });
            }

            function _accountRegistrationFailed(response) {
                $scope.error = response.data.msg;
                $scope.userForm.preferredWorkingHoursPerDay.$error = { serverError: true };
            }

            $scope.isPossibleTryToCreateAccount = function() {
                if($scope.userForm.$dirty && $scope.userForm.$valid)
                    return true;
                return false;
            };
        }
    ]);
})();
