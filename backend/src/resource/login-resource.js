'use strict';

var LoginResource = function(httpStatusCode, _, bcrypt, userDAO) {
    function login(req, res) {
        var username = req.body.username;
        var password = req.body.password;

        userDAO.findOne(username)
        .then(function(user) {
            if(_.isEmpty(user)) {
                res.status(httpStatusCode.CLIENT_ERROR_UNAUTHORIZED)
                .json({ msg: 'invalid username or password' });
            }
            else {
                if(bcrypt.compareSync(password, user.password)) {
                    res.status(httpStatusCode.SUCCESS_OK)
                    .json({ msg: 'valid credentials' });
                } else {
                    res.status(httpStatusCode.CLIENT_ERROR_UNAUTHORIZED)
                    .json({ msg: 'invalid username or password' });
                }
            }
        })
        .catch(function(reason) {            
            res.status(httpStatusCode.SERVER_ERROR_INTERNAL)
            .json({ msg: 'sorry, an error has occurred while we were processing your request'});
        });
    }

    return { login: login };
};


module.exports = LoginResource;
