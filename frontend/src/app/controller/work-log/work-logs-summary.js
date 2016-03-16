(function() {
    'use strict';

    angular.module('demo-app.controller.work-log.summary', [
        'ui.router',
        'demo-app.resource.work-log'
    ])
    .controller('workLogSummaryController', [
        '$scope',
        '$state',
        'workLogResource',
        function($scope, $state, workLogResource) {
            var _username = $state.params.username;
            var _filter = { dateFrom: $state.params.dateFrom, dateTo: $state.params.dateTo };

            workLogResource.findSummary(_username, _filter)
            .then(function(response) {
                $scope.summaries = response.data;
            });
        }
    ]);
})();
