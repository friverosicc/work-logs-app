'use strict';

var _ = require('underscore');
var httpStatusCode = require('../../../src/lib/http-status-code');
var UserResource = require('../../../src/resource/user-resource');

describe('User resource', function() {
    var _userDAOMock, _resMock, _bcryptMock;
    var userResource;
    var _user;

    beforeEach(function() {
        _user = {
            username: 'username',
            password: 'secretPassword',
            role: 'admin',
            preferredWorkingHoursPerDay: 7
        };

        _userDAOMock = require('../user-dao-mock')();
        _resMock = require('./response-mock')();
        _bcryptMock = require('./bcrypt-mock')();

        userResource = UserResource(httpStatusCode, _, _bcryptMock, _userDAOMock);
    });

    it('should remove an user', function(done) {
        var req = {
            params: {
                username: _user.username
            }
        };

        userResource.remove(req, _resMock);

        _userDAOMock.getPromiseRemove()
        .then(function() {
            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SUCCESS_OK);
            expect(_resMock.json).toHaveBeenCalled();

            done();
        });
    });

    it('should give information when some problem appears in the removing process', function(done) {
        _userDAOMock.setThrowAnError(true);

        var req = {
            params: {
                username: _user.username
            }
        };

        userResource.remove(req, _resMock);

        _userDAOMock.getPromiseRemove()
        .then()
        .catch(function(reason) {
                expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR_INTERNAL);
                expect(_resMock.json).toHaveBeenCalled();

                done();
        });
    });

    it('should update an user', function(done) {
        _userDAOMock.create(_user);

        var userUpdated = {
            username: _user.username,
            password: 'otherPassword',
            preferredWorkingHoursPerDay: 4,
            role: 'manager'
        };

        var req = {
            params: {
                username: _user.username
            },
            body: userUpdated
        };

        userResource.update(req, _resMock);

        _userDAOMock.getPromiseUpdate()
        .then(function() {
            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SUCCESS_OK);
            expect(_resMock.json).toHaveBeenCalled();

            done();
        });
    });

    it('should give information when some problem appears in the updating process', function(done) {
        _userDAOMock.setThrowAnError(true);

        var req = {
            params: {
                username: _user.username
            },
            body: _user
        };

        userResource.update(req, _resMock);

        _userDAOMock.getPromiseUpdate()
        .then()
        .catch(function(reason) {
            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR_INTERNAL);
            expect(_resMock.json).toHaveBeenCalled();

            done();
        });
    });

    it('should find an user', function(done) {
        _userDAOMock.create(_user);

        var req = {
            params : { username: _user.username }
        };

        userResource.findOne(req, _resMock);

        _userDAOMock.getPromiseFindOne()
        .then(function() {
            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SUCCESS_OK);
            expect(_resMock.json).toHaveBeenCalledWith(_user);
            done();
        });
    });

    it('should give information when some problem appears in the finding process', function(done) {
        _userDAOMock.setThrowAnError(true);

        var req = {
            params: {
                username: _user.username
            }
        };

        userResource.findOne(req, _resMock);

        _userDAOMock.getPromiseFindOne()
        .then()
        .catch(function(reason) {
            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR_INTERNAL);
            expect(_resMock.json).toHaveBeenCalled();

            done();
        });
    });
});
