(function() {
    'use strict';

    angular.module('demo-app.common.session', [])
    .factory('userSession', [function() {
        var _user = {};

        function save(user) {
            _user = user;
        }

        function clean() {
            _user = {};
        }

        function getUser() {
            return _user;
        }

        return {
            save: save,
            clean: clean,
            getUser: getUser
        };
    }]);
})();
