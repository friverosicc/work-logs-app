'use strict';

describe('Work log controller', function() {
    var $controller, $scope, $state, $timeout, $q, $floatingForm, paginator;
    var workLogResourceMock;
    var _username, _findDeferred, _findResult;

    beforeEach(module('demo-app.controller.work-log'));

    beforeEach(function() {
        inject(function($injector) {
            $controller = $injector.get('$controller');
            $q = $injector.get('$q');
            $state = $injector.get('$state');
            $timeout = $injector.get('$timeout');
            $floatingForm = $injector.get('$floatingForm');
            paginator = $injector.get('paginator');
            workLogResourceMock = $injector.get('workLogResource');

            var $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
        });

        _findResult = { data: { total: 100, workLogs: [] } };
        _username = 'username';
        $state.params.username = _username;

        spyOn(paginator, 'init').and.callThrough();
        spyOn(paginator, 'setTotal').and.callThrough();
        spyOn(paginator, 'nextPage').and.callThrough();
        spyOn(paginator, 'previousPage').and.callThrough();
        spyOn(paginator, 'lastPage').and.callThrough();
        spyOn(workLogResourceMock, 'find').and.callFake(function() {
            _findDeferred = $q.defer();

            _findDeferred.resolve(_findResult);

            return _findDeferred.promise;
        });
    });

    it('should initialize the global variable', function() {
        $scope.filter = {};
        _createController();

        expect(paginator.init).toHaveBeenCalled();
    });

    it('should find the work logs of an user without filter', function() {
        _createController();

        $scope.search();

        var page = { start: paginator.getStart(), length: paginator.getRange() };
        var filter = { };

        _findDeferred.promise
        .then(function(response) {
            expect(workLogResourceMock.find).toHaveBeenCalledWith(_username, page, filter);
            expect($scope.workLogs).toBe(response.data.workLogs);
            expect(paginator.setTotal).toHaveBeenCalledWith(response.data.total);
            expect(paginator.getLabel()).toBe($scope.labelPagination);
            expect(paginator.isNextPageDisabled()).toBe($scope.nextPageDisabled);
            expect(paginator.isPreviousPageDisabled()).toBe($scope.previousPageDisabled);
        });

        $timeout.flush();
    });

    it('should find the work logs of an user with filter', function() {
        $scope.filter = { dateTo: new Date(2016, 2, 1), dateFrom: new Date(2016, 2, 13) };
        _createController();

        $scope.search();

        var page = {
            start: paginator.getStart(),
            length: paginator.getRange()
        };
        var filter = {
            dateFrom: $scope.filter.dateFrom,
            dateTo: $scope.filter.dateTo
        };

        _findDeferred.promise
        .then(function(response) {
            expect(workLogResourceMock.find).toHaveBeenCalledWith(_username, page, filter);
            expect($scope.workLogs).toBe(response.data.workLogs);
            expect(paginator.setTotal).toHaveBeenCalledWith(response.data.total);
        });

        $timeout.flush();
    });

    it('should go to the next page of work logs data', function() {
        $scope.filter = {};
        _createController();
        spyOn($scope, 'search').and.callThrough();

        $scope.nextPage();

        expect(paginator.nextPage).toHaveBeenCalled();
        expect($scope.search).toHaveBeenCalled();
    });

    it('should go to the previous page of work logs data', function() {
        $scope.filter = {};
        _createController();
        spyOn($scope, 'search').and.callThrough();

        $scope.previousPage();
        expect(paginator.previousPage).toHaveBeenCalled();
        expect($scope.search).toHaveBeenCalled();
    });

    it('should go to the last page of work logs data', function() {
        $scope.filter = {};
        _createController();
        spyOn($scope, 'search').and.callThrough();

        $scope.lastPage();
        expect(paginator.lastPage).toHaveBeenCalled();
        expect($scope.search).toHaveBeenCalled();
    });

    it('should go to the first page of work logs data', function() {
        $scope.filter = {};
        _createController();
        spyOn($scope, 'search').and.callThrough();

        $scope.firstPage();
        expect(paginator.init).toHaveBeenCalledWith(0, 15, 0);
        expect($scope.search).toHaveBeenCalled();
    });

    function _createController() {
        $controller('workLogController', {
            $scope: $scope,
            $state: $state,
            paginator: paginator,
            workLogResource: workLogResourceMock,
            $floatingForm: $floatingForm
        });
    }
});
