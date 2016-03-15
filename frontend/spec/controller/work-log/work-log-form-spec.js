'use strict';

describe('Work log form controller', function() {
    var $controller, $state, $timeout,
        $floatingForm, $mdToast, $scope,
        $q, $timeout, workLogResource;

    var workLog, formTitle, action,
        _username, _createDeferred, _updateDeferred;

    beforeEach(module('demo-app.controller.work-log.form'));
    beforeEach(function() {
        inject(function($injector) {
            $controller = $injector.get('$controller');
            $timeout = $injector.get('$timeout');
            $q = $injector.get('$q');
            $timeout = $injector.get('$timeout');
            $floatingForm = $injector.get('$floatingForm');
            $mdToast = $injector.get('$mdToast');
            $state = $injector.get('$state');
            workLogResource = $injector.get('workLogResource');

            var $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
        });

        workLog = { _id: 1, date: new Date(2016, 2, 13), hours: 2, note: 'working on some stuff' };

        formTitle = 'FORM TITLE';
        _username = 'username';
        $state.params.username = _username;

        spyOn($floatingForm, 'hide').and.callThrough();
        spyOn($floatingForm, 'cancel').and.callThrough();
        spyOn(workLogResource, 'create').and.callFake(function() {
            _createDeferred = $q.defer();
            _createDeferred.resolve({ data: { msg: 'response message' } });
            return _createDeferred.promise;
        });
        spyOn(workLogResource, 'update').and.callFake(function() {
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

    it('should create a new work log successfully', function() {
        $scope.workLogForm = { $invalid: false };
        action = 'create';
        _createController();
        $scope.save();

        $timeout.flush();
        expect(workLogResource.create).toHaveBeenCalledWith(_username, workLog);
        expect($floatingForm.hide).toHaveBeenCalled();
    });

    it('should update a new work log successfully', function() {
        $scope.workLogForm = { $invalid: false };
        action = 'update';
        _createController();
        $scope.save();

        $timeout.flush();
        expect(workLogResource.update).toHaveBeenCalledWith(_username, workLog);
        expect($floatingForm.hide).toHaveBeenCalled();
    });

    it('should not execute the action when the form is invalid', function() {
        $scope.workLogForm = { $invalid: true };
        _createController();

        $scope.save();

        expect(workLogResource.create.calls.count()).toEqual(0);
    });

    function _createController() {
        $controller('workLogFormController', {
            $scope: $scope,
            $state: $state,
            $mdToast: $mdToast,
            $floatingForm: $floatingForm,
            workLogResource: workLogResource,
            workLog: workLog,
            formTitle: formTitle,
            action: action
        });
    }
});
