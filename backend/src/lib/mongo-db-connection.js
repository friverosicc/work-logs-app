'use strict';

var MongoDBConnection = function(mongoClient, configDatabase) {
    var _db;

    function _init() {
        mongoClient.connect(configDatabase.URL, function(err, db) {
            if(err) {
                throw new Error('Could not connect: ' + err);
            }

            _db = db;
        });
    }

    function getCollection(collectionName) {
        return _db.collection(collectionName);
    }

    _init();

    return {
        getCollection: getCollection
    };
};

module.exports = MongoDBConnection;
