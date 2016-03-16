'use strict';

describe('Work log summary controller', function() {
    var $controller, $scope, $state, $timeout, $q, workLogResourceMock;
    var _username, _dateFrom, _dateTo, _resultSummarize;

    beforeEach(module('demo-app.controller.work-log.summary'));
    beforeEach(function() {
        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
            $timeout = $injector.get('$timeout');
            $q = $injector.get('$q');
            workLogResourceMock = $injector.get('workLogResource');
            $scope = $injector.get('$rootScope').$new();
        });

        _resultSummarize = [];
        _username = 'username';
        _dateFrom = new Date(2016, 2, 1);
        _dateTo = new Date(2016, 2, 30);

        $state.params = {
            username: _username,
            dateFrom: _dateFrom,
            dateTo: _dateTo
        };
        spyOn(workLogResourceMock, 'findSummary').and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve({ data: _resultSummarize });
            return deferred.promise;
        });

        $controller('workLogSummaryController', {
            $scope: $scope,
            $state: $state,
            workLogResource: workLogResourceMock
        });
    });

    it('should call to findSummarize in the resource object', function() {
        var filter = {
            dateFrom: _dateFrom,
            dateTo: _dateTo
        };

        $timeout.flush();
        expect(workLogResourceMock.findSummary).toHaveBeenCalledWith(_username, filter);
        expect($scope.summaries).toBe(_resultSummarize);
    });

});
