'use strict';

var LoginResource = function(httpStatusCode, _, bcrypt, userDAO) {
    const _SERVER_ERROR_MESSAGE = { msg: 'sorry, an error has occurred while we were processing your request' };
    const _INVALID_CREDENTIALS_MESSAGE = { msg: 'invalid username or password'};
    const _VALID_CREDENTIALS_MESSAGE = { msg: 'valid credentials' };

    function login(req, res) {
        var username = req.body.username;
        var password = req.body.password;

        userDAO.findOne(username)
        .then(function(user) {
            if(_.isEmpty(user)) {
                _setStatusAndMakeResponse(res, httpStatusCode.CLIENT_ERROR_UNAUTHORIZED, _INVALID_CREDENTIALS_MESSAGE);
            } else {
                if(_areEquals(password, user.password)) {
                    _setStatusAndMakeResponse(res, httpStatusCode.SUCCESS_OK, _VALID_CREDENTIALS_MESSAGE);
                } else {
                    _setStatusAndMakeResponse(res, httpStatusCode.CLIENT_ERROR_UNAUTHORIZED, _INVALID_CREDENTIALS_MESSAGE);
                }
            }
        })
        .catch(function(reason) {
            _setStatusAndMakeResponse(res, httpStatusCode.SERVER_ERROR_INTERNAL, _SERVER_ERROR_MESSAGE);
        });
    }

    function _areEquals(pass1, pass2) {
        return bcrypt.compareSync(pass1, pass2);
    }

    function _setStatusAndMakeResponse(res, statusCode, data) {
        res.status(statusCode).json(data);
    }

    return { login: login };
};

module.exports = LoginResource;
