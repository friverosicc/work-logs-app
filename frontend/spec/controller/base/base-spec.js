'use strict';

describe('Base controller', function() {
    var $controller, $scope, $state, userSession;
    var _user, _isUserLogged;

    beforeEach(module('demo-app.controller.base'));
    beforeEach(function() {
        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
            userSession = $injector.get('userSession');

            var $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
        });

        spyOn($state, 'go');

        _user = {
            username: 'username',
            password: 'password',
            role: 'regular',
            preferredWorkingHoursPerDay: '8'
        };
    });

    it('should get the user information from the session', function() {
        userSession.save(_user);
        $controller('baseController', {
            $scope: $scope,
            $state: $state,
            userSession: userSession
        });

        expect($scope.user).toEqual(_user);
        expect($state.go.calls.count()).toEqual(0);
    });

    it('should redirect to the login view if there is nobody logged', function() {
        userSession.clean();
        $controller('baseController', {
            $scope: $scope,
            $state: $state,
            userSession: userSession
        });

        expect($scope.user).toBeNull();
        expect($state.go).toHaveBeenCalledWith('login');
    });
});
