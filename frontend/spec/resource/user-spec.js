'use strict';

describe('user resource', function() {
    var $httpBackend;
    var userResource;
    var user = {
        username: 'username',
        password: 'password',
        role: 'regular',
        preferredWorkingHoursPerDay: '8'
    };

    beforeEach(module('demo-app.resource.user'));
    beforeEach(function() {
        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            userResource = $injector.get('userResource');
        });
    });

    it('should call to login', function() {
        var userLogin = {
            username: user.username,
            password: user.password
        };

        $httpBackend.expectPOST('http://localhost:8080/login', userLogin)
        .respond(200, 'valid credentials');

        userResource.login(userLogin);

        $httpBackend.flush();
    });

    it('should call to sing-in', function() {
        $httpBackend.expectPOST('http://localhost:8080/sign-in', user)
        .respond(201, 'user created successfully');

        userResource.signIn(user);

        $httpBackend.flush();
    });

    it('should call to create user', function() {
        $httpBackend.expectPOST('http://localhost:8080/users', user)
        .respond(201, 'user created successfully');

        userResource.create(user);

        $httpBackend.flush();
    });

    it('should call to update user', function() {
        $httpBackend.expectPUT('http://localhost:8080/users/'+user.username, user)
        .respond(201, 'user updated successfully');

        userResource.update(user.username, user);

        $httpBackend.flush();
    });

    it('should call to delete user', function() {
        $httpBackend.expectDELETE('http://localhost:8080/users/'+user.username)
        .respond(200, 'user deleted successfully');

        userResource.remove(user.username);

        $httpBackend.flush();
    });

    it('should call to find users', function() {
        $httpBackend.expectGET('http://localhost:8080/users?length=15&start=0')
        .respond(200, {});

        var paginator = { start: 0, length: 15 };
        userResource.find(paginator);

        $httpBackend.flush();
    });

    it('should call to find one', function() {
        $httpBackend.expectGET('http://localhost:8080/users/'+user.username)
        .respond(200, user);

        userResource.findOne(user.username);

        $httpBackend.flush();
    });
});
