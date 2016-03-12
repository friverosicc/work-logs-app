(function() {
    'use strict';

    angular.module('demo-app.resource.user', [])
    .factory('userResource', ['$http', function($http) {

        function login(user) {
            return $http.post('http://localhost:8080/login', user);
        }

        function signIn(user) {
            return $http.post('http://localhost:8080/sign-in', user);
        }

        function create(user) {
            return $http.post('http://localhost:8080/users', user);
        }

        function update(username, user) {
            return $http.put('http://localhost:8080/users/'+username, user);
        }

        function remove(username) {
            return $http.delete('http://localhost:8080/users/'+username);
        }

        function find(paginator) {
            var params = paginator;
            return $http.get('http://localhost:8080/users', { params: params });
        }

        function findOne(username) {
            return $http.get('http://localhost:8080/users/'+username);
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
