(function() {
    'use strict';

    angular.module('demo-app.controller.user.form', [
        'ngMaterial',
        'demo-app.resource.user',
        'demo-app.common.floating-form'
    ])
    .controller('userFormController', [
        '$scope',
        '$mdToast',
        '$floatingForm',
        'userResource',
        'user',
        'formTitle',
        'action',
        function($scope, $mdToast, $floatingForm, userResource, user, formTitle, action) {
            $scope.user = user;
            $scope.user.role = (action === 'create') ? 'regular' : user.role;
            $scope.formTitle = formTitle;
            $scope.onEdition = (action === 'update') ? true : false;

            $scope.hide = function() {
                $floatingForm.cancel();
            };

            $scope.save = function() {
                _validate($scope.userForm);

                if(!$scope.userForm.$invalid) {
                    if(action === 'create') {
                        userResource.create($scope.user)
                        .then(function(response) {
                            $floatingForm.hide(response.data.msg);
                        })
                        .catch(function(response) {
                            _showMessage(response.data.msg);
                        });
                    } else {
                        userResource.update($scope.user.username, $scope.user)
                        .then(function(response) {
                            $floatingForm.hide(response.data.msg);
                        })
                        .catch(function(response) {
                            _showMessage(response.data.msg);
                        });
                    }
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

            function _showMessage(msg) {
                $mdToast.show(
                    $mdToast.simple()
                    .content(msg)
                    .position('top right')
                    .hideDelay(6000)
                    .capsule(true)
                );
            }
        }
    ]);
})();
