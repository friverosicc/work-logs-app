'use strict';

var UsersResource = function(httpStatusCode, _, bcrypt, userDAO) {
    const _SERVER_ERROR_MESSAGE = { msg: 'sorry, an error has occurred while we were processing your request' };
    const _DATA_ALREADY_EXISTS_MESSAGE = { msg: 'the user account already exitsts'};
    const _CREATE_SUCCESS_MESSAGE = { msg: 'the user has been created' };

    function create(req, res) {
        var newUser = req.body;

        userDAO.findOne(newUser.username)
        .then(function(user) {
            if(_.isUndefined(user)) {
                return userDAO.create(newUser);
            } else {
                _setStatusAndMakeResponse(res, httpStatusCode.CLIENT_ERROR_CONFLICT, _DATA_ALREADY_EXISTS_MESSAGE);
            }
        })
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
            lenth: parseInt(req.query.length)
        };

        var userList = {
            total: 0,
            users: []
        };

        userDAO.findAmount()
        .then(function(amount) {
            userList.total = amount;

            return userDAO.find(paginator);
        })
        .then(function(users) {
            userList.users = users;

            _setStatusAndMakeResponse(res, httpStatusCode.SUCCESS_OK, userList);
        })
        .catch(function(reason) {
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

module.exports = UsersResource;
