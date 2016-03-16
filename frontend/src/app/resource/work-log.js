(function() {
    'use strict';

    angular.module('demo-app.resource.work-log', ['demo-app.common.api.config'])
    .factory('workLogResource', [
        '$http',
        '$interpolate',
        'apiURLs',
        function($http, $interpolate, apiURLs) {
            var _templateURL = $interpolate(apiURLs.workLogs);
            var _templateURLOne = $interpolate(apiURLs.workLog);
            var _templateURLSummarize = $interpolate(apiURLs.workLogsSummarize);

            function create(username, workLog) {
                var url = _templateURL({ username: username });
                workLog.date = workLog.date.getTime();

                return $http.post(url, workLog);
            }

            function update(username, workLog) {
                var url = _templateURLOne({ username: username, workLogId: workLog._id });
                workLog.date = workLog.date.getTime();

                return $http.put(url, workLog);
            }

            function remove(username, workLogId) {
                var url = _templateURLOne({ username: username, workLogId: workLogId });

                return $http.delete(url);
            }

            function find(username, page, filter) {
                var url = _templateURL({ username: username });
                var params = page;

                if(angular.isDefined(filter.dateTo))
                    params.dateTo = filter.dateTo.getTime();

                if(angular.isDefined(filter.dateFrom))
                    params.dateFrom = filter.dateFrom.getTime();

                return $http.get(url, { params: params });
            }

            function findSummary(username, filter) {
                var url = _templateURLSummarize({ username: username });

                return $http.get(url, { params: filter });
            }

            return {
                create: create,
                update: update,
                remove: remove,
                find: find,
                findSummary: findSummary
            };
        }
    ]);
})();
