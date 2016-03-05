'use strict';

var _ = require('underscore');
var bcrypt = require('bcrypt');
var UserDAOMock = require('../user-dao-mock');
var LoginResource = require('../../../src/resource/login-resource');
var httpStatusCode = require('../../../src/lib/http-status-code');

describe('Login resource', function() {
    var loginResource;
    var _resMock;
    var _user = {
        username: 'username',
        password: 'secretPassword'
    };
    var _userDAOMock;

    beforeEach(function() {
        _userDAOMock = UserDAOMock(_user);

        _resMock = {
            json: function() {},
            status: function() {}
        };
        spyOn(_resMock, 'json');
        spyOn(_resMock, 'status').and.returnValue(_resMock);

        spyOn(bcrypt, 'compareSync').and.callFake(function(pass1, pass2) {
            if(pass1 === pass2)
                return true;
            return false;
        });

        loginResource = LoginResource(httpStatusCode, _, bcrypt, _userDAOMock);
    });

    it('should accept the login to a user with valid credentials', function(done) {
        var req = {
            body: _user
        };

        loginResource.login(req, _resMock);

        var promise = _userDAOMock.getPromise();
        promise.then(function() {
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

        var promise = _userDAOMock.getPromise();
        promise.then(function() {
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

        var promise = _userDAOMock.getPromise();
        promise.then(function() {
            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.CLIENT_ERROR_UNAUTHORIZED);
            expect(_resMock.json).toHaveBeenCalled();

            done();
        });
    });

    it('should give information when some problem appears in the process', function(done) {
        _userDAOMock.setThrowAnError(true);

        var req = { body: _user };

        loginResource.login(req, _resMock);

        var promise = _userDAOMock.getPromise();
        promise.then()
        .catch(function(reason) {
            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR_INTERNAL);
            expect(_resMock.json).toHaveBeenCalled();

            done();
        });
    });
});
