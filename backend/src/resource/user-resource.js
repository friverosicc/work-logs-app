'use strict';

var UserResource = function(httpStatusCode, _, bcrypt, userDAO) {
    const _SERVER_ERROR_MESSAGE = { msg: 'sorry, an error has occurred while we were processing your request' };
    const _REMOVE_SUCCESS_MESSAGE = { msg: 'the user has been deleted correctly' };
    const _UPDATE_SUCCESS_MESSAGE = { msg: 'the user has been updated correctly' };

    function remove(req, res) {
        var username = req.params.username;

        userDAO.remove(username)
        .then(function() {
            _setStatusAndMakeResponse(res, httpStatusCode.SUCCESS_OK, _REMOVE_SUCCESS_MESSAGE);
        })
        .catch(function() {
            _setStatusAndMakeResponse(res, httpStatusCode.SERVER_ERROR_INTERNAL, _SERVER_ERROR_MESSAGE);
        });
    }

    function update(req, res) {
        var username = req.params.username;
        var user = req.body;

        if(!_.isUndefined(user.password)) {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(), null);
        }

        userDAO.update(username, user)
        .then(function() {
            _setStatusAndMakeResponse(res, httpStatusCode.SUCCESS_OK, _UPDATE_SUCCESS_MESSAGE);
        })
        .catch(function() {
            _setStatusAndMakeResponse(res, httpStatusCode.SERVER_ERROR_INTERNAL, _SERVER_ERROR_MESSAGE);
        });
    }

    function findOne(req, res) {
        var username = req.params.username;

        userDAO.findOne(username)
        .then(function(user) {
            _setStatusAndMakeResponse(res, httpStatusCode.SUCCESS_OK, user);
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
        update: update,
        findOne: findOne
    };
};

module.exports = UserResource;
