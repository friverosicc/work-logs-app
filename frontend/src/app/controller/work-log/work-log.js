(function() {
    'use strict';

    angular.module('demo-app.controller.work-log', [
        'ui.router',
        'ngMaterial',
        'demo-app.resource.work-log',
        'demo-app.common.paginator',
        'demo-app.common.floating-form',
        'demo-app.resource.user'
    ])
    .controller('workLogController', [
        '$scope',
        '$state',
        '$mdToast',
        'workLogResource',
        'paginator',
        '$floatingForm',
        'userResource',
        function($scope, $state, $mdToast, workLogResource, paginator, $floatingForm, userResource) {
            var _username = $state.params.username;

            $scope.search = function() {
                var page = _getPage();
                var filter = _getFilter();

                userResource.findOne(_username)
                .then(function(response) {
                    $scope.user = response.data;

                    workLogResource.find(_username, page, filter)
                    .then(_processResponse);
                });
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
                $scope.nextPageDisabled = paginator.isNextPageDisabled();
                $scope.previousPageDisabled = paginator.isPreviousPageDisabled();

                if(response.data.total > 0 && response.data.workLogs.length === 0)
                    $scope.previousPage();

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

            $scope.openFormToEdit = function(workLog) {
                var workLogEdit = workLog;
                workLogEdit.date = new Date(workLogEdit.date);

                $floatingForm.show({
                    controller: 'workLogFormController',
                    templateUrl: 'controller/work-log/work-log-form.tpl.html',
                    locals: {
                        workLog: workLogEdit,
                        formTitle: 'EDIT WORK LOG',
                        action: 'update'
                    }
                })
                .then(function(msg) {
                    $scope.search();
                    _showMessage(msg);
                });
            };

            $scope.openFormToCreate = function() {
                $floatingForm.show({
                    controller: 'workLogFormController',
                    templateUrl: 'controller/work-log/work-log-form.tpl.html',
                    locals: {
                        workLog: {},
                        formTitle: 'NEW WORK LOG',
                        action: 'create'
                    }
                })
                .then(function(msg) {
                    $scope.search();
                    _showMessage(msg);
                });
            };

            $scope.remove = function(workLog) {
                workLogResource.remove(_username, workLog._id)
                .then(function(response) {
                    $scope.search();
                    _showMessage(response.data.msg);
                })
                .catch(function(response) {
                    _showMessage(response.data.msg);
                });
            };

            function _showMessage(msg) {
                $mdToast.show(
                    $mdToast.simple()
                    .content(msg)
                    .position('top right')
                    .hideDelay(6000)
                    .capsule(true)
                );
            }

            $scope.firstPage();
        }
    ]);
})();
