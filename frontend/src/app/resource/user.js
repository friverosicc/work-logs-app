(function() {
    'use strict';

    angular.module('demo-app.resource.user', ['demo-app.common.api.config'])
    .factory('userResource', [
        '$http',
        '$interpolate',
        'apiURLs',
        function($http, $interpolate, apiURLs) {

        function login(username, password) {
            var user = { username: username, password: password };
            return $http.post(apiURLs.login, user);
        }

        function signIn(user) {
            return $http.post(apiURLs.signIn, user);
        }

        function create(user) {
            return $http.post(apiURLs.users, user);
        }

        function update(username, user) {
            var url = $interpolate(apiURLs.user)({ username: username });
            return $http.put(url, user);
        }

        function remove(username) {
            var url = $interpolate(apiURLs.user)({ username: username });
            return $http.delete(url);
        }

        function find(paginator) {
            var params = paginator;
            return $http.get(apiURLs.users, { params: params });
        }

        function findOne(username) {
            return $http.get($interpolate(apiURLs.user)({ username: username }));
        }

        return {
            login: login,
            signIn: signIn,
            create: create,
            update: update,
            remove: remove,
            find: find,
            findOne: findOne
        };
    }]);
})();
