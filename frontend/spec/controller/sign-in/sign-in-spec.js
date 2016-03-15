'use strict';

describe('Sign in controller', function() {
    var $q, $scope, $controller, $timeout, $state;
    var userResource, userSession, sigInController;
    var _user, _userAlreadyExists, _errorResponse;

    beforeEach(module('demo-app.controller.sign-in'));

    beforeEach(function() {
        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
            $q = $injector.get('$q');
            $timeout = $injector.get('$timeout');
            userSession = $injector.get('userSession');
            userResource = $injector.get('userResource');

            var $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
        });

        _errorResponse = { data: { msg: 'user account already exists' } };
        _user = {
            username: 'username',
            password: 'password',
            preferredWorkingHoursPerDay: 8
        };

        $scope.user = _user;
        $scope.userForm = {
            username: {},
            password: {},
            preferredWorkingHoursPerDay: {}
        };

        spyOn($state, 'go');
        spyOn(userSession, 'save');
        spyOn(userResource, 'signIn').and.callFake(function(user) {
            var deferred = $q.defer();

            if(_userAlreadyExists)
                deferred.reject(_errorResponse);
            else
                deferred.resolve();

            return deferred.promise;
        });

        sigInController = $controller('signInController', {
            $scope: $scope,
            $state: $state,
            userSession: userSession,
            userResource: userResource
        });
    });

    it('should create a new user account', function() {
        _userAlreadyExists = false;

        $scope.signIn();

        $timeout.flush();
        expect(userResource.signIn).toHaveBeenCalledWith(_user);
        expect(userSession.save).toHaveBeenCalledWith(_user);
    });

    it('should go to work log list', function() {
        _userAlreadyExists = false;

        $scope.signIn();

        $timeout.flush();
        expect($state.go).toHaveBeenCalledWith('app.work-logs', { username: $scope.user.username });
    });

    it('should reject the request to create a new user account', function() {
        _userAlreadyExists = true;

        $scope.signIn();

        $timeout.flush();
        expect($scope.error).toBe(_errorResponse.data.msg);
    });

    it('should acive form error', function() {
        _userAlreadyExists = true;

        $scope.signIn();

        $timeout.flush();
        expect($scope.userForm.preferredWorkingHoursPerDay.$error).toEqual({ serverError: true });
    });

    it('should be possible try to send information to create new user account', function() {
        $scope.userForm = {
            $valid: true,
            $dirty: true
        };

        expect($scope.isPossibleTryToCreateAccount()).toBeTruthy();
    });

    it('should not be possible try to send information to create new user account because form is invalid', function() {
        $scope.registrationForm = {
           $valid: false,
           $dirty: true
       };

       expect($scope.isPossibleTryToCreateAccount()).toBeFalsy();
    });

    it('should not be possible try to send information to create an user account because form is dirty', function() {
        $scope.registrationForm = {
            $valid: true,
            $dirty: false
        };

        expect($scope.isPossibleTryToCreateAccount()).toBeFalsy();
    });
});
