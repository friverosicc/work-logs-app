(function() {
    'use strict';

    angular.module('demo-app.controller.unauthorized', [
        'demo-app.common.session'
    ])
    .controller('unauthorizedController', [
        '$scope',
        'userSession',
        function($scope, userSession) {
            $scope.username = userSession.getUser().username;
        }
    ]);
})();
