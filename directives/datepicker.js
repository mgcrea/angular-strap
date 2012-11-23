// https://github.com/eternicode/bootstrap-datepicker

angular.module('$strap.directives')

.directive('bsDatepicker', ['$timeout', function($timeout) {
  'use strict';

  var DATE_REGEXP_MAP = {
    '/'    : '[\\/]',
    '-'    : '[-]',
    'dd'   : '(?:(?:[0-2]?\\d{1})|(?:[3][01]{1}))',
    'mm'   : '(?:[0]?[1-9]|[1][012])',
    'yyyy' : '(?:(?:[1]{1}\\d{1}\\d{1}\\d{1})|(?:[2]{1}\\d{3}))(?![\\d])'
  };

  return {
    restrict: 'A',
    require: '?ngModel',
    link: function postLink(scope, element, attrs, controller) {
      //console.log('postLink', this, arguments);

      // If we have a controller (i.e. ngModelController) then wire it up
      if(controller) {
        element.on('changeDate', function(ev) {
          scope.$apply(function () {
            controller.$setViewValue(element.val());
          });
        });
      }

      var regexpForDateFormat = function(dateFormat, options) {
        options || (options = {});
        var re = dateFormat, regexpMap = DATE_REGEXP_MAP;
        /*if(options.mask) {
          regexpMap['/'] = '';
          regexpMap['-'] = '';
        }*/
        angular.forEach(regexpMap, function(v, k) { re = re.split(k).join(v); });
        return new RegExp('^' + re + '$', ['i']);
      };

      var dateFormatRegexp = regexpForDateFormat(attrs.dateFormat || 'mm/dd/yyyy'/*, {mask: !!attrs.uiMask}*/);

      // Handle date validity according to dateFormat
      controller.$parsers.unshift(function(viewValue) {
        //console.warn('viewValue', viewValue, dateFormatRegexp,  dateFormatRegexp.test(viewValue));
        if (!viewValue || dateFormatRegexp.test(viewValue)) {
          controller.$setValidity('date', true);
          return viewValue;
        } else {
          controller.$setValidity('date', false);
          return undefined;
        }
      });

      // Support add-on
      var component = element.next('[data-toggle="datepicker"]');
      if(component.length) {
        component.on('click', function() { element.datepicker('show'); });
      }

      // Popover GarbageCollection
      var $popover = element.closest('.popover');
      if($popover) {
        $popover.on('hide', function(e) {
          var datepicker = element.data('datepicker');
          if(datepicker) {
            datepicker.picker.remove();
            element.data('datepicker', null);
          }
        });
      }

      // Create datepicker
      element.attr('data-toggle', 'datepicker');
      //$timeout(function () { // makes the ui lag?
        element.datepicker({
          autoclose: true
        });
      //}, 0, false);

    }

  };

}]);
