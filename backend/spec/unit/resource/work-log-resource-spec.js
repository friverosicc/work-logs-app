'use strict';

var httpStatusCode = require('../../../src/lib/http-status-code');
var WorkLogResource = require('../../../src/resource/work-log-resource');

describe('Work resource', function() {
    var _workLogDAOMock, _resMock;
    var _workLog, _username;
    var workLogResource;

    beforeEach(function() {
        _username = 'username';
        _workLog = {
            id: '1',
            date: new Date(2016, 2, 5),
            hours: 6,
            note: 'lorem ipsum dolor sit amet'
        };

        _workLogDAOMock = require('../work-log-dao-mock')();
        _resMock = require('./response-mock')();

        workLogResource = WorkLogResource(httpStatusCode, _workLogDAOMock);
    });

    it('should remove a work log', function(done) {
        var req = {
            params: {
                username: _username,
                workLogId: _workLog.id
            }
        };

        workLogResource.remove(req, _resMock);

        _workLogDAOMock.getPromiseRemove()
        .then(function() {
            return _workLogDAOMock.findOne(_workLog.id);
        })
        .then(function(workLog) {
            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SUCCESS_OK);
            expect(_resMock.json).toHaveBeenCalled();

            expect(workLog).toBeUndefined();
            done();
        });
    });

    it('should give information when some problem appears in the removing process', function(done) {
        _workLogDAOMock.setThrowAnError(true);

        var req = {
            params: {
                username: _username,
                workLogId: _workLog.id
            }
        };

        workLogResource.remove(req, _resMock);

        _workLogDAOMock.getPromiseRemove()
        .then()
        .catch(function(reason) {
            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR_INTERNAL);
            expect(_resMock.json).toHaveBeenCalled();

            done();
        });
    });

    it('should update a work log', function(done) {
        _workLogDAOMock.create(_username, _workLog);

        var workLogUpdated = {
            id: '1',
            date: new Date(2016, 3, 5),
            hours: 3.5,
            note: 'lorem ipsum'
        };

        var req = {
            params: {
                username: _username,
                workLogId: _workLog.id
            },
            body: workLogUpdated
        };

        workLogResource.update(req, _resMock);

        _workLogDAOMock.getPromiseUpdate()
        .then(function() {
            return _workLogDAOMock.findOne(_workLog.id);
        })
        .then(function(workLog) {
            setTimeout(function() {
                expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SUCCESS_OK);
                expect(_resMock.json).toHaveBeenCalled();

                expect(workLog).toBe(workLogUpdated);

                done();
            }, 0);
        });
    });

    it('should give information when some problem appears in the updating process', function(done) {
        _workLogDAOMock.setThrowAnError(true);

        var workLogUpdated = {
            id: '1',
            date: new Date(2016, 3, 5),
            hours: 3.5,
            note: 'lorem ipsum'
        };

        var req = {
            params: {
                username: _username,
                workLogId: _workLog.id
            },
            body: workLogUpdated
        };

        workLogResource.update(req, _resMock);

        _workLogDAOMock.getPromiseUpdate()
        .then()
        .catch(function(reason) {
            expect(_resMock.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR_INTERNAL);
            expect(_resMock.json).toHaveBeenCalled();

            done();
        });
    });
});
