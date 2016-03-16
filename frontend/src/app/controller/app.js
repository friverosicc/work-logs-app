(function() {
    'use strict';

    angular.module('demo-app.controller', [
        'demo-app.controller.login',
        'demo-app.controller.logout',
        'demo-app.controller.sign-in',
        'demo-app.controller.base',
        'demo-app.controller.work-log',
        'demo-app.controller.work-log.form',
        'demo-app.controller.work-log.summary'
    ])
    .controller('appController', [

		function() {
		}
    ]);
})();
