
// https://github.com/eternicode/bootstrap-datepicker

var DATE_REGEXP_MAP = {
  '/'    : '[\\/]',
  '-'    : '[-]',
  'dd'   : '(?:(?:[0-2]?\\d{1})|(?:[3][01]{1}))',
  'mm'   : '(?:[0]?[1-9]|[1][012])',
  'yyyy' : '(?:(?:[1]{1}\\d{1}\\d{1}\\d{1})|(?:[2]{1}\\d{3}))(?![\\d])'
};

angular.module('$strap.directives')

.directive('bsDatepicker', [function() {

  return {
    restrict: 'A',
    require: '?ngModel',
    link: function postLink(scope, element, attrs, ctrl) {
      //console.log('postLink', this, arguments);

      // If we have a controller (i.e. ngModelController) then wire it up
      if(ctrl) {
        var updateModel = function () {
          scope.$apply(function () {
            ctrl.$setViewValue(element.val());
          });
        };
      }

      var regexpForDateFormat = function(dateFormat, options) {
        options || (options = {});
        var re = dateFormat, regexpMap = DATE_REGEXP_MAP;
        /*if(options.mask) {
          regexpMap['/'] = '';
          regexpMap['-'] = '';
        }*/
        angular.forEach(regexpMap, function(v, k) { re = re.split(k).join(v); })
        return new RegExp('^' + re + '$', ['i']);
      }

      var dateFormatRegexp = regexpForDateFormat(attrs.dateFormat || 'mm/dd/yyyy'/*, {mask: !!attrs.uiMask}*/);

      // Handle date validity according to dateFormat
      ctrl.$parsers.unshift(function(viewValue) {
        //console.warn('viewValue', viewValue, dateFormatRegexp,  dateFormatRegexp.test(viewValue));
        if (!viewValue || dateFormatRegexp.test(viewValue)) {
          ctrl.$setValidity('date', true);
          return viewValue;
        } else {
          ctrl.$setValidity('date', false);
          return undefined;
        }
      });

      // Support add-on
      var component = element.next('[data-toggle="datepicker"]');
      if(component.length) {
        component.on('click', function() { element.datepicker('show'); });
      }

      // Create datepicker
      element.attr('data-toggle', 'datepicker');
      element.datepicker({
        autoclose: true
      }).on('changeDate', updateModel);
      window.element = element;

    }
  }

}]);
