'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var diContainer = require('./lib/di-container');
var module = require('./module');

var Server = function() {
    var _app = express();

    module.initializeContainer(diContainer, _app, passport);

    _configureHeaders(_app);
    _configureSecurity();
    _addMiddleware(_app);
    _setRoutes(_app);
    _initServer(_app);

    function _configureHeaders(app) {
        _app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
            res.setHeader('Access-Control-Allow-Credentials', false);
            next();
        });
    }

    function _configureSecurity() {
        var authenticator = diContainer.get('authenticator');
        var basicStrategy = new BasicStrategy({ realm: 'demo-project' }, authenticator.authenticate);

        passport.use(basicStrategy);
    }

    function _addMiddleware(app) {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended : true }));
        app.use(passport.initialize());
    }

    function _setRoutes(app) {
        diContainer.factory('router', require('./router'));
        var router = diContainer.get('router');

        router.registerLoginResource(diContainer.get('loginResource'));
        router.registerSignInResource(diContainer.get('signInResource'));
        router.registerUsersResource(diContainer.get('usersResource'));
        router.registerUserResource(diContainer.get('userResource'));
        router.registerWorkLogsResource(diContainer.get('workLogsResource'));
        router.registerWorkLogResource(diContainer.get('workLogResource'));
    }

    function _initServer(app) {
        var port = process.env.PORT || 8080;
        return _app.listen(port, function() {
            console.log('Express started in 8080; press Ctrl-C to terminate.');
        });
    }
};

Server();
