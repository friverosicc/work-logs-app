(function() {
    'use stritc';

    angular.module('demo-app.controller.work-log.new', [
        'demo-app.common.floating-form'
    ])
    .controller('workLogFormController', [
        '$scope',
        '$floatingForm',
        'workLog',
        'formTitle',
        function($scope, $floatingForm, workLog, formTitle) {
            $scope.workLog = workLog;
            $scope.formTitle = formTitle;

            $scope.hide = function() {
                $floatingForm.hide();
            };
        }
    ]);
})();
