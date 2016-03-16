(function() {
    'use strict';

    angular.module('demo-app.controller.user-form', [
        'demo-app.common.floating-form'
    ])
    .controller('userFormController', [
        '$scope',
        '$floatingForm',
        'user',
        'formTitle',
        'action',
        function($scope, $floatingForm, user, formTitle, action) {
            $scope.user = user;
            $scope.formTitle = formTitle;

            $scope.hide = function() {
                $floatingForm.cancel();
            };
        }
    ]);
})();
