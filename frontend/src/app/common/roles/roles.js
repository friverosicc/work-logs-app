(function() {
    'use strict';

    angular.module('demo-app.common.roles', [])
    .constant('USER_ROLES', {
        regular: 'regular',
        manager: 'manager',
        admin: 'admin'
    });
})();
