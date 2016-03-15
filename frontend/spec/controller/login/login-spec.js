'use strict';

describe('Login controller', function() {
    var $controller, $rootScope, $scope, $state, $q, $timeout;
    var userSession, userResource;
    var _areValidCredentials, _errorResponse, _user;

    beforeEach(module('demo-app.controller.login'));
    beforeEach(function() {
        inject(function($injector) {
            $controller = $injector.get('$controller');
            $timeout = $injector.get('$timeout');
            $q = $injector.get('$q');
            userSession = $injector.get('userSession');
            $rootScope = $injector.get('$rootScope');
            userResource = $injector.get('userResource');
            $state = $injector.get('$state');

        });

        _errorResponse = { data: { msg: 'invalid user' } };
        _user = { username: 'username', password: 'password', preferredWorkingHoursPerDay: 8 };

        $scope = $rootScope.$new();
        $scope.user = { username: _user.username, password: _user.password };
        $scope.loginForm = { username: {}, password: {} };

        spyOn($state, 'go');
        spyOn(userResource, 'login').and.callFake(function(username, password) {
            var deferred = $q.defer();

            if(_areValidCredentials)
                deferred.resolve();
            else
                deferred.reject(_errorResponse);
            return deferred.promise;
        });
        spyOn(userResource, 'findOne').and.callFake(function(username) {
            var user = { username: _user.username, preferredWorkingHoursPerDay: _user.preferredWorkingHoursPerDay };
            delete user.password;

            var deferred = $q.defer();
            deferred.resolve({ data: user });
            return deferred.promise;
        });

        $controller('loginController', {
            $scope: $scope,
            $state: $state,
            userResource: userResource,
            userSession: userSession
        });
    });

    it('should login a valid user', function() {
        _areValidCredentials = true;
        var user = { username: _user.username, preferredWorkingHoursPerDay: _user.preferredWorkingHoursPerDay };

        $scope.login();

        $timeout.flush();
        expect(userResource.login).toHaveBeenCalledWith(_user.username, _user.password);
        expect(userSession.getUser()).toEqual(user);
    });

    it('should go to work log list', function() {
        _areValidCredentials = true;

        $scope.login();

        $timeout.flush();
        expect($state.go).toHaveBeenCalledWith('app.work-logs', { username: $scope.user.username });
    });

    it('should reject an invalid user login', function() {
        _areValidCredentials = false;

        $scope.login();

        $timeout.flush();
        expect($scope.error).toEqual(_errorResponse.data.msg);
    });

    it('should active form error', function() {
        _areValidCredentials = false;

        $scope.login();

        $timeout.flush();
        expect($scope.loginForm.password.$error).toEqual({ invalidLogin: true});
    });

    it('should be possible try to login user', function() {
        $scope.loginForm = {
            $valid: true,
            $dirty: true
        };

        expect($scope.isNotPossibleTryToLogin()).toBeFalsy();
    });

    it('should not be possible try to login because form is invalid', function() {
        $scope.loginForm = {
           $valid: false,
           $dirty: true
       };

       expect($scope.isNotPossibleTryToLogin()).toBeTruthy();
    });

    it('should not be possible try to login because form is not dirty', function() {
        $scope.loginForm = {
            $valid: true,
            $dirty: false
        };

        expect($scope.isNotPossibleTryToLogin()).toBeTruthy();
    });
});
