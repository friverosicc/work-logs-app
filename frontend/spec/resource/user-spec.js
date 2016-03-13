'use strict';

describe('user resource', function() {
    var $httpBackend, $interpolate;
    var apiURLs, userResource;
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
            userResource = $injector.get('userResource');
            apiURLs = $injector.get('apiURLs');
        });
    });

    it('should call to login', function() {
        var userLogin = {
            username: _user.username,
            password: _user.password
        };

        $httpBackend.expectPOST(apiURLs.login, userLogin)
        .respond(200, 'valid credentials');

        userResource.login(_user.username, _user.password);
        $httpBackend.flush();
    });

    it('should call to sing-in', function() {
        $httpBackend.expectPOST(apiURLs.signIn, _user)
        .respond(201, 'user created successfully');

        userResource.signIn(_user);

        $httpBackend.flush();
    });

    it('should call to create user', function() {
        $httpBackend.expectPOST(apiURLs.users, _user)
        .respond(201, 'user created successfully');

        userResource.create(_user);

        $httpBackend.flush();
    });

    it('should call to update user', function() {
        var url = $interpolate(apiURLs.user)({ username: _user.username });
        $httpBackend.expectPUT(url, _user)
        .respond(201, 'user updated successfully');

        userResource.update(_user.username, _user);

        $httpBackend.flush();
    });

    it('should call to delete user', function() {
        var url = $interpolate(apiURLs.user)({ username: _user.username });
        $httpBackend.expectDELETE(url)
        .respond(200, 'user deleted successfully');

        userResource.remove(_user.username);

        $httpBackend.flush();
    });

    it('should call to find users', function() {
        var page = { start: 0, length: 15 };
        $httpBackend.expectGET(apiURLs.users + '?length='+page.length+'&start='+page.start)
        .respond(200, {});

        userResource.find(page);

        $httpBackend.flush();
    });

    it('should call to find one', function() {
        var url = $interpolate(apiURLs.user)({ username: _user.username });
        $httpBackend.expectGET(url)
        .respond(200, _user);

        userResource.findOne(_user.username);

        $httpBackend.flush();
    });
});
