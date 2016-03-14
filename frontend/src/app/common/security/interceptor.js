(function() {
    'use strict';

    angular.module('demo-app.common.security', [
        'ui.router',
        'ngMaterial',
        'demo-app.common.session'
    ])
    .factory('interceptor', [
        '$injector',
        '$q',
        'userSession',
        function($injector, $q, userSession) {

            function request(config) {
                var credentials = userSession.getCredentials();

                if(credentials)
                    config.headers.Authorization = 'Basic ' + credentials;
                return config;
            }

            function responseError(rejection) {
                var $state = $injector.get('$state');
                var $mdToast = $injector.get('$mdToast');

                if(rejection.status === 401 && $state.current.name !== 'login')
                    $state.go('logout');

                if(rejection.status === 403)
                    $mdToast.show(
                        $mdToast
                        .simple()
                        .content(rejection.data.msg)
                        .position('top right')
                        .hideDelay(3000)
                        .capsule(true)
                    );

                return $q.reject(rejection);
            }

            return {
                request: request,
                responseError: responseError
            };
        }
    ])
    .config(['$httpProvider', function($httpProvider){
		$httpProvider.interceptors.push('interceptor');
	}]);
})();
