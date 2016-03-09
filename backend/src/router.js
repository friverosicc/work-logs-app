'use strict';

var authorizer = require('./security/authorizer');

/**
 * This module sets each resource with its url and http methods.
 */
var Router = function(app, passport) {

    function registerLoginResource(loginResource) {
        app.post('/login', loginResource.login);
    }

    function registerSignInResource(signInResource) {
        app.post('/sign-in', signInResource.signIn);
    }

    function registerUsersResource(usersResource) {
        app.post('/users',
        passport.authenticate('basic', { session : false }),
        authorizer(['manager', 'admin']).authorize,
        usersResource.create);

        app.get('/users',
        passport.authenticate('basic', { session : false }),
        authorizer(['manager', 'admin']).authorize,
        usersResource.find);
    }

    function registerUserResource(userResource) {
        app.get('/users/:username',
        passport.authenticate('basic', { session : false }),
        authorizer(['manager', 'admin']).authorize,
        userResource.findOne);

        app.delete('/users/:username',
        passport.authenticate('basic', { session : false }),
        authorizer(['manager', 'admin']).authorize,
        userResource.remove);

        app.put('/users/:username',
        passport.authenticate('basic', { session : false }),
        authorizer(['manager', 'admin']).authorize,
        userResource.update);
    }

    function registerWorkLogsResource(workLogsResource) {
        app.post('/users/:username/work-logs',
        passport.authenticate('basic', { session : false }),
        authorizer(['admin']).authorize,
        workLogsResource.create);

        app.get('/users/:username/work-logs',
        passport.authenticate('basic', { session : false }),
        authorizer(['admin']).authorize,
        workLogsResource.find);

        app.get('/users/:username/work-logs/summarize',
        passport.authenticate('basic', { session : false }),
        authorizer(['admin']).authorize,
        workLogsResource.findSummarize);
    }

    function registerWorkLogResource(workLogResource) {
        app.delete('/users/:username/work-logs/:workLogId',
        passport.authenticate('basic', { session : false }),
        authorizer(['admin']).authorize,
        workLogResource.remove);

        app.put('/users/:username/work-logs/:workLogId',
        passport.authenticate('basic', { session : false }),
        authorizer(['admin']).authorize,
        workLogResource.update);
    }

    return {
        registerLoginResource: registerLoginResource,
        registerSignInResource: registerSignInResource,
        registerUsersResource: registerUsersResource,
        registerUserResource: registerUserResource,
        registerWorkLogsResource: registerWorkLogsResource,
        registerWorkLogResource: registerWorkLogResource
    };
}

module.exports = Router;
