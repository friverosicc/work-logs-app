'use strict';

var WorksResource = function(httpStatusCode, _, workLogDAO) {
    const _SERVER_ERROR_MESSAGE = { msg: 'sorry, an error has occurred while we were processing your request' };
    const _CREATE_SUCCESS_MESSAGE = { msg: 'the work log has been created' };

    function create(req, res) {
        var workLog = req.body;
        workLog.username = req.params.username;
        workLog.date = new Date(parseInt(workLog.date));
        workLog.hours = parseInt(workLog.hours);

        workLogDAO.create(workLog)
        .then(function() {
            _setStatusAndMakeResponse(res, httpStatusCode.SUCCESS_CREATED, _CREATE_SUCCESS_MESSAGE);
        })
        .catch(function(reason) {
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
            dateFrom: (req.query.dateFrom) ? new Date(parseInt(req.query.dateFrom)) : undefined,
            dateTo: (req.query.dateTo) ? new Date(parseInt(req.query.dateTo)) : undefined
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

    function findSummarize(req, res) {
        var filter = {
            username: req.params.username,
            dateFrom: (req.query.dateFrom) ? new Date(parseInt(req.query.dateFrom)) : undefined,
            dateTo: (req.query.dateTo) ? new Date(parseInt(req.query.dateTo)) : undefined
        };        

        workLogDAO.findSummarize(filter)
        .then(function(summarizedData) {
            _setStatusAndMakeResponse(res, httpStatusCode.SUCCESS_OK, summarizedData);
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
        find: find,
        findSummarize: findSummarize
    };
};

module.exports = WorksResource;
