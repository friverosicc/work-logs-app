'use strict';

describe('Interceptor to any state different of login', function() {
    var base64Mock, qMock, stateMock, $mdToast;
    var interceptor, userSession;

    beforeEach(module('demo-app.common.security'));
    beforeEach(function() {
        stateMock = {
            go: jasmine.createSpy(),
            current: {
                name: 'otherState'
            }
        };
        qMock = { reject: jasmine.createSpy() };


        module(function($provide) {
            $provide.value('$state', stateMock);
            $provide.value('$q', qMock);
        });

        inject(function($injector) {
            userSession = $injector.get('userSession');
            interceptor = $injector.get('interceptor');
            $mdToast = $injector.get('$mdToast');
        });

        spyOn($mdToast, 'show');
    });

    it('should set header with user credential', function() {
        var config = { headers: {} };
        var user = {
            username: 'username',
            password: 'password'
        };

        userSession.save(user);

        interceptor.request(config);
        expect(config.headers.Authorization).toEqual('Basic dXNlcm5hbWU6cGFzc3dvcmQ=');
    });

    it('should leave the header empty if there is no user logged', function() {
        var config = { headers: {} };
        userSession.clean();

        interceptor.request(config);
        expect(config.headers.Authorization).toBeUndefined();
    });

    it('should logout users if is there a 401 status code', function() {
        var rejection = { status: 401 };

        interceptor.responseError(rejection);

        expect(stateMock.go).toHaveBeenCalledWith('logout');
    });

    it('should pass the error to the next level', function() {
        var rejection = { status: 500 };

        interceptor.responseError(rejection);
        expect(stateMock.go).not.toHaveBeenCalled();
        expect(qMock.reject).toHaveBeenCalledWith(rejection);
    });

    it('should display an error message when http status code is 403', function() {
        var rejection = {
            status: 403,
            data: {
                msg: 'You do not have authorization to do this'
            }
        };

        interceptor.responseError(rejection);

        expect($mdToast.show).toHaveBeenCalled();
    });
});

describe('Interceptor to state login', function() {
    var base64Mock, qMock, stateMock;
    var interceptor, userSession;

    beforeEach(module('demo-app.common.security'));
    beforeEach(function() {
        stateMock = {
            go: jasmine.createSpy(),
            current: {
                name: 'login'
            }
        };
        qMock = { reject: jasmine.createSpy() };

        module(function($provide) {
            $provide.value('$state', stateMock);
            $provide.value('$q', qMock);
        });

        inject(function($injector) {
            userSession = $injector.get('userSession');
            interceptor = $injector.get('interceptor');
        });
    });

    it('should pass the error to the next level', function() {
        var rejection = { status: 401 };

        interceptor.responseError(rejection);
        expect(stateMock.go).not.toHaveBeenCalled();
        expect(qMock.reject).toHaveBeenCalledWith(rejection);
    });
});
