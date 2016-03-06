'use strict';

var _ = require('underscore');
var httpStatusCode = require('../../../src/lib/http-status-code');
var UsersResource = require('../../../src/resource/users-resource');

describe('Users resource', function() {
    var usersResource;
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

        usersResource = UsersResource(httpStatusCode, _, _bcryptMock, _userDAOMock);
    });

    it('should create a new user', function(done) {
        var req = { body: _newUser };

        usersResource.create(req, _resMock);

        _userDAOMock.getPromiseFindOne()
        .then(function() {
            return _userDAOMock.getPromiseCreate();
        })
        .then(function() {
            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SUCCESS_CREATED);
            expect(_resMock.json).toHaveBeenCalled();

            done();
        });
    });

    it('should not create a new user because it already exists', function(done) {
        _userDAOMock.create(_newUser);

        var req = { body: _newUser };

        usersResource.create(req, _resMock);

        _userDAOMock.getPromiseFindOne()
        .then(function() {
            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.CLIENT_ERROR_CONFLICT);
            expect(_resMock.json).toHaveBeenCalled();

            done();
        });
    });

    it('should return a list of all users', function(done) {
        var amountOfUsers = 4;
        var users = [];
        for(var i=0; i<amountOfUsers; i++) {
            _userDAOMock.create(_newUser);
            users.push(_newUser);
        }

        var req = {
            query: {
                start: '0',
                length: '15'
            }
        };

        usersResource.find(req, _resMock);

        _userDAOMock.getPromiseFindAmount()
        .then(function() {
            return _userDAOMock.getPromiseFind();
        })
        .then(function() {
            var userListExpected = {
                total: amountOfUsers,
                users: users
            };

            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SUCCESS_OK);
            expect(_resMock.json).toHaveBeenCalledWith(userListExpected);

            done();
        });
    });

    it('should give information when some problem appears in the creation process', function(done) {
        _userDAOMock.setThrowAnError(true);

        var req = { body: _newUser };

        usersResource.create(req, _resMock);

        _userDAOMock.getPromiseFindOne()
        .then()
        .catch(function() {
            setTimeout(function() {
                expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR_INTERNAL);
                expect(_resMock.json).toHaveBeenCalled();

                done();
            }, 0);
        });
    });

    it('should give information when some problem appears in the finding process', function(done) {
        _userDAOMock.setThrowAnError(true);

        var req = {
            query: {
                start: '0',
                length: '15'
            }
        };

        usersResource.find(req, _resMock);

        _userDAOMock.getPromiseFindAmount()
        .then(function() {
            _userDAOMock.getPromiseFind()
            .then()
            .catch(function() {
                setTimeout(function() {
                    expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR_INTERNAL);
                    expect(_resMock.json).toHaveBeenCalled();

                    done();
                }, 0);
            });
        });
    });
});
