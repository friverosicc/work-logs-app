'use strict';

describe('User session', function() {
    var userSession;

    beforeEach(module('demo-app.common.session'));

    beforeEach(function() {
        inject(function($injector) {
            userSession = $injector.get('userSession');
        });
    });

    it('should store the user information and his encrypted credentials', function() {
        var user = {
            username: 'username',
            password: 'password',
            preferredWorkingHoursPerDay: 8
        };

        userSession.save(user);

        expect(userSession.getCredentials()).toEqual('dXNlcm5hbWU6cGFzc3dvcmQ=');
    });
});
