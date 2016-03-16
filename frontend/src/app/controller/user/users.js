(function() {
    'use strict';

    angular.module('demo-app.controller.user', [
        'ui.router',
        'ngMaterial',
        'demo-app.resource.user',
        'demo-app.common.floating-form',
        'demo-app.common.paginator'
    ])
    .controller('usersController', [
        '$scope',
        '$state',
        '$mdToast',
        '$floatingForm',
        'paginator',
        'userResource',
        function($scope, $state, $mdToast, $floatingForm, paginator, userResource) {


            $scope.search = function() {
                var page = { start: paginator.getStart(), length: paginator.getRange() };

                userResource.find(page)
                .then(function(response) {
                    paginator.setTotal(response.data.total);

                    $scope.users = response.data.users;
                    $scope.labelPagination = paginator.getLabel();
                    $scope.nextPageDisabled = paginator.isNextPageDisabled();
                    $scope.previousPageDisabled = paginator.isPreviousPageDisabled();
                });
            };

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

            $scope.openFormToCreate = function() {
                $floatingForm.show({
                    controller: 'userFormController',
                    templateUrl: 'controller/user/user-form.tpl.html',
                    locals: {
                        user: {},
                        formTitle: 'NEW USER',
                        action: 'create'
                    }
                })
                .then(function(msg) {
                    $scope.search();
                    _showMessage(msg);
                });
            };

            $scope.openFormToEdit = function(user) {
                $floatingForm.show({
                    controller: 'userFormController',
                    templateUrl: 'controller/user/user-form.tpl.html',
                    locals: {
                        user: user,
                        formTitle: 'EDIT USER',
                        action: 'update'
                    }
                })
                .then(function(msg) {
                    $scope.search();
                    _showMessage(msg);
                });
            };

            $scope.remove = function(user) {
                userResource.remove(user.username)
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
