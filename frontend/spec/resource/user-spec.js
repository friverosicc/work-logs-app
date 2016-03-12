'use strict';

describe('user resource', function() {
    var $httpBackend, $interpolate;
    var _apiURLs;
    var _userResource;
    var _user = {
        username: 'username',
        password: 'password',
        role: 'regular',
        preferredWorkingHoursPerDay: '8'
    };

    beforeEach(module('demo-app.resource.user'));
    beforeEach(function() {
        inject(function($injector) {
            $interpolate = $injector.get('$interpolate');
            $httpBackend = $injector.get('$httpBackend');
            _userResource = $injector.get('userResource');
            _apiURLs = $injector.get('apiURLs');
        });
    });

    it('should call to login', function() {
        var userLogin = {
            username: _user.username,
            password: _user.password
        };

        $httpBackend.expectPOST(_apiURLs.login, userLogin)
        .respond(200, 'valid credentials');

        _userResource.login(_user.username, _user.password);        
        $httpBackend.flush();
    });

    it('should call to sing-in', function() {
        $httpBackend.expectPOST(_apiURLs.signIn, _user)
        .respond(201, 'user created successfully');

        _userResource.signIn(_user);

        $httpBackend.flush();
    });

    it('should call to create user', function() {
        $httpBackend.expectPOST(_apiURLs.users, _user)
        .respond(201, 'user created successfully');

        _userResource.create(_user);

        $httpBackend.flush();
    });

    it('should call to update user', function() {
        var url = $interpolate(_apiURLs.user)({ username: _user.username });
        $httpBackend.expectPUT(url, _user)
        .respond(201, 'user updated successfully');

        _userResource.update(_user.username, _user);

        $httpBackend.flush();
    });

    it('should call to delete user', function() {
        var url = $interpolate(_apiURLs.user)({ username: _user.username });
        $httpBackend.expectDELETE(url)
        .respond(200, 'user deleted successfully');

        _userResource.remove(_user.username);

        $httpBackend.flush();
    });

    it('should call to find users', function() {
        $httpBackend.expectGET(_apiURLs.users + '?length=15&start=0')
        .respond(200, {});

        var paginator = { start: 0, length: 15 };
        _userResource.find(paginator);

        $httpBackend.flush();
    });

    it('should call to find one', function() {
        var url = $interpolate(_apiURLs.user)({ username: _user.username });
        $httpBackend.expectGET(url)
        .respond(200, _user);

        _userResource.findOne(_user.username);

        $httpBackend.flush();
    });
});
