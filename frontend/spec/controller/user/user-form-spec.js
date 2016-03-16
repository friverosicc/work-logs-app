'use strict';

describe('User form controller', function() {
    var $controller, $timeout,
        $floatingForm, $mdToast, $scope,
        $q, $timeout, userResource;

    var user, formTitle, action, _createDeferred, _updateDeferred;

    beforeEach(module('demo-app.controller.user.form'));
    beforeEach(function() {
        inject(function($injector) {
            $controller = $injector.get('$controller');
            $timeout = $injector.get('$timeout');
            $q = $injector.get('$q');
            $timeout = $injector.get('$timeout');
            $floatingForm = $injector.get('$floatingForm');
            $mdToast = $injector.get('$mdToast');
            userResource = $injector.get('userResource');

            var $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
        });

        user = { username: 'username', role: 'manager', preferredWorkingHoursPerDay: 5 };

        formTitle = 'FORM TITLE';

        spyOn($floatingForm, 'hide').and.callThrough();
        spyOn($floatingForm, 'cancel').and.callThrough();
        spyOn(userResource, 'create').and.callFake(function() {
            _createDeferred = $q.defer();
            _createDeferred.resolve({ data: { msg: 'response message' } });
            return _createDeferred.promise;
        });
        spyOn(userResource, 'update').and.callFake(function() {
            _updateDeferred = $q.defer();
            _updateDeferred.resolve({ data: { msg: 'response message' } });
            return _updateDeferred.promise;
        });
    });

    it('should call $floatingForm.cancel to close the form', function() {
        _createController();

        $scope.hide();

        expect($floatingForm.cancel).toHaveBeenCalled();
    });

    it('should create a new user successfully', function() {
        $scope.userForm = { $invalid: false };
        action = 'create';
        _createController();

        $scope.save();

        $timeout.flush();
        expect(userResource.create).toHaveBeenCalledWith(user);
        expect($floatingForm.hide).toHaveBeenCalled();
    });

    it('should update an user successfully', function() {
        $scope.userForm = { $invalid: false };
        action = 'update';
        _createController();
        $scope.save();

        $timeout.flush();
        expect(userResource.update).toHaveBeenCalledWith(user.username, user);
        expect($floatingForm.hide).toHaveBeenCalled();
    });

    it('should not execute the action when the form is invalid', function() {
        $scope.userForm = { $invalid: true };
        _createController();

        $scope.save();

        expect(userResource.create.calls.count()).toEqual(0);
    });

    function _createController() {
        $controller('userFormController', {
            $scope: $scope,
            $mdToast: $mdToast,
            $floatingForm: $floatingForm,
            userResource: userResource,
            user: user,
            formTitle: formTitle,
            action: action
        });
    }
});
