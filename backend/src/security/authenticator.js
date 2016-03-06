'use strict';

var Authenticator = function(bcrypt, _, userDAO) {

    function authenticate(username, password, done) {
        userDAO.findOne(username)
        .then(function(user) {
            if(_.isEmpty(user)) {
                return done(null, false);
            }

            if(_areNotEquals(password, user.password)) {
                return done(null, false);
            }

            return done(null, user);
        });
    }

    function _areNotEquals(pass1, pass2) {
        return !bcrypt.compareSync(pass1, pass2);
    }

    return { authenticate: authenticate };
};

module.exports = Authenticator;
