(function() {
    'use strict';

    angular.module('demo-app.controller.logout', [
        'ui.router',
        'demo-app.common.session'
    ])
    .controller('logoutController', [
        '$state',
        'userSession',
        function($state, userSession) {
            userSession.clean();
            $state.go('login');
        }
    ]);
})();
