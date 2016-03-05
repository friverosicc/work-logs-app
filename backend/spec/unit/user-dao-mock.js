'use stritc';

var _ = require('underscore');

var UserDAOMock = function() {
    var _promiseFindOne, _promiseFind, _promiseFindAmount, _promiseCreate;
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
            resolve(_users)
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

    function setThrowAnError(throwAnError) {
        _throwAnError = throwAnError;
    }

    return {
        findOne: findOne,
        find: find,
        findAmount: findAmount,
        create: create,
        getPromiseFindOne: getPromiseFindOne,
        getPromiseFind: getPromiseFind,
        getPromiseFindAmount: getPromiseFindAmount,
        getPromiseCreate: getPromiseCreate,
        setThrowAnError: setThrowAnError
    };
};

module.exports = UserDAOMock;
