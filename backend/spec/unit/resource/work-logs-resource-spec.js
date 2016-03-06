'use strict';

var _ = require('underscore');
var httpStatusCode = require('../../../src/lib/http-status-code');
var WorkLogsResource = require('../../../src/resource/work-logs-resource');

describe('Work logs resource', function() {
    var workLogsResource;
    var _workLogDAOMock, _resMock;
    var _newWorkLog, _username;

    beforeEach(function() {
        _username = 'username';
        _newWorkLog = {
            id: '1',
            date: new Date(2016, 2, 5),
            hours: 6,
            note: 'lorem ipsum dolor sit amet'
        };

        _workLogDAOMock = require('../work-log-dao-mock')();
        _resMock = require('./response-mock')();

        workLogsResource = WorkLogsResource(httpStatusCode, _, _workLogDAOMock);
    });

    it('should create a new work log', function(done) {
        var req = {
            params: {
                username: _username
            },
            body: _newWorkLog
        };

        workLogsResource.create(req, _resMock);

        _workLogDAOMock.getPromiseCreate()
        .then(function() {
            return _workLogDAOMock.findOne(_newWorkLog.id);
        })
        .then(function(workLog) {
            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SUCCESS_CREATED);
            expect(_resMock.json).toHaveBeenCalled();

            expect(workLog).toBe(_newWorkLog);
            done();
        });
    });

    it('should give information when some problem appears in the creation process', function(done) {
        _workLogDAOMock.setThrowAnError(true);

        var req = {
            params: {
                username: _username
            },
            body: _newWorkLog
        };

        workLogsResource.create(req, _resMock);

        _workLogDAOMock.getPromiseCreate()
        .then()
        .catch(function() {
            setTimeout(function() {
                expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR_INTERNAL);
                expect(_resMock.json).toHaveBeenCalled();

                done();
            }, 0);
        });
    });

    it('should return a list of all work logs', function(done) {
        var amountOfWorkLogs = 5;
        var workLogs = [];
        for(var i=0; i<amountOfWorkLogs; i++) {
            _workLogDAOMock.create(_username, _newWorkLog);
            workLogs.push(_newWorkLog);
        }

        var req = {
            params: {
                username: _username
            },
            query: {
                start: '0',
                length: '15'
            }
        };

        workLogsResource.find(req, _resMock);

        _workLogDAOMock.getPromiseFindAmount()
        .then(function(amount) {
            return _workLogDAOMock.getPromiseFind();
        })
        .then(function() {
            var workLogsListExpected = {
                total: amountOfWorkLogs,
                workLogs: workLogs
            };

            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SUCCESS_OK);
            expect(_resMock.json).toHaveBeenCalledWith(workLogsListExpected);

            done();
        });
    });

    it('should give information when some problem appears in the finding process', function(done) {
        _workLogDAOMock.setThrowAnError(true);

        var req = {
            params: {
                username: _username
            },
            query: {
                start: '0',
                length: '15'
            }
        };

        workLogsResource.find(req, _resMock);

        _workLogDAOMock.getPromiseFindAmount()
        .then()
        .catch(function() {
            setTimeout(function() {
                expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR_INTERNAL);
                expect(_resMock.json).toHaveBeenCalled();

                done();
            }, 0);
        });
    });
});
