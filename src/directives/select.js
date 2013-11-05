'use strict';

angular.module('$strap.directives')

.directive('bsSelect', function($timeout, $parse) {

  var NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w\d]*)|(?:\(\s*([\$\w][\$\w\d]*)\s*,\s*([\$\w][\$\w\d]*)\s*\)))\s+in\s+(.*)$/;

  return {
    restrict: 'A',
    require: '?ngModel',
    link: function postLink(scope, element, attrs, controller) {

      var options = scope.$eval(attrs.bsSelect) || {},
        selectpicker;

      $timeout(function() {
        element.selectpicker(options);
        element.unbind('DOMNodeInserted DOMNodeRemoved'); // disable listening for DOM updates
        selectpicker = element.next('.bootstrap-select');
        selectpicker.removeClass('ng-scope');
      });
      
      // If we have a controller (i.e. ngModelController) then wire it up
      if(controller) {

        var refresh = function(newValue, oldValue) {
          if (!angular.equals(newValue, oldValue)) {
            element.selectpicker('refresh');
          }
        };
        
        var checkValidity = function(value) {
          if (selectpicker) {
            selectpicker
              .toggleClass('ng-invalid', !controller.$valid)
              .toggleClass('ng-valid', controller.$valid)
              .toggleClass('ng-invalid-required', !controller.$valid)
              .toggleClass('ng-valid-required', controller.$valid)
              .toggleClass('ng-dirty', controller.$dirty)
              .toggleClass('ng-pristine', controller.$pristine);
          }
          return value;
        };

        // Handle AngularJS validation when the DOM changes
        controller.$parsers.push(checkValidity);
        // Handle AngularJS validation when the model changes
        controller.$formatters.push(checkValidity);
        // Handle AngularJS validation when the required attribute changes
        attrs.$observe('required', function() {
          checkValidity(controller.$viewValue);
        });

        // Watch for changes to the model value
        scope.$watch(attrs.ngModel, refresh);

        // Watch for changes to the options
        if (attrs.ngOptions) {
          var match = attrs.ngOptions.match(NG_OPTIONS_REGEXP),
		  valuesFn = $parse(match[7]);

          if (match && match[7]) {
            scope.$watch(function () {
              return valuesFn(scope);
            }, refresh, true);
          }
        }

      }

    }

  };

});
