'use strict';

var _ = require('underscore');
var httpStatusCode = require('../../../src/lib/http-status-code');
var SingInResource = require('../../../src/resource/sign-in-resource');

describe('Users resource', function() {
    var signInResource;
    var _userDAOMock, _resMock, _bcryptMock;
    var _newUser;

    beforeEach(function() {
        _newUser = {
            username: 'newUsername',
            password: 'newPassword',
            preferredWorkingHoursPerDay: 8
        };

        _userDAOMock = require('../user-dao-mock')();
        _resMock = require('./response-mock')();
        _bcryptMock = require('./bcrypt-mock')();

        signInResource = SingInResource(httpStatusCode, _, _bcryptMock, _userDAOMock);
    });

    it('should sign in a new user', function(done) {
        var req = { body: _newUser };

        signInResource.signIn(req, _resMock);

        _userDAOMock.getPromiseFindOne()
        .then(function() {
            return _userDAOMock.getPromiseCreate();
        })
        .then(function() {
            return _userDAOMock.findOne(_newUser.username);
        })
        .then(function(user) {
            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SUCCESS_CREATED);
            expect(_resMock.json).toHaveBeenCalled();

            expect(user.role).toBe('regular');
            expect(user.password).toBe('passwordEncrypted');
            expect(user.username).toBe(_newUser.username);
            expect(user.preferredWorkingHoursPerDay).toBe(_newUser.preferredWorkingHoursPerDay);

            done();
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

    it('should give information when some problem appears in the registration process', function(done) {
        _userDAOMock.setThrowAnError(true);

        var req = { body: _newUser };

        signInResource.signIn(req, _resMock);

        _userDAOMock.getPromiseFindOne()
        .then()
        .catch(function(reason) {
            setTimeout(function() {
                expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR_INTERNAL);
                expect(_resMock.json).toHaveBeenCalled();

                done();
            }, 0);
        });
    });

});
