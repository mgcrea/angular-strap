
// https://github.com/jdewit/bootstrap-timepicker
// https://github.com/kla/bootstrap-timepicker

angular.module('$strap.directives')

.directive('bsTimepicker', ['$timeout', function($timeout) {
	'use strict';

	var TIME_REGEXP = '((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9])?(?:\\s?(?:am|AM|pm|PM))?)';

	return {
		restrict: 'A',
		require: '?ngModel',
		link: function postLink(scope, element, attrs, controller) {

			// If we have a controller (i.e. ngModelController) then wire it up
			if(controller) {
				element.on('change', function(ev) {
					scope.$apply(function () {
						controller.$setViewValue(element.val());
					});
				});
			}

			// Handle input time validity
			var timeRegExp = new RegExp('^' + TIME_REGEXP + '$', ['i']);
			controller.$parsers.unshift(function(viewValue) {
				//console.warn('viewValue', viewValue, timeRegExp,  timeRegExp.test(viewValue));
				if (!viewValue || timeRegExp.test(viewValue)) {
					controller.$setValidity('time', true);
					return viewValue;
				} else {
					controller.$setValidity('time', false);
					return undefined;
				}
			});

			// Support add-on
			// var component = element.siblings('[data-toggle="timepicker"]');
			// if(component.length) {
			//  component.on('click', function() {
			//    var $widget = element.data('timepicker').$widget;
			//   });
			// }

			// Popover GarbageCollection
			var $popover = element.closest('.popover');
			if($popover) {
				$popover.on('hide', function(e) {
					var timepicker = element.data('timepicker');
					if(timepicker) {
						timepicker.$widget.remove();
						element.data('timepicker', null);
					}
				});
			}

			// Create datepicker
			element.attr('data-toggle', 'timepicker');
			//$timeout(function () {
				element.timepicker();
			//});

		}
	};

}]);
