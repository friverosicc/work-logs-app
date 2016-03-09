'use strict';

var WorksResource = function(httpStatusCode, _, workLogDAO) {
    const _SERVER_ERROR_MESSAGE = { msg: 'sorry, an error has occurred while we were processing your request' };
    const _CREATE_SUCCESS_MESSAGE = { msg: 'the user has been created' };

    function create(req, res) {
        var username = req.params.username;
        var workLog = req.body;

        workLogDAO.create(username, workLog)
        .then(function() {
            _setStatusAndMakeResponse(res, httpStatusCode.SUCCESS_CREATED, _CREATE_SUCCESS_MESSAGE);
        })
        .catch(function() {
            _setStatusAndMakeResponse(res, httpStatusCode.SERVER_ERROR_INTERNAL, _SERVER_ERROR_MESSAGE);
        });
    }

    function find(req, res) {
        var paginator = {
            start: parseInt(req.query.start),
            length: parseInt(req.query.length)
        };
        var filter = {
            username: req.params.username,
            dateFrom: req.query.dateFrom,
            dateTo: req.query.dateTo
        };

        var workLogsList = {
            total: 0,
            workLogs: []
        };

        workLogDAO.findAmount(filter)
        .then(function(amount) {
            workLogsList.total = amount;

            return workLogDAO.find(paginator, filter);
        })
        .then(function(workLogs) {
            workLogsList.workLogs = workLogs;

            _setStatusAndMakeResponse(res, httpStatusCode.SUCCESS_OK, workLogsList);
        })
        .catch(function() {
            _setStatusAndMakeResponse(res, httpStatusCode.SERVER_ERROR_INTERNAL, _SERVER_ERROR_MESSAGE);
        });
    }

    function _setStatusAndMakeResponse(res, statusCode, data) {
        res.status(statusCode).json(data);
    }

    return {
        create: create,
        find: find
    };
};

module.exports = WorksResource;
