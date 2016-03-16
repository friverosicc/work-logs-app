(function() {
    'use stritc';

    angular.module('demo-app.controller.work-log.form', [
        'ui.router',
        'ngMaterial',
        'demo-app.common.floating-form',
        'demo-app.resource.work-log'
    ])
    .controller('workLogFormController', [
        '$scope',
        '$state',
        '$mdToast',
        '$floatingForm',
        'workLogResource',
        'workLog',
        'formTitle',
        'action',
        function($scope, $state, $mdToast, $floatingForm, workLogResource, workLog, formTitle, action) {
            var _username = $state.params.username;
            $scope.workLog = workLog;
            $scope.formTitle = formTitle;            

            $scope.hide = function() {
                $floatingForm.cancel();
            };

            function _validate(ngFormController) {
                if(ngFormController.$invalid) {
                    angular.forEach(ngFormController, function(value, key) {
                        if (typeof value === 'object' && value.hasOwnProperty('$modelValue'))
                            value.$setTouched();
                    });
                }
            }

            $scope.save = function() {
                _validate($scope.workLogForm);

                if(!$scope.workLogForm.$invalid) {
                    if(action === 'create') {
                        workLogResource.create(_username, $scope.workLog)
                        .then(function(response) {
                            $floatingForm.hide(response.data.msg);
                        });
                    } else {
                        workLogResource.update(_username, $scope.workLog)
                        .then(function(response) {
                            $floatingForm.hide(response.data.msg);
                        });
                    }
                }
            };
        }
    ]);
})();
