(function() {
    'use strict';

    angular.module('demo-app.controller.setting', [
        'ngMaterial',
        'demo-app.resource.user',
        'demo-app.common.session'
    ])
    .controller('settingController', [
        '$scope',
        '$mdDialog',
        'userResource',
        'userSession',
        'user',
        function($scope, $mdDialog, userResource, userSession, user) {
            $scope.user = {};
            angular.copy(user, $scope.user);

            $scope.hide = function() {
                $mdDialog.cancel();
            };

            $scope.save = function() {
                _validate($scope.userForm);

                if(!$scope.userForm.$invalid) {
                    userResource.update($scope.user.username, $scope.user)
                    .then(function(response) {
                        $mdDialog.hide(response.data.msg);
                        userSession.save($scope.user);
                    });
                }
            };

            function _validate(ngFormController) {
                if(ngFormController.$invalid) {
                    angular.forEach(ngFormController, function(value, key) {
                        if (typeof value === 'object' && value.hasOwnProperty('$modelValue'))
                            value.$setTouched();
                    });
                }
            }
        }
    ]);
})();
