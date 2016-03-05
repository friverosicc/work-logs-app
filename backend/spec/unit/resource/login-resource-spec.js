'use strict';

var _ = require('underscore');
var bcrypt = require('bcrypt');
var LoginResource = require('../../../src/resource/login-resource');
var httpStatusCode = require('../../../src/lib/http-status-code');

describe('Login resource', function() {
    var loginResource;
    var resMock;
    var user = {
        username: 'username',
        password: 'secretPassword'
    };
    var promise;
    var thereIsAProblemInTheServer;

    beforeEach(function() {
        thereIsAProblemInTheServer = false;

        var userDAOMock = {
            findOne: function(username) {
                promise = new Promise(function(resolve, reject) {
                    if(thereIsAProblemInTheServer) {
                        reject("problem with the database");
                    } else {
                        if(username === user.username)
                            resolve(user);
                        else
                            resolve({});
                    }
                });

                return promise;
            }
        };

        resMock = {
            json: function() {},
            status: function() {}
        };
        spyOn(resMock, 'json');
        spyOn(resMock, 'status').and.returnValue(resMock);

        spyOn(bcrypt, 'compareSync').and.callFake(function(pass1, pass2) {
            if(pass1 === pass2)
                return true;
            return false;
        });

        loginResource = LoginResource(httpStatusCode, _, bcrypt, userDAOMock);
    });

    it('should accept the login to a user with valid credentials', function(done) {
        var req = {
            body: user
        };

        loginResource.login(req, resMock);

        promise.then(function() {
            expect(resMock.status).toHaveBeenCalledWith(httpStatusCode.SUCCESS_OK);
            expect(resMock.json).toHaveBeenCalled();

            done();
        });
    });

    it('should reject the login to a user that does not exist', function(done) {
        var req = {
            body: {
                username: 'userDoesNotExist'
            }
        };

        loginResource.login(req, resMock);

        promise.then(function() {
            expect(resMock.status).toHaveBeenCalledWith(httpStatusCode.CLIENT_ERROR_UNAUTHORIZED);
            expect(resMock.json).toHaveBeenCalled();
            done();
        });
    });

    it('should reject the login to a user with wrong password', function(done) {
        var req = {
            body: {
                username: user.username,
                password: 'wrongPassword'
            }
        };

        loginResource.login(req, resMock);

        promise.then(function() {
            expect(resMock.status).toHaveBeenCalledWith(httpStatusCode.CLIENT_ERROR_UNAUTHORIZED);
            expect(resMock.json).toHaveBeenCalled();

            done();
        });
    });

    it('should give information when some problem appears in the process', function(done) {
        thereIsAProblemInTheServer = true;
        var req = { body: user };

        loginResource.login(req, resMock);

        promise.then()
        .catch(function(reason) {
            expect(resMock.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR_INTERNAL);
            expect(resMock.json).toHaveBeenCalled();

            done();
        });
    });
});
