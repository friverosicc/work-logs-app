'use strict';

describe('Users controller', function() {
    var $controller, $scope, $state, $mdToast,
        $timeout, $q, $floatingForm, paginator;
    var userResourceMock;
    var _findDeferred, _findResult, _removeDeferred,
        _removeResult, _problemInTheRemovalProcess;

    beforeEach(module('demo-app.controller.user'));

    beforeEach(function() {
        inject(function($injector) {
            $controller = $injector.get('$controller');
            $q = $injector.get('$q');
            $state = $injector.get('$state');
            $mdToast = $injector.get('$mdToast');
            $timeout = $injector.get('$timeout');
            $floatingForm = $injector.get('$floatingForm');
            paginator = $injector.get('paginator');
            userResourceMock = $injector.get('userResource');

            var $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
        });

        _findResult = { data: { total: 0, users: [] } };
        _removeResult = { data: { msg: 'message received' } };

        spyOn(paginator, 'init').and.callThrough();
        spyOn(paginator, 'setTotal').and.callThrough();
        spyOn(paginator, 'nextPage').and.callThrough();
        spyOn(paginator, 'previousPage').and.callThrough();
        spyOn(paginator, 'lastPage').and.callThrough();
        spyOn($floatingForm, 'show').and.callThrough();
        spyOn($mdToast, 'show').and.callThrough();
        spyOn(userResourceMock, 'find').and.callFake(function() {
            _findDeferred = $q.defer();
            _findDeferred.resolve(_findResult);
            return _findDeferred.promise;
        });
        spyOn(userResourceMock, 'remove').and.callFake(function() {
            _removeDeferred = $q.defer();

            if(_problemInTheRemovalProcess)
                _removeDeferred.reject(_removeResult);
            else
                _removeDeferred.resolve(_removeResult);
            return _removeDeferred.promise;
        });
    });

    it('should initialize the global variable', function() {
        _createController();

        expect(paginator.init).toHaveBeenCalled();
    });

    it('should find users', function() {
        _createController();

        $scope.search();

        var page = { start: paginator.getStart(), length: paginator.getRange() };
        var filter = { };

        _findDeferred.promise
        .then(function(response) {
            expect(userResourceMock.find).toHaveBeenCalledWith(page);
            expect($scope.users).toBe(response.data.users);
            expect(paginator.setTotal).toHaveBeenCalledWith(response.data.total);
            expect(paginator.getLabel()).toBe($scope.labelPagination);
            expect(paginator.isNextPageDisabled()).toBe($scope.nextPageDisabled);
            expect(paginator.isPreviousPageDisabled()).toBe($scope.previousPageDisabled);
        });

        $timeout.flush();
    });

    it('should go to the next page of users data', function() {
        _createController();
        spyOn($scope, 'search').and.callThrough();

        $scope.nextPage();

        expect(paginator.nextPage).toHaveBeenCalled();
        expect($scope.search).toHaveBeenCalled();
    });

    it('should go to the previous page of users data', function() {
        _createController();
        spyOn($scope, 'search').and.callThrough();

        $scope.previousPage();
        expect(paginator.previousPage).toHaveBeenCalled();
        expect($scope.search).toHaveBeenCalled();
    });

    it('should go to the last page of users data', function() {
        _createController();
        spyOn($scope, 'search').and.callThrough();

        $scope.lastPage();
        expect(paginator.lastPage).toHaveBeenCalled();
        expect($scope.search).toHaveBeenCalled();
    });

    it('should go to the first page of users data', function() {
        _createController();
        spyOn($scope, 'search').and.callThrough();

        $scope.firstPage();
        expect(paginator.init).toHaveBeenCalledWith(0, 15, 0);
        expect($scope.search).toHaveBeenCalled();
    });

    it('should open the form to create a new user', function() {
        _createController();

        $scope.openFormToCreate();

        expect($floatingForm.show).toHaveBeenCalled();
    });

    it('should open the form to edit a existing user', function() {
        _createController();
        var user = { username: 'username', preferredWorkingHoursPerDay: 7, role: 'regular' };

        $scope.openFormToEdit(user);

        expect($floatingForm.show).toHaveBeenCalled();
    });

    it('should delete successfully a work log', function() {
        _problemInTheRemovalProcess = false;
        _createController();
        var user = { username: 'username' };
        spyOn($scope, 'search');

        $scope.remove(user);


        $timeout.flush();

        expect(userResourceMock.remove).toHaveBeenCalledWith(user.username);
        expect($scope.search).toHaveBeenCalled();
    });

    it('should show a message if occurred any problem in the elimination process', function() {
        _problemInTheRemovalProcess = true;
        _createController();
        var user = { username: 'username' };
        spyOn($scope, 'search');

        $scope.remove(user);

        $timeout.flush();

        expect(userResourceMock.remove).toHaveBeenCalledWith(user.username);
        expect($scope.search.calls.count()).toEqual(0);
        expect($mdToast.show).toHaveBeenCalled();
    });

    function _createController() {
        $controller('usersController', {
            $scope: $scope,
            $state: $state,
            $mdToast: $mdToast,
            paginator: paginator,
            $floatingForm: $floatingForm,
            userResource: userResourceMock
        });
    }
});
