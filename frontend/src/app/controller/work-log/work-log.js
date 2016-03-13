(function() {
    'use strict';

    angular.module('demo-app.controller.work-log', [
        'ui.router',
        'demo-app.resource.work-log',
        'demo-app.common.paginator'
    ])
    .controller('workLogController', [
        '$scope',
        '$state',
        'workLogResource',
        'paginator',
        function($scope, $state, workLogResource, paginator) {
            paginator.init(0, 15, 0);
            var _username = $state.params.username;

            $scope.search = function() {
                var page = _getPage();
                var filter = _getFilter();

                workLogResource.find(_username, page, filter)
                .then(function(response) {
                    paginator.setTotal(response.data.total);
                    $scope.workLogs = response.data.workLogs;
                });
            };

            function _getPage() {
                return { start: paginator.getStart(), length: paginator.getRange() };
            }

            function _getFilter() {
                var filter = { dateFrom: undefined, dateTo: undefined };

                if(angular.isDefined($scope.filterForm.dateFrom))
                    filter.dateFrom = $scope.filterForm.dateFrom.getTime();
                if(angular.isDefined($scope.filterForm.dateTo))
                    filter.dateTo = $scope.filterForm.dateTo.getTime();

                return filter;
            }

            $scope.nextPage = function() {
                paginator.nextPage();
                $scope.search();
            };

            $scope.previousPage = function() {
                paginator.previousPage();
                $scope.search();
            };

            $scope.lastPage = function() {
                paginator.lastPage();
                $scope.search();
            };

            $scope.firstPage = function() {
                paginator.init(0, 15, 0);
                $scope.search();
            };

            $scope.search();
        }
    ]);
})();
