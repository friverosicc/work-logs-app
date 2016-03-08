'use strict';

var WorkLogDAO = function(mongoDBConnection, ObjectID, _) {
    var _collectionName = 'workLogs';

    function find(paginator, filter) {
        var match = _generateMatch(filter);
        var collection = mongoDBConnection.getCollection(_collectionName);

        return collection.find(match)
        .sort({ date: -1 })
        .skip(paginator.start)
        .limit(paginator.length)
        .toArray();
    }

    function findAmount(filter) {
        var match = _generateMatch(filter);
        var collection = mongoDBConnection.getCollection(_collectionName);

        return collection.find(match).count();
    }

    function _generateMatch(filter) {
        var matchDateRange = {};
        if(filter.dateFrom)
            matchDateRange.$gte = filter.dateFrom;
        if(filter.dateTo)
            matchDateRange.$lte = filter.dateTo;

        return (_.isEmpty(matchDateRange)) ? { } : { date: matchDateRange };
    }

    function findOne(id) {
        var collection = mongoDBConnection.getCollection(_collectionName);

        return collection.findOne({ _id: new ObjectID(id) });
    }

    function create(workLog) {
        var collection = mongoDBConnection.getCollection(_collectionName);

        return collection.insertOne(workLog);
    }

    function remove(id) {
        var collection = mongoDBConnection.getCollection(_collectionName);

        return collection.findAndRemove({ _id: new ObjectID(id) });
    }

    function update(id, workLog) {
        delete workLog._id;
        var collection = mongoDBConnection.getCollection(_collectionName);

        return collection.updateOne({ _id: new ObjectID(id) }, { $set: workLog });
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

module.exports = WorkLogDAO;
