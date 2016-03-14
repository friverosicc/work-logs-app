(function() {
    'use strict';

    angular.module('demo-app.common.session', [
        'base64'
    ])
    .factory('userSession', [
        '$base64',
        function($base64) {
        var _token = 'TOKEN';
        var _userData = 'USER-DATA';

        function save(user) {
            var credentials = $base64.encode(user.username + ':' + user.password);

            delete user.password;

            window.localStorage.setItem(_userData, JSON.stringify(user));
            window.localStorage.setItem(_token, credentials);
        }

        function clean() {
            window.localStorage.clear();
        }

        function getUser() {        
            return JSON.parse(window.localStorage.getItem(_userData));
        }

        function getCredentials() {
            return window.localStorage.getItem(_token);
        }

        return {
            save: save,
            clean: clean,
            getUser: getUser,
            getCredentials: getCredentials
        };
    }]);
})();
