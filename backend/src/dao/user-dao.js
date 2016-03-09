'use strict';

var UserDAO = function(mongoDBConnection, _) {
    var _collectionName = "users";

    function find(paginator) {
        var collection = mongoDBConnection.getCollection(_collectionName);

        return collection.find({}, { password: 0, _id: 0 })
        .sort({ username: 1 })
        .skip(paginator.start)
        .limit(paginator.length)
        .toArray();
    }

    function findAmount() {
        var collection = mongoDBConnection.getCollection(_collectionName);

        return collection.find().count();
    }

    function findOne(username) {
        var collection = mongoDBConnection.getCollection(_collectionName);

        return collection.findOne({ username: username }, { _id: 0 });
    }

    function create(user) {
        var collection = mongoDBConnection.getCollection(_collectionName);

        return collection.insertOne(user);
    }

    function remove(username) {
        var collection = mongoDBConnection.getCollection(_collectionName);

        return collection.findAndRemove({ username: username });
    }

    function update(username, user) {
        delete user.username;
        var collection = mongoDBConnection.getCollection(_collectionName);

        return collection.updateOne({ username: username }, { $set: user });
    }

    return {
        find: find,
        findAmount: findAmount,
        findOne: findOne,
        create: create,
        remove: remove,
        update: update
    };
};

module.exports = UserDAO;
