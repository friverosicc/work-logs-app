(function() {
    'use strict';

    angular.module('demo-app.common.floating-form', [
        'material.core',
        'material.components.button'
    ])
    .directive('floatingForm', FloatingFormDirective)
    .provider('$floatingForm', FloatingFormProvider);

    function FloatingFormDirective($floatingForm) {
        return {
            restrict: 'E',
            link: function postLink(scope, element, attr) {
                scope.$on('$destroy', function() {
                    $floatingForm.destroy();
                });
            }
        };
    }

    function FloatingFormProvider($$interimElementProvider) {
        var $floatingForm = $$interimElementProvider('$floatingForm');

        return $floatingForm;
    }
})();
