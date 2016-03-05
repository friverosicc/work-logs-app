'use strict';

var UsersResource = function(httpStatusCode, _, bcrypt, userDAO) {

    function create(req, res) {
        var newUser = req.body;

        userDAO.findOne(newUser.username)
        .then(function(user) {
            if(_.isUndefined(user)) {
                return userDAO.create(newUser);
            } else {
                res.status(httpStatusCode.CLIENT_ERROR_CONFLICT)
                .json({ msg: 'the user account already exitsts'});
            }
        })
        .then(function() {
            res.status(httpStatusCode.SUCCESS_CREATED)
            .json({ msg: 'the user has been created'});
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

            res.status(httpStatusCode.SUCCESS_OK)
            .json(userList);
        });
    }

    return {
        create: create,
        find: find
    };
};

module.exports = UsersResource;
