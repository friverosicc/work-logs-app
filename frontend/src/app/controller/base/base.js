(function() {
    'use strict';

    angular.module('demo-app.controller.base', [
        'ngMaterial',
        'ui.router',
        'demo-app.common.session'
    ])
    .controller('baseController', [
        '$scope',
        '$state',
        '$mdDialog',
        'userSession',
        function($scope, $state, $mdDialog, userSession) {
            $scope.user = userSession.getUser();

            if(!$scope.user)
                $state.go('login');

            $scope.showMySettings = function() {
                $mdDialog.show({
                    controller: 'settingController',
                    templateUrl: 'controller/setting/setting.tpl.html',
                    locals: { user: $scope.user }
                });
            };
        }
    ]);
})();
