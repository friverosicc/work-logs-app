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
            var _username = $state.params.username;

            $scope.search = function() {
                var page = _getPage();
                var filter = _getFilter();

                workLogResource.find(_username, page, filter)
                .then(_processResponse);
            };

            function _getPage() {
                return { start: paginator.getStart(), length: paginator.getRange() };
            }

            function _getFilter() {
                var filter = {};

                if(angular.isUndefined($scope.filter))
                    $scope.filter = {};
                if(angular.isDefined($scope.filter.dateFrom) && $scope.filter.dateFrom)
                    filter.dateFrom = $scope.filter.dateFrom;
                if(angular.isDefined($scope.filter.dateTo) && $scope.filter.dateTo)
                    filter.dateTo = $scope.filter.dateTo;

                return filter;
            }

            function _processResponse(response) {
                paginator.setTotal(response.data.total);

                $scope.workLogs = response.data.workLogs;
                $scope.labelPagination = paginator.getLabel();
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

            $scope.firstPage();
        }
    ]);
})();
