'use strict';

angular.module('$strap.directives')

.directive('bsTimepicker', function($timeout, $strapConfig) {

  var TIME_REGEXP = '((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9])?(?:\\s?(?:am|AM|pm|PM))?)';

  return {
    restrict: 'A',
    require: '?ngModel',
    link: function postLink(scope, element, attrs, controller) {
      var pad = function(number) {
        var r = String(number);
        if ( r.length === 1 ) {
          r = '0' + r;
        }
        return r;
      };

      var options = angular.extend({openOnFocus:false}, $strapConfig.timepicker);
      var defaultTime = attrs.defaultTime || options.defaultTime || false;
      // Let Angular manage defaultTime since the widget is terrible at this
      options.defaultTime = false;
      var type = attrs.timeType || options.timeType || 'string';

      angular.forEach(
        [
          'template',
          'minuteStep',
          'showSeconds',
          'secondStep',
          'showMeridian',
          'showInputs',
          'disableFocus',
          'modalBackdrop',
          'openOnFocus'
        ],
        function (key) {
          if (angular.isDefined(attrs[key])) {
            if (attrs[key] === 'true' || attrs[key] === 'false') {
              options[key] = (attrs[key] === 'true');
            } else if (/^\-?([0-9]+|Infinity)$/.test(attrs[key])) {
              options[key] = parseInt(attrs[key], 10);
            } else {
              options[key] = attrs[key];
            }
          }
        }
      );

      // If we have a controller (i.e. ngModelController) then wire it up
      if(controller) {
        element.on('changeTime.timepicker', function(ev) {
          $timeout(function() {
            if (type === 'string') {
              controller.$setViewValue(element.val());
            } else if (type === 'date') {
              var date = new Date();
              date.setHours(ev.time.hours);
              date.setMinutes(ev.time.minutes);
              controller.$setViewValue(date);
            }
          });
        });

        // Handle input time validity
        var timeRegExp = new RegExp('^' + TIME_REGEXP + '$', ['i']);

        controller.$formatters.unshift(function (modelValue) {
          if (modelValue) {
            if (type === 'date') {
              controller.$setViewValue(new Date(modelValue));
              element.val(new Date(modelValue));
              return new Date(modelValue);
            }
            controller.$setViewValue(modelValue);
            element.val(modelValue);
            return modelValue;
          } else if (defaultTime) {
            if (defaultTime === 'current') {
              if (type === 'date') {
                controller.$setViewValue(new Date());
                element.val(new Date());
                return new Date();
              } else {
                var currentDate = new Date();
                var currentTime = pad(currentDate.getHours()) + ':' + pad(currentDate.getMinutes());
                controller.$setViewValue(currentDate);
                element.val(currentDate);
                return currentDate;
              }
            } else {
              controller.$setViewValue(defaultTime);
              element.val(defaultTime);
              return defaultTime;
            }
          }
          controller.$setViewValue(element.val());
          return element.val();
        });

        controller.$render = function ngModelRender() {
          if (controller.$viewValue) {
            if (type === 'date') {
              var renderedDate;
              if (timeRegExp.test(controller.$viewValue)) {
                renderedDate = new Date();

                var dateParts = controller.$viewValue.split(':');
                var hours = (!isNaN(parseInt(dateParts[0], 10)))?parseInt(dateParts[0], 10):'0';
                var minutes = (!isNaN(parseInt(dateParts[1], 10)))?parseInt(dateParts[1], 10):'0';
                renderedDate.setHours(hours);
                renderedDate.setMinutes(minutes);

                element.val(controller.$viewValue);
                controller.$setViewValue(renderedDate);
                return renderedDate;
              } else {
                renderedDate = new Date(controller.$viewValue);

                var modelRender = (renderedDate !== 'Invalid Date')?pad(renderedDate.getHours()) + ':' + pad(renderedDate.getMinutes()):'';

                element.val(modelRender);
                controller.$setViewValue(renderedDate);
                return renderedDate;
              }
            }

            element.val(controller.$viewValue);
            controller.$setViewValue(controller.$viewValue);
            return controller.$viewValue;
          }

          element.val('');
          return '';
        };

        // viewValue -> $parsers -> modelValue
        controller.$parsers.unshift(function(viewValue) {
          if (!viewValue || (type === 'string' && timeRegExp.test(viewValue))) {
            controller.$setValidity('time', true);
            return viewValue;
          } else if (type === 'date' && typeof viewValue === 'object' && viewValue.toString() !== 'Invalid Date') {
            controller.$setValidity('time', true);
            return viewValue;
          } else {
            controller.$setValidity('time', false);
            return;
          }
        });

      }

      // Create timepicker
      element.attr('data-toggle', 'timepicker');
      element.parent().addClass('bootstrap-timepicker');
      element.timepicker(options || {});
      var timepicker = element.data('timepicker');

      // Support add-on
      var component = element.siblings('[data-toggle="timepicker"]');
      if(component.length) {
        component.on('click', $.proxy(timepicker.showWidget, timepicker));
      }
      if (options.openOnFocus) {
        element.on('focus', $.proxy(timepicker.showWidget, timepicker));
      }
    }
  };
});
