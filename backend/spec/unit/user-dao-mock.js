'use stritc';

var _ = require('underscore');

var UserDAOMock = function() {
    var _promiseFindOne, _promiseFind, _promiseFindAmount,
    _promiseCreate, _promiseRemove, _promiseUpdate;
    var _throwAnError = false;
    var _users = [];

    function findOne(username) {
        _promiseFindOne = new Promise(function(resolve, reject) {
            if(_throwAnError) {
                reject("problem in the process");
            } else {
                var user = _.find(_users, function(user) {
                    return user.username === username;
                });
                resolve(user);
            }
        });

        return _promiseFindOne;
    }

    function find(fiter) {
        _promiseFind = new Promise(function(resolve, reject) {
            if(_throwAnError) {
                reject("problem in the process");
            } else {
                resolve(_users)
            }
        });

        return _promiseFind;
    }

    function findAmount() {
        _promiseFindAmount = new Promise(function(resolve, reject) {
            resolve(_users.length);
        });

        return _promiseFindAmount;
    }

    function create(newUser) {
        _promiseCreate = new Promise(function(resolve, reject) {
            _users.push(newUser);
            resolve({});
        });

        return _promiseCreate;
    }

    function remove(username) {
        _promiseRemove = new Promise(function(resolve, reject) {
            if(_throwAnError) {
                reject("problem in the process");
            } else {
                _users = _.reject(_users, function(user) {
                    return user.username === username;
                });

                resolve({});
            }
        });

        return _promiseRemove;
    }

    function update(username, user) {
        _promiseUpdate = new Promise(function(resolve, reject) {
            if(_throwAnError) {
                reject("problem in the process");
            } else {
                _.each(_users, function(item, index) {
                    if(item.username === username) {
                        _users[index] = user;
                    }
                });

                resolve({});
            }
        });

        return _promiseUpdate;
    }

    function getPromiseFindOne() {
        return _promiseFindOne;
    }

    function getPromiseFind() {
        return _promiseFind;
    }

    function getPromiseFindAmount() {
        return _promiseFindAmount;
    }

    function getPromiseCreate() {
        return _promiseCreate;
    }

    function getPromiseRemove() {
        return _promiseRemove;
    }

    function getPromiseUpdate() {
        return _promiseUpdate;
    }

    function setThrowAnError(throwAnError) {
        _throwAnError = throwAnError;
    }

    return {
        findOne: findOne,
        find: find,
        findAmount: findAmount,
        create: create,
        remove: remove,
        update: update,
        getPromiseFindOne: getPromiseFindOne,
        getPromiseFind: getPromiseFind,
        getPromiseFindAmount: getPromiseFindAmount,
        getPromiseCreate: getPromiseCreate,
        getPromiseRemove: getPromiseRemove,
        getPromiseUpdate: getPromiseUpdate,
        setThrowAnError: setThrowAnError
    };
};

module.exports = UserDAOMock;
