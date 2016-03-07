'use strict'

var Authorizer = require('../../../src/security/authorizer');
var httpStatusCode = require('../../../src/lib/http-status-code');

describe('Authorizer', function() {
    var authorizer;
    var _resMock, _nextMock;

    const regularUser = {
        username: 'regularUsername',
        role: 'regular'
    };
    const managerUser = {
        username: 'managerUsernamer',
        role: 'manager'
    };
    const adminUser = {
        username: 'adminUsername',
        role: 'admin'
    };

    beforeEach(function() {
        _resMock = require('../resource/response-mock')();
        _nextMock = jasmine.createSpy('next');
    });

    it('should allow to all users CRUD on their information', function() {
        var req = {
            params: { username: regularUser.username },
            user: regularUser
        };

        var authorizer = Authorizer([]);
        authorizer.authorize(req, _resMock, _nextMock);

        expect(_nextMock).toHaveBeenCalled();
    });

    it('should not allow to users CRUD on information of others users', function() {
        var req = {
            params: { username: managerUser.username },
            user: regularUser
        };

        var authorizer = Authorizer([]);
        authorizer.authorize(req, _resMock, _nextMock);

        expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.CLIENT_ERROR_FORDIDDEN);
        expect(_resMock.json).toHaveBeenCalled();
        expect(_nextMock).not.toHaveBeenCalled();
    });

    it('should allow to one role CRUD on information of others users', function() {
        var req = {
            params: { username: regularUser.username },
            user: managerUser
        };

        var authorizer = Authorizer(['manager']);
        authorizer.authorize(req, _resMock, _nextMock);

        expect(_nextMock).toHaveBeenCalled();
    });

    it('should allow to more than one role CRUD on information of others users', function() {
        var req = {
            params: { username: regularUser.username },
            user: adminUser
        };

        var authorizer = Authorizer(['manager', 'admin']);
        authorizer.authorize(req, _resMock, _nextMock);

        expect(_nextMock).toHaveBeenCalled();
    });

});
