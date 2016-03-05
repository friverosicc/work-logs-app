'use stritc';

var UserDAOMock = function(user) {
    var _promise;
    var _throwAnError = false;

    function findOne(username) {
        _promise = new Promise(function(resolve, reject) {
            if(_throwAnError) {
                reject("problem in the process");
            } else {
                if(username === user.username)
                    resolve(user);
                else
                    resolve({});
            }
        });

        return _promise;
    }

    function getPromise() {
        return _promise;
    };

    function setThrowAnError(throwAnError) {
        _throwAnError = throwAnError;
    }

    return {
        findOne: findOne,
        getPromise: getPromise,
        setThrowAnError: setThrowAnError
    };
};

module.exports = UserDAOMock;
