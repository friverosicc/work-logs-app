'use strict';

var _ = require('underscore');
var LoginResource = require('../../../src/resource/login-resource');
var httpStatusCode = require('../../../src/lib/http-status-code');

describe('Login resource', function() {
    var loginResource;
    var _resMock, _userDAOMock, _bcryptMock;
    var _user;

    beforeEach(function() {
        _user = {
            username: 'username',
            password: 'secretPassword'
        };
        
        _bcryptMock = require('./bcrypt-mock')();
        _resMock = require('./response-mock')();
        _userDAOMock = require('../user-dao-mock')();
        _userDAOMock.create(_user);

        loginResource = LoginResource(httpStatusCode, _, _bcryptMock, _userDAOMock);
    });

    it('should accept the login to a user with valid credentials', function(done) {
        var req = {
            body: _user
        };

        loginResource.login(req, _resMock);

        _userDAOMock.getPromiseFindOne()
        .then(function() {
            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SUCCESS_OK);
            expect(_resMock.json).toHaveBeenCalled();

            done();
        });
    });

    it('should reject the login to a user that does not exist', function(done) {
        var req = {
            body: {
                username: 'userDoesNotExist'
            }
        };

        loginResource.login(req, _resMock);

        _userDAOMock.getPromiseFindOne()
        .then(function() {
            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.CLIENT_ERROR_UNAUTHORIZED);
            expect(_resMock.json).toHaveBeenCalled();
            done();
        });
    });

    it('should reject the login to a user with wrong password', function(done) {
        var req = {
            body: {
                username: _user.username,
                password: 'wrongPassword'
            }
        };

        loginResource.login(req, _resMock);

        _userDAOMock.getPromiseFindOne()
        .then(function() {
            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.CLIENT_ERROR_UNAUTHORIZED);
            expect(_resMock.json).toHaveBeenCalled();

            done();
        });
    });

    it('should give information when some problem appears in the process', function(done) {
        _userDAOMock.setThrowAnError(true);

        var req = { body: _user };

        loginResource.login(req, _resMock);

        _userDAOMock.getPromiseFindOne()
        .then()
        .catch(function(reason) {
            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR_INTERNAL);
            expect(_resMock.json).toHaveBeenCalled();

            done();
        });
    });
});
