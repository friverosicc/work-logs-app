'use strict';

var WorkLogDAO = function(mongoDBConnection, ObjectID, _) {
    var _collectionName = 'workLogs';

    function find(paginator, filter) {
        var promise = new Promise(function(resolve, reject) {            
            var match = _generateMatch(filter);
            var collection = mongoDBConnection.getCollection(_collectionName);

            var map = function() { emit(this.date, this.hours); };
            var reduce = function(key, values) { return Array.sum(values); };
            var out = { replace: 'totalHours' };
            var query = match;

            collection.mapReduce(map, reduce, { out: out, query: match }, function(error, result) {
                if(error)
                    return reject('error map reduce');

                collection.find(match)
                .sort({ date: -1 })
                .skip(paginator.start)
                .limit(paginator.length)
                .toArray(function(error, workLogs) {
                    if(error)
                        return reject('error finding');

                    var total = workLogs.length;
                    var mapReduceCollection = mongoDBConnection.getCollection('totalHours');

                    _.each(workLogs, function(workLog, index) {
                        mapReduceCollection.findOne({ _id: workLog.date }, function(err, date) {
                            workLog.totalHoursByDate = date.value;

                            if(index === (total-1))
                                resolve(workLogs);
                        });
                    });
                });
            });
        });

        return promise;
    }

    function findAmount(filter) {
        var match = _generateMatch(filter);
        var collection = mongoDBConnection.getCollection(_collectionName);

        return collection.find(match).count();
    }

    function findSummarize(filter) {
        var match = {
            $match: _generateMatch(filter)
        };
        var group = {
            $group: {
                _id: '$date',
                hours: { $sum: '$hours' },
                notes: { $push: '$note' }
            }
        };

        var sort = {
            $sort: { _id: -1 }
        };

        var collection = mongoDBConnection.getCollection(_collectionName);

        return collection.aggregate([match, group, sort])
        .toArray();
    }

    function _generateMatch(filter) {
        var match = { username: filter.username };
        var matchDateRange = {};

        if(filter.dateFrom)
            matchDateRange.$gte = filter.dateFrom;
        if(filter.dateTo)
            matchDateRange.$lte = filter.dateTo;

        if(!_.isEmpty(matchDateRange))
            match.date = matchDateRange;

        return match;
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
        findSummarize: findSummarize,
        create: create,
        remove: remove,
        update: update
    };
};

module.exports = WorkLogDAO;
