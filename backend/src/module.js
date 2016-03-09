'use strict';

var Module = function() {

    function initializeContainer(diContainer, app, passport) {
        diContainer.register('_', require('underscore'));
        diContainer.register('mongoClient', require('mongodb').MongoClient);
        diContainer.register('ObjectID', require('mongodb').ObjectID);

        diContainer.register('bcrypt', require('bcrypt'));
        diContainer.register('configDatabase', require('./configuration/database'));
        diContainer.register('httpStatusCode', require('./lib/http-status-code'));
        diContainer.register('app', app);
        diContainer.register('passport', passport);

        diContainer.factory('mongoDBConnection', require('./lib/mongo-db-connection'));
        diContainer.factory('userDAO', require('./dao/user-dao'));
        diContainer.factory('workLogDAO', require('./dao/work-log-dao'));
        diContainer.factory('usersResource', require('./resource/users-resource'));
        diContainer.factory('userResource', require('./resource/user-resource'));
        diContainer.factory('loginResource', require('./resource/login-resource'));
        diContainer.factory('signInResource', require('./resource/sign-in-resource'));
        diContainer.factory('workLogsResource', require('./resource/work-logs-resource'));
        diContainer.factory('workLogResource', require('./resource/work-log-resource'));
        diContainer.factory('authenticator', require('./security/authenticator'));
    }

    return { initializeContainer: initializeContainer };
};

module.exports = Module();
