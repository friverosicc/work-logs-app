'use strict';

var UserResource = function(httpStatusCode, _, bcrypt, userDAO) {
    function remove(req, res) {
        var username = req.params.username;

        userDAO.remove(username)
        .then(function() {
            res.status(httpStatusCode.SUCCESS_OK)
            .json({ msg: 'the user has been deleted correctly'});
        })
        .catch(function() {
            res.status(httpStatusCode.SERVER_ERROR_INTERNAL)
            .json({ msg: 'sorry, an error has occurred while we were processing your request'});
        });
    }

    function update(req, res) {
        var username = req.params.username;
        var user = req.body;

        userDAO.update(username, user)
        .then(function() {
            res.status(httpStatusCode.SUCCESS_OK)
            .json({ msg: 'the user has been updated correctly'});
        })
        .catch(function() {
            res.status(httpStatusCode.SERVER_ERROR_INTERNAL)
            .json({ msg: 'sorry, an error has occurred while we were processing your request'});
        });
    }

    function findOne(req, res) {
        var username = req.params.username;

        userDAO.findOne(username)
        .then(function(user) {
            res.status(httpStatusCode.SUCCESS_OK)
            .json(user);
        })
        .catch(function() {
            res.status(httpStatusCode.SERVER_ERROR_INTERNAL)
            .json({ msg: 'sorry, an error has occurred while we were processing your request'});
        });;
    }

    return {
        remove: remove,
        update: update,
        findOne: findOne
    };
};

module.exports = UserResource;
