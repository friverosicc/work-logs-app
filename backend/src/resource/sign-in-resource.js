'use strict';

var SignInResource = function(httpStatusCode, _, bycrypt, userDAO) {

    function signIn(req, res) {
        var newUser = req.body;
        newUser.role = 'regular';

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

    return { signIn: signIn };
};


module.exports = SignInResource;
