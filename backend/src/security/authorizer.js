'use strict';

var Authorizer = function(roles) {

    function authorize(req, res, next) {

        if(_isTheUserAccessingTowardHisResource(req)) {
            next();
        } else {
            if(_doesTheRoleHaveTheNeededPermissions(req.user.role)) {
                next();
            } else {
                res.status(403)
                .json({ msg: "Sorry, you don't have authorization to access or process this information" });
            }
        }        
    }

    function _isTheUserAccessingTowardHisResource(req) {
        if(req.user.username === req.params.username)
            return true;
        return false;
    }

    function _doesTheRoleHaveTheNeededPermissions(role) {
        if(roles.indexOf(role) >= 0)
            return true;
        return false;
    }

    return {
        authorize: authorize
    };
};

module.exports = Authorizer;
