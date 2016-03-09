'use strict';

var WorkLogResource = function(httpStatusCode, workLogDAO) {
    const _SERVER_ERROR_MESSAGE = { msg: 'sorry, an error has occurred while we were processing your request' };
    const _REMOVE_SUCCESS_MESSAGE = { msg: 'the work log has been deleted correctly' };
    const _UPDATE_SUCCESS_MESSAGE = { msg: 'the work log has been updated correctly' };

    function remove(req, res) {
        var id = req.params.workLogId;

        workLogDAO.remove(id)
        .then(function() {
            _setStatusAndMakeResponse(res, httpStatusCode.SUCCESS_OK, _REMOVE_SUCCESS_MESSAGE);
        })
        .catch(function() {
            _setStatusAndMakeResponse(res, httpStatusCode.SERVER_ERROR_INTERNAL, _SERVER_ERROR_MESSAGE);
        });
    }

    function update(req, res) {
        var id = req.params.workLogId;
        var workLog = req.body;
        workLog.date = new Date(workLog.date);
        workLog.hours = parseInt(workLog.hours);

        workLogDAO.update(id, workLog)
        .then(function() {
            _setStatusAndMakeResponse(res, httpStatusCode.SUCCESS_OK, _UPDATE_SUCCESS_MESSAGE);
        })
        .catch(function() {
            _setStatusAndMakeResponse(res, httpStatusCode.SERVER_ERROR_INTERNAL, _SERVER_ERROR_MESSAGE);
        });
    }

    function _setStatusAndMakeResponse(res, statusCode, data) {
        res.status(statusCode).json(data);
    }

    return {
        remove: remove,
        update: update
    };
};

module.exports = WorkLogResource;
