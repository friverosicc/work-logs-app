'use strict';

var UserDAOMock = require('../user-dao-mock');
var bcrypt = require('bcrypt');
var _ = require('underscore');
var httpStatusCode = require('../../../src/lib/http-status-code');
var SingInResource = require('../../../src/resource/sign-in-resource');

describe('Users resource', function() {
    var signInResource;
    var _userDAOMock;
    var _resMock;
    var _newUser;

    beforeEach(function() {
        _newUser = {
            username: 'newUsername',
            password: 'newPassword',
            preferredWorkingHoursPerDay: 8
        };

        _userDAOMock = UserDAOMock();
        _resMock = require('./response-mock')();

        spyOn(bcrypt, 'hashSync').and.callFake(function(password) {
            return 'passwordEncrypted';
        });

        signInResource = SingInResource(httpStatusCode, _, bcrypt, _userDAOMock);
    });

    it('should sign in a new user', function(done) {
        var newUser = {
            username: 'newUsername',
            password: 'newPassword',
            preferredWorkingHoursPerDay: 8
        };

        var req = { body: _newUser };

        signInResource.signIn(req, _resMock);

        _userDAOMock.getPromiseFindOne()
        .then(function() {
            _userDAOMock.getPromiseCreate()
            .then(function() {
                setTimeout(function() {
                    expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SUCCESS_CREATED);
                    expect(_resMock.json).toHaveBeenCalled();

                    done();
                }, 0);
            });
        });
    });

    it('should sign in a user with regular role by default', function(done) {
        var req = { body: _newUser };

        signInResource.signIn(req, _resMock);

        _userDAOMock.getPromiseFindOne()
        .then(function() {
            _userDAOMock.getPromiseCreate()
            .then(function() {
                _userDAOMock.findOne(_newUser.username)
                .then(function(user) {
                        expect(user.role).toBe('regular');

                        done();
                });
            });
        });
    });

    it('should not sign in a new user because it already exists', function(done) {
        _userDAOMock.create(_newUser);

        var req = { body: _newUser };

        signInResource.signIn(req, _resMock);

        _userDAOMock.getPromiseFindOne()
        .then(function() {
            _userDAOMock.getPromiseCreate()
            .then(function() {
                setTimeout(function() {
                    expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.CLIENT_ERROR_CONFLICT);
                    expect(_resMock.json).toHaveBeenCalled();

                    done();
                }, 0);
            });
        });
    });

});
