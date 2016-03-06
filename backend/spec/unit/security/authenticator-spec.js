'use strict';

var _ = require('underscore');
var Authenticator = require('../../../src/security/authenticator');

describe('Authenticator', function() {
    var _userDAOMock, _bcryptMock, _doneMock;
    var _user;
    var authenticator;

    beforeEach(function() {
        _user = {
            username: 'validUsername',
            password: 'validPassword'
        };

        _userDAOMock = require('../user-dao-mock')();
        _bcryptMock = require('../resource/bcrypt-mock')();
        _doneMock = jasmine.createSpy('doneMock');

        authenticator = Authenticator(_bcryptMock, _, _userDAOMock);
    });

    it('should authenticate a valid user', function(done) {
        _userDAOMock.create(_user);

        authenticator.authenticate(_user.username, _user.password, _doneMock);

        _userDAOMock.getPromiseFindOne()
        .then(function() {
            expect(_doneMock).toHaveBeenCalledWith(null, _user);
            done();
        });
    });

    it('should not authenticate to an user that does not exist', function(done) {

        authenticator.authenticate(_user.username, _user.password, _doneMock);

        _userDAOMock.findOne()
        .then(function() {
            expect(_doneMock).toHaveBeenCalledWith(null, false);
            done();
        });
    });

    it('should not authenticate an user with invalid password', function(done) {
        _userDAOMock.create(_user);

        authenticator.authenticate(_user.username, 'passwordWrong', _doneMock);

        _userDAOMock.findOne()
        .then(function() {
            expect(_doneMock).toHaveBeenCalledWith(null, false);
            done();
        });
    });
});
