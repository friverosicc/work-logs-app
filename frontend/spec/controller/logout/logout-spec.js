'use strict';

describe('Logout resource', function() {
    var $controller, $state;
    var userSession, logoutController;

    beforeEach(module('demo-app.controller.logout'));

    beforeEach(function() {
        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
            userSession = $injector.get('userSession');
        });

        spyOn($state, 'go');
        spyOn(userSession, 'clean');

        logoutController = $controller('logoutController', {
            $state: $state,
            userSession: userSession
        });
    });

    it('should delete the user credentials from the session', function() {
        expect(userSession.clean).toHaveBeenCalled();
    });

    it('should redirect to the login state', function() {
        expect($state.go).toHaveBeenCalledWith('login');
    });
});
