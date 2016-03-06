'use strict';

var _ = require('underscore');

var WorkDAOMock = function() {
    var _promiseFind, _promiseFindAmount,
    _promiseCreate, _promiseRemove, _promiseUndate;
    var _throwAnError = false;
    var _works = [];

    function find(paginator, filter) {
        _promiseFind = new Promise(function(resolve, reject) {
            if(_throwAnError) {
                reject('problem in the process');
            } else {
                resolve(_works);
            }
        });

        return _promiseFind;
    }

    function findAmount(filter) {
        _promiseFindAmount = new Promise(function(resolve, reject) {
            if(_throwAnError) {
                reject('problem in the process');
            } else {
                resolve(_works.length);
            }
        });

        return _promiseFindAmount;
    }

    function create(username, work) {
        _promiseCreate = new Promise(function(resolve, reject) {
            if(_throwAnError) {
                reject('problem in the process');
            } else {
                _works.push(work);
                resolve({});
            }
        });

        return _promiseCreate;
    }

    function remove(workId) {
        _promiseRemove = new Promise(function(resolve, reject) {
            if(_throwAnError) {
                reject("problem in the process");
            } else {
                _works = _.reject(_works, function(work) {
                    return work.id === workId;
                });

                resolve({});
            }
        });

        return _promiseRemove;
    }

    function update(workId, work) {
        _promiseUpdate = new Promise(function(resolve, reject) {
            if(_throwAnError) {
                reject("problem in the process");
            } else {
                _.each(_works, function(item, index) {
                    if(item.id === workId) {
                        _works[index] = work;
                    }
                });

                resolve({});
            }
        });

        return _promiseUpdate;
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
        find: find,
        findAmount: findAmount,
        create: create,
        remove: remove,
        update: update,
        getPromiseFind: getPromiseFind,
        getPromiseFindAmount: getPromiseFindAmount,
        getPromiseCreate: getPromiseCreate,
        getPromiseRemove: getPromiseRemove,
        getPromiseUpdate: getPromiseUpdate,
        setThrowAnError: setThrowAnError
    };
};

module.exports = WorkDAOMock;
