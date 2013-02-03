// https://github.com/eternicode/bootstrap-datepicker

angular.module('$strap.directives')

.directive('bsDatepicker', ['$timeout', function($timeout) {
	'use strict';

	var isTouch = 'ontouchstart' in window && !window.navigator.userAgent.match(/PhantomJS/i);

	var DATE_REGEXP_MAP = {
		'/'    : '[\\/]',
		'-'    : '[-]',
		'.'    : '[.]',
		'dd'   : '(?:(?:[0-2]?[0-9]{1})|(?:[3][01]{1}))',
		'd'   : '(?:(?:[0-2]?[0-9]{1})|(?:[3][01]{1}))',
		'mm'   : '(?:[0]?[1-9]|[1][012])',
		'm'   : '(?:[0]?[1-9]|[1][012])',
		'yyyy' : '(?:(?:[1]{1}[0-9]{1}[0-9]{1}[0-9]{1})|(?:[2]{1}[0-9]{3}))(?![[0-9]])',
		'yy'   : '(?:(?:[0-9]{1}[0-9]{1}))(?![[0-9]])'
	};

	return {
		restrict: 'A',
		require: '?ngModel',
		link: function postLink(scope, element, attrs, controller) {
			//console.log('postLink', this, arguments); window.element = element;

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

			var dateFormatRegexp = isTouch ? 'yyyy/mm/dd' : regexpForDateFormat(attrs.dateFormat || 'mm/dd/yyyy'/*, {mask: !!attrs.uiMask}*/);

			// Handle date validity according to dateFormat
			if(controller) {
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
			}

			// Support add-on
			var component = element.next('[data-toggle="datepicker"]');
			if(component.length) {
				component.on('click', function() { isTouch ? element.trigger('focus') : element.datepicker('show'); });
			}

			// Use native interface for touch devices
			if(isTouch && element.prop('type') === 'text') {

				element.prop('type', 'date');
				element.on('change', function(ev) {
					scope.$apply(function () {
						controller.$setViewValue(element.val());
					});
				});

			} else {

				// If we have a controller (i.e. ngModelController) then wire it up
				if(controller) {
					element.on('changeDate', function(ev) {
						scope.$apply(function () {
							controller.$setViewValue(element.val());
						});
					});
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
				element.datepicker({
					autoclose: true,
					language: attrs.language || 'en'
				});

			}

		}

	};

}]);
