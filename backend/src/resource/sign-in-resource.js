'use strict';

var SignInResource = function(httpStatusCode, _, bcrypt, userDAO) {
    const _SERVER_ERROR_MESSAGE = { msg: 'sorry, an error has occurred while we were processing your request' };
    const _DATA_ALREADY_EXISTS_MESSAGE = { msg: 'the user account already exitsts'};
    const _CREATE_SUCCESS_MESSAGE = { msg: 'the user has been created' };

    function signIn(req, res) {
        var newUser = req.body;
        newUser.role = 'regular';
        newUser.password = bcrypt.hashSync(newUser.password);

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

    function _setStatusAndMakeResponse(res, statusCode, data) {
        res.status(statusCode).json(data);
    }

    return { signIn: signIn };
};


module.exports = SignInResource;
