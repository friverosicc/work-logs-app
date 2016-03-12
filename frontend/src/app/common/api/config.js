(function() {
    'use strict';

    var _baseURL = 'http://localhost:8080/';

    angular.module('demo-app.common.api.config', [])
    .constant('apiURLs', {
        login: _baseURL + 'login',
        signIn: _baseURL + 'sign-in',
        users: _baseURL + 'users',
        user: _baseURL + 'users/{{username}}',
        workLogs: _baseURL + 'users/{{username}}/work-logs',
        workLog: _baseURL + 'users/{{username}}/work-logs/{{workLogId}}'
    });
})();
