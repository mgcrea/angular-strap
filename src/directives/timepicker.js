'use strict';

angular.module('$strap.directives')

.directive('bsTimepicker', function($timeout) {

  var TIME_REGEXP = '((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9])?(?:\\s?(?:am|AM|pm|PM))?)';

  return {
    restrict: 'A',
    require: '?ngModel',
    link: function postLink(scope, element, attrs, controller) {

      // If we have a controller (i.e. ngModelController) then wire it up
      if(controller) {
        element.on('changeTime.timepicker', function(ev) {
          $timeout(function() {
            controller.$setViewValue(element.val());
          });
        });

        // Handle input time validity
        var timeRegExp = new RegExp('^' + TIME_REGEXP + '$', ['i']);

        // viewValue -> $parsers -> modelValue
        controller.$parsers.unshift(function(viewValue) {
          if (!viewValue || timeRegExp.test(viewValue)) {
            controller.$setValidity('time', true);
            return viewValue;
          } else {
            controller.$setValidity('time', false);
            return;
          }
        });

      }

      // Create datepicker
      element.attr('data-toggle', 'timepicker');
      element.parent().addClass('bootstrap-timepicker');
      element.timepicker();
      var timepicker = element.data('timepicker');

      // Support add-on
      var component = element.siblings('[data-toggle="timepicker"]');
      if(component.length) {
        component.on('click', $.proxy(timepicker.showWidget, timepicker));
      }

    }
  };

});
