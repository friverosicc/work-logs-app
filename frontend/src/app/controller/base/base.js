(function() {
    'use strict';

    angular.module('demo-app.controller.base', [
        'ui.router',
        'demo-app.common.session'
    ])
    .controller('baseController', [
        '$scope',
        '$state',
        'userSession',
        function($scope, $state, userSession) {
            $scope.user = userSession.getUser();
                        
            if(!$scope.user)
                $state.go('login');
        }
    ]);
})();