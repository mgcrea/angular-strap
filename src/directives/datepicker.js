// https://github.com/eternicode/bootstrap-datepicker

angular.module('$strap.directives')

.directive('bsDatepicker', ['$timeout', '$strap.config', function($timeout, config) {
  'use strict';

  var isAppleTouch = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;

  var regexpMap = function regexpMap(language) {
    language = language || 'en';
    return {
      '/'    : '[\\/]',
      '-'    : '[-]',
      '.'    : '[.]',
      ' '    : '[\\s]',
      'dd'   : '(?:(?:[0-2]?[0-9]{1})|(?:[3][01]{1}))',
      'd'    : '(?:(?:[0-2]?[0-9]{1})|(?:[3][01]{1}))',
      'mm'   : '(?:[0]?[1-9]|[1][012])',
      'm'    : '(?:[0]?[1-9]|[1][012])',
      'DD'   : '(?:' + $.fn.datepicker.dates[language].days.join('|') + ')',
      'D'    : '(?:' + $.fn.datepicker.dates[language].daysShort.join('|') + ')',
      'MM'   : '(?:' + $.fn.datepicker.dates[language].months.join('|') + ')',
      'M'    : '(?:' + $.fn.datepicker.dates[language].monthsShort.join('|') + ')',
      'yyyy' : '(?:(?:[1]{1}[0-9]{1}[0-9]{1}[0-9]{1})|(?:[2]{1}[0-9]{3}))(?![[0-9]])',
      'yy'   : '(?:(?:[0-9]{1}[0-9]{1}))(?![[0-9]])'
    };
  };

  var regexpForDateFormat = function regexpForDateFormat(format, language) {
    var re = format, map = regexpMap(language), i;
    // Abstract replaces to avoid collisions
    i = 0; angular.forEach(map, function(v, k) {
      re = re.split(k).join('${' + i + '}'); i++;
    });
    // Replace abstracted values
    i = 0; angular.forEach(map, function(v, k) {
      re = re.split('${' + i + '}').join(v); i++;
    });
    return new RegExp('^' + re + '$', ['i']);
  };

  return {
    restrict: 'A',
    require: '?ngModel',
    link: function postLink(scope, element, attrs, controller) {

      var options = config.datepicker || {},
          language = attrs.language || options.language || 'en',
          type = attrs.dateType || options.type || 'date',
          format = attrs.dateFormat || options.format || ($.fn.datepicker.dates[language] && $.fn.datepicker.dates[language].format) || 'yyyy-mm-dd';

      var dateFormatRegexp = isAppleTouch ? regexpForDateFormat('yyyy-mm-dd', language) : regexpForDateFormat(format, language);

      // Handle date validity according to dateFormat
      if(controller) {

        // modelValue -> $formatters -> viewValue
        controller.$formatters.unshift(function(viewValue) {
          return type === 'date' && angular.isString(viewValue) ? new Date(viewValue) : viewValue;
        });

        // viewValue -> $parsers -> modelValue
        controller.$parsers.unshift(function(viewValue) {
          if(!viewValue) {
            controller.$setValidity('date', true);
            return null;
          } else if(type === 'date' && angular.isDate(viewValue)) {
            controller.$setValidity('date', true);
            return viewValue;
          } else if(angular.isString(viewValue) && dateFormatRegexp.test(viewValue)) {
            controller.$setValidity('date', true);
            if(isAppleTouch) return new Date(viewValue);
            return type === 'string' ? viewValue : $.fn.datepicker.DPGlobal.parseDate(viewValue, $.fn.datepicker.DPGlobal.parseFormat(format), language);
          } else {
            controller.$setValidity('date', false);
            return undefined;
          }
        });

        // ngModel rendering
        controller.$render = function ngModelRender() {
          return controller.$viewValue && element.datepicker('update', controller.$viewValue);
        };

      }

      // Use native interface for touch devices
      if(isAppleTouch) {

        element.prop('type', 'date').css('-webkit-appearance', 'textfield');

      } else {

        // If we have a ngModelController then wire it up
        if(controller) {
          element.on('changeDate', function(ev) {
            scope.$apply(function () {
              controller.$setViewValue(type === 'string' ? element.val() : ev.date);
            });
          });
        }

        // Create datepicker
        element.attr('data-toggle', 'datepicker');
        element.datepicker({
          autoclose: true,
          format: format,
          language: language,
          forceParse: attrs.forceParse || false
        });

        // Garbage collection
        scope.$on('$destroy', function() {
          console.warn('$destroy');
          var datepicker = element.data('datepicker');
          if(datepicker) {
            datepicker.picker.remove();
            element.data('datepicker', null);
          }
        });

      }

      // Support add-on
      var component = element.siblings('[data-toggle="datepicker"]');
      if(component.length) {
        component.on('click', function() {
          element.trigger('focus');
        });
      }

    }

  };

}]);
