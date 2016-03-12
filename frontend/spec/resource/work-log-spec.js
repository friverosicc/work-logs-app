'use strict';

describe('Work log', function() {
    var _username, _workLog;
    var $interpolate, $httpBackend;
    var apiURLs, workLogResource;

    beforeEach(module('demo-app.resource.work-log'));
    beforeEach(function() {
        inject(function($injector) {
            $interpolate = $injector.get('$interpolate');
            $httpBackend = $injector.get('$httpBackend');
            workLogResource = $injector.get('workLogResource');
            apiURLs = $injector.get('apiURLs');
        });

        _workLog = {
            _id: '1',
            date: new Date(2016, 3, 8),
            hours: 6,
            note: 'lorem ipsum dolor sit amet',
            username: 'username'
        };
    });

    it('should call to create work log', function() {
        var url = $interpolate(apiURLs.workLogs)({ username: _workLog.username });
        $httpBackend.expectPOST(url, _workLog)
        .respond(201, 'created successfully');

        workLogResource.create(_workLog.username, _workLog);

        $httpBackend.flush();
    });

    it('should call to update work log', function() {
        var url = $interpolate(apiURLs.workLog)({ username: _workLog.username, workLogId: _workLog._id });
        $httpBackend.expectPUT(url, _workLog)
        .respond(200, 'updated successfully');

        workLogResource.update(_workLog.username, _workLog);

        $httpBackend.flush();
    });

    it('should call to delete work log', function() {
        var url = $interpolate(apiURLs.workLog)({ username: _workLog.username, workLogId: _workLog._id });
        $httpBackend.expectDELETE(url)
        .respond(200, 'deleted successfully');

        workLogResource.remove(_workLog.username, _workLog._id);

        $httpBackend.flush();
    });

    it('should call to find work logs without filter', function() {
        var paginator = { start: 0, length: 15 };
        var filter = {};
        var url = $interpolate(apiURLs.workLogs)({ username: _workLog.username })
                + '?length=' + paginator.length + '&start=' + paginator.start;
        $httpBackend.expectGET(url)
        .respond(200, '');

        workLogResource.find(_workLog.username, paginator, filter);

        $httpBackend.flush();
    });

    it('should call to find work logs with filter', function() {
        var filter = { dateFrom: new Date(2016, 3, 1), dateTo: new Date(2016, 3, 20) };
        var paginator = { start: 0, length: 15 };
        var url = $interpolate(apiURLs.workLogs)({ username: _workLog.username })
                + '?dateFrom=' + filter.dateFrom.getTime() + '&dateTo=' + filter.dateTo.getTime()
                + '&length=' + paginator.length + '&start=' + paginator.start;

        $httpBackend.expectGET(url)
        .respond(200, {});

        workLogResource.find(_workLog.username, paginator, filter);

        $httpBackend.flush();
    });

    it('should call to find summarized data without filter', function() {
        var filter = {};
        var url = $interpolate(apiURLs.workLogsSummarize)({ username: _workLog.username });

        $httpBackend.expectGET(url)
        .respond(200, '');

        workLogResource.findSummarize(_workLog.username, filter);

        $httpBackend.flush();
    });

    it('should call to find summarized data with filter', function() {
        var filter = { dateFrom: new Date(2016, 3, 1), dateTo: new Date(2016, 3, 20) };
        var url = $interpolate(apiURLs.workLogsSummarize)({ username: _workLog.username })
                + '?dateFrom=' + filter.dateFrom.getTime() + '&dateTo=' + filter.dateTo.getTime();

        $httpBackend.expectGET(url)
        .respond(200, '');

        workLogResource.findSummarize(_workLog.username, filter);

        $httpBackend.flush();
    });
});
